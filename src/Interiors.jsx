import React,{useLayoutEffect,useRef} from 'react'
import {Canvas,useFrame,useThree} from '@react-three/fiber'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import Pig from './Pig'
import {BarnScene} from './BarnInterior'

// Janelinha de zoom: usa um único contexto WebGL persistente e troca apenas a cena interna,
// evitando esgotar o limite de contextos WebGL do navegador ao navegar pelos 14 setores.
const clamp=x=>Math.min(1,Math.max(0,x))
const ph=(c,a,b)=>clamp((c-a)/(b-a))
const ease=k=>k*k*(3-2*k)
const lerp=(a,b,k)=>a+(b-a)*k
const B=({at,size,color,rot=[0,0,0]})=><mesh position={at} rotation={rot} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color}/></mesh>
function useT(){const t=useRef(0);useFrame((_,dt)=>{t.current+=Math.min(dt,.05)});return t}
function Person({g,body,at,color='#f4f1ea'}){
  return <group ref={g} position={at}><mesh ref={body} position={[0,.42,0]} castShadow><capsuleGeometry args={[.17,.4,4,10]}/><meshStandardMaterial color={color}/></mesh><mesh position={[0,.92,0]} castShadow><sphereGeometry args={[.15,12,10]}/><meshStandardMaterial color="#e8b99a"/></mesh></group>
}
function Car({g,color='#a3546a'}){
  return <group ref={g}>
    <B at={[0,.3,0]} size={[1.1,.3,.56]} color={color}/>
    <B at={[-.08,.55,0]} size={[.55,.25,.5]} color="#b8d6de"/>
    {[-.34,.34].map(x=>[-.29,.29].map(z=><mesh key={x+'_'+z} position={[x,.14,z]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.14,.14,.09,10]}/><meshStandardMaterial color="#2c3030"/></mesh>))}
  </group>
}
function Room({w=7,d=4,wall='#e8e3d6',floor='#cfc6b4',h=2.4}){
  return <group>
    <B at={[0,-.1,0]} size={[w,.2,d]} color={floor}/>
    <B at={[0,h/2,-d/2]} size={[w,h,.14]} color={wall}/>
    <B at={[-w/2,h/2,0]} size={[.14,h,d]} color={wall}/>
  </group>
}
function Drops({n=10,color='#7fb8e8',at,h=1.6,spread=.2,speed=.8}){
  const t=useT(),refs=useRef([])
  useFrame(()=>{refs.current.forEach((m,i)=>{if(!m)return;const k=(t.current*speed+i/n)%1;m.position.y=at[1]-k*h;m.scale.setScalar(k>.93?.01:1)})})
  return <group position={[at[0],0,at[2]]}>{Array.from({length:n},(_,i)=><mesh key={i} ref={m=>{refs.current[i]=m}} position={[Math.sin(i*2.4)*spread,at[1],Math.cos(i*1.7)*spread]}><sphereGeometry args={[.05,8,6]}/><meshBasicMaterial color={color} toneMapped={false}/></mesh>)}</group>
}
function Tick({g}){
  return <group ref={g}><B at={[-.1,0,0]} size={[.12,.34,.05]} rot={[0,0,.8]} color="#2f7d62"/><B at={[.12,.06,0]} size={[.12,.6,.05]} rot={[0,0,-.7]} color="#2f7d62"/></group>
}

