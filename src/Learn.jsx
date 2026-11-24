import React,{useState} from 'react'
import {Siren,ArrowRight,ExternalLink,CircleCheck,CircleX,Globe} from 'lucide-react'
import {MESSAGE,disease,status,scenario,steps,quiz,top3,top3Source,refs,practices,conclusion,note,credits} from './content'

function Head({title,id,children}){
  return <div className="block-head"><h2 id={id}>{title}</h2>{children}</div>
}
import {Src} from './Sources'

export function Disease(){
  return <section className="block" id="febre-aftosa" aria-labelledby="t-febre">
    <Head title="Febre aftosa em suínos" id="t-febre"/>
    <div className="cards2">{disease.map(d=>{return <article key={d.title} className="card">
      <h3>{d.title}</h3>
      {d.text?<p>{d.text}</p>:<ul className="dots-list">{d.list.map(t=><li key={t}>{t}</li>)}</ul>}
      <Src>{d.source}</Src>
    </article>})}</div>
    <div className="status"><Globe size={26} aria-hidden="true"/><div>
      <p><strong>Status sanitário.</strong> {status.brasil}</p>
      <p>{status.mundo}</p>
      <p>{status.vacina}</p>
      <Src>{status.source}</Src>
    </div></div>
  </section>
}

export function Practices(){
  return <section className="block tint" id="boas-praticas" aria-labelledby="t-boas">
    <Head title="Boas práticas: medidas preventivas essenciais" id="t-boas"><Src>Guia, seção 6</Src></Head>
    <dl className="practice-list">{practices.map(([t,p])=><div key={t}><dt>{t}</dt><dd>{p}</dd></div>)}</dl>
  </section>
}

export function Materials({banner}){
  const items=[
    ['Banner acadêmico (PDF)','Síntese de uma página com três figuras sobre situação sanitária, manifestações clínicas e prevenção.',banner,true],
    ['Simulação de emergência','Cenário clínico com escolhas, feedback explicativo e notificação imediata.','#simulacao'],
    ['Quiz','Cinco questões, pontuação e resumo dos três cuidados mais importantes.','#quiz'],
    ['Referências e créditos','MAPA, OMSA e créditos do trabalho acadêmico e do grupo.','#referencias'],
  ]
  return <section className="block" id="materiais" aria-labelledby="t-mat">
    <Head title="Materiais didáticos" id="t-mat"/>
    <ul className="mat-list">{items.map(([t,p,href,ext])=><li key={t}><a href={href} {...(ext?{target:'_blank',rel:'noreferrer'}:{})}><strong>{t}{ext && <ExternalLink size={16} aria-label="abre em nova aba"/>}</strong><span>{p}</span></a></li>)}</ul>
  </section>
}

export function Simulation(){
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
    <Head title="Simulação: suspeita de febre aftosa" id="t-sim"><p className="lead">{scenario}</p><Src>Guia, seção 7</Src></Head>
    <div className="sim">
      {!done ? <>
        <ol className="dots" aria-label="Etapas">{steps.map((s,k)=><li key={s.title} className={k<i?'past':k===i?'now':''} aria-current={k===i?'step':undefined}>{k+1}</li>)}</ol>
        <h3>{step.title}</h3>
        <p className="q">{step.q}</p>
        <div className="opts">{step.options.map((o,k)=><button key={o} disabled={picked!==null} className={picked===null?'':k===step.answer?'good':k===picked?'bad':''} onClick={()=>setPicked(k)}>{o}</button>)}</div>
        <div aria-live="polite" className="feedback">{picked!==null && <><p className={right?'ok':'no'}>{right?<CircleCheck size={20}/>:<CircleX size={20}/>}<span>{step.ok}</span></p><button className="btn" onClick={next}>{i===steps.length-1?'Concluir simulação':'Próxima etapa'} <ArrowRight size={18}/></button></>}</div>
      </> : <div className="end"><h3>Simulação concluída</h3><p className="msg">{MESSAGE}</p><button className="btn ghost" onClick={()=>{setDone(false);setI(0);setPicked(null)}}>Refazer simulação</button></div>}
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

export function Refs(){
  return <footer className="foot" id="referencias">
    <p className="msg"><Siren size={22}/>{MESSAGE}</p>
    <p className="conclusion">{conclusion}</p>
    <div className="refs"><h3>Referências</h3>
      <ul>{refs.map(([t,u])=><li key={u}><a href={u} target="_blank" rel="noreferrer">{t} <ExternalLink size={14}/></a></li>)}</ul>
      <h3>Créditos</h3>
      <p className="credits"><strong>{credits.title}</strong><br/>Discentes: {credits.students}.<br/>Orientadores: {credits.advisors}.</p>
      <p className="note">{note}</p></div>
  </footer>
}
