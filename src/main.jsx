import React,{useEffect,useRef,useState} from 'react'
import {createRoot} from 'react-dom/client'
import '@fontsource-variable/nunito'
import {House,Search,CircleHelp,Play,Plus,Minus,Move,X,Info,ArrowRight,CircleCheck,MapPin,Shield,Virus,GraduationCap,Layers,Route,Menu,ChevronLeft,ChevronRight,PiggyBank,ZoomIn,Map as MapIcon,Box as BoxIcon,Target,Pause,SkipForward,SkipBack} from 'lucide-react'
import Farm from './Farm'
import Plan2D from './Plan2D'
import {objective} from './content'
import {SourceLinks} from './Sources'
import BarnInterior from './BarnInterior'
import Interior from './Interiors'
import {sectors,zones,flows,flowLegend,isBarn,tourOrder} from './sectors'
import {sectorIcons} from './icons'
import {Disease,Practices,Materials,Simulation,Quiz,Refs} from './Learn'
import './style.css'
import banner from '../material-didatico/Banner Febre Aftosa- Suínos- Versão 2.pdf?url'

const plain=t=>t.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()
const quick=[
  [MapPin,'Explore a Granja','Navegue pela estrutura, clique nos pontos e aprenda na prática.','#granja',''],
  [Shield,'Biosseguridade','Entenda as principais medidas de proteção na suinocultura.','#boas-praticas',''],
  [Virus,'Febre aftosa','Saiba o que é, como ocorre, os sinais clínicos e como prevenir.','#febre-aftosa','rose'],
  [GraduationCap,'Materiais Didáticos','Banner, simulação e quiz para aprofundar seus conhecimentos.','#materiais',''],
]

