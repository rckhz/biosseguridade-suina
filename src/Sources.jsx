import React,{Fragment} from 'react'

// Transforma a citação de fonte ("Guia, seções 3 e 5; Plano, seção 3") em links que abrem
// o documento do grupo direto na seção (cópias geradas por scripts/docs-to-html.mjs).
const DOCS = {
  Guia: 'documentos/guia.html',
  Plano: 'documentos/plano.html',
  Banner: 'documentos/banner.pdf',
  'txt.txt': 'documentos/ideia.html',
}
const ext = {target:'_blank', rel:'noreferrer'}

function Part({text}){
  const m = text.match(/^(Guia|Plano|Banner|txt\.txt)\b(.*)$/s)
  if(!m) return text
  const [, doc, rest] = m
  const href = DOCS[doc]
  // Banner e txt: um só arquivo, o link cobre a citação inteira.
  if(doc==='Banner' || doc==='txt.txt') return <a href={href} {...ext}>{text}</a>
  // Guia e Plano: cada número de seção abre a sua âncora.
  const pieces = rest.split(/(\d+)/)
  return <><a href={`${href}#secao-${rest.match(/\d+/)?.[0]||1}`} {...ext}>{doc}</a>{pieces.map((p,k)=>/^\d+$/.test(p)
    ? <a key={k} href={`${href}#secao-${p}`} {...ext}>{p}</a>
    : <Fragment key={k}>{p}</Fragment>)}</>
}

export function SourceLinks({text}){
  const parts = text.split(/(;\s*)/)
  return <>{parts.map((p,k)=>k%2 ? <Fragment key={k}>{p}</Fragment> : <Part key={k} text={p}/>)}</>
}

export const Src = ({children}) => <p className="src">Fonte: <SourceLinks text={children}/></p>
