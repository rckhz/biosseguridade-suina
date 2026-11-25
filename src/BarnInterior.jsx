import React,{useLayoutEffect,useRef} from 'react'
import Pig from './Pig'
import {Canvas,useThree} from '@react-three/fiber'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

function Beam({at, size, color, angle=0}){
  return <mesh position={at} rotation={[0,0,angle]} castShadow receiveShadow>
    <boxGeometry args={size}/><meshStandardMaterial color={color}/>
  </mesh>
}

function PenRow({side,kind}){
  const x=side*3.25
  return <group>
    <Beam at={[side*1.3,.29,0]} size={[.14,.58,16]} color="#b7b3a3"/>
    {[.72,.97].map(y=><Beam key={y} at={[side*1.3,y,0]} size={[.06,.055,16]} color="#77857c"/>)}
    {[-8,-4,0,4,8].map(z=><group key={z}>
      <Beam at={[x,.46,z]} size={[3.9,.92,.14]} color="#c4bca9"/>
      <Beam at={[side*1.3,.55,z]} size={[.11,1.1,.11]} color="#57675f"/>
    </group>)}
    {[-6,-2,2,6].map((z,i)=>kind==='maternidade'
      ? <group key={z}>
          <Beam at={[x-.55,.01,z]} size={[1.5,.03,2.6]} color="#d6cbb7"/>
          <Beam at={[x+1.05,.015,z]} size={[1.2,.03,1.7]} color="#e8b98a"/>
          {[-.55,.55].map(o=><Beam key={o} at={[x-.55+o,.35,z]} size={[.07,.7,2.6]} color="#57675f"/>)}
          {[-1.3,0,1.3].map(o=><Beam key={o} at={[x-.55,.62,z+o]} size={[1.2,.07,.07]} color="#57675f"/>)}
          <group position={[x-.55,0,z]} scale={1.15}><Pig x={0} z={0} phase={i*1.7+side}/></group>
          {[0,1,2].map(j=><group key={j} position={[x+.85+(j%2)*.35,0,z-.35+j*.35]} scale={.42}><Pig x={0} z={0} phase={i*2.3+j*1.9+side}/></group>)}
          <mesh position={[x+1.05,1.35,z]}><coneGeometry args={[.32,.28,14]}/><meshStandardMaterial color="#8a8f8c"/></mesh>
          <mesh position={[x+1.05,1.12,z]}><sphereGeometry args={[.13,12,10]}/><meshBasicMaterial color="#ffb35c" toneMapped={false}/></mesh>
          <Beam at={[x+1.05,1.75,z]} size={[.03,.8,.03]} color="#57675f"/>
        </group>
      : kind==='recria'
      ? <group key={z}>
          <Beam at={[x,.012,z]} size={[3.4,.025,2.4]} color="#d8d1c2"/>
          {[[-.8,-.5],[.75,-.45],[-.65,.65],[.8,.6]].map(([ox,oz],j)=><group key={j} position={[x+ox,0,z+oz]} scale={.64}><Pig x={0} z={0} phase={i*1.5+j*1.8+side}/></group>)}
          <Beam at={[side*1.68,.26,z]} size={[.34,.22,2.1]} color="#c9a45c"/>
          <Beam at={[side*1.68,.38,z]} size={[.26,.04,2.0]} color="#e5c97b"/>
          <mesh position={[x+.9,1.5,z]}><coneGeometry args={[.26,.22,12]}/><meshStandardMaterial color="#70857c"/></mesh>
        </group>
      : <group key={z}>
          <Pig x={x-.75} z={z-.2} phase={i*1.7+side}/>
          <Pig x={x+.75} z={z-.1} phase={i*2.3-side+2.1}/>
          <Pig x={x+.05} z={z+1.15} phase={i*.9+side}/>
          <Beam at={[side*1.65,.3,z]} size={[.35,.14,1.8]} color="#8b8f8c"/>
          <mesh position={[side*4.8,.65,z-1.45]}><cylinderGeometry args={[.43,.25,1.2,20]}/><meshStandardMaterial color="#b87551"/></mesh>
        </group>)}
  </group>
}

export function BarnScene({kind='recria'}){
  return <group>
    <Beam at={[0,-.15,0]} size={[11,.3,18]} color="#b0a79b"/>
    <Beam at={[0,-.006,0]} size={[2.4,.04,18]} color="#d3c4ad"/>
    <Beam at={[0,1.45,-8.7]} size={[11,2.9,.22]} color="#dbcdb8"/>
    {[-1,1].map(side=><group key={side}><PenRow side={side} kind={kind}/>
      <Beam at={[side*5.3,.65,0]} size={[.18,1.3,17.6]} color="#d6cbb7"/>
      <Beam at={[side*2.7,4.65,0]} size={[5.75,.14,18]} angle={-side*.26} color="#c6b59d"/>
      {[-8,-4,0,4,8].map(z=><group key={z}>
        <Beam at={[side*5.25,1.95,z]} size={[.2,3.9,.2]} color="#806449"/>
        <Beam at={[side*2.7,4.47,z]} size={[5.65,.18,.18]} angle={-side*.26} color="#865e40"/>
      </group>)}
    </group>)}
  </group>
}

function BarnCamera({closeUp,reset}){
  const {camera,gl}=useThree()
  useLayoutEffect(()=>{
    const orbit=new OrbitControls(camera,gl.domElement)
    orbit.enablePan=true
    orbit.screenSpacePanning=false
    orbit.maxPolarAngle=Math.PI/2
    orbit.minDistance=0.15
    orbit.maxDistance=80
    if(closeUp){
      orbit.target.set(2.95,.42,6)
      camera.position.set(1.66,1.46,7.77)
    }else{
      orbit.target.set(0,1,-2)
      camera.position.set(.7,3.65,10.6)
    }
    orbit.update()
    return ()=>orbit.dispose()
  },[closeUp,reset,camera,gl])
  return null
}

export default function BarnInterior({closeUp,reset,kind='recria'}){
  return <Canvas shadows dpr={[1,1.5]} camera={{position:[.7,3.65,10.6],fov:58}} fallback={<p>A vista interna precisa de suporte a WebGL.</p>}>
    <color attach="background" args={['#cbdac7']}/><hemisphereLight args={['#fff4df','#a49c82',2]}/>
    <directionalLight position={[3,9,5]} intensity={2} castShadow shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12}/>
    <BarnScene kind={kind}/>
    <BarnCamera closeUp={closeUp} reset={reset}/>
  </Canvas>
}
