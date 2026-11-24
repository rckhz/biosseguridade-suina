// Todo o conteúdo vem dos documentos da raiz do projeto. Cada bloco indica a fonte.
//   Guia   = material-didatico/Guia_Granja_Suinicola_Biosseguridade_Febre_Aftosa.docx
//   Plano  = material-didatico/Plano de Biosseguridade Contra Doenças Emergentes- Febre Aftosa.docx
//   Banner = material-didatico/Banner Febre Aftosa- Suínos- Versão 2.pdf

// Guia, seção 7: mensagem fixa do módulo.
export const MESSAGE = 'Suspeitou de doença vesicular? Não movimente os animais e avise imediatamente o Serviço Veterinário Oficial.'

// Banner (Introdução, Transmissão, Diagnóstico e controle) e Plano (seção 3).
export const disease = [
  {title:'O que é', source:'Banner, Introdução',
    text:'Doença viral aguda, altamente contagiosa e de notificação obrigatória, causada por um vírus do gênero Aphthovirus, família Picornaviridae. Acomete animais biungulados, incluindo os suínos, que apresentam elevada capacidade de disseminação viral, especialmente por aerossóis.'},
  {title:'Transmissão', source:'Plano, seção 3',
    list:['Contato direto entre animais infectados e susceptíveis.', 'Aerossóis, com destaque para a elevada eliminação viral pelos suínos infectados.', 'Ingestão de alimentos ou materiais contaminados.', 'Veículos, equipamentos, roupas e calçados contaminados.', 'Movimentação de animais, pessoas e materiais entre propriedades.']},
  {title:'Sinais clínicos em suínos', source:'Plano, seção 3',
    list:['Febre.', 'Vesículas e erosões no focinho e cavidade oral.', 'Vesículas na região interdigital e banda coronária dos cascos.', 'Claudicação intensa; dificuldade ou relutância em caminhar.', 'Redução do consumo alimentar e do desempenho produtivo.', 'Sialorreia pode ocorrer, porém geralmente é menos evidente que em bovinos.', 'Em leitões, casos graves podem causar miocardite e morte súbita.']},
  {title:'Diagnóstico e controle', source:'Banner, Diagnóstico e controle',
    text:'Baseia-se na avaliação clínica e epidemiológica, na identificação de lesões vesiculares e na confirmação laboratorial por RT-PCR, ELISA e isolamento viral. Não existe tratamento específico para a febre aftosa, sendo adotadas medidas sanitárias oficiais, incluindo restrição do trânsito animal e abate sanitário, conforme determinação das autoridades competentes.'},
]

// Banner (Contexto epidemiológico), Plano (seção 2) e Guia (seção 2).
export const status = {
  brasil:'Em maio de 2025, o Brasil recebeu da Organização Mundial de Saúde Animal (OMSA) o reconhecimento de país livre de febre aftosa sem vacinação. Entretanto, a circulação do vírus em outras regiões do mundo mantém o risco de reintrodução da doença, exigindo vigilância epidemiológica contínua.',
  mundo:'Há preocupação atual com a expansão internacional do sorotipo SAT 1. Em 2026, foram relatadas ocorrências em países da África, Oriente Médio, Europa e Ásia.',
  vacina:'Eventuais decisões de vacinação emergencial e de abate sanitário cabem às autoridades oficiais.',
  source:'Banner, Contexto epidemiológico; Plano, seção 2; Guia, seção 2',
}

