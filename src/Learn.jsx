import React,{useState} from 'react'
import {Siren,ArrowRight,ExternalLink,CircleCheck,CircleX,Globe,ShieldAlert,Shield,PhoneCall,Target,AlertTriangle,Stethoscope,FileCheck2,Truck,Footprints,Box as Box3D,X} from 'lucide-react'
import {MESSAGE,emergencySteps,diagnosisItems,transmissionRoutes,clinicalSigns,disinfectionBarriers,status,scenario,steps,quiz,top3,top3Source,refs,practices,conclusion,note,credits} from './content'
import {Src} from './Sources'

function Head({title,id,children}){
  return <div className="block-head"><h2 id={id}>{title}</h2>{children}</div>
}

// Modal/painel educativo de Notificação Compulsória imediata ao Serviço Veterinário Oficial
export function CompulsoryNotificationModal({open,onClose}){
  const [unit,setUnit]=useState('Unidade de crescimento e terminação — Lote 04')
  const [signsPicked,setSignsPicked]=useState(['Claudicação intensa no lote','Vesículas no focinho e nos cascos'])
  const [sent,setSent]=useState(false)
  if(!open) return null
  const signList=[
    'Claudicação intensa no lote',
    'Vesículas no focinho e nos cascos',
    'Febre alta e queda brusca de consumo',
    'Mortalidade súbita em leitões',
  ]
  const toggle=s=>setSignsPicked(list=>list.includes(s)?list.filter(x=>x!==s):[...list,s])
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="t-notif" onClick={e=>{if(e.target===e.currentTarget) onClose()}}>
    <div className="modal-box">
      <div className="modal-head">
        <span className="badge alert-badge"><PhoneCall size={26}/></span>
        <div>
          <span className="code">Simulação educativa · Comunicação imediata</span>
          <h2 id="t-notif">Notificação compulsória ao Serviço Veterinário Oficial</h2>
        </div>
        <button className="close" aria-label="Fechar janela" onClick={onClose}><X size={22}/></button>
      </div>
      {!sent ? <>
        <p className="modal-lead">A febre aftosa é doença de <strong>notificação compulsória imediata</strong>. Qualquer suspeita de doença vesicular deve ser comunicada sem demora ao órgão estadual de defesa sanitária animal (ou via e-SISBRAVET).</p>
        <div className="notif-form">
          <label className="field">
            <span>Setor / lote com suspeita identificada</span>
            <select value={unit} onChange={e=>setUnit(e.target.value)}>
              <option>Unidade de maternidade — Sala 02</option>
              <option>Unidade de recria — Lote 03</option>
              <option>Unidade de crescimento e terminação — Lote 04</option>
              <option>Unidade de quarentena — Reposição</option>
            </select>
          </label>
          <fieldset className="field">
            <legend>Sinais clínicos observados na inspeção</legend>
            <div className="check-grid">
              {signList.map(s=><label key={s} className="chk"><input type="checkbox" checked={signsPicked.includes(s)} onChange={()=>toggle(s)}/><span>{s}</span></label>)}
            </div>
          </fieldset>
          <div className="notif-locks">
            <CircleCheck size={18}/><span>Bloqueio imediato de entrada/saída de animais, veículos e GTAs ativado na portaria.</span>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn danger" disabled={!signsPicked.length} onClick={()=>setSent(true)}><PhoneCall size={18}/>Enviar notificação simulada ao SVO</button>
          <a className="btn ghost" href="https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/sanidade-suidea/notificacao-de-doencas-relativas-a-suinocultura" target="_blank" rel="noreferrer">Canal oficial MAPA / e-SISBRAVET <ExternalLink size={16}/></a>
        </div>
      </> : <div className="notif-done" aria-live="polite">
        <div className="notif-protocol">
          <FileCheck2 size={28}/>
          <div>
            <strong>Comunicação simulada registrada!</strong>
            <p>Setor informado: <b>{unit}</b>. Sinais reportados: {signsPicked.join('; ')}.</p>
          </div>
        </div>
        <ul className="checks">
          <li><CircleCheck size={20}/>Propriedade mantida com trânsito suspenso (animais, pessoas, ração e resíduos).</li>
          <li><CircleCheck size={20}/>Fichas do lote, histórico de visitantes e GTAs separados no Escritório Sanitário.</li>
          <li><CircleCheck size={20}/>Aguardando chegada do Serviço Veterinário Oficial para investigação e colheita laboratorial.</li>
        </ul>
        <div className="modal-actions">
          <button className="btn" onClick={()=>{setSent(false);onClose()}}>Concluir</button>
          <button className="btn ghost" onClick={()=>setSent(false)}>Simular outro registro</button>
        </div>
      </div>}
    </div>
  </div>
}

