import React,{useRef} from 'react'
import {Canvas,useFrame} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei/core/OrbitControls.js'
import Pig from './Pig'

// Janelinha de zoom: cada setor mostra, por dentro, o processo que acontece nele.
// As cenas são ilustrativas e seguem o que o guia descreve para cada setor (seção 3).
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

// 1 Portaria: o visitante se registra, a cancela sobe, ele passa e ela desce.
function Gate(){
  const t=useT(),vis=useRef(),arm=useRef(),log=useRef()
  useFrame(()=>{
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
    <B at={[-3.6,.35,2]} size={[.12,.7,.12]} color="#6c7572"/><B at={[-3.6,.9,2]} size={[1.2,.4,.06]} color="#a3546a"/>
  </group>
}
// 2 Estacionamento: o carro para do lado de fora e o visitante segue a pé.
function Parking(){
  const t=useT(),car=useRef(),man=useRef()
  useFrame(()=>{
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
// 3 Veículos e entrega: caixas descem do caminhão, passam pela higienização e seguem.
function Delivery(){
  const t=useT(),refs=useRef([])
  useFrame(()=>{refs.current.forEach((m,i)=>{
    const k=(t.current*.22+i/5)%1
    m.position.set(-2.3+k*5,.55+Math.sin(k*Math.PI)*.35,.2)
    m.rotation.y=k*2
  })})
  return <group>
    <B at={[0,-.1,0]} size={[9,.2,5]} color="#b8b3a4"/>
    <B at={[-3.2,.8,.2]} size={[1.8,1.2,1.5]} color="#e8ecea"/><B at={[-3.2,.35,.2]} size={[1.84,.1,1.54]} color="#5a615f"/>
    <B at={[0,.25,.2]} size={[5,.1,.9]} color="#6f7a76"/>
    <B at={[0,1.9,.2]} size={[1.2,.1,.9]} color="#8d9996"/>{[-.55,.55].map(x=><B key={x} at={[x,.95,-.2]} size={[.08,1.9,.08]} color="#6c7572"/>)}
    <Drops n={12} at={[0,1.85,.2]} h={1.3} spread={.45} color="#a8d8f0"/>
    <B at={[3.6,.4,.2]} size={[1.1,.8,1.1]} color="#c3ccc8"/>
    {[0,1,2,3,4].map(i=><mesh key={i} ref={m=>{refs.current[i]=m}} castShadow><boxGeometry args={[.4,.36,.4]}/><meshStandardMaterial color="#c9a45c"/></mesh>)}
    <B at={[-1.4,.02,1.8]} size={[2.8,.02,.9]} color="#e7b93c"/>
  </group>
}
// 4 Recepção e registro: o visitante é registrado no balcão e segue para a barreira.
function Reception(){
  const t=useT(),vis=useRef(),tick=useRef(),sheet=useRef()
  useFrame(()=>{
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
// 5 Barreira sanitária: roupa suja de um lado, banho na passagem, roupa limpa do outro.
function Barrier(){
  const t=useT(),vis=useRef(),body=useRef()
  useFrame(()=>{
    const c=(t.current%10)/10
    const x=c<.35?lerp(-3.1,-.3,ease(ph(c,0,.35))):c<.5?lerp(-.3,.9,ease(ph(c,.35,.5))):c<.72?.9:lerp(.9,3.1,ease(ph(c,.72,.95)))
    vis.current.position.x=x
    vis.current.visible=c<.96
    body.current.material.color.set(x<.2?'#8a8f8c':'#f4f1ea')
  })
  return <group>
    <Room w={7.4} d={4} floor="#e6cfc8"/>
    <B at={[1.85,-.09,0]} size={[3.7,.02,3.9]} color="#cfe3d6"/>
    <B at={[0,1.2,-1.4]} size={[.14,2.4,1.1]} color="#d9d3c4"/><B at={[0,1.9,.2]} size={[.14,1,2.1]} color="#d9d3c4"/>
    <B at={[-2.7,.3,-1.6]} size={[2,.1,.5]} color="#8a6a55"/>{[-3.3,-2.1].map(x=><B key={x} at={[x,.15,-1.6]} size={[.08,.3,.4]} color="#8a6a55"/>)}
    {[1.4,2.2,3].map(x=><B key={x} at={[x,1.1,-1.85]} size={[.7,2.2,.3]} color="#7d8c96"/>)}
    <B at={[.9,2.2,.5]} size={[.5,.05,.5]} color="#8d9996"/><B at={[.9,1.1,.5]} size={[.04,2.2,.04]} color="#8d9996"/>
    <Drops n={14} at={[.9,2.15,.5]} h={2.1} spread={.2} speed={.9}/>
    <group ref={vis} position={[-3.1,0,.5]}><Person body={body} color="#8a8f8c"/></group>
  </group>
}
// 6 Quarentena: animais ficam separados e o responsável os observa um a um.
function Quarantine(){
  const t=useT(),vet=useRef(),ring=useRef()
  const stops=[-2.4,-.8,.8,2.4,.8,-.8]
  useFrame(()=>{
    const c=t.current/2.2,i=Math.floor(c)%stops.length,f=c%1,j=(i+1)%stops.length
    vet.current.position.x=f<.55?lerp(stops[i],stops[j],ease(f/.55)):stops[j]
    ring.current.position.x=stops[j]
    ring.current.visible=f>.55
    ring.current.scale.setScalar(.7+.3*Math.sin(t.current*7))
  })
  return <group>
    <Room w={7.6} d={4.6} wall="#ece8df"/>
    <B at={[0,.01,.5]} size={[7.4,.01,.08]} color="#e7b93c"/>
    {[-2.4,-.8,.8,2.4].map((x,i)=><group key={x}>
      <B at={[x+.8,.45,-1.4]} size={[.08,.9,1.9]} color="#b7b3a3"/>
      <group position={[x,0,-1.4]} scale={.7}><Pig x={0} z={0} phase={i*1.9}/></group>
    </group>)}
    <B at={[-3.2,.45,-1.4]} size={[.08,.9,1.9]} color="#b7b3a3"/>
    <mesh ref={ring} position={[0,.05,-1.4]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.5,.6,32]}/><meshBasicMaterial color="#e7b93c" toneMapped={false}/></mesh>
    <group ref={vet} position={[-2.4,0,.1]}><Person/></group>
  </group>
}
// 9 Depósito: a ração desce dos silos e segue pela esteira até a distribuição.
function Storage(){
  const t=useT(),refs=useRef([])
  useFrame(()=>{refs.current.forEach((m,i)=>{
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
// 10 Reservatório: o nível da água sobe e desce e ela segue pelo cano até os bebedouros.
function Water(){
  const t=useT(),lvl=useRef(),refs=useRef([])
  useFrame(()=>{
    const k=.65+.2*Math.sin(t.current*.8)
    lvl.current.scale.y=k;lvl.current.position.y=.12+1.1*k
    refs.current.forEach((m,i)=>{const p=(t.current*.35+i/7)%1;m.position.set(-.5+p*4,.18,.9)})
  })
  return <group>
    <Room w={8.4} d={4.4}/>
    <mesh position={[-2.6,1.3,-.5]}><cylinderGeometry args={[1.15,1.15,2.5,28]}/><meshStandardMaterial color="#b8d6de" transparent opacity={.3}/></mesh>
    <mesh ref={lvl} position={[-2.6,1.3,-.5]}><cylinderGeometry args={[1.1,1.1,2.2,28]}/><meshStandardMaterial color="#4f9ac9"/></mesh>
    <B at={[-1.2,.15,.9]} size={[3.4,.14,.14]} color="#8d9996"/><B at={[1.8,.15,.9]} size={[2.6,.14,.14]} color="#8d9996"/>
    {[0,1,2,3,4,5,6].map(i=><mesh key={i} ref={m=>{refs.current[i]=m}}><sphereGeometry args={[.1,10,8]}/><meshBasicMaterial color="#7fb8e8" toneMapped={false}/></mesh>)}
    {[1.2,2.2,3.2].map(x=><group key={x}><B at={[x,.85,.9]} size={[.06,.7,.06]} color="#8d9996"/><Drops n={3} at={[x,.45,.9]} h={.35} spread={.02} speed={.6}/></group>)}
    <B at={[2.2,.1,1.5]} size={[2.6,.2,.5]} color="#8a8f8c"/>
  </group>
}
// 11 Resíduos: o saco é levado até a lixeira identificada e depois segue para a coleta.
function Waste(){
  const t=useT(),man=useRef(),bag=useRef(),lid=useRef()
  useFrame(()=>{
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
// 12 Registros: cada etapa cumprida é marcada na lista e anotada no computador.
function Records(){
  const t=useT(),checks=useRef([]),pen=useRef(),scr=useRef()
  useFrame(()=>{
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
    <group position={[-1.3,0,.2]}><Person/></group>
    <mesh ref={pen} position={[-1.2,.98,-.3]}><boxGeometry args={[.4,.02,.28]}/><meshStandardMaterial color="#fff"/></mesh>
    <B at={[-3.3,1,-1]} size={[.2,2,1.6]} color="#8a6a55"/>
  </group>
}

const scenes={0:Gate,1:Parking,2:Delivery,3:Reception,4:Barrier,5:Quarantine,8:Storage,9:Water,10:Waste,11:Records}
export const hasInterior=i=>i in scenes
export default function Interior({i}){
  const Scene=scenes[i]
  return <Canvas shadows dpr={[1,1.5]} camera={{position:[1.9,2.5,4.3],fov:54}} fallback={<p>A vista interna precisa de suporte a WebGL.</p>}>
    <color attach="background" args={['#cbdac7']}/><hemisphereLight args={['#fff4df','#a49c82',2]}/>
    <directionalLight position={[3,9,5]} intensity={2} castShadow/>
    <Scene/>
    <OrbitControls target={[0,.7,0]} enablePan={false} maxPolarAngle={Math.PI/2.05} minDistance={3} maxDistance={14}/>
  </Canvas>
}