// Guia, seção 7: cenário, etapas e respostas esperadas.
// As alternativas incorretas são ações que os próprios documentos mandam evitar (indicado em `why`).
export const scenario = 'Um funcionário percebe suínos mancando, com lesões no focinho e nos cascos. A suspeita NÃO equivale à confirmação laboratorial.'
export const steps = [
  {title:'1. Reconhecer', q:'Como classificar o quadro?',
    options:['Suspeita de doença vesicular, compatível com febre aftosa e outros diagnósticos.', 'Febre aftosa confirmada.'], answer:0,
    ok:'Identificar o quadro como suspeita de doença vesicular, compatível com febre aftosa e outros diagnósticos. Os sinais vesiculares não confirmam sozinhos o diagnóstico, exigindo investigação oficial e exames laboratoriais.'},
  {title:'2. Proteger', q:'O que fazer com animais, pessoas, veículos e materiais?',
    options:['Deslocar os suínos suspeitos para outro galpão.', 'Evitar movimentação de animais, pessoas, veículos e materiais potencialmente contaminados.'], answer:1,
    ok:'Evitar movimentação de animais, pessoas, veículos e materiais potencialmente contaminados; não deslocar suínos suspeitos.'},
  {title:'3. Comunicar', q:'Quem avisar, e quando?',
    options:['Notificar imediatamente o Serviço Veterinário Oficial estadual e o responsável técnico.', 'Esperar a confirmação laboratorial para avisar.'], answer:0,
    ok:'Notificar IMEDIATAMENTE o Serviço Veterinário Oficial estadual e o responsável técnico.'},
  {title:'4. Aguardar orientação', q:'O que a granja faz enquanto aguarda?',
    options:['Colher amostras por conta própria.', 'Restringir acessos e conservar registros.'], answer:1,
    ok:'Restringir acessos e conservar registros, sem colher amostras por conta própria ou executar medidas oficiais não autorizadas.'},
  {title:'5. Investigação oficial', q:'Quem avalia sinais, situação epidemiológica, coleta e exames?',
    options:['O serviço competente, que decide medidas sanitárias proporcionais.', 'A própria granja, executando as medidas oficiais.'], answer:0,
    ok:'O serviço competente avalia sinais, situação epidemiológica, coleta e exames; decide medidas sanitárias proporcionais.'},
  {title:'6. Desfecho educativo', q:'De quem dependem confirmação, interdição, abate sanitário, limpeza oficial e eventual vacinação emergencial?',
    options:['De decisão oficial.', 'Da própria granja.'], answer:0,
    ok:'Confirmação, interdição, abate sanitário, limpeza oficial e eventual vacinação emergencial dependem de decisão oficial.'},
]

// Guia, seção 8: cinco questões. Respostas e alternativas tiradas dos documentos (fonte em cada questão).
export const quiz = [
  {q:'Qual setor é a única entrada autorizada da granja?', source:'Guia, seção 3',
    options:['Estacionamento externo', 'Portaria e cerca perimetral', 'Controle de veículos / entrega'], answer:1},
  {q:'Para onde vão os animais recém-chegados antes do setor de produção?', source:'Guia, seções 3, 4 e 5',
    options:['Área de quarentena / isolamento de introdução', 'Galpão de maternidade e leitões', 'Galpões de creche e crescimento/terminação'], answer:0},
  {q:'Nos suínos, a sialorreia (salivação excessiva):', source:'Plano, seção 3',
    options:['É geralmente mais evidente que em bovinos.', 'Pode ocorrer, porém geralmente é menos evidente que em bovinos.'], answer:1},
  {q:'Diante de uma suspeita de doença vesicular, o que fazer?', source:'Guia, seção 7',
    options:['Não movimentar os animais e avisar imediatamente o Serviço Veterinário Oficial.', 'Deslocar os suínos suspeitos.', 'Colher amostras por conta própria.'], answer:0},
  {q:'Em maio de 2025, o Brasil foi reconhecido pela OMSA como país:', source:'Banner, Contexto epidemiológico',
    options:['Livre de febre aftosa com vacinação.', 'Livre de febre aftosa sem vacinação.'], answer:1},
]
// Banner, Conclusão: os três cuidados destacados.
export const top3 = ['Reconhecimento precoce dos sinais clínicos.', 'Notificação imediata.', 'Controle sanitário das propriedades.']
export const top3Source = 'Banner, Conclusão'