// Guia rápido do botão "Suspeita de febre aftosa: o que fazer?"
export function EmergencyQuickModal({open,onClose,onOpenNotify,onGoSimulation}){
  if(!open) return null
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="t-emerg" onClick={e=>{if(e.target===e.currentTarget) onClose()}}>
    <div className="modal-box">
      <div className="modal-head">
        <span className="badge alert-badge"><AlertTriangle size={26}/></span>
        <div>
          <span className="code">Protocolo imediato de contingência</span>
          <h2 id="t-emerg">Suspeita de febre aftosa: o que fazer?</h2>
        </div>
        <button className="close" aria-label="Fechar protocolo" onClick={onClose}><X size={22}/></button>
      </div>
      <ol className="emerg-steps">
        {emergencySteps.map(([title,desc],idx)=><li key={title}>
          <span className="step-num">{idx+1}</span>
          <div><strong>{title}.</strong> <p>{desc}</p></div>
        </li>)}
      </ol>
      <p className="msg compact"><Siren size={20}/>{MESSAGE}</p>
      <div className="modal-actions">
        <button className="btn danger" onClick={()=>{onClose();onOpenNotify()}}><PhoneCall size={18}/>Notificação compulsória ao SVO</button>
        <button className="btn" onClick={()=>{onClose();onGoSimulation()}}>Praticar na simulação passo a passo <ArrowRight size={18}/></button>
      </div>
    </div>
  </div>
}

// Módulo interativo 1: Transmissão da febre aftosa (com barreira ligada à maquete)
function TransmissionInteractive({onShowSector}){
  const [idx,setIdx]=useState(0)
  const [protectedMode,setProtectedMode]=useState(true)
  const route=transmissionRoutes[idx]
  return <div className="interactive-box" aria-labelledby="t-transm">
    <div className="ib-top">
      <div>
        <span className="code">Explore fora do mapa · Vias de entrada</span>
        <h3 id="t-transm">Transmissão da febre aftosa: como o vírus entra e como barrar</h3>
      </div>
      <div className="mode-switch" role="group" aria-label="Modo de proteção">
        <button className={!protectedMode?'on danger-on':''} aria-pressed={!protectedMode} onClick={()=>setProtectedMode(false)}>Sem biosseguridade</button>
        <button className={protectedMode?'on ok-on':''} aria-pressed={protectedMode} onClick={()=>setProtectedMode(true)}>Com barreira ativa</button>
      </div>
    </div>
    <div className="route-tabs" role="tablist" aria-label="Vias de transmissão">
      {transmissionRoutes.map((r,k)=><button key={r.id} role="tab" aria-selected={idx===k} className={idx===k?'active':''} onClick={()=>setIdx(k)}>{r.label}</button>)}
    </div>
    <div className="route-stage">
      <svg viewBox="0 0 680 128" className="route-svg" aria-hidden="true">
        <rect x="8" y="18" width="184" height="92" rx="14" fill="#fbece6" stroke="#26232a"/>
        <text x="100" y="50" textAnchor="middle" className="r-kicker">ORIGEM EXTERNA</text>
        <text x="100" y="74" textAnchor="middle" className="r-title">{route.label}</text>

        <line x1="192" y1="64" x2="254" y2="64" stroke="#b2453a" strokeWidth="4" strokeDasharray="7 5"/>

        <rect x="254" y="14" width="176" height="100" rx="14" fill={protectedMode?'#e2f0e8':'#f6e4e0'} stroke={protectedMode?'#2f7d62':'#b2453a'} strokeWidth="2"/>
        <text x="342" y="46" textAnchor="middle" className="r-kicker">{protectedMode?'BARREIRA SANITÁRIA':'FALHA DE CONTROLE'}</text>
        <text x="342" y="70" textAnchor="middle" className="r-title">{protectedMode?'Vírus bloqueado':'Passagem livre'}</text>
        <text x="342" y="92" textAnchor="middle" className="r-sub">{protectedMode?route.sectorLabel:'Sem barreira efetiva'}</text>

        <line x1="430" y1="64" x2="492" y2="64" stroke={protectedMode?'#2f7d62':'#b2453a'} strokeWidth="4" strokeDasharray={protectedMode?'2 8':'none'} opacity={protectedMode?.45:1}/>

        <rect x="492" y="18" width="180" height="92" rx="14" fill={protectedMode?'#f7f5f7':'#fbece6'} stroke="#26232a"/>
        <text x="582" y="50" textAnchor="middle" className="r-kicker">ZONA INTERNA</text>
        <text x="582" y="74" textAnchor="middle" className="r-title">{protectedMode?'Rebanho protegido':'Risco de foco'}</text>
      </svg>
      <div className="route-details">
        <div className="rd-item">
          <strong>Fonte / veículo viral:</strong>
          <p>{route.origin}.</p>
        </div>
        {!protectedMode ? <div className="rd-item bad-box">
          <strong><CircleX size={18}/> O que ocorre sem controle ({route.entry.toLowerCase()}):</strong>
          <p>{route.impact}</p>
        </div> : <div className="rd-item good-box">
          <strong><Shield size={18}/> Medida que bloqueia essa via:</strong>
          <p>{route.barrier}</p>
        </div>}
        <div className="rd-foot">
          <Src>Plano, seções 3 e 4; Guia, seções 3 e 5</Src>
          <button className="btn ghost sm" onClick={()=>onShowSector(route.sectorIndex)}><Target size={16}/>Ver {route.sectorLabel} no mapa</button>
        </div>
      </div>
    </div>
  </div>
}

