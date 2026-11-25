import React, {useEffect, useLayoutEffect, useRef} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import {Html} from '@react-three/drei/web/Html.js'
import {CanvasTexture,RepeatWrapping,SRGBColorSpace,Vector3,Shape} from 'three'
import {sectors,flows,zones,isBarn,barnKind} from './sectors'
import {sectorIcons} from './icons'
import Pig from './Pig'

function Camera({reset,selected,near,zoomTick,panelOpen}) {
  const {camera,gl,size,invalidate} = useThree()
  const controls = useRef(null)
  const base = useRef(1)
  const first = useRef(true)
  const wide = size.width>900
  useLayoutEffect(() => {
    base.current = Math.min(size.width / (wide?30:24), size.height / 15)
    camera.zoom = base.current
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
  useEffect(() => {
    if (!zoomTick) return
    const c = controls.current
    camera.zoom = Math.min(c.maxZoom,Math.max(c.minZoom,camera.zoom*zoomTick.f))
    camera.updateProjectionMatrix()
    invalidate()
  }, [zoomTick,camera,invalidate])
  return null
}
function Box({at,size,color,tilt=0,turn=0,roll=0}) {
  return <mesh position={at} rotation={[tilt,turn,roll]} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color}/></mesh>
}
// Galpão em corte proporcional à largura `w` (suporta maternidade, recria e crescimento/terminação).
function Cutaway({w,d,kind}) {
  const bays = 3
  const step = w / bays
  const dividers = Array.from({length: bays+1}, (_,k) => -w/2 + k*step)
  const xs = Array.from({length: bays}, (_,k) => -w/2 + (k+.5)*step)
  return <group>
    <Box at={[0,.1,0]} size={[w,.12,d]} color="#c9bfae"/>
    <Box at={[0,.165,0]} size={[w,.02,.5]} color="#e3d6bd"/>
    <Box at={[0,.55,-d/2]} size={[w+.1,.9,.08]} color="#ece8df"/>
    {[-1,1].map(k=><Box key={k} at={[k*w/2,.4,0]} size={[.08,.6,d]} color="#ece8df"/>)}
    {[-1,1].map(side=><group key={side}>
      <Box at={[0,.42,side*.27]} size={[w,.04,.03]} color="#77857c"/>
      {dividers.map(x=><Box key={x} at={[x,.33,side*.62]} size={[.04,.32,.68]} color="#b7b3a3"/>)}
      {kind==='maternidade'
        ? xs.map((x,k)=><group key={k}>
            <Box at={[x-.08,.1,side*.62]} size={[step*.74,.02,.62]} color="#d8cdb8"/>
            <Box at={[x+step*.26,.115,side*.62]} size={[step*.32,.02,.5]} color="#e8b98a"/>
            {[-.2,.2].map(o=><Box key={o} at={[x-.08,.3,side*.62+o]} size={[step*.55,.025,.025]} color="#57675f"/>)}
            <group position={[x-.08,.16,side*.62]} scale={.32}><Pig x={0} z={0} phase={k*1.9+side}/></group>
            {[0,1].map(j=><group key={j} position={[x+step*.24+j*.1,.13,side*.62+(j?.1:-.1)]} scale={.14}><Pig x={0} z={0} phase={k*1.3+j*2.2+side}/></group>)}
            <mesh position={[x+step*.26,.5,side*.62]}><coneGeometry args={[.09,.08,10]}/><meshStandardMaterial color="#8a8f8c"/></mesh>
            <mesh position={[x+step*.26,.44,side*.62]}><sphereGeometry args={[.045,8,8]}/><meshBasicMaterial color="#ffb35c" toneMapped={false}/></mesh>
          </group>)
        : kind==='recria'
        ? xs.map((x,k)=><group key={k}>
            <Box at={[x,.2,side*.36]} size={[step*.68,.08,.09]} color="#c9a45c"/>
            {[-.28,.0,.28].map((o,j)=><group key={j} position={[x+o,.15,side*(.56+(j%2)*.18)]} scale={.21}><Pig x={0} z={0} phase={k*1.5+j*1.9+side}/></group>)}
          </group>)
        : xs.map((x,k)=><group key={k}>
            <Box at={[x,.2,side*.38]} size={[step*.65,.09,.1]} color="#8b8f8c"/>
            {[-.28,.28].map((o,j)=><group key={j} position={[x+o,.16,side*.68]} scale={.32}><Pig x={0} z={0} phase={k*1.7+j*2.3+side}/></group>)}
          </group>)}
    </group>)}
  </group>
}
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
function useTick(){
  const {invalidate}=useThree()
  const t=useRef(0)
  useFrame((_,dt)=>{t.current+=Math.min(dt,.05);invalidate()})
  return t
}
function Drops({n=8,color,at,h=1.2,spread=.2,size=.05,speed=.7}){
  const t=useTick(),refs=useRef([])
  useFrame(()=>{refs.current.forEach((m,i)=>{
    if(!m) return
    const k=(t.current*speed+i/n)%1
    m.position.y=at[1]-k*h
    m.scale.setScalar(k>.93?.01:1)
  })})
  return <group position={[at[0],0,at[2]]}>{Array.from({length:n},(_,i)=>
    <mesh key={i} ref={m=>{refs.current[i]=m}} position={[Math.sin(i*2.4)*spread,at[1],Math.cos(i*1.7)*spread]}><sphereGeometry args={[size,8,6]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>)}</group>
}
function Ripple({at,color,max=1.4,period=2.2}){
  const t=useTick(),a=useRef(),b=useRef()
  useFrame(()=>{[a,b].forEach((r,i)=>{
    const k=(t.current/period+i*.5)%1
    r.current.scale.setScalar(.25+k*max)
    r.current.material.opacity=.85*(1-k)
  })})
  return <group position={at}>{[a,b].map((r,i)=>
    <mesh key={i} ref={r} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.9,1,44]}/><meshBasicMaterial color={color} transparent toneMapped={false}/></mesh>)}</group>
}
function Blink({at,color='#ff6a4d',rate=3}){
  const t=useTick(),r=useRef()
  useFrame(()=>{r.current.visible=Math.floor(t.current*rate)%2===0})
  return <mesh ref={r} position={at}><sphereGeometry args={[.09,10,8]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>
}
function Person({at}){
  return <group position={at}><mesh position={[0,.42,0]} castShadow><capsuleGeometry args={[.17,.4,4,10]}/><meshStandardMaterial color="#f4f1ea"/></mesh><mesh position={[0,.92,0]}><sphereGeometry args={[.15,12,10]}/><meshStandardMaterial color="#e8b99a"/></mesh></group>
}
// 01 Portaria (pulso discreto na guarita; a cancela abre no próprio portão de entrada)
function PortariaFx({d}){
  return <Ripple at={[0,.2,d/2+.25]} color="#c2b257" max={.95} period={2}/>
}
// 02 Estacionamento externo
function PassCar(){
  const ref=useRef(),hz=useRef(),t=useTick()
  useFrame(()=>{
    const c=(t.current%9)/9
    const x=c<.45?-9+(c/.45)*11.6:c<.7?2.6:2.6+((c-.7)/.3)*6.4
    ref.current.position.x=x
    hz.current.visible=c>=.45&&c<.7&&Math.floor(t.current*3)%2===0
  })
  return <group ref={ref} position={[-9,0,2.9]}>
    <Box at={[0,.3,0]} size={[1.0,.3,.52]} color="#a3546a"/>
    <Box at={[-.08,.54,0]} size={[.5,.24,.46]} color="#b8d6de"/>
    {[-.32,.32].map(x=>[-.27,.27].map(z=><mesh key={x+'_'+z} position={[x,.14,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.13,.13,.08,10]}/><meshStandardMaterial color="#2c3030"/></mesh>))}
    <group ref={hz}>{[-.2,.2].map(z=><mesh key={z} position={[-.52,.34,z]}><sphereGeometry args={[.06,8,8]}/><meshBasicMaterial color="#ffb35c" toneMapped={false}/></mesh>)}</group>
  </group>
}
// 03 Rodolúvio e controle de veículos: veículo atravessa o fosso desinfetante sob o arco pulverizador
function RodoluvioFx(){
  const t=useTick(),van=useRef(),okRing=useRef()
  useFrame(()=>{
    if(!van.current||!okRing.current) return
    const c=(t.current%8)/8
    const z=c<.34?2.5-(c/.34)*2.5:c<.64?0:-(c-.64)/.36*2.2
    van.current.position.set(-2.35,c>=.22&&c<=.72?-.03:0,z)
    van.current.visible=c<.96
    okRing.current.visible=c>.58&&c<.95
    okRing.current.position.z=z
  })
  return <group>
    <Drops n={16} color="#9ad6f5" at={[-2.35,1.82,0]} h={1.65} spread={.65} speed={1.25}/>
    <Ripple at={[-2.35,.21,0]} color="#48a9cc" max={1.05} period={1.4}/>
    <group ref={van} position={[-2.35,0,2.5]}>
      <Box at={[0,.42,0]} size={[.86,.52,1.45]} color="#e8ecea"/>
      <Box at={[0,.36,-.88]} size={[.82,.42,.52]} color="#3f6b78"/>
      <Box at={[0,.6,-.9]} size={[.76,.22,.46]} color="#b8d6de"/>
      {[-.44,.44].map(x=>[-.82,.45].map(z=><mesh key={x+'_'+z} position={[x,.17,z]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.16,.16,.1,12]}/><meshStandardMaterial color="#262a2a"/></mesh>))}
    </group>
    <mesh ref={okRing} position={[-2.35,.19,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.62,.78,28]}/><meshBasicMaterial color="#2f7d62" toneMapped={false}/></mesh>
  </group>
}
// 04 Recepção e registro
function Visitor({d}){
  const ref=useRef(),t=useTick()
  useFrame(()=>{
    const c=(t.current%9)/9
    const k=c<.35?c/.35:c<.65?1:1-(c-.65)/.35
    ref.current.position.set(2.2*(1-k),0,d/2+.35+1.5*(1-k))
  })
  return <group><group ref={ref}><Person at={[0,0,0]}/></group><Ripple at={[0,.2,d/2+.35]} color="#2f7d62" max={1.1} period={1.8}/></group>
}
// 05 Barreira sanitária e pedilúvio: banho seguido de imersão das botas no pedilúvio na saída limpa
function Shower({d}){
  const t=useTick(),worker=useRef(),splash=useRef()
  const pedZ=-d/2-.55
  useFrame(()=>{
    if(!worker.current||!splash.current) return
    const c=(t.current%8)/8
    const z=c<.28?-.2-(c/.28)*(Math.abs(pedZ)-.2):c<.62?pedZ:pedZ-((c-.62)/.38)*1.65
    worker.current.visible=c>.06&&c<.96
    worker.current.position.set(0,c>=.28&&c<.62?-.02:0,z)
    const inBath=c>=.28&&c<.64
    splash.current.visible=inBath
    if(inBath){
      const p=((c-.28)/.36)%1
      splash.current.scale.setScalar(.35+p*.85)
    }
  })
  return <group>
    <Drops n={12} color="#7fb8e8" at={[0,1.65,0]} h={1.45} spread={.38}/>
    <Ripple at={[0,.22,pedZ]} color="#48a9cc" max={.85} period={1.5}/>
    <mesh ref={splash} position={[0,.24,pedZ]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.35,.5,28]}/><meshBasicMaterial color="#2f7d62" toneMapped={false}/></mesh>
    <group ref={worker} position={[0,0,-.2]}>
      <Person at={[0,0,0]}/>
      {[-.1,.1].map(x=><Box key={x} at={[x,.14,0]} size={[.11,.24,.16]} color="#2f7d62"/>)}
    </group>
  </group>
}
// 06 Embarcadouro: movimentação pela rampa perimetral
function RampFx(){
  const t=useTick(),ref=useRef()
  useFrame(()=>{
    const k=(t.current*.35)%1
    ref.current.position.set(0,.22+.35*(1-k),1.1-2.2*k)
  })
  return <group><group ref={ref} rotation={[0,Math.PI,0]} scale={.45}><Pig x={0} z={0} phase={.3}/></group><Ripple at={[0,.2,-1.1]} color="#c2b257" max={1.1} period={2.2}/></group>
}
// 07 Quarentena
function Isolation({w,d}){
  return <group><Ripple at={[0,.2,0]} color="#457b9d" max={Math.max(w,d)*1.15} period={2.6}/><Blink at={[0,2.0,0]} color="#457b9d" rate={2}/></group>
}
// 08 Maternidade
function Warm({w,d}){
  const t=useTick(),a=useRef(),b=useRef()
  useFrame(()=>{[a,b].forEach((r,i)=>{const p=.5+.5*Math.sin(t.current*2.2+i*1.6);r.current.scale.setScalar(.75+.45*p);r.current.material.opacity=.45+.4*p})})
  return <group>{[a,b].map((r,i)=><mesh key={i} ref={r} position={[(i?1:-1)*w*.3,1.45+.1*d+.55,0]}><sphereGeometry args={[.32,16,12]}/><meshBasicMaterial color="#ffb35c" transparent toneMapped={false}/></mesh>)}<Ripple at={[0,.2,0]} color="#ffb35c" max={Math.max(w,d)*1.1} period={3}/></group>
}
// 09 Unidade de recria
function RecriaFx({w,d}){
  return <group>
    <Drops n={8} color="#d8b25a" at={[w/2+.55,1.2,-.35]} h={1.1} spread={.05} speed={.85}/>
    <Ripple at={[0,.2,0]} color="#3e8f72" max={Math.max(w,d)*1.05} period={2.6}/>
  </group>
}
// 10 Crescimento e terminação
function Fans({w}){
  const t=useTick(),refs=useRef([])
  useFrame(()=>{refs.current.forEach(g=>{if(g) g.rotation.x=t.current*7})})
  return <group>{[-1,1].map((k,i)=><group key={k} ref={g=>{refs.current[i]=g}} position={[k*(w/2+.12),.8,0]}>
    <Box at={[0,0,0]} size={[.02,.5,.07]} color="#e9e4d6"/><Box at={[0,0,0]} size={[.02,.07,.5]} color="#e9e4d6"/></group>)}
    <Drops n={9} color="#d8b25a" at={[w/2+.58,1.25,-.4]} h={1.15} spread={.05} speed={.9}/></group>
}
// 11 Silos e depósito
function Grain(){
  return <group>{[-.75,.75].map(x=><Drops key={x} n={9} color="#d8b25a" at={[x,1.0,-1.05]} h={.9} spread={.06} speed={.8}/>)}</group>
}
// 12 Reservatório de água
function Water(){
  return <group><Drops n={10} color="#7fb8e8" at={[0,.55,.95]} h={.5} spread={.07} speed={.9} size={.045}/><Ripple at={[0,.2,.95]} color="#7fb8e8" max={.9} period={1.4}/></group>
}
// 13 Resíduos e mortos
function Waste({w}){
  const t=useTick(),r=useRef()
  useFrame(()=>{const k=(t.current*.45)%1;r.current.position.set(-.2+(w/2+.75)*k,.7+Math.sin(k*Math.PI)*.8,.2);r.current.scale.setScalar(k>.95?.01:1)})
  return <group><mesh ref={r} castShadow><sphereGeometry args={[.15,10,8]}/><meshStandardMaterial color="#2d3030"/></mesh><Ripple at={[0,.2,0]} color="#b2453a" max={2} period={2.4}/></group>
}
// 14 Escritório sanitário e GTA
function Sheets(){
  const t=useTick(),refs=useRef([])
  useFrame(()=>{refs.current.forEach((m,i)=>{
    if(!m) return
    const k=(t.current*.3+i/4)%1
    m.position.set(Math.sin(i*2.1)*.35,1.7+k*1.2,Math.cos(i*1.3)*.2)
    m.rotation.set(k*2,k*3+i,0)
    m.material.opacity=1-k
  })})
  return <group>{[0,1,2,3].map(i=><mesh key={i} ref={m=>{refs.current[i]=m}}><boxGeometry args={[.34,.015,.26]}/><meshBasicMaterial color="#ffffff" transparent toneMapped={false}/></mesh>)}</group>
}
function SectorFx({i,s}){
  const {w,d}=s
  return [
    <PortariaFx d={d}/>,<PassCar/>,<RodoluvioFx/>,<Visitor d={d}/>,<Shower d={d}/>,<RampFx/>,
    <Isolation w={w} d={d}/>,<Warm w={w} d={d}/>,<RecriaFx w={w} d={d}/>,<Fans w={w}/>,
    <Grain/>,<Water/>,<Waste w={w}/>,<Sheets/>,
  ][i]||null
}
function Building({s,i,selected,onSelect,portal,showZones,cut,hide,tourFlowId}) {
  const {w,d}=s
  const kind = barnKind(i)
  const roof = [2,5,10,12].includes(i) ? '#899595' : i===7 ? '#c4764f' : i===8 ? '#6b8778' : i===9 ? '#5f7482' : '#9a5b48'
  const pad = showZones ? (s.zone ? zones[s.zone].color : '#d9d6cc') : selected ? '#e7b7c4' : '#ccc5a9'
  const Icon = sectorIcons[i]
  if(hide) return <group position={[s.x,0,s.z]}><Box at={[0,.075,0]} size={[w+.45,.15,d+.45]} color={pad}/></group>
  return <group position={[s.x,0,s.z]} onClick={e=>{e.stopPropagation(); if(e.delta<5) onSelect(i)}}>
    <Box at={[0,.075,0]} size={[w+(showZones?.85:.45),.15,d+(showZones?.85:.45)]} color={pad}/>
    {selected && <Box at={[0,.04,0]} size={[w+1.2,.08,d+1.2]} color="#f3dbe2"/>}
    {selected && !cut && <SectorFx i={i} s={s}/>}
    {i===2 && tourFlowId==='veiculos' && !(selected&&!cut) && <>
      <Drops n={18} color="#9ad6f5" at={[-2.35,1.82,0]} h={1.65} spread={.65} speed={1.25}/>
      <Ripple at={[-2.35,.21,0]} color="#48a9cc" max={1.05} period={1.4}/>
    </>}
    {i===4 && tourFlowId==='pessoas' && !(selected&&!cut) && <>
      <Drops n={12} color="#7fb8e8" at={[0,1.65,0]} h={1.45} spread={.38}/>
      <Ripple at={[0,.23,d/2+.48]} color="#48a9cc" max={.95} period={1.4}/>
    </>}
    {i===8 && tourFlowId==='pessoas' && !(selected&&!cut) &&
      <Ripple at={[0,.23,d/2+.36]} color="#48a9cc" max={.95} period={1.4}/>
    }
    <Html portal={portal} position={[0,2.5,0]} center zIndexRange={[5,1]}>
      <button className={'pin'+(selected?' active':'')} aria-label={s.name} aria-pressed={selected} onClick={()=>onSelect(i)}>
        <b><Icon size={19} strokeWidth={2.2}/></b>{selected && <span>{s.short}</span>}
      </button>
    </Html>
    {/* 01 Portaria: placa de acesso restrito voltada para a via externa */}
    {i===0 && <group position={[0,0,1.55]}>
      <Box at={[0,.48,0]} size={[.08,.96,.08]} color="#6c7572"/>
      <Box at={[0,.88,0]} size={[.76,.4,.05]} color="#f6f3ea"/>
      <Box at={[0,.98,.03]} size={[.7,.13,.02]} color="#b2453a"/>
    </group>}
    {/* 03 Rodolúvio (fosso desinfetante + rampas + arco de pulverização) */}
    {i===2 && <group position={[-2.35,0,0]}>
      <Box at={[0,.11,0]} size={[1.86,.07,2.7]} color="#b9b4a6"/>
      {[-.88,.88].map(x=><Box key={x} at={[x,.2,0]} size={[.1,.16,2.2]} color="#e7b93c"/>)}
      <Box at={[0,.17,0]} size={[1.66,.05,2.05]} color="#48a9cc"/>
      {[-.88,.88].map(x=><Box key={'p'+x} at={[x,1.02,0]} size={[.09,1.84,.09]} color="#5c6865"/>)}
      <Box at={[0,1.9,0]} size={[1.88,.1,.12]} color="#5c6865"/>
    </group>}
    {/* Pedilúvio na porta das unidades produtivas e quarentena */}
    {[6,7,8,9].includes(i) && !cut && <group position={[0,0,d/2+.36]}>
      <Box at={[0,.165,0]} size={[1.06,.06,.58]} color="#e7b93c"/>
      <Box at={[0,.2,0]} size={[.9,.03,.44]} color="#48a9cc"/>
    </group>}
    {/* 11 Silos de ração atrás do depósito */}
    {i===10 && [-.72,.72].map(x=><group key={x} position={[x,0,-1.55]}>
      <mesh position={[0,.08,0]}><cylinderGeometry args={[.64,.66,.16,24]}/><meshStandardMaterial color="#9d9a90"/></mesh>
      <mesh position={[0,1.22,0]} castShadow><cylinderGeometry args={[.56,.56,2.3,28]}/><meshStandardMaterial color="#cdd5d1" metalness={.55} roughness={.3}/></mesh>
      {[.55,1.05,1.55,2.05].map(y=><mesh key={y} position={[0,y+.1,0]}><cylinderGeometry args={[.575,.575,.045,28]}/><meshStandardMaterial color="#a9b4b0" metalness={.5} roughness={.4}/></mesh>)}
      <mesh position={[0,2.5,0]} castShadow><sphereGeometry args={[.56,24,10,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#98a7a3" metalness={.45} roughness={.35}/></mesh>
      <mesh position={[0,3.0,0]}><cylinderGeometry args={[.1,.12,.12,12]}/><meshStandardMaterial color="#6e7c78"/></mesh>
      <Box at={[.1,1.2,.59]} size={[.05,2.3,.05]} color="#6e7c78"/><Box at={[.28,1.2,.54]} size={[.05,2.3,.05]} color="#6e7c78"/>
    </group>)}
    {/* 13 Área de resíduos: coletores tampados */}
    {i===12 && <group position={[w/2+.55,0,.2]}><Box at={[0,.32,0]} size={[.6,.64,.6]} color="#6d7673"/><Box at={[0,.67,0]} size={[.68,.06,.68]} color="#4f5755"/></group>}
    {/* 12 Reservatório de água */}
    {i===11 ? <><mesh position={[0,1.3,0]} castShadow><cylinderGeometry args={[.84,.84,1.5,32]}/><meshStandardMaterial color="#709695" metalness={.3} roughness={.45}/></mesh>
        {[.8,1.3,1.8].map(y=><mesh key={y} position={[0,y,0]}><cylinderGeometry args={[.855,.855,.05,32]}/><meshStandardMaterial color="#56797a"/></mesh>)}
        <mesh position={[0,2.2,0]} castShadow><coneGeometry args={[.9,.5,32]}/><meshStandardMaterial color="#5c7b7c"/></mesh>
        <mesh position={[0,.58,0]}><cylinderGeometry args={[.78,.78,.1,24]}/><meshStandardMaterial color="#59686a"/></mesh>
        {[[-.55,-.4],[.55,-.4],[-.55,.4],[.55,.4]].map(([x,z],k)=><Box key={k} at={[x,.3,z]} size={[.1,.6,.1]} color="#59686a"/>)}
        <Box at={[0,.2,0]} size={[1.2,.04,.04]} color="#59686a" turn={.78}/><Box at={[0,.2,0]} size={[1.2,.04,.04]} color="#59686a" turn={-.78}/></>
      /* 02 Estacionamento externo */
      : i===1 ? <>{[[-.62,'#e8ecea'],[.62,'#d9c290']].map(([z,c],k)=><group key={k} position={[-.4+k*.15,.12,z]} scale={.72}><Truck at={[0,0,0]} color={c}/></group>)}</>
      /* 05 Barreira sanitária com pedilúvio na entrada e na saída para a área limpa */
      : i===4 ? <><Box at={[0,.6,0]} size={[w,1,d]} color="#ece8df"/><Box at={[0,1.15,0]} size={[w+.4,.1,d+.4]} color="#d9dcd8"/>
          {[d/2+.48,-d/2-.55].map(z=><group key={z} position={[0,0,z]}>
            <Box at={[0,.17,0]} size={[.96,.065,.68]} color="#e7b93c"/>
            <Box at={[0,.21,0]} size={[.8,.03,.52]} color="#48a9cc"/>
          </group>)}</>
      /* 06 Embarcadouro e desembarcadouro junto ao perímetro */
      : i===5 ? <>
          <Box at={[0,.45,-.2]} size={[1.35,.65,1.0]} color="#ece8df"/>
          <Box at={[0,.86,-.2]} size={[1.55,.1,1.16]} color="#899595"/>
          <Box at={[0,.34,.45]} size={[1.15,.12,1.15]} tilt={.28} color="#b9b4a6"/>
          {[-.55,.55].map(x=><Box key={x} at={[x,.62,.42]} size={[.07,.48,1.15]} tilt={.28} color="#6f7a76"/>)}
          <Box at={[0,.16,1.02]} size={[1.6,.04,.22]} color="#e7b93c"/>
        </>
      : cut ? <Cutaway w={w} d={d} kind={kind}/>
      : <><Box at={[0,.7,0]} size={[w,1.2,d]} color="#ece8df"/>
        <Box at={[0,.27,0]} size={[w+.06,.24,d+.06]} color="#b9b4a6"/>
        {[-1,1].map(k=><Gable key={k} x={k*(w/2-.02)} d={d}/>)}
        {[-1,1].map(sign=><Box key={sign} at={[0,1.45,sign*d*.28]} size={[w+.32,.12,d*.64]} tilt={sign*.32} color={roof}/>)}
        <Box at={[0,1.45+.1*d+.03,0]} size={[w+.36,.07,.2]} color="#6f4636"/>
        <Box at={[0,1.45+.1*d+.14,0]} size={[Math.max(.8,w*.35),.16,.34]} color="#d8d3c6"/>
        {(i===8||i===9)
          ? <><Box at={[0,.78,d/2+.03]} size={[w-.4,.5,.05]} color={i===8?'#8bb29a':'#7fa58e'}/>{Array.from({length:Math.floor(w/.5)},(_,j)=><Box key={j} at={[-w/2+.45+j*.5,.78,d/2+.06]} size={[.025,.5,.02]} color="#5f8573"/>)}</>
          : Array.from({length: Math.ceil(w/1.25)},(_,j)=>({j,x:-w/2+.45+j*1.12})).filter(o=>Math.abs(o.x)>.75).map(({j,x})=><group key={j}><Box at={[x,.8,d/2+.02]} size={[.46,.41,.05]} color="#516c64"/><Box at={[x,.8,d/2+.045]} size={[.5,.045,.04]} color="#f6f3ea"/></group>)}
        {i===7 && [-1,1].map(k=><Box key={k} at={[k*w*.3,1.45+.1*d+.07,0]} size={[.7,.12,.28]} color="#e6c9a8"/>)}
        {i===8 && <group position={[w/2+.5,0,-.35]}><mesh position={[0,.48,0]} castShadow><cylinderGeometry args={[.24,.24,.95,16]}/><meshStandardMaterial color="#c3ccc8" metalness={.5} roughness={.35}/></mesh><mesh position={[0,1.12,0]}><coneGeometry args={[.28,.32,16]}/><meshStandardMaterial color="#95a3a0"/></mesh></group>}
        {i===9 && <>
          {[-1,1].map(k=><group key={k}><mesh position={[k*(w/2+.04),.8,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.3,.3,.07,18]}/><meshStandardMaterial color="#8d9996"/></mesh><mesh position={[k*(w/2+.09),.8,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.22,.22,.02,18]}/><meshStandardMaterial color="#3d4543"/></mesh></group>)}
          <group position={[w/2+.55,0,-.4]}><mesh position={[0,.55,0]} castShadow><cylinderGeometry args={[.28,.28,1.1,16]}/><meshStandardMaterial color="#c3ccc8" metalness={.5} roughness={.35}/></mesh><mesh position={[0,1.28,0]}><coneGeometry args={[.32,.36,16]}/><meshStandardMaterial color="#95a3a0"/></mesh></group>
        </>}
        <Box at={[0,.62,d/2+.03]} size={[1.15,.9,.06]} color="#7b5a45"/>
        <Box at={[0,.62,d/2+.065]} size={[.04,.9,.03]} color="#4e3a2d"/>
        <Box at={[0,1.1,d/2+.045]} size={[1.3,.07,.05]} color="#f6f3ea"/>
      </>}
  </group>
}
function Gable({x,d}){
  const h=.18+.1*d
  const shape=new Shape()
  shape.moveTo(-d/2,0); shape.lineTo(d/2,0); shape.lineTo(0,h); shape.closePath()
  return <mesh position={[x,1.25,0]} rotation={[0,Math.PI/2,0]} castShadow><extrudeGeometry args={[shape,{depth:.05,bevelEnabled:false}]}/><meshStandardMaterial color="#e4dfd2"/></mesh>
}
function Tree({at,i}){
  const c=i%3===0?'#6e8a4c':i%2?'#58764a':'#46633f'
  const r=1.0+(i%3)*.12
  return <group position={at}>
    <Box at={[0,.65,0]} size={[.22,1.3,.22]} color="#816948"/>
    <mesh position={[0,1.6,0]} scale={[1,1.1,1]} castShadow><icosahedronGeometry args={[r,1]}/><meshStandardMaterial flatShading color={c}/></mesh>
    <mesh position={[.28,2.15,.12]} castShadow><icosahedronGeometry args={[r*.68,1]}/><meshStandardMaterial flatShading color={c}/></mesh>
    <mesh position={[-.34,1.95,-.15]} castShadow><icosahedronGeometry args={[r*.55,1]}/><meshStandardMaterial flatShading color="#7a9a58"/></mesh>
  </group>
}
function Bush({at,s=1}){
  return <group position={at} scale={s}><mesh position={[0,.28,0]} scale={[1.2,.8,1]} castShadow><icosahedronGeometry args={[.42,1]}/><meshStandardMaterial flatShading color="#5b7d47"/></mesh><mesh position={[.34,.22,.1]} castShadow><icosahedronGeometry args={[.3,1]}/><meshStandardMaterial flatShading color="#6a8c50"/></mesh></group>
}
function BoomDriver({arm,holdOpen}){
  const t=useTick()
  const {invalidate}=useThree()
  useEffect(()=>()=>{if(arm.current){arm.current.rotation.z=0;invalidate()}},[arm,invalidate])
  useFrame(()=>{
    if(!arm.current) return
    if(holdOpen){
      arm.current.rotation.z+=(1.18-arm.current.rotation.z)*.12
      return
    }
    const c=(t.current%5)/5
    const lift=c<.16?c/.16:c<.56?1:c<.72?1-(c-.56)/.16:0
    arm.current.rotation.z=lift*1.18
  })
  return <>
    <Blink at={[-1.28,.84,0]}/>
    <Ripple at={[0,.18,0]} color="#2f7d62" max={1.25} period={2.2}/>
  </>
}
function Gate({x,active,holdOpen,onSelect}){
  const arm=useRef()
  return <group position={[x,0,7.8]} onClick={e=>{e.stopPropagation(); if(e.delta<5) onSelect(0)}}>
    {[-1.6,1.6].map(k=><group key={k}><Box at={[k,.6,0]} size={[.24,1.2,.24]} color="#b9b4a6"/><Box at={[k,1.24,0]} size={[.32,.08,.32]} color="#8f8a7d"/></group>)}
    {/* Pedestal e apoio da cancela no vão real do portão */}
    <Box at={[-1.28,.38,0]} size={[.16,.76,.16]} color="#6c7572"/>
    <Box at={[1.28,.31,0]} size={[.1,.62,.12]} color="#6c7572"/>
    <group ref={arm} position={[-1.28,.64,0]}>
      {[0,1,2,3,4].map(k=><Box key={k} at={[.255+k*.51,0,0]} size={[.51,.075,.075]} color={k%2?'#f6f3ea':'#d9483b'}/>)}
    </group>
    {(active||holdOpen) && <BoomDriver arm={arm} holdOpen={holdOpen}/>}
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
    <Box at={[0,.4,0]} size={[2.64,.12,1.19]} color="#5a615f"/>
    <Box at={[0,1.0,.585]} size={[2.6,.1,.02]} color="#a3546a"/><Box at={[0,1.0,-.585]} size={[2.6,.1,.02]} color="#a3546a"/>
    <Box at={[1.75,.62,0]} size={[.95,.95,1.1]} color="#3f6b78"/>
    <Box at={[1.78,.98,0]} size={[.62,.34,1.12]} color="#b8d6de"/>
    <Box at={[2.24,.45,0]} size={[.06,.3,.8]} color="#2c3030"/>
    <Box at={[2.26,.2,0]} size={[.1,.1,1.15]} color="#8a918f"/>
    {[-.3,.3].map(z=><Box key={z} at={[2.23,.62,z*1.4]} size={[.04,.1,.14]} color="#ffe9a8"/>)}
    {[-.9,.9,1.8].map(x=>[-.6,.6].map(z=><group key={x+'_'+z} position={[x,.25,z]} rotation={[Math.PI/2,0,0]}><mesh><cylinderGeometry args={[.25,.25,.14,14]}/><meshStandardMaterial color="#2c3030"/></mesh><mesh position={[0,z>0?.08:-.08,0]}><cylinderGeometry args={[.11,.11,.03,10]}/><meshStandardMaterial color="#b9c0be"/></mesh></group>))}
  </group>
}
const PARK=6.4
function ArrivingTruck({play,parked,inTour,onDone}){
  const ref=useRef(),ring=useRef(),t=useRef(0),done=useRef(onDone),fired=useRef(false)
  const {invalidate}=useThree()
  done.current=onDone
  const place=()=>{
    if(!ref.current) return
    if(!inTour){
      const e=1-Math.pow(1-t.current,3)
      ref.current.position.set(-32+(PARK+32)*e,t.current>=1?0:Math.sin(t.current*80)*.012*(1-e),12.4)
      ref.current.rotation.y=0
      if(ring.current) ring.current.visible=false
      return
    }
    if(parked){
      ref.current.position.set(4.65,0,8.15)
      ref.current.rotation.y=Math.PI/2
      if(ring.current) ring.current.visible=false
      return
    }
    const u=t.current
    let x,z,rot,y=0
    if(u<.34){
      const p=u/.34
      x=-20+22.65*p
      z=14.65
      rot=0
    }else if(u<.5){
      const p=(u-.34)/.16, ang=p*Math.PI/2
      x=2.65+2.0*Math.sin(ang)
      z=12.65+2.0*Math.cos(ang)
      rot=ang
    }else if(u<.88){
      const p=(u-.5)/.38, e=p*p*(3-2*p)
      x=4.65
      z=12.65-4.25*e
      rot=Math.PI/2
      if(z>=8.9&&z<=11.4) y=-.04
    }else{
      const p=(u-.88)/.12, e=1-Math.pow(1-p,2)
      x=4.65
      z=8.4-.25*e
      rot=Math.PI/2
    }
    ref.current.position.set(x,y,z)
    ref.current.rotation.y=rot
    if(ring.current) ring.current.visible=u>.72
  }
  useEffect(()=>{
    fired.current=false
    t.current=parked?1:0
    place()
    invalidate()
  },[play,parked,inTour,invalidate])
  useFrame((_,dt)=>{
    if(!ref.current||t.current>=1) return
    t.current=Math.min(1,t.current+Math.min(dt,.05)/(inTour?9:7))
    place()
    if(t.current>=1&&!fired.current){fired.current=true;if(done.current) done.current()}
    invalidate()
  })
  return <group ref={ref} position={[-32,0,12.4]}>
    <Truck at={[0,0,0]}/>
    <mesh ref={ring} visible={false} position={[.5,.22,0]} rotation={[-Math.PI/2,0,0]}>
      <ringGeometry args={[1.85,2.05,36]}/><meshBasicMaterial color="#2f7d62" toneMapped={false} transparent opacity={.9}/>
    </mesh>
  </group>
}
function Walker({pts,color,kind,onDone}){
  const ref=useRef(),bodyGroup=useRef(),torso=useRef(),legL=useRef(),legR=useRef(),bootL=useRef(),bootR=useRef(),splash=useRef()
  const elapsed=useRef(0),done=useRef(onDone),fired=useRef(false)
  const {invalidate}=useThree()
  done.current=onDone
  const segs=pts.slice(1).map((p,i)=>({a:pts[i],len:Math.hypot(p[0]-pts[i][0],p[1]-pts[i][1]),b:p}))
  const total=segs.reduce((n,s)=>n+s.len,0)
  const isPerson=kind==='pessoas'
  const speed=isPerson?3.8:3.4
  const dEntryPed=isPerson&&segs.length>3?segs.slice(0,3).reduce((n,s)=>n+s.len,0):0
  const dCleanPed=isPerson&&segs.length>4?dEntryPed+segs[3].len:0
  const dBarreira=isPerson?(dEntryPed+dCleanPed)*.5:0
  const dBarnPed=isPerson&&segs.length>6?dCleanPed+segs[4].len+segs[5].len:0
  const pEntry=isPerson?.6:0, pBar=isPerson?.5:0, pBarnPed=isPerson?1.5:0
  const t1=dEntryPed/speed, t1End=t1+pEntry
  const t2=t1End+(dBarreira-dEntryPed)/speed, t2End=t2+pBar
  const t3=t2End+(dBarnPed-dBarreira)/speed, t3End=t3+pBarnPed
  const tEnd=total/speed+pEntry+pBar+pBarnPed
  useFrame((_,dt)=>{
    if(!ref.current) return
    if(elapsed.current<tEnd) elapsed.current=Math.min(tEnd,elapsed.current+Math.min(dt,.05))
    const te=elapsed.current
    let d,walking=te<tEnd,inEntry=false,inBarreira=false,inBarnPed=false,pedPhase=0
    if(!isPerson){
      d=Math.min(total,te*speed)
    }else if(te<t1){
      d=te*speed
    }else if(te<t1End){
      d=dEntryPed;walking=false;inEntry=true;pedPhase=(te-t1)/pEntry
    }else if(te<t2){
      d=dEntryPed+(te-t1End)*speed
    }else if(te<t2End){
      d=dBarreira;walking=false;inBarreira=true
    }else if(te<t3){
      d=dBarreira+(te-t2End)*speed
    }else if(te<t3End){
      d=dBarnPed;walking=false;inBarnPed=true;pedPhase=(te-t3)/pBarnPed
    }else{
      d=Math.min(total,dBarnPed+(te-t3End)*speed)
    }
    let left=d,sg=segs[segs.length-1],k=1
    for(const s of segs){ if(left<=s.len){sg=s;k=s.len?left/s.len:1;break} left-=s.len }
    ref.current.position.set(sg.a[0]+(sg.b[0]-sg.a[0])*k,0,sg.a[1]+(sg.b[1]-sg.a[1])*k)
    ref.current.rotation.y=Math.atan2(-(sg.b[1]-sg.a[1]),sg.b[0]-sg.a[0])
    if(isPerson&&bodyGroup.current){
      const dip=inBarnPed?-.02+Math.abs(Math.sin(pedPhase*Math.PI*3))*.04:0
      bodyGroup.current.position.y=inBarreira?0:walking?Math.abs(Math.sin(d*5))*.05:dip
      const swing=walking?Math.sin(d*5)*.32:0
      if(legL.current) legL.current.rotation.z=swing
      if(legR.current) legR.current.rotation.z=-swing
      const changed=te>=t2+pBar*.5
      const sanitized=te>=t3+pBarnPed*.35
      if(torso.current) torso.current.material.color.set(changed?'#f4f1ea':'#7e8380')
      const bootColor=sanitized?'#1f7a5a':changed?'#358f6e':'#6b4c35'
      if(bootL.current) bootL.current.material.color.set(bootColor)
      if(bootR.current) bootR.current.material.color.set(bootColor)
      const nearEndPed=d>total-.6&&te<tEnd
      if(splash.current){
        const showSplash=inEntry||inBarnPed||nearEndPed
        splash.current.visible=showSplash
        if(showSplash){
          const sp=inEntry?(pedPhase*1.5)%1:inBarnPed?(pedPhase*2.5)%1:((total-d)/.6*1.5)%1
          splash.current.scale.setScalar(.45+sp*.85)
          splash.current.material.opacity=.9*(1-sp)
        }
      }
    }else if(ref.current.children[0]){
      ref.current.children[0].position.y=Math.abs(Math.sin(d*5))*.05*(walking?1:0)
    }
    if(te>=tEnd&&!fired.current){fired.current=true;done.current&&done.current()}
    else if(te<tEnd) invalidate()
  })
  const body=isPerson
    ? <group ref={bodyGroup}>
        <mesh ref={torso} position={[0,.56,0]} castShadow><capsuleGeometry args={[.16,.34,4,10]}/><meshStandardMaterial color="#7e8380"/></mesh>
        <mesh position={[0,1.02,0]} castShadow><sphereGeometry args={[.145,12,10]}/><meshStandardMaterial color="#e8b99a"/></mesh>
        <group ref={legL} position={[0,.34,-.09]}>
          <Box at={[0,-.1,0]} size={[.1,.2,.1]} color="#4a4e52"/>
          <mesh ref={bootL} position={[.03,-.24,0]} castShadow><boxGeometry args={[.2,.14,.12]}/><meshStandardMaterial color="#6b4c35"/></mesh>
        </group>
        <group ref={legR} position={[0,.34,.09]}>
          <Box at={[0,-.1,0]} size={[.1,.2,.1]} color="#4a4e52"/>
          <mesh ref={bootR} position={[.03,-.24,0]} castShadow><boxGeometry args={[.2,.14,.12]}/><meshStandardMaterial color="#6b4c35"/></mesh>
        </group>
      </group>
    : kind==='animais'
    ? <group><mesh position={[0,.34,0]} scale={[1.3,.8,.8]} castShadow><sphereGeometry args={[.38,14,10]}/><meshStandardMaterial color="#f2c4af"/></mesh><mesh position={[.4,.38,0]} castShadow><sphereGeometry args={[.2,12,10]}/><meshStandardMaterial color="#eeaf99"/></mesh></group>
    : <group><Box at={[0,.4,0]} size={[.6,.5,.6]} color={kind==='residuos'?'#8a8f8c':'#c9a45c'}/></group>
  return <group ref={ref} position={[pts[0][0],0,pts[0][1]]}>
    {body}
    {isPerson && <mesh ref={splash} visible={false} position={[0,.23,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.35,.52,28]}/><meshBasicMaterial color="#48a9cc" transparent toneMapped={false}/></mesh>}
    <mesh position={[0,.03,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.5,.68,28]}/><meshBasicMaterial color={color} toneMapped={false} transparent opacity={.85}/></mesh>
  </group>
}
function Lamp({at}){
  return <group position={at}><Box at={[0,.9,0]} size={[.07,1.8,.07]} color="#58625f"/><Box at={[0,.07,0]} size={[.22,.14,.22]} color="#6c7572"/><Box at={[.1,1.82,0]} size={[.3,.05,.05]} color="#58625f"/><mesh position={[.22,1.78,0]}><sphereGeometry args={[.14,12,10]}/><meshBasicMaterial color="#ffe9a8"/></mesh></group>
}
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
export default function Farm({selected,onSelect,reset,showZones,activeFlows,near,inset,onAnchor,zoomTick,panelOpen,tour,onTourDone}) {
  const tourFlow=tour&&tour.flow
  const portal=useRef(null)
  const cutting=near&&isBarn(selected)
  const sel=sectors[selected]
  return <div ref={portal} style={{height:"100%"}}><Canvas resize={{debounce:0}} orthographic shadows frameloop={cutting?"always":"demand"} dpr={[1,1.6]} camera={{position:[19,20,26],near:.1,far:160}} fallback={<p>Use a lista de setores para explorar as fichas neste dispositivo.</p>}>
    <Camera reset={reset} selected={selected} near={near} zoomTick={zoomTick} panelOpen={panelOpen}/>
    <Tracker target={inset?sel:null} onAnchor={onAnchor}/>
    <hemisphereLight args={['#fff6e2','#7d8c55',1.6]}/><directionalLight position={[4,15,8]} intensity={2.4} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15}/>
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[180,180]}/><meshStandardMaterial map={grass}/></mesh>
    {/* Cercamento perimetral conectado ao portão, embarcadouro e passagem de serviço do rodolúvio */}
    <Fence at={[0,0,-8.2]} length={21}/><Fence at={[10.5,0,-.2]} length={16} turn={Math.PI/2}/><Fence at={[-10.5,0,-.2]} length={16} turn={Math.PI/2}/>
    <Fence at={[-8.35,0,7.8]} length={4.3}/><Fence at={[-1.35,0,7.8]} length={3.3}/><Fence at={[3.175,0,7.8]} length={.95}/><Fence at={[8.075,0,7.8]} length={4.85}/>
    <Box at={[0,.025,13.63]} size={[100,.04,4.6]} color="#5d625c"/>
    {Array.from({length:26},(_,i)=><Box key={i} at={[(i-13)*3,.053,13.63]} size={[1,.015,.06]} color="#f1ead0"/>)}
    <Box at={[0,.06,2.0]} size={[20,.06,1.15]} color="#d9cdb3"/><Box at={[-4.6,.06,1.3]} size={[1.6,.07,19.8]} color="#d9cdb3"/>
    <Box at={[4.65,.04,11.1]} size={[1.85,.05,1.8]} color="#cfc6b4"/><Box at={[4.65,.04,7.2]} size={[1.85,.05,2.4]} color="#cfc6b4"/>
    <ArrivingTruck play={tour?'t'+tour.run:selected===2?'e':'i'} parked={!!tour&&tour.step>0} inTour={Boolean(tour)} onDone={tour&&tour.step===0?onTourDone:null}/>
    {tour&&tour.step>0&&<Walker key={tour.run} pts={tourFlow.paths[0]} color={tourFlow.color} kind={tourFlow.id} onDone={onTourDone}/>}
    {[-2,1.5,5,8.5].map(x=><Lamp key={x} at={[x,0,2.9]}/>)}
    {sectors.map((s,i)=>{
      const dz=sel?s.z-sel.z:0, dx=sel?s.x-sel.x:0
      return <Building key={s.name} {...{s,i,onSelect,portal,showZones}} selected={selected===i} tourFlowId={tourFlow?.id}
        cut={cutting&&selected===i} hide={cutting&&i!==selected&&dz>0&&Math.abs(dx-.45*dz)<3.2}/>
    })}
    {flows.filter(f=>activeFlows.includes(f.id)).map(f=><Flow key={f.id} {...f}/>)}
    {[[-9.3,-6.2],[0,-7],[2,-7],[4,-7],[9.5,5.4],[-9.2,4.5],...Array.from({length:40},(_,i)=>[(i%20-10)*2.4,-11-Math.floor(i/20)*3+Math.sin(i)])].map(([x,z],i)=><Tree key={i} at={[x,0,z]} i={i}/>)}
    {[[-10.9,-7],[-10.9,-3],[10.9,-4.5],[10.9,2.5],[-6.8,8.6],[9.1,8.7],[9.6,8.7],[-2.4,-8.9],[3.2,-8.9],[8.4,-8.9]].map(([x,z],i)=><Bush key={i} at={[x,0,z]} s={.9+(i%3)*.18}/>)}
    <Gate x={-4.6} active={selected===0} holdOpen={Boolean(tour&&tourFlow?.id==='pessoas')} onSelect={onSelect}/>
  </Canvas></div>
}
