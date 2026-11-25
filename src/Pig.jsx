import React,{useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {BufferGeometry, CatmullRomCurve3, Color, Float32BufferAttribute, Matrix4, Quaternion, SphereGeometry, TubeGeometry, Vector3} from 'three'
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js'

// Cada parte articulada usa uma malha compartilhada pelos leitões.
function part(shape, position, scale, color, tilt=0){
  const geometry=shape.toNonIndexed()
  const rotation=new Quaternion().setFromAxisAngle(new Vector3(0,0,1),tilt)
  geometry.applyMatrix4(new Matrix4().compose(new Vector3(...position),rotation,new Vector3(...scale)))
  const tint=new Color(color)
  const colors=[]
  for(let i=0;i<geometry.attributes.position.count;i++) colors.push(tint.r,tint.g,tint.b)
  if(!geometry.hasAttribute('color')) geometry.setAttribute('color',new Float32BufferAttribute(colors,3))
  geometry.deleteAttribute('uv')
  return geometry
}
const sphere=new SphereGeometry(1,16,12)
const skin='#eeaf99'
const oval=(at,size,color)=>part(sphere,at,size,color)

// Seções transversais do quadril até o pescoço (ou da nuca até o focinho).
// Cada seção define profundidade, altura central, meia largura e meia altura.
function contour(sections){
  const axis=new CatmullRomCurve3(sections.map(([z,y])=>new Vector3(z,y,0)),false,'catmullrom')
  const radii=new CatmullRomCurve3(sections.map(([,,w,h])=>new Vector3(w,h,0)),false,'catmullrom')
  const points=[],colors=[],indices=[]
  const underside=new Color('#d99c8a'),back=new Color('#f2c4af')
  const rings=32,sides=28
  for(let j=0;j<=rings;j++){
    const center=axis.getPoint(j/rings),radius=radii.getPoint(j/rings)
    for(let i=0;i<sides;i++){
      const angle=i*2*Math.PI/sides, height=Math.sin(angle)
      points.push(radius.x*Math.cos(angle),center.y+radius.y*height,center.x)
      const tint=underside.clone().lerp(back,(height+1)*.5)
      colors.push(tint.r,tint.g,tint.b)
      if(j<rings){
        const a=j*sides+i,b=j*sides+(i+1)%sides
        indices.push(a,b,a+sides,b,b+sides,a+sides)
      }
    }
  }
  const geometry=new BufferGeometry()
  geometry.setIndex(indices)
  geometry.setAttribute('position',new Float32BufferAttribute(points,3))
  geometry.setAttribute('color',new Float32BufferAttribute(colors,3))
  geometry.computeVertexNormals()
  return part(geometry,[0,0,0],[1,1,1],skin)
}

function curvedLine(points,radius,color){
  const path=new CatmullRomCurve3(points.map(p=>new Vector3(...p)))
  return part(new TubeGeometry(path,16,radius,6,false),[0,0,0],[1,1,1],color)
}

function foldedEar(side){
  const outer=[[.12,.20,.03],[.18,.34,-.03],[.38,.42,.055],[.35,.29,.13],[.23,.19,.14]]
  const front=[.24,.275,.06], rear=[.245,.285,-.012]
  const vertices=[],colors=[]
  for(let i=0;i<outer.length;i++){
    const next=outer[(i+1)%outer.length]
    for(const [triangle,shades] of [
      [[outer[i],next,front],[skin,skin,'#bd756e']],
      [[next,outer[i],rear],[skin,skin,'#dfa18b']]
    ]){
      const order=side===1?[2,1,0]:[0,1,2]
      for(const k of order){
        const [x,y,z]=triangle[k],color=new Color(shades[k])
        vertices.push(side*x,y,z)
        colors.push(color.r,color.g,color.b)
      }
    }
  }
  const geo=new BufferGeometry()
  geo.setAttribute('position',new Float32BufferAttribute(vertices,3))
  geo.setAttribute('color',new Float32BufferAttribute(colors,3))
  geo.computeVertexNormals()
  return geo
}
const curl=Array.from({length:20},(_,i)=>{
  const t=i/19
  return new Vector3(.09*Math.sin(t*7.5),.59+.12*t+.075*Math.cos(t*7.5),-.63-.2*t)
})
const body=mergeGeometries([
  contour([[-.72,.59,.002,.002],[-.65,.56,.22,.24],[-.45,.56,.375,.345],[-.12,.535,.38,.345],[.19,.56,.34,.32],[.39,.59,.29,.30],[.55,.59,.24,.23],[.64,.6,.002,.002]]),
  part(new TubeGeometry(new CatmullRomCurve3(curl),20,.021,5,false),[0,0,0],[1,1,1],skin)
])
const face=[
  contour([[-.19,.025,.002,.002],[-.12,.045,.23,.23],[.035,.022,.285,.265],[.18,-.008,.25,.215],[.31,-.05,.174,.146],[.42,-.066,.131,.093],[.46,-.065,.002,.002]]),
  oval([0,-.06,.424],[.153,.104,.067],'#dd9185'),
  curvedLine([[-.126,-.134,.389],[-.085,-.155,.428],[0,-.159,.437],[.085,-.155,.428],[.126,-.134,.389]],.008,'#ad7065')
]
for(const side of [-1,1]){
  face.push(foldedEar(side))
  face.push(oval([side*.238,.059,.191],[.034,.033,.04],'#49342e'))
  face.push(oval([side*.258,.07,.211],[.009,.009,.009],'#fff3da'))
  face.push(oval([side*.066,-.056,.483],[.023,.031,.012],'#884f49'))
}
const headShape=mergeGeometries(face)
const legShape=mergeGeometries([
  oval([0,-.06,-.012],[.107,.173,.12],skin),
  oval([0,-.203,.006],[.071,.123,.076],'#e6a995'),
  ...[-1,1].map(side=>oval([side*.034,-.307,.026],[.037,.038,.074],'#936e61'))
])

export default function Pig({x,z,phase,inPlace=false}){
  const pig=useRef(),head=useRef(),legs=useRef([])
  const angle=useRef(phase),time=useRef(phase*2)
  useFrame((_,delta)=>{
    const dt=Math.min(delta,.06)
    time.current+=dt
    if(inPlace){
      pig.current.position.set(x,0,z)
      pig.current.rotation.y=0
      head.current.rotation.x=.06*Math.sin(time.current*4)
      head.current.rotation.y=0
      head.current.position.y=.59+.012*Math.cos(time.current*18)
      legs.current.forEach((leg,i)=>{
        leg.rotation.x=.38*Math.sin(time.current*9+(i===0||i===3?0:Math.PI))
      })
      return
    }
    // A velocidade cai até zero enquanto o animal para para farejar.
    const pace=Math.min(1,Math.max(0,1.4*Math.sin(time.current*.57)+.55))
    angle.current+=dt*.88*pace
    const a=angle.current
    pig.current.position.set(x+.28*Math.cos(a),0,z+.77*Math.sin(a))
    pig.current.rotation.y=Math.atan2(-.28*Math.sin(a),.77*Math.cos(a))
    head.current.rotation.x=(1-pace)*(.26+.1*Math.sin(time.current*3))
    head.current.rotation.y=.09*Math.sin(time.current*2.1)*(1-pace)
    head.current.position.y=.59+.013*pace*Math.cos(a*22)
    legs.current.forEach((leg,i)=>{
      leg.rotation.x=.38*Math.sin(a*11+(i===0||i===3?0:Math.PI))*pace
    })
  })
  return <group ref={pig} position={[x,0,z]} scale={.72}>
    <mesh geometry={body} castShadow><meshStandardMaterial vertexColors/></mesh>
    <mesh ref={head} position={[0,.59,.46]} geometry={headShape} castShadow><meshStandardMaterial vertexColors/></mesh>
    {[-1,1].flatMap((side,s)=>[-.31,.34].map((offset,j)=>
      <mesh key={s*2+j} ref={node=>{legs.current[s*2+j]=node}} geometry={legShape} position={[side*.22,.35,offset]} castShadow><meshStandardMaterial vertexColors/></mesh>
    ))}
  </group>
}
