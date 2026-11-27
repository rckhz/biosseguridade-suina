import React,{useEffect,useRef,useState} from 'react'
import {createRoot} from 'react-dom/client'
import '@fontsource-variable/nunito'
import '@fontsource-variable/nunito/wght-italic.css'
import {House,Search,CircleHelp,Play,Plus,Minus,Move,X,Info,ArrowRight,CircleCheck,MapPin,Shield,Virus,Siren,Layers,Route,Menu,ChevronLeft,ChevronRight,PiggyBank,Map as MapIcon,Box as BoxIcon,Target,Pause,SkipForward,SkipBack,PhoneCall,AlertTriangle,Maximize2,Minimize2,Eye} from 'lucide-react'
import Farm from './Farm'
import Plan2D from './Plan2D'
import {objective} from './content'
import {SourceLinks} from './Sources'
import Interior from './Interiors'
import {sectors,zones,flows,flowLegend,isBarn,barnKind,tourOrder,tourStages} from './sectors'
import {sectorIcons} from './icons'
import {Disease,Practices,Materials,Simulation,Quiz,Refs,EmergencyQuickModal,CompulsoryNotificationModal} from './Learn'
import './style.css'

const banner='documentos/banner.pdf'
const plain=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
const quick=[
  [MapPin,'Explore a Granja','Navegue pelas 14 instalações, zonas e fluxos sanitários.','#granja',''],
  [Virus,'Conheça a Febre Aftosa','Agente etiológico, vias de transmissão e sinais clínicos interativos.','#febre-aftosa',''],
  [Shield,'Biosseguridade','Medidas essenciais por setor, da portaria à unidade de recria.','#boas-praticas',''],
  [Siren,'Simule uma Emergência','Suspeita clínica, notificação compulsória e medidas oficiais.','#simulacao','rose'],
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
  const [insetBig,setInsetBig]=useState(false)
  const [view2d,setView2d]=useState(q.has('2d'))
  const [showZones,setShowZones]=useState(q.has('zonas'))
  const [activeFlows,setActiveFlows]=useState(q.has('fluxos')?flows.map(f=>f.id):(+q.get('etapa')>=1?tourOrder.slice(0,+q.get('etapa')):[]))
  const [zoomTick,setZoomTick]=useState(null)
  const [tourInfo,setTourInfo]=useState(false)
  const [tour,setTour]=useState(()=>{const n=+q.get('etapa');return n>=1&&n<=5?{step:n-1,run:1,playing:false}:null})
  const [emergOpen,setEmergOpen]=useState(false)
  const [notifyOpen,setNotifyOpen]=useState(false)

  const tourFlows=tourOrder.map(id=>flows.find(f=>f.id===id))
  function startTour(step=0,playing=true){
    setNear(false);setInset(true);setInsetBig(false);setView2d(false)
    if(!tour) select(-1)
    setTour(t=>({step,run:(t?t.run:0)+1,playing}))
    setActiveFlows(tourOrder.slice(0,step+1))
  }
  function tourStop(){setTour(null);setActiveFlows([]);setInsetBig(false)}
  function tourDone(){
    setTour(t=>t&&t.playing?{...t,waiting:true}:t)
  }
  useEffect(()=>{
    if(!tour||!tour.waiting) return
    const id=setTimeout(()=>{ if(tour.step<tourOrder.length-1) startTour(tour.step+1,true); else setTour(t=>t&&{...t,waiting:false,playing:false,end:true}) },1400)
    return ()=>clearTimeout(id)
  },[tour])
  const [pop,setPop]=useState(null)
  const [term,setTerm]=useState('')
  const searchRef=useRef(null)
  const anchor=useRef(null)
  const popupRef=useRef(null)
  const linesRef=useRef(null)
  const tourSector=tour?tourStages[tourOrder[tour.step]].sector:-1
  const insetSector=tour?tourSector:selected
  const insetSectorData=insetSector>=0?sectors[insetSector]:null
  const showInset=inset&&!view2d&&insetSector>=0&&(tour||!(near&&isBarn(selected)))
  function showOnMap(i){
    selectSector(i)
    document.getElementById('granja').scrollIntoView({block:'start'})
  }
  function goSimulation(){
    document.getElementById('simulacao').scrollIntoView({block:'start'})
  }
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
    if(index>=0 && tour) tourStop()
    setNear(false)
    setInset(true)
    select(index<0?-1:(index+sectors.length)%sectors.length)
  }
  useEffect(()=>{
    const onKey=e=>{
      if(e.key==='Escape'){setPop(null);setEmergOpen(false);setNotifyOpen(false);return}
      if(emergOpen||notifyOpen) return
      if(e.target.closest('select,input,textarea')) return
      if(e.key==='ArrowRight') selectSector(selected+1)
      if(e.key==='ArrowLeft') selectSector(selected-1)
    }
    window.addEventListener('keydown',onKey)
    return ()=>window.removeEventListener('keydown',onKey)
  },[selected,emergOpen,notifyOpen])
  useEffect(()=>{ if(pop==='busca') searchRef.current?.focus() },[pop])

  const toggleFlow=id=>setActiveFlows(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id])
  const flowsOn=activeFlows.length>0
  const sector=sectors[selected]
  const SectorIcon=sectorIcons[selected]
  const found=sectors.map((s,i)=>[s,i]).filter(([s])=>plain(s.name+' '+s.short).includes(plain(term)))
  const nav=[
    ['#inicio','Início',House],
    ['#granja','Explore a Granja'],
    ['#febre-aftosa','Conheça a Febre Aftosa'],
    ['#boas-praticas','Biosseguridade'],
    ['#simulacao','Simule uma Emergência'],
    ['#materiais','Materiais'],
  ]

  return <>
    <a className="skip" href="#granja">Ir para a maquete</a>
    <header id="inicio">
      <a className="brand" href="#inicio" aria-label="Biosseguridade na Suinocultura, início"><PiggyBank size={42} strokeWidth={1.6}/><span>Biosseguridade na<br/>Suinocultura</span></a>
      <nav aria-label="Principal" className={pop==='menu'?'open':''}>
        {nav.map(([href,label,I])=><a key={href} href={href} onClick={()=>setPop(null)}>{I && <I size={19}/>}{label}</a>)}
      </nav>
      <div className="tools">
        <button className="hdr-alert" onClick={()=>setNotifyOpen(true)} title="Comunicação imediata ao Serviço Veterinário Oficial"><PhoneCall size={17}/><span>Notificar SVO</span></button>
        <button className="icon-btn" aria-label="Buscar setor" aria-expanded={pop==='busca'} onClick={()=>setPop(pop==='busca'?null:'busca')}><Search size={22}/></button>
        <button className="icon-btn" aria-label="Ajuda" aria-expanded={pop==='ajuda'} onClick={()=>setPop(pop==='ajuda'?null:'ajuda')}><CircleHelp size={22}/></button>
        <button className="icon-btn menu-btn" aria-label={pop==='menu'?'Fechar menu':'Abrir menu'} aria-expanded={pop==='menu'} onClick={()=>setPop(pop==='menu'?null:'menu')}>{pop==='menu'?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
      {pop==='busca' && <div className="popover" role="dialog" aria-label="Buscar setor">
        <label htmlFor="busca" className="sr-only">Nome do setor</label>
        <input id="busca" ref={searchRef} placeholder="Buscar setor (ex.: recria, rodolúvio, GTA)…" value={term} onChange={e=>setTerm(e.target.value)}/>
        <ul>{found.map(([s,i])=>{const I=sectorIcons[i];return <li key={s.name}><button onClick={()=>{selectSector(i);setPop(null);setTerm('');document.getElementById('granja').scrollIntoView({block:'start'})}}><I size={18}/><span>{s.code} · {s.name}</span></button></li>})}
          {!found.length && <li className="none">Nenhum setor com esse nome.</li>}</ul>
      </div>}
      {pop==='ajuda' && <div className="popover help" role="dialog" aria-label="Ajuda">
        <h3>Como explorar</h3>
        <ul>
          <li><b>Clique</b> num ponto da maquete para abrir a ficha e a cena do setor.</li>
          <li><b>Arraste</b> para girar, use a <b>rolagem</b> ou + e − para o zoom e o <b>botão direito</b> para mover.</li>
          <li><b>← →</b> no teclado trocam de setor.</li>
          <li><Layers size={16}/> exibe as 5 zonas de biosseguridade e <Route size={16}/> os fluxos sanitários.</li>
        </ul>
      </div>}
    </header>
    <main>
      <section className={'hero'+(selected>=0?' with-panel':'')+(view2d?' is-2d':'')+(tour?' touring':'')} id="granja" aria-label={view2d?'Planta 2D da granja':'Maquete interativa da granja'}>
        <div className={exploring?'hero-copy exploring':'hero-copy'}>
          <h1>Biosseguridade na<br/>Suinocultura</h1>
          <p>Explore uma granja tecnificada em 3D, reconheça vias de transmissão e sinais clínicos da febre aftosa e pratique a conduta diante de uma suspeita sanitária.</p>
          <div className="hero-actions">
            <button className="cta" onClick={()=>{
              setExploring(true)
              selectSector(0)
            }}><Play size={20} fill="currentColor"/>Explorar a propriedade</button>
            <button className="cta secondary-cta" onClick={()=>setEmergOpen(true)}><AlertTriangle size={20}/>Suspeita de febre aftosa: o que fazer?</button>
          </div>
        </div>
        <div className="stage">
        <div className="scene">{view2d
          ? <div className="plan2d"><Plan2D selected={selected} onSelect={selectSector} showZones={showZones} activeFlows={activeFlows}/></div>
          : <Farm key={reset} selected={selected} onSelect={selectSector} reset={reset} showZones={showZones} activeFlows={activeFlows} near={near} inset={showInset&&!insetBig} onAnchor={anchor} zoomTick={zoomTick} panelOpen={selected>=0&&!tour} tour={tour&&{...tour,flow:tourFlows[tour.step]}} onTourDone={tourDone}/>}</div>
        {showInset && <>
          {!insetBig && <svg ref={linesRef} className="callout-lines" aria-hidden="true" style={{opacity:0}}><line/><line/></svg>}
          <div ref={popupRef} className={'inset'+(insetBig?' big-inset':'')} role="dialog" aria-label={`${insetSectorData.short} (por dentro)`}>
            <div className="inset-view"><Interior i={insetSector} kind={barnKind(insetSector)}/></div>
            <div className="inset-head">
              <span className="inset-chip">{insetSectorData.short}: por dentro</span>
              <div className="inset-btns">
                <button className="inset-x" aria-label={insetBig?'Reduzir janela interna':'Ampliar janela interna'} title={insetBig?'Reduzir':'Ampliar'} onClick={()=>setInsetBig(v=>!v)}>{insetBig?<Minimize2 size={16}/>:<Maximize2 size={16}/>}</button>
                <button className="inset-x" aria-label="Fechar zoom" title="Fechar" onClick={()=>{setInset(false);setInsetBig(false)}}><X size={18}/></button>
              </div>
            </div>
          </div>
        </>}
        <div className="map-tools" role="group" aria-label="Controles da maquete">
          {!view2d && <>
            <div className="stack">
              <button aria-label="Aproximar" onClick={()=>setZoomTick({f:1.25,t:Date.now()})}><Plus size={22}/></button>
              <button aria-label="Afastar" onClick={()=>setZoomTick({f:.8,t:Date.now()})}><Minus size={22}/></button>
            </div>
            <button className="solo" aria-label="Restaurar vista" title="Restaurar vista" onClick={()=>{setNear(false);setReset(v=>v+1)}}><Move size={22}/></button>
          </>}
          <button className={'solo'+(view2d?' on':'')} aria-pressed={view2d} aria-label={view2d?'Voltar à maquete 3D':'Ver planta 2D'} title={view2d?'Maquete 3D':'Planta 2D'} onClick={()=>{setNear(false);setView2d(v=>!v)}}>{view2d?<BoxIcon size={22}/>:<MapIcon size={22}/>}</button>
          <button className={'solo'+(showZones?' on':'')} aria-pressed={showZones} aria-label="Mostrar zonas" title="Zonas de biosseguridade" onClick={()=>setShowZones(v=>!v)}><Layers size={22}/></button>
          <button className={'solo'+(tour?' on':'')} aria-pressed={!!tour} aria-label="Animação guiada dos fluxos" title="Animação passo a passo" onClick={()=>tour?tourStop():startTour(0,true)}><Play size={22}/></button>
          <button className={'solo'+(flowsOn?' on':'')} aria-pressed={flowsOn} aria-label="Mostrar fluxos" title="Fluxos sanitários" onClick={()=>setActiveFlows(flowsOn?[]:flows.map(f=>f.id))}><Route size={22}/></button>
          <button className="solo emerg-tool" aria-label="Suspeita de febre aftosa: o que fazer?" title="Suspeita de febre aftosa: o que fazer?" onClick={()=>setEmergOpen(true)}><AlertTriangle size={22}/></button>
        </div>
        </div>
        {tour && <div className="tour" role="region" aria-label="Animação guiada dos fluxos" aria-live="polite">
          <div className="tour-top"><span className="code">Etapa {tour.step+1} de {tourOrder.length}</span><strong>{tourFlows[tour.step].name}</strong>
            <button className="tour-x" aria-label="Fechar animação" onClick={tourStop}><X size={18}/></button></div>
          <div className="tour-ctl">
            <button aria-label="Etapa anterior" disabled={tour.step===0} onClick={()=>startTour(tour.step-1,false)}><SkipBack size={18}/></button>
            <button className="tour-play" onClick={()=>tour.playing?setTour(t=>({...t,playing:false,waiting:false})):(tour.end?startTour(0,true):startTour(tour.step,true))}>{tour.playing?<><Pause size={18}/>Pausar</>:<><Play size={18} fill="currentColor"/>{tour.end?'Rever':'Continuar'}</>}</button>
            <button aria-label="Próxima etapa" disabled={tour.step===tourOrder.length-1} onClick={()=>startTour(tour.step+1,false)}><SkipForward size={18}/></button>
            <button aria-label={inset?'Ocultar cena interna':'Ver cena interna'} title={inset?'Ocultar cena interna':'Ver cena interna'} aria-pressed={inset} className={inset?'on':''} onClick={()=>setInset(v=>!v)}><Eye size={18}/></button>
            <button aria-label="Descrição da etapa" aria-expanded={tourInfo} className={tourInfo?'on':''} onClick={()=>setTourInfo(v=>!v)}><Info size={18}/></button>
          </div>
          {tourInfo && <><p>{tourFlows[tour.step].note}</p>
          <p className="src">Fonte: <SourceLinks text="Guia, seção 4"/>. O traçado no mapa é didático, feito pelo grupo.</p></>}
        </div>}
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
          {!inset && !view2d && !(near&&isBarn(selected)) && <button className="btn ghost full-w" onClick={()=>setInset(true)}><Eye size={18}/>Ver animação por dentro</button>}
          {selected===13 && <button className="btn danger full-w" onClick={()=>setNotifyOpen(true)}><PhoneCall size={18}/>Notificação compulsória ao SVO</button>}
          <p className="src">Fonte: <SourceLinks text={sector.source}/>. Risco: <SourceLinks text={sector.riskSource}/>.</p>
          <div className="actions">
            <button className="step" aria-label="Setor anterior" onClick={()=>selectSector(selected-1)}><ChevronLeft size={22}/></button>
            {view2d
              ? <button className="big" onClick={()=>setView2d(false)}><BoxIcon size={22}/><span>Ver na maquete 3D</span></button>
              : <button className="big" onClick={()=>{if(!isBarn(selected)&&!near) setInset(true); setNear(v=>!v)}}>
                {near?<ArrowRight size={22} style={{transform:'scaleX(-1)'}}/>:<Info size={22}/>}
                <span>{near?'Vista geral':isBarn(selected)?'Ver galpão em corte':'Ver de perto'}</span>
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
          <blockquote>
            <strong className="obj-title">{objective.proposalTitle}</strong>
            <p>{objective.proposal}</p>
          </blockquote>
          <blockquote>
            <strong className="obj-title">{objective.purposeTitle}</strong>
            <p>{objective.purpose}</p>
          </blockquote>
        </div>
      </section>
      <section className="block tint" id="setores" aria-labelledby="t-set">
        <div className="block-head"><h2 id="t-set">Estrutura da granja e zonas de biosseguridade</h2><p className="src"><SourceLinks text="Guia, seção 9"/>: alternativa textual completa ao mapa. Conteúdo baseado em <SourceLinks text="Guia, seções 3 e 5"/> e <SourceLinks text="Plano, seção 4"/>.</p></div>
        <ol className="sector-list">{sectors.map((s,i)=>{const I=sectorIcons[i];return <li key={s.name}><details>
          <summary><span className="n">{s.code}</span><I size={22} aria-hidden="true"/><span className="t"><strong>{s.short}</strong>{s.short!==s.name && <small>{s.name}</small>}</span>{s.zone && <span className="tag"><i style={{background:zones[s.zone].color}}/>{zones[s.zone].name}</span>}</summary>
          <div className="sl-body">
            <p><strong>Localização e função:</strong> {s.role}</p>
            <p><strong>Medidas:</strong></p><ul>{s.measures.map(m=><li key={m}>{m}</li>)}</ul>
            <p><strong>Risco sanitário relacionado:</strong> {s.risk}</p>
            <p className="src">Fonte: <SourceLinks text={s.source}/>. Risco: <SourceLinks text={s.riskSource}/>.</p>
            <button className="btn ghost" onClick={()=>showOnMap(i)}><Target size={18}/>Ver no mapa</button>
          </div>
        </details></li>})}</ol>
      </section>
      <Disease onShowSector={showOnMap} onOpenEmergency={()=>setEmergOpen(true)}/>
      <Practices onShowSector={showOnMap}/>
      <Simulation onOpenEmergency={()=>setEmergOpen(true)} onOpenNotify={()=>setNotifyOpen(true)}/>
      <Materials banner={banner}/>
      <Quiz/>
    </main>
    <Refs onOpenNotify={()=>setNotifyOpen(true)}/>
    <EmergencyQuickModal open={emergOpen} onClose={()=>setEmergOpen(false)} onOpenNotify={()=>setNotifyOpen(true)} onGoSimulation={goSimulation}/>
    <CompulsoryNotificationModal open={notifyOpen} onClose={()=>setNotifyOpen(false)}/>
  </>
}
createRoot(document.getElementById('root')).render(<App/>)