// Módulo interativo 2: Inspeção visual de sinais clínicos no suíno
function ClinicalSignsInteractive({onOpenEmergency}){
  const [active,setActive]=useState(0)
  const current=clinicalSigns[active]
  return <div className="interactive-box" aria-labelledby="t-sinais">
    <div className="ib-top">
      <div>
        <span className="code">Inspeção clínica interativa</span>
        <h3 id="t-sinais">Sinais clínicos em suínos: clique nos pontos de atenção</h3>
      </div>
      <button className="btn ghost sm" onClick={onOpenEmergency}><Stethoscope size={16}/>Suspeita: o que fazer?</button>
    </div>
    <div className="pig-inspector">
      <div className="pig-diagram">
        <svg viewBox="0 0 420 250" className="pig-svg" role="img" aria-label="Ilustração esquemática de suíno com pontos anatômicos dos sinais clínicos">
          {/* Sombra no chão */}
          <ellipse cx="212" cy="222" rx="135" ry="14" fill="#dfe4da"/>
          {/* Orelha de trás */}
          <path d="M292 72 C308 46, 334 52, 326 78 Z" fill="#dfa18b" stroke="#26232a" strokeWidth="2.2"/>
          {/* Membros posteriores e anteriores de trás */}
          <rect x="118" y="148" width="24" height="62" rx="10" fill="#d99c8a" stroke="#26232a" strokeWidth="2.2"/>
          <path d="M116 205 H144 L140 218 H128 L125 211 L121 218 H114 Z" fill="#7b5c52" stroke="#26232a" strokeWidth="2"/>
          <rect x="256" y="148" width="24" height="62" rx="10" fill="#d99c8a" stroke="#26232a" strokeWidth="2.2"/>
          <path d="M254 205 H282 L278 218 H266 L263 211 L259 218 H252 Z" fill="#7b5c52" stroke="#26232a" strokeWidth="2"/>
          {/* Cauda enrolada */}
          <path d="M84 96 C58 84, 56 60, 74 62 C86 64, 80 82, 66 78" fill="none" stroke="#d99c8a" strokeWidth="6" strokeLinecap="round"/>
          <path d="M84 96 C58 84, 56 60, 74 62 C86 64, 80 82, 66 78" fill="none" stroke="#26232a" strokeWidth="2" strokeLinecap="round"/>
          {/* Corpo e cabeça */}
          <path d="M82 114 C82 66, 146 52, 218 56 C268 58, 298 68, 324 84 C344 96, 358 100, 366 104 C374 108, 374 128, 364 132 C346 138, 328 144, 304 148 C274 164, 152 168, 108 152 C90 144, 82 130, 82 114 Z" fill="#f2c4af" stroke="#26232a" strokeWidth="2.6"/>
          {/* Espelho rostral (focinho) */}
          <ellipse cx="367" cy="117" rx="10" ry="15" fill="#e08b7e" stroke="#26232a" strokeWidth="2.2"/>
          <circle cx="365" cy="112" r="2.3" fill="#5e3731"/>
          <circle cx="369" cy="121" r="2.3" fill="#5e3731"/>
          {/* Olho e orelha da frente */}
          <circle cx="318" cy="94" r="4.2" fill="#26232a"/>
          <circle cx="319.5" cy="92.5" r="1.3" fill="#fff"/>
          <path d="M276 76 C290 48, 320 56, 308 86 C300 88, 284 84, 276 76 Z" fill="#eeaf99" stroke="#26232a" strokeWidth="2.2"/>
          {/* Membros da frente (com cascos biungulados destacados) */}
          <rect x="138" y="146" width="26" height="66" rx="11" fill="#eeaf99" stroke="#26232a" strokeWidth="2.4"/>
          <path d="M136 207 H166 L162 221 H150 L147 213 L143 221 H134 Z" fill="#8b665b" stroke="#26232a" strokeWidth="2.2"/>
          <rect x="276" y="146" width="26" height="66" rx="11" fill="#eeaf99" stroke="#26232a" strokeWidth="2.4"/>
          <path d="M274 207 H304 L300 221 H288 L285 213 L281 221 H272 Z" fill="#8b665b" stroke="#26232a" strokeWidth="2.2"/>

          {/* Hotspots clicáveis */}
          {clinicalSigns.map((s,k)=>{
            const cx=s.x*4.2, cy=s.y*2.5, on=active===k
            return <g key={s.id} className={'pig-spot'+(on?' on':'')} role="button" tabIndex={0} aria-label={s.title} aria-pressed={on}
              onClick={()=>setActive(k)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setActive(k)}}}>
              {on && <circle cx={cx} cy={cy} r="20" fill="#a3546a2e" stroke="#a3546a" strokeWidth="2"/>}
              <circle cx={cx} cy={cy} r="12" fill={on?'#86404f':'#b2453a'} stroke="#fff" strokeWidth="2.5"/>
              <text x={cx} y={cy+4} textAnchor="middle" className="spot-num">{k+1}</text>
            </g>
          })}
        </svg>
      </div>
      <div className="pig-panel" aria-live="polite">
        <div className="sign-chips" role="tablist" aria-label="Regiões e sinais clínicos">
          {clinicalSigns.map((s,k)=><button key={s.id} role="tab" aria-selected={active===k} className={active===k?'active':''} onClick={()=>setActive(k)}><span>{k+1}</span>{s.label}</button>)}
        </div>
        <div className="sign-card">
          <h4>{current.title}</h4>
          <p>{current.detail}</p>
          <p className="sign-watch"><strong>Vigilância no galpão:</strong> {current.inspect}</p>
          <Src>Plano, seção 3; Guia, seções 2 e 6</Src>
        </div>
      </div>
    </div>
  </div>
}