function App(){
  const q=new URLSearchParams(location.search)
  const [selected,select]=useState(()=>{
    const sectorNumber=Number(q.get('setor'))
    return Number.isInteger(sectorNumber) && sectorNumber>=1 && sectorNumber<=sectors.length ? sectorNumber-1 : -1
  })
  const [reset,setReset]=useState(0)
  const [exploring,setExploring]=useState(false)
  const [near,setNear]=useState(q.has('galpao'))
  const [inset,setInset]=useState(true)
  const [view2d,setView2d]=useState(q.has('2d'))
  const [showZones,setShowZones]=useState(q.has('zonas'))
  const [activeFlows,setActiveFlows]=useState(q.has('fluxos')?flows.map(f=>f.id):(+q.get('etapa')>=1?tourOrder.slice(0,+q.get('etapa')):[]))
  const [zoomTick,setZoomTick]=useState(null)
  const [tourInfo,setTourInfo]=useState(false)
  const [tour,setTour]=useState(()=>{const n=+q.get('etapa');return n>=1&&n<=5?{step:n-1,run:1,playing:false}:null}) // {step, run, playing} da animação guiada
  const tourFlows=tourOrder.map(id=>flows.find(f=>f.id===id))
  function startTour(step=0,playing=true){
    setNear(false);setInset(false);setView2d(false)
    if(!tour){select(-1);setReset(v=>v+1)}
    setTour(t=>({step,run:(t?t.run:0)+1,playing}))
    setActiveFlows(tourOrder.slice(0,step+1))
  }
  function tourStop(){setTour(null);setActiveFlows([])}
  function tourDone(){
    setTour(t=>t&&t.playing?{...t,waiting:true}:t)
  }
  useEffect(()=>{
    if(!tour||!tour.waiting) return
    const id=setTimeout(()=>{ if(tour.step<tourOrder.length-1) startTour(tour.step+1,true); else setTour(t=>t&&{...t,waiting:false,playing:false,end:true}) },1400)
    return ()=>clearTimeout(id)
  },[tour])
  const [pop,setPop]=useState(null) // 'busca' | 'ajuda' | 'menu'
  const [term,setTerm]=useState('')
  const searchRef=useRef(null)
  const anchor=useRef(null)
  const popupRef=useRef(null)
  const linesRef=useRef(null)
  const showInset=inset&&!near&&!view2d&&selected>=0&&!tour
  function showOnMap(i){
    selectSector(i)
    document.getElementById('granja').scrollIntoView({block:'start'})
  }
  // Liga o galpão (posição projetada pela cena) aos cantos inferiores da janela de zoom.
  anchor.current=(x,y)=>{
    const svg=linesRef.current, box=popupRef.current
    if(!svg||!box) return
    if(x==null){svg.style.opacity=0;return}
    const l=box.offsetLeft, b=box.offsetTop+box.offsetHeight, r=l+box.offsetWidth
    const [a,c]=svg.querySelectorAll('line')
    a.setAttribute('x1',x);a.setAttribute('y1',y);a.setAttribute('x2',l+6);a.setAttribute('y2',b-6)
    c.setAttribute('x1',x);c.setAttribute('y1',y);c.setAttribute('x2',r-6);c.setAttribute('y2',b-6)
    svg.style.opacity=1
  }

  function selectSector(index){
    setNear(false)
    setInset(true)
    select(index<0?-1:(index+sectors.length)%sectors.length)
  }
  useEffect(()=>{
    const onKey=e=>{
      if(e.key==='Escape') setPop(null)
      if(e.target.closest('select,input,textarea')) return
      if(e.key==='ArrowRight') selectSector(selected+1)
      if(e.key==='ArrowLeft') selectSector(selected-1)
    }
    window.addEventListener('keydown',onKey)
    return ()=>window.removeEventListener('keydown',onKey)
  },[selected])
  useEffect(()=>{ if(pop==='busca') searchRef.current?.focus() },[pop])

  const toggleFlow=id=>setActiveFlows(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id])
  const flowsOn=activeFlows.length>0
  const sector=sectors[selected]
  const SectorIcon=sectorIcons[selected]
  const found=sectors.map((s,i)=>[s,i]).filter(([s])=>plain(s.name).includes(plain(term)))
  const nav=[['#inicio','Início',House],['#granja','Explore a Granja'],['#febre-aftosa','Febre Aftosa'],['#boas-praticas','Boas Práticas'],['#materiais','Materiais Didáticos']]

  return <>
    <a className="skip" href="#granja">Ir para a maquete</a>
    <header id="inicio">
      <a className="brand" href="#inicio" aria-label="Biosseguridade na Suinocultura, início"><PiggyBank size={44} strokeWidth={1.6}/><span>Biosseguridade na<br/>Suinocultura</span></a>
      <nav aria-label="Principal" className={pop==='menu'?'open':''}>
        {nav.map(([href,label,I],k)=><a key={href} href={href} className={k===0?'current':''} aria-current={k===0?'page':undefined} onClick={()=>setPop(null)}>{I && <I size={20}/>}{label}</a>)}
      </nav>
      <div className="tools">
        <button className="icon-btn" aria-label="Buscar setor" aria-expanded={pop==='busca'} onClick={()=>setPop(pop==='busca'?null:'busca')}><Search size={22}/></button>
        <button className="icon-btn" aria-label="Ajuda" aria-expanded={pop==='ajuda'} onClick={()=>setPop(pop==='ajuda'?null:'ajuda')}><CircleHelp size={22}/></button>
        <button className="icon-btn menu-btn" aria-label={pop==='menu'?'Fechar menu':'Abrir menu'} aria-expanded={pop==='menu'} onClick={()=>setPop(pop==='menu'?null:'menu')}>{pop==='menu'?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
      {pop==='busca' && <div className="popover" role="dialog" aria-label="Buscar setor">
        <label htmlFor="busca" className="sr-only">Nome do setor</label>
        <input id="busca" ref={searchRef} placeholder="Buscar setor da granja…" value={term} onChange={e=>setTerm(e.target.value)}/>
        <ul>{found.map(([s,i])=>{const I=sectorIcons[i];return <li key={s.name}><button onClick={()=>{selectSector(i);setPop(null);setTerm('');document.getElementById('granja').scrollIntoView({block:'start'})}}><I size={18}/><span>{s.code} · {s.name}</span></button></li>})}
          {!found.length && <li className="none">Nenhum setor com esse nome.</li>}</ul>
      </div>}
      {pop==='ajuda' && <div className="popover help" role="dialog" aria-label="Ajuda">
        <h3>Como explorar</h3>
        <ul>
          <li><b>Clique</b> num ponto da maquete para abrir a ficha do setor.</li>
          <li><b>Arraste</b> para girar, use a <b>rolagem</b> ou + e − para o zoom e o <b>botão direito</b> para mover.</li>
          <li><b>← →</b> no teclado trocam de setor.</li>
          <li><Layers size={16}/> mostra as zonas e <Route size={16}/> os fluxos de pessoas, animais, ração, veículos e resíduos.</li>
        </ul>
      </div>}
    </header>
    <main>
      <section className={'hero'+(selected>=0?' with-panel':'')+(view2d?' is-2d':'')+(tour?' touring':'')} id="granja" aria-label={view2d?'Planta 2D da granja':'Maquete interativa da granja'}>
        <div className="scene">{view2d
          ? <div className="plan2d"><Plan2D selected={selected} onSelect={selectSector} showZones={showZones} activeFlows={activeFlows}/></div>
          : <Farm key={reset} selected={selected} onSelect={selectSector} reset={reset} showZones={showZones} activeFlows={activeFlows} near={near} inset={showInset} onAnchor={anchor} zoomTick={zoomTick} panelOpen={selected>=0&&!tour} tour={tour&&{...tour,flow:tourFlows[tour.step]}} onTourDone={tourDone}/>}</div>
        {showInset && <>
          <svg ref={linesRef} className="callout-lines" aria-hidden="true" style={{opacity:0}}><line/><line/></svg>
          <div ref={popupRef} className="inset" role="dialog" aria-label={`${sector.short} (zoom)`}>
            <div className="inset-view">{isBarn(selected)?<BarnInterior key={selected} kind={selected===6?'maternidade':'creche'} closeUp={false} reset={0}/>:<Interior key={selected} i={selected}/>}</div>
            <div className="inset-head"><span className="inset-chip">{sector.short}: interior</span><button className="inset-x" aria-label="Fechar zoom" onClick={()=>setInset(false)}><X size={18}/></button></div>
          </div>
        </>}
        <div className={exploring?'hero-copy exploring':'hero-copy'}>
          <h1>Biosseguridade na<br/>Suinocultura</h1>
          <p>Conheça a estrutura de uma granja, aprenda medidas de biosseguridade e descubra como prevenir a febre aftosa.</p>
          <button className="cta" onClick={()=>{
            setExploring(true)
            selectSector(0)
          }}><Play size={20} fill="currentColor"/>Explorar a propriedade</button>
        </div>
        {tour && <div className="tour" role="region" aria-label="Animação guiada dos fluxos" aria-live="polite">
          <div className="tour-top"><span className="code">Etapa {tour.step+1} de {tourOrder.length}</span><strong>{tourFlows[tour.step].name}</strong>
            <button className="tour-x" aria-label="Fechar animação" onClick={tourStop}><X size={18}/></button></div>
          <div className="tour-ctl">
            <button aria-label="Etapa anterior" disabled={tour.step===0} onClick={()=>startTour(tour.step-1,false)}><SkipBack size={18}/></button>
            <button className="tour-play" onClick={()=>tour.playing?setTour(t=>({...t,playing:false,waiting:false})):(tour.end?startTour(0,true):startTour(tour.step,true))}>{tour.playing?<><Pause size={18}/>Pausar</>:<><Play size={18} fill="currentColor"/>{tour.end?'Rever':'Continuar'}</>}</button>
            <button aria-label="Próxima etapa" disabled={tour.step===tourOrder.length-1} onClick={()=>startTour(tour.step+1,false)}><SkipForward size={18}/></button>
            <button aria-label="Descrição da etapa" aria-expanded={tourInfo} className={tourInfo?'on':''} onClick={()=>setTourInfo(v=>!v)}><Info size={18}/></button>
          </div>
          {tourInfo && <><p>{tourFlows[tour.step].note}</p>
          <p className="src">Fonte: <SourceLinks text="Guia, seção 4"/>. O traçado no mapa é didático, feito pelo grupo.</p></>}
        </div>}
        <div className="map-tools" role="group" aria-label="Controles da maquete">
          {!view2d && <>
            <div className="stack">
              <button aria-label="Aproximar" onClick={()=>setZoomTick({f:1.25,t:Date.now()})}><Plus size={22}/></button>
              <button aria-label="Afastar" onClick={()=>setZoomTick({f:.8,t:Date.now()})}><Minus size={22}/></button>
            </div>
            <button className="solo" aria-label="Restaurar vista" title="Restaurar vista" onClick={()=>{setNear(false);setReset(v=>v+1)}}><Move size={22}/></button>
          </>}
          <button className={'solo'+(view2d?' on':'')} aria-pressed={view2d} aria-label={view2d?'Voltar à maquete 3D':'Ver planta 2D'} title={view2d?'Maquete 3D':'Planta 2D'} onClick={()=>{setNear(false);setView2d(v=>!v)}}>{view2d?<BoxIcon size={22}/>:<MapIcon size={22}/>}</button>
          <button className={'solo'+(showZones?' on':'')} aria-pressed={showZones} aria-label="Mostrar zonas" title="Zonas" onClick={()=>setShowZones(v=>!v)}><Layers size={22}/></button>
          <button className={'solo'+(tour?' on':'')} aria-pressed={!!tour} aria-label="Animação guiada dos fluxos" title="Animação passo a passo" onClick={()=>tour?tourStop():startTour(0,true)}><Play size={22}/></button>
          <button className={'solo'+(flowsOn?' on':'')} aria-pressed={flowsOn} aria-label="Mostrar fluxos" title="Fluxos" onClick={()=>setActiveFlows(flowsOn?[]:flows.map(f=>f.id))}><Route size={22}/></button>
        </div>
        {(showZones||flowsOn)&&!tour && <div className="legend" aria-label="Legenda">
          {showZones && Object.values(zones).map(z=><span key={z.name} className="lg"><i style={{background:z.color}}/>{z.name}</span>)}
          {flowsOn && <span className="lg note">{flowLegend}</span>}
          {flowsOn && flows.map(f=><button key={f.id} aria-pressed={activeFlows.includes(f.id)} className={'lg flow'+(activeFlows.includes(f.id)?' on':'')} title={f.note} onClick={()=>toggleFlow(f.id)}><i className={f.dash?'dash':''} style={{'--c':f.color}}/>{f.name}</button>)}
        </div>}
        {selected>=0 && <aside className="panel" aria-live="polite" aria-label={`Ficha: ${sector.name}`}>
          <div className="panel-head">
            <span className="badge"><SectorIcon size={30}/></span>
            <div><span className="code">Setor {sector.code} de {sectors.length}</span><h2>{sector.short}</h2>{sector.short!==sector.name && <span className="full">{sector.name}</span>}{sector.zone && <span className="tag"><i style={{background:zones[sector.zone].color}}/>{zones[sector.zone].name}</span>}</div>
            <button className="close" aria-label="Fechar ficha" onClick={()=>selectSector(-1)}><X size={22}/></button>
          </div>
          <p className="role">{sector.role}</p>
          <div className="measures">
            <h3>Principais medidas de biosseguridade:</h3>
            <ul>{sector.measures.map(m=><li key={m}><CircleCheck size={22} className="ok" aria-hidden="true"/>{m}</li>)}</ul>
          </div>
          <div className="risk">
            <Virus size={34} className="risk-ico" aria-hidden="true"/>
            <div><div className="risk-top"><h3>Risco sanitário relacionado</h3><a href="#febre-aftosa">Saiba mais <ArrowRight size={16}/></a></div><p>{sector.risk}</p></div>
          </div>
          <p className="src">Fonte: <SourceLinks text={sector.source}/>. Risco: texto de <SourceLinks text={sector.riskSource}/>; a associação ao setor é do grupo.</p>
          <div className="actions">
            <button className="step" aria-label="Setor anterior" onClick={()=>selectSector(selected-1)}><ChevronLeft size={22}/></button>
            {view2d
              ? <button className="big" onClick={()=>setView2d(false)}><BoxIcon size={22}/><span>Ver na maquete 3D</span></button>
              : <button className="big" onClick={()=>setNear(v=>!v)}>
                {near?<ArrowRight size={22} style={{transform:'scaleX(-1)'}}/>:<Info size={22}/>}
                <span>{near?'Vista geral':isBarn(selected)?'Ver por dentro':'Ver de perto'}</span>
              </button>}
            <button className="step" aria-label="Próximo setor" onClick={()=>selectSector(selected+1)}><ChevronRight size={22}/></button>
          </div>
        </aside>}
      </section>
      <section className="quick" aria-label="Atalhos">
        {quick.map(([I,t,p,href,tone])=><a key={t} href={href} className={'q-card '+tone}><I size={44} strokeWidth={1.6} aria-hidden="true"/><span><strong>{t}</strong><small>{p}</small></span><ArrowRight size={22} className="go" aria-hidden="true"/></a>)}
      </section>
      <section className="block objective" id="objetivo" aria-labelledby="t-obj">
        <div className="block-head"><h2 id="t-obj">Objetivo do trabalho</h2></div>
        <div className="obj-grid">
          <blockquote><p>{objective.txt}</p><cite>{objective.txtSource}</cite></blockquote>
          <blockquote><p>{objective.guia}</p><cite><SourceLinks text={objective.guiaSource}/></cite></blockquote>
        </div>
      </section>
      <section className="block tint" id="setores" aria-labelledby="t-set">
        <div className="block-head"><h2 id="t-set">Os 12 setores da granja</h2><p className="src"><SourceLinks text="Guia, seção 9"/>: “alternativa textual ao mapa”. Conteúdo: <SourceLinks text="Guia, seções 3 e 5"/>.</p></div>
        <ol className="sector-list">{sectors.map((s,i)=>{const I=sectorIcons[i];return <li key={s.name}><details>
          <summary><span className="n">{s.code}</span><I size={22} aria-hidden="true"/><span className="t"><strong>{s.short}</strong>{s.short!==s.name && <small>{s.name}</small>}</span>{s.zone && <span className="tag"><i style={{background:zones[s.zone].color}}/>{zones[s.zone].name}</span>}</summary>
          <div className="sl-body">
            <p><strong>Localização e função:</strong> {s.role}</p>
            <p><strong>Medidas:</strong></p><ul>{s.measures.map(m=><li key={m}>{m}</li>)}</ul>
            <p><strong>Risco sanitário relacionado:</strong> {s.risk}</p>
            <p className="src">Fonte: <SourceLinks text={s.source}/>. Risco: texto de <SourceLinks text={s.riskSource}/>; a associação ao setor é do grupo.</p>
            <button className="btn ghost" onClick={()=>showOnMap(i)}><Target size={18}/>Ver no mapa</button>
          </div>
        </details></li>})}</ol>
      </section>
      <Disease/>
      <Practices/>
      <Materials banner={banner}/>
      <Simulation/>
      <Quiz/>
    </main>
    <Refs/>
  </>
}
createRoot(document.getElementById('root')).render(<App/>)