// 01 Portaria: placa de acesso restrito, registro na guarita e cancela controlada.
function Gate(){
  const t=useT(),vis=useRef(),arm=useRef(),log=useRef()
  useFrame(()=>{
    if(!vis.current||!arm.current||!log.current) return
    const c=(t.current%9)/9
    vis.current.visible=c<.9
    vis.current.position.x=c<.55?lerp(-3.6,-.4,ease(ph(c,0,.3))):lerp(-.4,3.6,ease(ph(c,.55,.88)))
    arm.current.rotation.x=(ph(c,.48,.58)-ph(c,.88,.98))*1.25
    log.current.visible=c>.3&&c<.5
  })
  return <group>
    <B at={[0,-.1,0]} size={[9,.2,5]} color="#b8b3a4"/>
    <B at={[0,.9,-1.6]} size={[2.4,1.8,.1]} color="#ece8df"/><B at={[-1.15,.9,-1.1]} size={[.1,1.8,1]} color="#ece8df"/><B at={[1.15,.9,-1.1]} size={[.1,1.8,1]} color="#ece8df"/>
    <B at={[0,.5,-.8]} size={[1.6,.9,.4]} color="#9a5b48"/>
    <mesh ref={log} position={[0,1.0,-.75]}><boxGeometry args={[.5,.03,.35]}/><meshStandardMaterial color="#ffffff"/></mesh>
    <Person at={[0,0,-1.25]}/>
    <group ref={vis} position={[-3.6,0,.5]}><Person/></group>
    <B at={[1.7,.4,1.7]} size={[.16,.8,.16]} color="#6c7572"/>
    <group ref={arm} position={[1.7,.8,1.7]}>{[0,1,2,3,4].map(k=><B key={k} at={[0,0,-.22-k*.44]} size={[.08,.08,.44]} color={k%2?'#f6f3ea':'#d9483b'}/>)}</group>
    <B at={[-3.3,.55,1.8]} size={[.12,1.1,.12]} color="#6c7572"/>
    <B at={[-3.3,1.2,1.8]} size={[1.45,.6,.07]} color="#f6f3ea"/>
    <B at={[-3.3,1.35,1.84]} size={[1.35,.2,.02]} color="#b2453a"/>
    <B at={[-3.3,1.05,1.84]} size={[1.1,.08,.02]} color="#26232a"/>
  </group>
}
// 02 Estacionamento externo: veículo permanece fora e visitante segue a pé.
function Parking(){
  const t=useT(),car=useRef(),man=useRef()
  useFrame(()=>{
    if(!car.current||!man.current) return
    const c=(t.current%10)/10
    const carX=c<.3?lerp(4.2,.4,ease(ph(c,0,.3))):c<.88?.4:lerp(.4,4.2,ease(ph(c,.88,1)))
    const carZ=c<.3?1.7:c<.4?lerp(1.7,-.3,ease(ph(c,.3,.4))):c<.8?-.3:c<.88?lerp(-.3,1.7,ease(ph(c,.8,.88))):1.7
    const rot=c<.3?Math.PI:c<.4?lerp(Math.PI,Math.PI/2,ease(ph(c,.3,.4))):c<.8?Math.PI/2:c<.88?lerp(Math.PI/2,0,ease(ph(c,.8,.88))):0
    car.current.position.set(carX,0,carZ)
    car.current.rotation.y=rot
    const goX=c<.42?.4:c<.62?lerp(.4,-3,ease(ph(c,.42,.62))):c<.72?-3:lerp(-3,.4,ease(ph(c,.72,.85)))
    man.current.visible=c>.4&&c<.86
    man.current.position.set(goX,0,.5)
  })
  return <group>
    <B at={[0,-.1,0]} size={[9,.2,5]} color="#9aa09c"/>
    <B at={[0,0,1.7]} size={[9,.01,1.4]} color="#5d625c"/>
    {[-1.6,.4,2.4].map(x=><B key={x} at={[x,.01,-.5]} size={[.05,.01,1.6]} color="#f1ead0"/>)}
    <B at={[-3.6,.5,.5]} size={[.14,1,.14]} color="#6c7572"/><B at={[-3.6,1.1,.5]} size={[.8,.4,.06]} color="#a3546a"/>
    <group position={[-1.2,0,-.3]} rotation={[0,Math.PI/2,0]}><Car color="#e8ecea"/></group>
    <Car g={car}/>
    <group ref={man}><Person/></group>
  </group>
}
// 03 Rodolúvio e controle de veículos: imersão completa dos pneus no fosso desinfetante + arco pulverizador.
function Delivery(){
  const t=useT(),truck=useRef(),wheels=useRef([]),wheelGroups=useRef([]),prevX=useRef(-4.1),ripA=useRef(),ripB=useRef(),tick=useRef()
  useFrame(()=>{
    if(!truck.current||!ripA.current||!ripB.current||!tick.current) return
    const c=(t.current%11)/11
    const x=c<.34?lerp(-4.1,-.15,ease(ph(c,0,.34))):c<.66?lerp(-.15,.35,ph(c,.34,.66)):lerp(.35,4.1,ease(ph(c,.66,.96)))
    const dx=x-prevX.current
    prevX.current=x
    const step=Math.abs(dx)>2?0:dx
    const inPool=x>-1.55&&x<1.75
    const clean=x>.05
    truck.current.visible=c<.97
    truck.current.position.set(x,inPool?-.05:.03,.35)
    wheelGroups.current.forEach(g=>{
      if(g) g.rotation.z-=step/.24
    })
    wheels.current.forEach(w=>{
      if(w) w.material.color.set(clean?'#222628':'#75563b')
    })
    ;[ripA,ripB].forEach((r,k)=>{
      r.current.visible=inPool
      if(inPool){
        const p=((t.current*1.4)+k*.5)%1
        r.current.position.set(x+(k?.85:-.75),.06,.35)
        r.current.scale.setScalar(.45+p*.85)
      }
    })
    tick.current.visible=c>.62&&c<.92
    tick.current.scale.setScalar(.7+.2*Math.sin(t.current*7))
  })
  return <group>
    <B at={[0,-.1,0]} size={[9.4,.2,5]} color="#b8b3a4"/>
    {/* Guarita de controle e registro de veículos ao fundo */}
    <B at={[-2.6,.75,-1.55]} size={[2.1,1.5,1.1]} color="#ece8df"/>
    <B at={[-2.6,1.55,-1.55]} size={[2.3,.1,1.25]} color="#899595"/>
    <Person at={[-2.6,0,-.82]}/>
    {/* Pista e rampas do rodolúvio */}
    <B at={[-3.3,.02,.35]} size={[2.4,.04,1.9]} color="#6c716d"/>
    <B at={[3.3,.02,.35]} size={[2.4,.04,1.9]} color="#6c716d"/>
    <B at={[-1.9,.04,.35]} size={[.7,.07,1.9]} rot={[0,0,.1]} color="#9d9788"/>
    <B at={[1.9,.04,.35]} size={[.7,.07,1.9]} rot={[0,0,-.1]} color="#9d9788"/>
    {/* Fosso impermeável do rodolúvio com guias amarelas e lâmina desinfetante */}
    {[-.98,.98].map(z=><B key={z} at={[0,.12,.35+z]} size={[3.6,.18,.14]} color="#e7b93c"/>)}
    <B at={[0,.03,.35]} size={[3.5,.06,1.82]} color="#47a8cc"/>
    <mesh ref={ripA} position={[0,.06,.35]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.48,.62,28]}/><meshBasicMaterial color="#dff4fc" toneMapped={false}/></mesh>
    <mesh ref={ripB} position={[0,.06,.35]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.48,.62,28]}/><meshBasicMaterial color="#dff4fc" toneMapped={false}/></mesh>
    {/* Arco de desinfecção com pulverização superior e lateral */}
    {[-.35,.55].map(ax=><group key={ax} position={[ax,0,.35]}>
      {[-1.02,1.02].map(z=><B key={z} at={[0,1.1,z]} size={[.12,2.2,.12]} color="#5c6865"/>)}
      <B at={[0,2.18,0]} size={[.14,.14,2.16]} color="#5c6865"/>
    </group>)}
    <Drops n={18} at={[.1,2.1,.35]} h={1.95} spread={.72} speed={1.15} color="#9ad6f5"/>
    <group position={[2.2,1.85,-1.1]}><Tick g={tick}/></group>
    {/* Caminhão passando pelo rodolúvio (pneus marrons entram sujos e saem pretos desinfetados) */}
    <group ref={truck} position={[-4.1,.03,.35]}>
      <B at={[-.35,.86,0]} size={[2.0,1.06,1.12]} color="#e8ecea"/>
      <B at={[.15,.30,0]} size={[2.7,.12,.96]} color="#5a615f"/>
      <B at={[1.08,.58,0]} size={[.80,.58,1.08]} color="#3f6b78"/>
      <B at={[.80,1.06,0]} size={[.24,.40,1.08]} color="#3f6b78"/>
      <B at={[1.15,1.04,0]} size={[.56,.34,1.02]} color="#b8d6de"/>
      <B at={[1.44,1.04,0]} size={[.06,.32,.94]} color="#cde4ec"/>
      <B at={[1.07,1.26,0]} size={[.80,.10,1.08]} color="#355c68"/>
      <B at={[.86,1.35,0]} size={[.34,.10,.98]} rot={[0,0,-.24]} color="#355c68"/>
      <B at={[1.49,.54,0]} size={[.04,.28,.70]} color="#283032"/>
      <B at={[1.49,.28,0]} size={[.10,.12,1.10]} color="#6d7574"/>
      {[-.36,.36].map(z=><B key={'h'+z} at={[1.49,.49,z]} size={[.05,.09,.14]} color="#ffe9a8"/>)}
      {[-.60,.60].map(z=><B key={'m'+z} at={[1.34,1.02,z]} size={[.05,.20,.05]} color="#2c3030"/>)}
      {[-.95,-.05,.95].flatMap((wx,i)=>[-.54,.54].map((wz,j)=>{
        const idx=i*2+j
        return <group key={idx} ref={g=>{wheelGroups.current[idx]=g}} position={[wx,.24,wz]}>
          <mesh ref={m=>{wheels.current[idx]=m}} rotation={[Math.PI/2,0,0]} castShadow>
            <cylinderGeometry args={[.24,.24,.14,16]}/><meshStandardMaterial color="#75563b"/>
          </mesh>
          <mesh position={[0,0,wz>0?.075:-.075]} rotation={[Math.PI/2,0,0]}>
            <cylinderGeometry args={[.11,.11,.02,12]}/><meshStandardMaterial color="#b9c0be"/>
          </mesh>
          <B at={[0,0,wz>0?.09:-.09]} size={[.18,.035,.015]} color="#4a504e"/>
        </group>
      }))}
    </group>
  </group>
}
// 04 Controle de acesso e registro sanitário: procedência e histórico de contato com animais.
function Reception(){
  const t=useT(),vis=useRef(),tick=useRef(),sheet=useRef()
  useFrame(()=>{
    if(!vis.current||!tick.current||!sheet.current) return
    const c=(t.current%9)/9
    vis.current.visible=c<.92
    vis.current.position.x=c<.4?lerp(-3.2,-.9,ease(ph(c,0,.35))):c<.62?-.9:lerp(-.9,3.1,ease(ph(c,.62,.92)))
    tick.current.visible=c>.5&&c<.7
    tick.current.scale.setScalar(.6+.25*Math.sin(t.current*8))
    sheet.current.visible=c>.36&&c<.62
  })
  return <group>
    <Room w={7.4} d={4}/>
    <B at={[0,.5,-.35]} size={[2.6,.9,.5]} color="#9a5b48"/><B at={[0,.98,-.35]} size={[2.7,.08,.62]} color="#e2d6bd"/>
    <Person at={[0,0,-1.1]}/>
    <mesh ref={sheet} position={[-.5,1.06,-.2]}><boxGeometry args={[.4,.02,.3]}/><meshStandardMaterial color="#fff"/></mesh>
    <group position={[.2,1.8,-1.5]} scale={1}><Tick g={tick}/></group>
    <group ref={vis} position={[-3.2,0,.8]}><Person/></group>
    <B at={[-3.69,1.0,.8]} size={[.06,2,1]} color="#8a6a55"/><B at={[3.69,1.0,.8]} size={[.06,2,1]} color="#8a6a55"/>
  </group>
}
// 05 Barreira sanitária: área suja → banho e botas exclusivas → imersão das botas no pedilúvio → área limpa.
function Barrier(){
  const t=useT(),vis=useRef(),body=useRef(),bootL=useRef(),bootR=useRef(),legL=useRef(),legR=useRef(),rip=useRef(),tick=useRef()
  useFrame(()=>{
    if(!vis.current||!body.current||!bootL.current||!bootR.current||!legL.current||!legR.current||!rip.current||!tick.current) return
    const c=(t.current%12)/12
    // Etapas: 0..0.26 área suja -> 0.26..0.52 banho e troca -> 0.52..0.64 vai ao pedilúvio -> 0.64..0.84 pausa no pedilúvio -> 0.84..0.97 sai limpo
    const x=c<.26?lerp(-3.2,-.45,ease(ph(c,0,.26)))
      :c<.46?lerp(-.45,.55,ease(ph(c,.26,.46)))
      :c<.62?lerp(.55,1.95,ease(ph(c,.46,.62)))
      :c<.83?1.95
      :lerp(1.95,3.3,ease(ph(c,.83,.97)))
    const walking=!(c>=.62&&c<.83)&&!(c>=.34&&c<.44)
    const inBath=c>=.62&&c<.84
    vis.current.visible=c<.97
    vis.current.position.set(x,inBath?-.02:0,.6)
    const swing=walking?Math.sin(t.current*10)*.28:0
    legL.current.rotation.z=swing
    legR.current.rotation.z=-swing
    const changed=x>.25
    body.current.material.color.set(changed?'#f7f6f2':'#7e8380')
    const bootColor=inBath||c>=.83?'#1f7a5a':changed?'#358f6e':'#6b4c35'
    bootL.current.material.color.set(bootColor)
    bootR.current.material.color.set(bootColor)
    rip.current.visible=inBath
    if(inBath){
      const p=((c-.62)/.22*2)%1
      rip.current.scale.setScalar(.4+p*.85)
    }
    tick.current.visible=c>.68&&c<.92
    tick.current.scale.setScalar(.65+.22*Math.sin(t.current*8))
  })
  return <group>
    <Room w={7.8} d={4.2} floor="#e6cfc8"/>
    {/* Piso verde-claro da área limpa */}
    <B at={[1.95,-.09,0]} size={[3.9,.02,4.1]} color="#cfe3d6"/>
    {/* Divisória entre vestiário sujo e limpo + banco de passagem */}
    <B at={[0,1.2,-1.45]} size={[.14,2.4,1.2]} color="#d9d3c4"/><B at={[0,1.9,.2]} size={[.14,1,2.2]} color="#d9d3c4"/>
    <B at={[-2.6,.3,-1.6]} size={[1.9,.1,.5]} color="#8a6a55"/>{[-3.2,-2.0].map(x=><B key={x} at={[x,.15,-1.6]} size={[.08,.3,.4]} color="#8a6a55"/>)}
    {/* Armários de roupa e botas exclusivas da granja */}
    {[1.35,2.15,2.95].map(x=><B key={x} at={[x,1.1,-1.88]} size={[.68,2.2,.32]} color="#7d8c96"/>)}
    {/* Chuveiro na passagem */}
    <B at={[.55,2.2,.6]} size={[.5,.05,.5]} color="#8d9996"/><B at={[.55,1.1,.6]} size={[.04,2.2,.04]} color="#8d9996"/>
    <Drops n={14} at={[.55,2.15,.6]} h={2.1} spread={.2} speed={.9}/>
    {/* Lava-botas + Pedilúvio em destaque com solução desinfetante ativa */}
    <B at={[1.2,.25,-.35]} size={[.36,.5,.36]} color="#8d9996"/>
    <B at={[1.95,.055,.6]} size={[1.22,.11,.96]} color="#e7b93c"/>
    <B at={[1.95,.105,.6]} size={[1.04,.04,.78]} color="#47a8cc"/>
    <mesh ref={rip} position={[1.95,.14,.6]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.28,.4,28]}/><meshBasicMaterial color="#dff4fc" toneMapped={false}/></mesh>
    <group position={[1.95,1.75,-.5]}><Tick g={tick}/></group>
    {/* Trabalhador/visitante com pernas e botas visíveis */}
    <group ref={vis} position={[-3.2,0,.6]}>
      <mesh ref={body} position={[0,.56,0]} castShadow><capsuleGeometry args={[.16,.34,4,10]}/><meshStandardMaterial color="#7e8380"/></mesh>
      <mesh position={[0,1.02,0]} castShadow><sphereGeometry args={[.145,12,10]}/><meshStandardMaterial color="#e8b99a"/></mesh>
      <group ref={legL} position={[0,.34,-.09]}>
        <B at={[0,-.1,0]} size={[.1,.2,.1]} color="#4a4e52"/>
        <mesh ref={bootL} position={[.03,-.24,0]} castShadow><boxGeometry args={[.2,.14,.12]}/><meshStandardMaterial color="#6b4c35"/></mesh>
      </group>
      <group ref={legR} position={[0,.34,.09]}>
        <B at={[0,-.1,0]} size={[.1,.2,.1]} color="#4a4e52"/>
        <mesh ref={bootR} position={[.03,-.24,0]} castShadow><boxGeometry args={[.2,.14,.12]}/><meshStandardMaterial color="#6b4c35"/></mesh>
      </group>
    </group>
  </group>
}
// 06 Embarcadouro e desembarcadouro: caminhão encosta pelo lado externo e suínos seguem pela rampa.
function LoadingRamp(){
  const t=useT(),pigRef=useRef()
  useFrame(()=>{
    if(!pigRef.current) return
    const c=(t.current%8)/8
    const k=ease(ph(c,.1,.82))
    pigRef.current.visible=c<.88
    pigRef.current.position.set(lerp(-1.5,2.7,k),lerp(.68,.02,clamp(k*1.35)),0)
  })
  return <group>
    <B at={[0,-.1,0]} size={[9,.2,5]} color="#b8b3a4"/>
    <B at={[-2.7,.01,0]} size={[3.6,.02,4.8]} color="#6b706b"/>
    <B at={[2.1,.01,0]} size={[4.8,.02,4.8]} color="#c9d9c2"/>
    <B at={[-.85,.03,0]} size={[.14,.04,4.8]} color="#e7b93c"/>
    {[-1.8,1.8].map(z=><B key={z} at={[-.85,.65,z]} size={[.12,1.3,1.3]} color="#e9e4d6"/>)}
    <B at={[-2.65,.88,0]} size={[2.2,1.15,1.3]} color="#d9c290"/>
    <B at={[-4.08,.58,0]} size={[.78,.58,1.18]} color="#3f6b78"/>
    <B at={[-3.82,1.08,0]} size={[.24,.44,1.18]} color="#3f6b78"/>
    <B at={[-4.14,1.06,0]} size={[.54,.36,1.12]} color="#b8d6de"/>
    <B at={[-4.42,1.06,0]} size={[.06,.34,1.02]} color="#cde4ec"/>
    <B at={[-4.07,1.31,0]} size={[.78,.11,1.18]} color="#355c68"/>
    <B at={[-3.88,1.40,0]} size={[.34,.11,1.06]} rot={[0,0,.24]} color="#355c68"/>
    <B at={[-4.48,.55,0]} size={[.04,.28,.76]} color="#283032"/>
    <B at={[-4.48,.28,0]} size={[.10,.12,1.20]} color="#6d7574"/>
    {[-.38,.38].map(z=><B key={'lh'+z} at={[-4.48,.50,z]} size={[.05,.09,.15]} color="#ffe9a8"/>)}
    {[-3.9,-2.9,-1.9].map(wx=>[-.6,.6].map(wz=><mesh key={wx+'_'+wz} position={[wx,.22,wz]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.22,.22,.12,12]}/><meshStandardMaterial color="#2c3030"/></mesh>))}
    <B at={[.3,.38,0]} size={[2.5,.12,1.15]} rot={[0,0,-.26]} color="#9d9686"/>
    {[-.55,.55].map(z=><B key={z} at={[.3,.72,z]} size={[2.5,.55,.06]} rot={[0,0,-.26]} color="#77857c"/>)}
    <B at={[2.25,.05,0]} size={[1.7,.08,1.2]} color="#cfc6b4"/>
    <group ref={pigRef} position={[-1.5,.68,0]} rotation={[0,Math.PI/2,0]} scale={.65}><Pig x={0} z={0} phase={.4} inPlace/></group>
  </group>
}
// 07 Quarentena: animais isolados, acompanhamento veterinário e equipamentos exclusivos.
function Quarantine(){
  const t=useT(),vet=useRef(),ring=useRef()
  const stops=[-2.4,-.8,.8,2.4,.8,-.8]
  useFrame(()=>{
    if(!vet.current||!ring.current) return
    const c=t.current/2.2,i=Math.floor(c)%stops.length,f=c%1,j=(i+1)%stops.length
    vet.current.position.x=f<.55?lerp(stops[i],stops[j],ease(f/.55)):stops[j]
    ring.current.position.x=stops[j]
    ring.current.visible=f>.55
    ring.current.scale.setScalar(.7+.3*Math.sin(t.current*7))
  })
  return <group>
    <Room w={7.6} d={4.6} wall="#ece8df"/>
    <B at={[0,.01,.5]} size={[7.4,.01,.08]} color="#457b9d"/>
    {[-2.4,-.8,.8,2.4].map((x,i)=><group key={x}>
      <B at={[x+.8,.45,-1.4]} size={[.08,.9,1.9]} color="#b7b3a3"/>
      <group position={[x,0,-1.4]} scale={.7}><Pig x={0} z={0} phase={i*1.9}/></group>
    </group>)}
    <B at={[-3.2,.45,-1.4]} size={[.08,.9,1.9]} color="#b7b3a3"/>
    <B at={[-3.62,1.1,1.2]} size={[.12,1.1,.9]} color="#457b9d"/>
    {[0,1].map(k=><B key={k} at={[-3.45,.25,1.0+k*.4]} size={[.22,.45,.18]} color="#2f7d62"/>)}
    <mesh ref={ring} position={[0,.05,-1.4]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.5,.6,32]}/><meshBasicMaterial color="#457b9d" toneMapped={false}/></mesh>
    <group ref={vet} position={[-2.4,0,.1]}><Person color="#dcebf2"/></group>
  </group>
}
// 11 Silos e depósito: ração desce dos silos fechados e segue protegida contra pragas.
function Storage(){
  const t=useT(),refs=useRef([])
  useFrame(()=>{refs.current.forEach((m,i)=>{
    if(!m) return
    const k=(t.current*.2+i/8)%1
    m.position.set(-1.9+k*5.4,.62,.4)
    m.scale.setScalar(k>.95?.01:1)
  })})
  return <group>
    <Room w={8.6} d={4.6}/>
    {[-2.8,-1.5].map(x=><group key={x}><mesh position={[x,1.3,-1.4]} castShadow><cylinderGeometry args={[.6,.6,2.6,24]}/><meshStandardMaterial color="#cdd5d1" metalness={.5} roughness={.35}/></mesh><mesh position={[x,.12,-1.4]}><cylinderGeometry args={[.1,.5,.25,16]}/><meshStandardMaterial color="#95a3a0"/></mesh><Drops n={6} at={[x,.1,-.7]} h={.5} color="#d8b25a" spread={.04}/></group>)}
    <B at={[.8,.4,.4]} size={[5.6,.1,.5]} color="#4f5755"/><B at={[.8,.2,.4]} size={[5.6,.4,.1]} color="#6f7a76"/>
    {[0,1,2,3,4,5,6,7].map(i=><mesh key={i} ref={m=>{refs.current[i]=m}}><boxGeometry args={[.2,.2,.2]}/><meshStandardMaterial color="#d8b25a"/></mesh>)}
    <B at={[3.7,.5,.4]} size={[.9,1,.9]} color="#6d7673"/>
    {[0,1,2].map(k=><B key={k} at={[-3.3+k*.6,.2,1.6]} size={[.5,.4,.35]} color="#c9a45c"/>)}
  </group>
}
// 12 Reservatório e abastecimento de água: tanque vedado, dosador de cloro e rede limpa.
function Water(){
  const t=useT(),lvl=useRef(),refs=useRef([])
  useFrame(()=>{
    if(!lvl.current) return
    const k=.65+.2*Math.sin(t.current*.8)
    lvl.current.scale.y=k;lvl.current.position.y=.12+1.1*k
    refs.current.forEach((m,i)=>{if(!m)return;const p=(t.current*.35+i/7)%1;m.position.set(-.5+p*4,.18,.9)})
  })
  return <group>
    <Room w={8.4} d={4.4}/>
    <mesh position={[-2.6,1.3,-.5]}><cylinderGeometry args={[1.15,1.15,2.5,28]}/><meshStandardMaterial color="#b8d6de" transparent opacity={.3}/></mesh>
    <mesh position={[-2.6,2.6,-.5]}><cylinderGeometry args={[1.2,1.2,.12,28]}/><meshStandardMaterial color="#5c7b7c"/></mesh>
    <mesh ref={lvl} position={[-2.6,1.3,-.5]}><cylinderGeometry args={[1.1,1.1,2.2,28]}/><meshStandardMaterial color="#4f9ac9"/></mesh>
    <B at={[-1.2,.15,.9]} size={[3.4,.14,.14]} color="#8d9996"/><B at={[1.8,.15,.9]} size={[2.6,.14,.14]} color="#8d9996"/>
    {[0,1,2,3,4,5,6].map(i=><mesh key={i} ref={m=>{refs.current[i]=m}}><sphereGeometry args={[.1,10,8]}/><meshBasicMaterial color="#7fb8e8" toneMapped={false}/></mesh>)}
    {[1.2,2.2,3.2].map(x=><group key={x}><B at={[x,.85,.9]} size={[.06,.7,.06]} color="#8d9996"/><Drops n={3} at={[x,.45,.9]} h={.35} spread={.02} speed={.6}/></group>)}
    <B at={[2.2,.1,1.5]} size={[2.6,.2,.5]} color="#8a8f8c"/>
  </group>
}
// 13 Área de resíduos e animais mortos: coleta isolada na zona suja.
function Waste(){
  const t=useT(),man=useRef(),bag=useRef(),lid=useRef()
  useFrame(()=>{
    if(!man.current||!bag.current||!lid.current) return
    const c=(t.current%9)/9
    const x=c<.4?lerp(-3,1.3,ease(ph(c,0,.4))):c<.6?1.3:lerp(1.3,-3,ease(ph(c,.6,.95)))
    man.current.position.x=x
    lid.current.rotation.z=-(ph(c,.38,.45)-ph(c,.56,.62))*1.5
    const drop=ph(c,.45,.55)
    bag.current.visible=c<.55
    bag.current.position.set(c<.45?x+.25:1.75,c<.45?.7:lerp(.7,.5,drop)-drop*.3,.4)
  })
  return <group>
    <B at={[0,-.1,0]} size={[9,.2,5]} color="#a7aaa4"/>
    <B at={[0,.0,.4]} size={[8.6,.01,.06]} color="#b2453a"/>
    {[1.9,2.8].map((x,i)=><group key={x}><B at={[x,.35,-.4]} size={[.7,.7,.7]} color={i?'#6d7673':'#4f6b8a'}/></group>)}
    <group ref={lid} position={[2.25,.72,-.4]}><B at={[.35,0,0]} size={[.8,.06,.76]} color="#3f4543"/></group>
    <mesh ref={bag} castShadow><sphereGeometry args={[.17,10,8]}/><meshStandardMaterial color="#2d3030"/></mesh>
    <group ref={man} position={[-3,0,.4]}><Person/></group>
    <B at={[3.7,.65,-1.2]} size={[1.6,1.3,1.2]} color="#8d9996"/><B at={[3.7,.2,-1.2]} size={[1.64,.1,1.24]} color="#3f4543"/>
  </group>
}
// 14 Escritório sanitário e rastreabilidade: GTA, lotes, inspeções e contato imediato do SVO.
function Records(){
  const t=useT(),checks=useRef([]),pen=useRef(),scr=useRef()
  useFrame(()=>{
    if(!pen.current||!scr.current) return
    const c=(t.current%10)/10
    checks.current.forEach((m,i)=>m&&m.material.color.set(c>(i+1)/6?'#2f7d62':'#cfcabd'))
    pen.current.position.y=.98+Math.abs(Math.sin(t.current*9))*.03
    scr.current.material.color.set(Math.floor(t.current*2)%2?'#9fd0e8':'#7fb8e8')
  })
  return <group>
    <Room w={7} d={4}/>
    <B at={[1.2,1.55,-1.9]} size={[3.2,1.6,.05]} color="#f7f5f7"/>
    {[0,1,2,3,4].map(i=><group key={i}><B at={[.5,2.1-i*.3,-1.86]} size={[1.6,.14,.03]} color="#8a8f8c"/><mesh ref={m=>{checks.current[i]=m}} position={[2.3,2.1-i*.3,-1.86]}><boxGeometry args={[.2,.2,.03]}/><meshStandardMaterial color="#cfcabd"/></mesh></group>)}
    <B at={[-1.6,.45,-.6]} size={[2.4,.08,1.1]} color="#9a5b48"/>{[-2.7,-.5].map(x=><B key={x} at={[x,.2,-.6]} size={[.08,.4,1]} color="#6e5445"/>)}
    <B at={[-1.9,.95,-.8]} size={[.8,.5,.06]} color="#2e2b30"/><mesh ref={scr} position={[-1.9,.95,-.76]}><boxGeometry args={[.7,.42,.02]}/><meshStandardMaterial color="#7fb8e8"/></mesh>
    <B at={[-.75,.55,-.8]} size={[.28,.12,.22]} color="#b2453a"/>
    <group position={[-1.3,0,.2]}><Person/></group>
    <mesh ref={pen} position={[-1.2,.98,-.3]}><boxGeometry args={[.4,.02,.28]}/><meshStandardMaterial color="#fff"/></mesh>
    <B at={[-3.3,1,-1]} size={[.2,2,1.6]} color="#8a6a55"/>
  </group>
}