export function Disease({onShowSector,onOpenEmergency}){
  return <section className="block" id="febre-aftosa" aria-labelledby="t-febre">
    <Head title="Conheça a febre aftosa em suínos" id="t-febre"/>
    <div className="cards2">
      <article className="card">
        <h3>O que é e agente etiológico</h3>
        <p>Doença viral aguda, altamente contagiosa e de notificação compulsória, causada por um vírus do gênero <em>Aphthovirus</em>, pertencente à família Picornaviridae. Acomete animais biungulados (casco fendido), incluindo os suínos, nos quais possui grande importância sanitária pela elevada eliminação viral em aerossóis e pelos impactos produtivos e comerciais.</p>
        <Src>Banner, Introdução; Plano, seção 1</Src>
      </article>
      <article className="card">
        <h3>Diagnóstico e controle</h3>
        <ul className="dots-list diag-list">
          {diagnosisItems.map(([label,desc])=><li key={label}><strong>{label}</strong> {desc}</li>)}
        </ul>
        <Src>Banner, Diagnóstico e controle; Plano, seção 3</Src>
      </article>
    </div>

    <div className="interactive-stack">
      <TransmissionInteractive onShowSector={onShowSector}/>
      <ClinicalSignsInteractive onOpenEmergency={onOpenEmergency}/>
    </div>

    <div className="status"><Globe size={26} aria-hidden="true"/><div>
      <p><strong>Atualização epidemiológica (maio de 2025).</strong> {status.brasil}</p>
      <p>{status.mundo}</p>
      <p>{status.vacina}</p>
      <Src>{status.source}</Src>
    </div></div>
  </section>
}

