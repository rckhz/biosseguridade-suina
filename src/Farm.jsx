import React, {useEffect, useLayoutEffect, useRef} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {Html} from '@react-three/drei/web/Html.js'
import {CanvasTexture,RepeatWrapping,SRGBColorSpace,Vector3} from 'three'
import {sectors,flows,zones,isBarn} from './sectors'
import {sectorIcons} from './icons'
import Pig from './Pig'

// Setores com etiqueta sempre visível, como na referência.

function Camera({reset,selected,near,zoomTick,panelOpen}) {
  const {camera,gl,size,invalidate} = useThree()
  const controls = useRef(null)
  const base = useRef(1)
  const first = useRef(true)
  const wide = size.width>900
  useLayoutEffect(() => {
    base.current = Math.min(size.width / (wide?30:24), size.height / 15)
    camera.zoom = base.current
    // Desloca a maquete para o lado livre do painel e para baixo do título.
    camera.setViewOffset(size.width,size.height,panelOpen&&wide?-70:0,-size.height*(panelOpen&&wide?.2:.1),size.width,size.height)
    camera.updateProjectionMatrix()
    invalidate()
  }, [size,camera,invalidate,panelOpen,wide])
  useEffect(() => {
    camera.position.set(13,18,29)
    const c = new OrbitControls(camera,gl.domElement)
    controls.current = c
    c.enablePan = true
    c.screenSpacePanning = false
    c.maxPolarAngle = Math.PI / 2 - 0.025
    c.minZoom = base.current*.4
    c.maxZoom = base.current*12
    c.addEventListener('change',invalidate)
    c.update()
    invalidate()
    return () => c.dispose()
  }, [reset,camera,gl,invalidate,size])
  // Ao escolher um setor, a câmera voa até ele e aproxima.
  useEffect(() => {
    first.current = false
    const c = controls.current
    if (!c) return
    const s = selected>=0 ? sectors[selected] : {x:0,z:0}
    const delta = new Vector3(s.x,0,s.z).sub(c.target)
    const p0 = camera.position.clone(), t0 = c.target.clone(), z0 = camera.zoom
    const z1 = base.current*(selected<0?1:near?(isBarn(selected)?3.6:2.8):1.15)
    const start = performance.now()
    let raf
    const step = now => {
      const k = Math.min(1,(now-start)/750), e = 1-Math.pow(1-k,3)
      c.target.copy(t0).addScaledVector(delta,e)
      camera.position.copy(p0).addScaledVector(delta,e)
      camera.zoom = z0+(z1-z0)*e
      camera.updateProjectionMatrix()
      c.update()
      invalidate()
      if (k<1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [selected,near,camera,invalidate])
  // Botões + e − do canto da maquete.
  useEffect(() => {
    if (!zoomTick) return
    const c = controls.current
    camera.zoom = Math.min(c.maxZoom,Math.max(c.minZoom,camera.zoom*zoomTick.f))
    camera.updateProjectionMatrix()
    invalidate()
  }, [zoomTick,camera,invalidate])
  return null
}
function Box({at,size,color,tilt=0,turn=0}) {
  return <mesh position={at} rotation={[tilt,turn,0]} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color}/></mesh>
}
// Galpão em corte: sem telhado, com baias e leitões dentro da própria maquete.
function Cutaway({w,d}) {
  const xs=[-1.8,-.6,.6,1.8]
  return <group>
    <Box at={[0,.1,0]} size={[w,.12,d]} color="#c9bfae"/>
    <Box at={[0,.165,0]} size={[w,.02,.5]} color="#e3d6bd"/>
    <Box at={[0,.55,-d/2]} size={[w+.1,.9,.08]} color="#ece8df"/>
    {[-1,1].map(k=><Box key={k} at={[k*w/2,.4,0]} size={[.08,.6,d]} color="#ece8df"/>)}
    {[-1,1].map(side=><group key={side}>
      <Box at={[0,.42,side*.27]} size={[w,.04,.03]} color="#77857c"/>
      {[-2.4,-1.2,0,1.2,2.4].map(x=><Box key={x} at={[x,.33,side*.62]} size={[.04,.32,.68]} color="#b7b3a3"/>)}
      {xs.map((x,k)=>[-.3,.3].map((o,j)=><group key={k+'_'+j} position={[x+o,.16,side*.62]} scale={.3}><Pig x={0} z={0} phase={k*1.7+j*2.3+side}/></group>))}
    </group>)}
  </group>
}
// Projeta o ponto do galpão na tela para as linhas da janela de zoom.
function Tracker({target,onAnchor}){
  const {camera,size}=useThree()
  const v=useRef(new Vector3())
  useFrame(()=>{
    const f=onAnchor.current
    if(!f) return
    if(!target) return f(null)
    v.current.set(target.x,1.3,target.z).project(camera)
    f((v.current.x+1)/2*size.width,(1-v.current.y)/2*size.height)
  })
  return null
}
function Building({s,i,selected,onSelect,portal,showZones,cut,hide}) {
  const {w,d}=s
  const roof = [8,2,10].includes(i) ? '#899595' : '#9a5b48'
  const pad = showZones ? (s.zone ? zones[s.zone].color : '#d9d6cc') : selected ? '#e7b7c4' : '#ccc5a9'
  const Icon = sectorIcons[i]
  if(hide) return <group position={[s.x,0,s.z]}><Box at={[0,.075,0]} size={[w+.45,.15,d+.45]} color={pad}/></group>
  return <group position={[s.x,0,s.z]} onClick={e=>{e.stopPropagation(); if(e.delta<5) onSelect(i)}}>
    <Box at={[0,.075,0]} size={[w+(showZones?.9:.45),.15,d+(showZones?.9:.45)]} color={pad}/>
    {selected && <Box at={[0,.04,0]} size={[w+1.3,.08,d+1.3]} color="#f3dbe2"/>}
    <Html portal={portal} position={[0,2.5,0]} center zIndexRange={[5,1]}>
      <button className={'pin'+(selected?' active':'')} aria-label={s.name} aria-pressed={selected} onClick={()=>onSelect(i)}>
        <b><Icon size={19} strokeWidth={2.2}/></b>{selected && <span>{s.short}</span>}
      </button>
    </Html>
    {i===8 && [-.75,.75].map(x=><group key={x} position={[x,0,-1.8]}><mesh position={[0,1.22,0]} castShadow><cylinderGeometry args={[.6,.6,2.4,24]}/><meshStandardMaterial color="#c3ccc8" metalness={.5} roughness={.35}/></mesh><mesh position={[0,2.64,0]}><coneGeometry args={[.64,.48,24]}/><meshStandardMaterial color="#95a3a0" metalness={.4}/></mesh></group>)}
    {i===9 ? <><mesh position={[0,1.3,0]} castShadow><cylinderGeometry args={[.84,.84,1.5,32]}/><meshStandardMaterial color="#709695"/></mesh>{[[-.55,-.4],[.55,-.4],[-.55,.4],[.55,.4]].map(([x,z],k)=><Box key={k} at={[x,.3,z]} size={[.1,.6,.1]} color="#59686a"/>)}</>
      : i===1 ? <>{[-.7,.4].map(n=><Box key={n} at={[n,.32,0]} size={[.48,.36,1.1]} color="#62777c"/>)}</>
      : i===4 ? <><Box at={[0,.6,0]} size={[w,1,d]} color="#ece8df"/><Box at={[0,1.15,0]} size={[w+.4,.1,d+.4]} color="#d9dcd8"/>{[-1,1].map(k=><Box key={k} at={[k*.5,.17,d/2+.5]} size={[.8,.04,.7]} color="#e7b93c"/>)}</>
      : cut ? <Cutaway w={w} d={d}/>
      : <><Box at={[0,.7,0]} size={[w,1.2,d]} color="#ece8df"/>
        {[-1,1].map(sign=><Box key={sign} at={[0,1.45,sign*d*.28]} size={[w+.32,.12,d*.64]} tilt={sign*.32} color={roof}/>)}
        {Array.from({length: Math.ceil(w/1.25)},(_,j)=><Box key={j} at={[-w/2+.45+j*1.12,.8,d/2+.02]} size={[.46,.41,.05]} color="#516c64"/>)}
      </>}
  </group>
}
function pasture(){
  const tile=document.createElement('canvas')
  tile.width=tile.height=256
  const ctx=tile.getContext('2d')
  ctx.fillStyle='#8b9b64'
  ctx.fillRect(0,0,256,256)
  for(let i=0;i<9500;i++){
    ctx.fillStyle=i%3?'rgba(52,70,40,.14)':'rgba(205,205,160,.22)'
    ctx.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*3,2)
  }
  const texture=new CanvasTexture(tile)
  texture.wrapS=texture.wrapT=RepeatWrapping
  texture.repeat.set(50,50)
  texture.colorSpace=SRGBColorSpace
  return texture
}
const grass=pasture()
function Fence({at,length,turn=0}){
  return <group position={at} rotation={[0,turn,0]}>{[.36,.67].map(y=><Box key={y} at={[0,y,0]} size={[length,.085,.08]} color="#e9e4d6"/>)}
    {Array.from({length:Math.ceil(length/1.6)+1},(_,i)=><Box key={i} at={[-length/2+i*length/Math.ceil(length/1.6),.42,0]} size={[.13,.84,.13]} color="#d8d1bd"/>)}</group>
}
function Truck({at,turn=0,color='#e8ecea'}){
  return <group position={at} rotation={[0,turn,0]}>
    <Box at={[0,.75,0]} size={[2.6,1.2,1.15]} color={color}/>
    <Box at={[1.75,.62,0]} size={[.95,.95,1.1]} color="#3f6b78"/>
    {[-.9,.9,1.8].map(x=>[-.6,.6].map(z=><mesh key={x+'_'+z} position={[x,.25,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.25,.25,.14,14]}/><meshStandardMaterial color="#2c3030"/></mesh>))}
  </group>
}
function Lamp({at}){
  return <group position={at}><Box at={[0,.9,0]} size={[.07,1.8,.07]} color="#58625f"/><mesh position={[0,1.85,0]}><sphereGeometry args={[.16,12,10]}/><meshBasicMaterial color="#ffe9a8"/></mesh></group>
}
// Fluxo: faixa no chão (contínua ou tracejada) com ponta de seta.
function Flow({paths,color,dash}){
  return <group>{paths.map((pts,k)=><Path key={k} pts={pts} color={color} dash={dash}/>)}</group>
}
function Path({pts,color,dash}){
  const y=.17
  const parts=[]
  pts.slice(1).forEach((b,i)=>{
    const a=pts[i], dx=b[0]-a[0], dz=b[1]-a[1], len=Math.hypot(dx,dz), turn=Math.atan2(-dz,dx)
    const n=dash?Math.floor(len/.7):1
    for(let k=0;k<n;k++){
      const t=dash?(k+.5)/n:.5, l=dash?.42:len
      parts.push(<mesh key={i+'_'+k} position={[a[0]+dx*t,y,a[1]+dz*t]} rotation={[0,turn,0]}><boxGeometry args={[l,.04,.2]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>)
    }
  })
  const e=pts[pts.length-1], p=pts[pts.length-2], turn=Math.atan2(-(e[1]-p[1]),e[0]-p[0])
  return <group>{parts}<group position={[e[0],y+.02,e[1]]} rotation={[0,turn,0]}><mesh rotation={[0,0,-Math.PI/2]}><coneGeometry args={[.36,.7,3]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh></group></group>
}
export default function Farm({selected,onSelect,reset,showZones,activeFlows,near,inset,onAnchor,zoomTick,panelOpen}) {
  const portal=useRef(null)
  const cutting=near&&isBarn(selected)
  const sel=sectors[selected]
  return <div ref={portal} style={{height:"100%"}}><Canvas resize={{debounce:0}} orthographic shadows frameloop={cutting?"always":"demand"} dpr={[1,1.6]} camera={{position:[19,20,26],near:.1,far:160}} fallback={<p>Use a lista de setores para explorar as fichas neste dispositivo.</p>}>
    <Camera reset={reset} selected={selected} near={near} zoomTick={zoomTick} panelOpen={panelOpen}/>
    <Tracker target={inset?sel:null} onAnchor={onAnchor}/>
    <hemisphereLight args={['#fff6e2','#7d8c55',1.6]}/><directionalLight position={[4,15,8]} intensity={2.4} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15}/>
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[180,180]}/><meshStandardMaterial map={grass}/></mesh>
    <Fence at={[0,0,-8]} length={21}/><Fence at={[10.5,0,0]} length={16} turn={Math.PI/2}/><Fence at={[-10.5,0,0]} length={16} turn={Math.PI/2}/><Fence at={[3.75,0,7.8]} length={13.5}/><Fence at={[-8.35,0,7.8]} length={4.3}/>
    <Box at={[0,.025,12.5]} size={[100,.04,2.35]} color="#5d625c"/>
    {Array.from({length:26},(_,i)=><Box key={i} at={[(i-13)*3,.053,12.5]} size={[1,.015,.06]} color="#f1ead0"/>)}
    <Box at={[0,.06,1.85]} size={[20,.06,1.2]} color="#d9cdb3"/><Box at={[-4.6,.06,1.3]} size={[1.6,.07,19.8]} color="#d9cdb3"/>
    <Truck at={[-13.5,0,12.1]}/><Truck at={[11,0,12.9]} turn={Math.PI} color="#d9c290"/>
    {[-2,1.5,5,8.5].map(x=><Lamp key={x} at={[x,0,2.9]}/>)}
    {sectors.map((s,i)=>{
      const dz=sel?s.z-sel.z:0, dx=sel?s.x-sel.x:0
      return <Building key={s.name} {...{s,i,onSelect,portal,showZones}} selected={selected===i}
        cut={cutting&&selected===i} hide={cutting&&i!==selected&&dz>0&&Math.abs(dx-.45*dz)<3.2}/>
    })}
    {flows.filter(f=>activeFlows.includes(f.id)).map(f=><Flow key={f.id} {...f}/>)}
    {[[-9.3,-6.2],[0,-7],[2,-7],[4,-7],[9.2,5.4],[-1,6.8],...Array.from({length:40},(_,i)=>[(i%20-10)*2.4,-11-Math.floor(i/20)*3+Math.sin(i)])].map(([x,z],i)=><group key={i} position={[x,0,z]}><Box at={[0,.65,0]} size={[.22,1.3,.22]} color="#816948"/><mesh position={[0,1.7,0]} scale={[1,1.2,1]} castShadow><icosahedronGeometry args={[1.05+(i%3)*.12,1]}/><meshStandardMaterial flatShading color={i%3===0?'#6e8a4c':i%2?'#58764a':'#46633f'}/></mesh></group>)}
  </Canvas></div>
}