// Guia, seção 6: medidas preventivas essenciais.
export const practices = [
  ['Controle de acesso', 'Restringir visitantes, veículos e equipamentos compartilhados; manter cadastro e regras claras.'],
  ['Procedência e trânsito', 'Adquirir animais de origem conhecida, observar exigências oficiais de trânsito e manter rastreabilidade por lote.'],
  ['Separação de lotes', 'Adotar organização por fase produtiva, limpeza entre grupos e manejo que reduza contatos desnecessários.'],
  ['Higiene e desinfecção', 'Retirar matéria orgânica antes da desinfecção; usar produtos autorizados, concentração e tempo de contato indicados no rótulo.'],
  ['Vigilância', 'Observar diariamente animais e registrar febre, salivação, lesões vesiculares, claudicação e mortalidade anormal.'],
  ['Água, alimento e pragas', 'Prevenir contaminações e entrada de animais estranhos na granja.'],
  ['Capacitação', 'Disponibilizar orientações visuais aos trabalhadores sobre sinais clínicos e protocolo de comunicação.'],
  ['Plano de contingência', 'Manter contatos do Serviço Veterinário Oficial e procedimentos escritos para suspeita de doença vesicular.'],
]

// Banner, Conclusão.
export const conclusion = 'A manutenção do status sanitário brasileiro depende da aplicação contínua de medidas de biosseguridade e vigilância epidemiológica. Considerando a elevada capacidade de disseminação viral dos suínos, o reconhecimento precoce dos sinais clínicos, associado à notificação imediata e ao controle sanitário das propriedades, é fundamental para proteger os rebanhos e prevenir a reintrodução da febre aftosa.'

// Guia, seção 12.
export const refs = [
  ['BRASIL. Ministério da Agricultura e Pecuária. Vigilância à Febre Aftosa.', 'https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/febre-aftosa/combate-febre-aftosa'],
  ['BRASIL. Ministério da Agricultura e Pecuária. Febre Aftosa (PNEFA).', 'https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/febre-aftosa/programa-nacional-de-erradicacao-de-febre-aftosa-pnefa'],
  ['BRASIL. Ministério da Agricultura e Pecuária. Notificação de doenças relativas à suinocultura.', 'https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/sanidade-suidea/notificacao-de-doencas-relativas-a-suinocultura'],
  ['BRASIL. Ministério da Agricultura e Pecuária. Principais normas sanitárias vigentes: sanidade de suídeos.', 'https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/sanidade-suidea/legislacao/legislacao-suideos/portugues/principais-normas-sanitarias-vigentes'],
]

// Guia, nota final.
export const note = 'Este guia é um modelo acadêmico para interface educativa e não substitui projeto de instalação, plano sanitário da granja, exigências estaduais ou orientações do Serviço Veterinário Oficial.'

// Banner: autoria.
export const credits = {
  title:'Plano de biosseguridade contra doenças emergentes: febre aftosa em suínos',
  students:'Barbara de Castro Piauilino, Ellen Maria Rodrigues Silva, Milena Antônia Ferreira Corrêa Colaço, Milena Moiteiro Silva dos Santos, Victoria Luisa Acosta Mosquetti',
  advisors:'Andrea Parra e Renato Bueno Flores',
}

// Objetivo acadêmico (Guia, seção 8, pede o objetivo na tela inicial).
export const objective = {
  txt:'A ideia é desenvolver um site interativo que apresente um protótipo virtual de uma granja de suinocultura, com foco nas medidas de biosseguridade para a prevenção de doenças emergentes, especificamente a febre aftosa.',
  txtSource:'Barbara Castro',
  guia:'Desenvolver um site educativo que represente uma granja suinícola tecnificada, permitindo ao visitante explorar sua organização física, reconhecer vias de entrada do vírus da febre aftosa, consultar medidas de biosseguridade e praticar decisões frente a uma suspeita sanitária.',
  guiaSource:'Guia, seção 1',
  ficticia:'A granja é fictícia e seu desenho é didático: dimensões, distâncias, fluxos e procedimentos reais devem ser ajustados por responsável técnico e normas aplicáveis.',
}