export function Practices({onShowSector}){
  return <section className="block tint" id="boas-praticas" aria-labelledby="t-boas">
    <Head title="Boas práticas: medidas preventivas essenciais" id="t-boas"><Src>Guia, seção 6; Plano, seção 4</Src></Head>
    <div className="disinf-grid" aria-label="Rodolúvio e pedilúvio">
      {disinfectionBarriers.map(b=>{
        const Icon=b.id==='rodoluvio'?Truck:Footprints
        return <article key={b.id} className="disinf-card">
          <div className="disinf-head">
            <span className="badge"><Icon size={26}/></span>
            <div>
              <span className="code">{b.subtitle}</span>
              <h3>{b.title}</h3>
            </div>
          </div>
          <p className="disinf-what">{b.what}</p>
          <ul className="checks compact-checks">
            {b.rules.map(r=><li key={r}><CircleCheck size={19}/><span>{r}</span></li>)}
          </ul>
          <div className="disinf-foot">
            <Src>Guia, seções 3, 5 e 6; Plano, seção 4</Src>
            <button className="btn sm" onClick={()=>onShowSector(b.sectorIndex)}><Box3D size={16}/>{b.btnLabel}</button>
          </div>
        </article>
      })}
    </div>
    <dl className="practice-list">{practices.map(([t,p])=><div key={t}><dt>{t}</dt><dd>{p}</dd></div>)}</dl>
  </section>
}

export function Materials({banner}){
  const items=[
    ['Banner acadêmico (PDF)','Síntese de uma página com três figuras sobre situação sanitária, manifestações clínicas e prevenção.',banner,true],
    ['Simulação de emergência','Cenário clínico com escolhas, interdição, investigação oficial e notificação compulsória.','#simulacao'],
    ['Quiz de biosseguridade','Cinco questões, pontuação e revisão dos três cuidados mais importantes.','#quiz'],
    ['Referências e créditos','MAPA, OMSA e créditos do trabalho acadêmico e da equipe.','#referencias'],
  ]
  return <section className="block" id="materiais" aria-labelledby="t-mat">
    <Head title="Materiais didáticos" id="t-mat"/>
    <ul className="mat-list">{items.map(([t,p,href,ext])=><li key={t}><a href={href} {...(ext?{target:'_blank',rel:'noreferrer'}:{})}><strong>{t}{ext && <ExternalLink size={16} aria-label="abre em nova aba"/>}</strong><span>{p}</span></a></li>)}</ul>
  </section>
}

