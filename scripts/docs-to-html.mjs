// Gera em public/documentos/ uma cópia navegável de cada documento do grupo, com âncora por seção
// (#secao-3), para que as fontes citadas no site abram direto no trecho consultado.
// Os .docx não abrem no navegador; viram HTML. O banner (PDF) e os originais são copiados como estão.
import mammoth from 'mammoth'
import {mkdir, readFile, writeFile, copyFile} from 'node:fs/promises'

const SRC = 'material-didatico'
const OUT = 'public/documentos'
await mkdir(OUT, {recursive: true})

const files = {
  guia: 'Guia_Granja_Suinicola_Biosseguridade_Febre_Aftosa.docx',
  plano: 'Plano de Biosseguridade Contra Doenças Emergentes- Febre Aftosa.docx',
  banner: 'Banner Febre Aftosa- Suínos- Versão 2.pdf',
}

const page = (title, original, body) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
:root{color:#18231f;background:#f3f2f4;font-family:Nunito,"Segoe UI",system-ui,sans-serif}
body{margin:0}
header{position:sticky;top:0;display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center;padding:12px max(16px,calc((100% - 860px)/2));background:#2e2b30;color:#fff}
header a{display:inline-flex;align-items:center;min-height:44px;color:#f0c9d4;font-weight:700}
header span{font-size:.85rem;color:#d9d3db}
main{max-width:860px;margin:0 auto;padding:32px 16px 80px;line-height:1.6}
h1{font-size:1.7rem;line-height:1.2}
h2{margin-top:2.2rem;padding-top:.4rem;font-size:1.3rem;scroll-margin-top:84px}
h3{margin-top:1.4rem;font-size:1.05rem}
h2:target{background:#fff3cc;outline:6px solid #fff3cc;border-radius:2px}
table{width:100%;border-collapse:collapse;margin:1rem 0;background:#fdfbfc;font-size:.95rem}
td,th{border:1px solid #ddd5d9;padding:8px 10px;vertical-align:top;text-align:left}
tr:first-child td{font-weight:800;background:#f5e9ed}
a{color:#86404f}
</style></head><body>
<header><a href="../">← Voltar ao site</a><span>Cópia em HTML do documento do grupo. Original: <a href="${encodeURI(original)}" download>${original}</a></span></header>
<main>${body}</main></body></html>`

// Âncora em cada seção numerada: "3. Planta conceitual..." vira <h2 id="secao-3">.
const anchor = html => html
  .replace(/<h1>(\d+)\.\s*([\s\S]*?)<\/h1>/g, (_, n, t) => `<h2 id="secao-${n}">${n}. ${t}</h2>`)
  .replace(/<p><strong><em>(\d+)\.\s*([\s\S]*?)<\/em><\/strong><\/p>/g, (_, n, t) => `<h2 id="secao-${n}">${n}. ${t}</h2>`)
  .replace(/<p><strong><em>([^<]{2,60})<\/em><\/strong><\/p>/g, '<h3>$1</h3>')

async function docx(key, title) {
  const {value} = await mammoth.convertToHtml({path: `${SRC}/${files[key]}`})
  const body = anchor(value).replace(/^<p><strong>(?:<em>)?([\s\S]*?)(?:<\/em>)?<\/strong><\/p>/, '<h1>$1</h1>')
  await copyFile(`${SRC}/${files[key]}`, `${OUT}/${files[key]}`)
  await writeFile(`${OUT}/${key}.html`, page(title, files[key], body))
}

await docx('guia', 'Guia para desenvolvimento do site')
await docx('plano', 'Plano de biosseguridade contra doenças emergentes')
await copyFile(`${SRC}/${files.banner}`, `${OUT}/banner.pdf`)

// Descrição da ideia (txt.txt), escrita por Barbara Castro.
const ideia = (await readFile('txt.txt', 'utf8')).trim().split(/\n\s*\n/).map(p => `<p>${p.trim()}</p>`).join('\n')
await copyFile('txt.txt', `${OUT}/ideia.txt`)
await writeFile(`${OUT}/ideia.html`, page('Descrição da ideia', 'ideia.txt', `<h1>Descrição da ideia</h1>\n<p><em>Barbara Castro</em></p>\n${ideia}`))

console.log('documentos gerados em', OUT)