const scenes={0:Gate,1:Parking,2:Delivery,3:Reception,4:Barrier,5:LoadingRamp,6:Quarantine,10:Storage,11:Water,12:Waste,13:Records}
export const hasInterior=i=>i in scenes

function InsetCamera({i,kind}){
  const {camera,gl}=useThree()
  useLayoutEffect(()=>{
    const c=new OrbitControls(camera,gl.domElement)
    c.enablePan=Boolean(kind)
    c.screenSpacePanning=false
    c.maxPolarAngle=Math.PI/2.04
    if(kind){
      camera.fov=58
      camera.position.set(.7,3.65,10.6)
      c.target.set(0,1,-2)
      c.minDistance=.2
      c.maxDistance=40
    }else{
      camera.fov=54
      camera.position.set(1.9,2.5,4.3)
      c.target.set(0,.7,0)
      c.minDistance=2.5
      c.maxDistance=14
    }
    camera.updateProjectionMatrix()
    c.update()
    return ()=>c.dispose()
  },[i,kind,camera,gl])
  return null
}

export default function Interior({i,kind}){
  const Scene=scenes[i]||Gate
  return <Canvas shadows dpr={[1,1.5]} camera={{position:[1.9,2.5,4.3],fov:54}} fallback={<p>A vista interna precisa de suporte a WebGL.</p>}>
    <color attach="background" args={['#cbdac7']}/><hemisphereLight args={['#fff4df','#a49c82',2]}/>
    <directionalLight position={[3,9,5]} intensity={2} castShadow shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12}/>
    {kind ? <BarnScene key={'barn-'+kind} kind={kind}/> : <Scene key={'sec-'+i}/>}
    <InsetCamera i={i} kind={kind}/>
  </Canvas>
}