export function Simulation({onOpenEmergency,onOpenNotify}){
  const [i,setI]=useState(0)
  const [picked,setPicked]=useState(null)
  const [done,setDone]=useState(false)
  const step=steps[i]
  const right=picked!==null && picked===step.answer
  function next(){
    setPicked(null)
    if(i===steps.length-1) setDone(true); else setI(i+1)
  }
  return <section className="block tint" id="simulacao" aria-labelledby="t-sim">
    <Head title="Simule uma emergência sanitária" id="t-sim">
      <p className="lead">{scenario}</p>
      <div className="sim-shortcuts">
        <button className="btn danger" onClick={onOpenNotify}><PhoneCall size={18}/>Notificação compulsória ao SVO</button>
        <button className="btn ghost" onClick={onOpenEmergency}><ShieldAlert size={18}/>Suspeita de febre aftosa: o que fazer?</button>
      </div>
      <Src>Guia, seção 7; Plano, seção 5</Src>
    </Head>
    <div className="sim">
      {!done ? <>
        <ol className="dots" aria-label="Etapas">{steps.map((s,k)=><li key={s.title} className={k<i?'past':k===i?'now':''} aria-current={k===i?'step':undefined}>{k+1}</li>)}</ol>
        <h3>{step.title}</h3>
        <p className="q">{step.q}</p>
        <div className="opts">{step.options.map((o,k)=><button key={o} disabled={picked!==null} className={picked===null?'':k===step.answer?'good':k===picked?'bad':''} onClick={()=>setPicked(k)}>{o}</button>)}</div>
        <div aria-live="polite" className="feedback">{picked!==null && <><p className={right?'ok':'no'}>{right?<CircleCheck size={20}/>:<CircleX size={20}/>}<span>{step.ok}</span></p><button className="btn" onClick={next}>{i===steps.length-1?'Concluir simulação':'Próxima etapa'} <ArrowRight size={18}/></button></>}</div>
      </> : <div className="end">
        <h3>Simulação concluída</h3>
        <p className="msg">{MESSAGE}</p>
        <div className="modal-actions">
          <button className="btn danger" onClick={onOpenNotify}><PhoneCall size={18}/>Abrir notificação compulsória</button>
          <button className="btn ghost" onClick={()=>{setDone(false);setI(0);setPicked(null)}}>Refazer simulação</button>
        </div>
      </div>}
    </div>
  </section>
}

export function Quiz(){
  const [answers,setAnswers]=useState([])
  const n=answers.length
  const finished=n===quiz.length
  const score=answers.filter((a,k)=>a===quiz[k].answer).length
  const q=quiz[n]
  return <section className="block" id="quiz" aria-labelledby="t-quiz">
    <Head title="Quiz de biosseguridade" id="t-quiz"/>
    <div className="sim">
      {!finished ? <>
        <p className="count">Questão {n+1} de {quiz.length}</p>
        <p className="q">{q.q}</p>
        <div className="opts">{q.options.map((o,k)=><button key={o} onClick={()=>setAnswers([...answers,k])}>{o}</button>)}</div>
        <Src>{q.source}</Src>
      </> : <div className="end" aria-live="polite">
        <h3>Você acertou {score} de {quiz.length}</h3>
        <ul className="review">{quiz.map((x,k)=><li key={x.q} className={answers[k]===x.answer?'ok':'no'}>{answers[k]===x.answer?<CircleCheck size={18}/>:<CircleX size={18}/>}<span>{x.q} <strong>{x.options[x.answer]}</strong></span></li>)}</ul>
        <p>Os três cuidados mais importantes:</p>
        <ul className="checks">{top3.map(t=><li key={t}><CircleCheck size={20}/>{t}</li>)}</ul>
        <Src>{top3Source}</Src>
        <button className="btn ghost" onClick={()=>setAnswers([])}>Refazer o quiz</button>
      </div>}
    </div>
  </section>
}

export function Refs({onOpenNotify}){
  return <footer className="foot" id="referencias">
    <div className="foot-alert">
      <p className="msg"><Siren size={22}/>{MESSAGE}</p>
      <button className="btn danger" onClick={onOpenNotify}><PhoneCall size={18}/>Notificação compulsória ao SVO</button>
    </div>
    <p className="conclusion">{conclusion}</p>
    <div className="refs"><h3>Referências</h3>
      <ul>{refs.map(([t,u])=><li key={u}><a href={u} target="_blank" rel="noreferrer">{t} <ExternalLink size={14}/></a></li>)}</ul>
      <h3>Créditos</h3>
      <p className="credits"><strong>{credits.title}</strong><br/>Discentes: {credits.students}.<br/>Orientadores: {credits.advisors}.</p>
      <p className="note">{note}</p></div>
  </footer>
}
