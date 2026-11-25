import React from 'react'
import {sectors,zones,flows} from './sectors'

// Planta 2D vista de cima (Guia, seção 9: protótipo mínimo e modo alternativo caso o 3D fique lento).
// Usa as mesmas coordenadas [x, z] da maquete 3D.
const FRONT=7.8, ROAD=13.63
const lines=t=>{
  if(t.length<=12) return [t]
  const words=t.split(' '), half=t.length/2
  let best=1, gap=Infinity
  for(let k=1;k<words.length;k++){const d=Math.abs(words.slice(0,k).join(' ').length-half); if(d<gap){gap=d;best=k}}
  return [words.slice(0,best).join(' '),words.slice(best).join(' ')]
}

export default function Plan2D({selected,onSelect,showZones,activeFlows}){
  const shown=flows.filter(f=>activeFlows.includes(f.id))
  const key=(e,i)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onSelect(i) } }
  return <svg className="plan2d-svg" viewBox="-13 -9.4 26 25.6" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Planta 2D da granja">
    <defs>{shown.map(f=><marker key={f.id} id={'seta-'+f.id} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={f.color}/></marker>)}</defs>
    <rect x="-13" y="-9.4" width="26" height="23.4" fill="#a7b38a"/>
    <rect x="-13" y={ROAD-2.3} width="26" height="4.6" fill="#5d625c"/>
    <line x1="-13" y1={ROAD} x2="13" y2={ROAD} stroke="#f1ead0" strokeWidth=".06" strokeDasharray="1 2"/>
    <rect x="-5.4" y="-8.6" width="1.6" height="19.8" fill="#d9cdb3"/>
    <rect x="-10" y="1.45" width="20" height="1.15" fill="#d9cdb3"/>
    <g stroke="#f4f1e8" strokeWidth=".16" fill="none" strokeLinecap="round">
      <polyline points={`5.65,${FRONT} 10.5,${FRONT} 10.5,-8.2 -10.5,-8.2 -10.5,${FRONT}`}/>
      <line x1="-10.5" y1={FRONT} x2="-6.2" y2={FRONT}/>
      <line x1="-3.0" y1={FRONT} x2="0.3" y2={FRONT}/>
      <line x1="2.7" y1={FRONT} x2="3.65" y2={FRONT}/>
    </g>
    <g pointerEvents="none">
      <rect x={4.65-.93} y={9.6-1.1} width={1.86} height={2.2} rx=".1" fill="#e7b93c" stroke="#8d8a7e" strokeWidth=".05"/>
      <rect x={4.65-.78} y={9.6-.98} width={1.56} height={1.96} rx=".06" fill="#48a9cc"/>
      {[5.48,2.85].map(pz=><g key={pz}>
        <rect x={-.48} y={pz-.34} width={.96} height={.68} rx=".06" fill="#e7b93c" stroke="#8d8a7e" strokeWidth=".04"/>
        <rect x={-.38} y={pz-.24} width={.76} height={.48} rx=".04" fill="#48a9cc"/>
      </g>)}
    </g>
    <text x="-4.6" y={FRONT+.8} className="plan-note" textAnchor="middle">portão</text>
    {sectors.map((s,i)=>{
      const on=selected===i
      const fill=showZones?(s.zone?zones[s.zone].color:'#d9d6cc'):'#ece8df'
      return <g key={s.name} className={'plan-sector'+(on?' on':'')} role="button" tabIndex={0} aria-label={s.name} aria-pressed={on} onClick={()=>onSelect(i)} onKeyDown={e=>key(e,i)}>
        <rect x={s.x-s.w/2} y={s.z-s.d/2} width={s.w} height={s.d} rx=".12" fill={fill} stroke={on?'#a3546a':'#8d8a7e'} strokeWidth={on?.18:.05}/>
        <circle cx={s.x} cy={s.z} r=".4" fill={on?'#86404f':'#a3546a'} stroke="white" strokeWidth=".08"/>
        <text x={s.x} y={s.z+.16} className="plan-num" textAnchor="middle">{i+1}</text>
        <text x={s.x} y={s.z+s.d/2+.48} className="plan-label" textAnchor="middle">{lines(s.short).map((l,k)=><tspan key={k} x={s.x} dy={k?.5:0}>{l}</tspan>)}</text>
      </g>
    })}
    {shown.map(f=>f.paths.map((pts,k)=><polyline key={f.id+k} points={pts.map(p=>p.join(',')).join(' ')} fill="none" stroke={f.color} strokeWidth=".2" strokeDasharray={f.dash?'.42 .28':undefined} markerEnd={`url(#seta-${f.id})`} strokeLinejoin="round"/>))}
  </svg>
}
