// Conteúdo consolidado a partir do Guia, Plano de Biosseguridade, Banner acadêmico
// e das atualizações solicitadas em "Ajustes na estrutura da granja.docx".

export const MESSAGE = 'Suspeitou de doença vesicular? Não movimente os animais e avise imediatamente o Serviço Veterinário Oficial.'

// Condutas imediatas para o botão "Suspeita de febre aftosa: o que fazer?"
export const emergencySteps = [
  ['Identificar sinais clínicos suspeitos', 'Observar claudicação intensa, febre e vesículas ou erosões no focinho, cavidade oral e cascos.'],
  ['Restringir a movimentação de animais e o acesso à propriedade', 'Suspender imediatamente entradas e saídas de suínos, veículos, visitantes, insumos e equipamentos.'],
  ['Notificar imediatamente o Serviço Veterinário Oficial', 'Realizar a comunicação compulsória ao órgão estadual de defesa sanitária animal e acionar o médico-veterinário responsável.'],
  ['Aguardar a investigação e seguir as determinações sanitárias oficiais', 'Preservar os registros e GTAs, sem colher amostras por conta própria; interdição, diagnóstico laboratorial e medidas de contenção cabem à autoridade oficial.'],
]

// Diagnóstico e controle: lista objetiva com rótulos em destaque solicitada nos ajustes.
export const diagnosisItems = [
  ['Diagnóstico clínico:', 'avaliação dos sinais e histórico epidemiológico.'],
  ['Confirmação laboratorial:', 'RT-PCR, ELISA e isolamento viral.'],
  ['Diagnóstico diferencial:', 'outras doenças vesiculares.'],
  ['Notificação:', 'imediata ao Serviço Veterinário Oficial.'],
  ['Controle:', 'interdição, restrição do trânsito e medidas sanitárias oficiais.'],
  ['Abate sanitário:', 'conforme determinação da autoridade competente.'],
  ['Tratamento:', 'não existe tratamento específico.'],
]

// Vias de transmissão interativas (fora do mapa 3D, conectadas aos setores da granja).
export const transmissionRoutes = [
  {
    id: 'animais',
    label: 'Animais infectados',
    origin: 'Suínos de reposição em incubação ou contato com outros biungulados',
    entry: 'Ingresso sem conferência sanitária ou mistura direta com lotes residentes',
    impact: 'Transmissão rápida focinho a focinho entre baias, atingindo todo o plantel susceptível.',
    barrier: 'Aquisição apenas com GTA, desembarque no perímetro e isolamento obrigatório na Unidade de quarentena.',
    sectorIndex: 6,
    sectorLabel: '07 · Unidade de quarentena',
  },
  {
    id: 'alimentos',
    label: 'Alimentos e água',
    origin: 'Restos de alimentos (lavagem) contaminados, ração exposta a pragas ou água desprotegida',
    entry: 'Fornecimento oral sem controle de origem ou contaminação no armazenamento',
    impact: 'Infecção simultânea de diversos suínos pela via digestiva.',
    barrier: 'Proibição de lavagem não tratada, abastecimento externo dos silos e proteção do reservatório de água.',
    sectorIndex: 10,
    sectorLabel: '11 · Silos de ração e depósito',
  },
  {
    id: 'veiculos',
    label: 'Veículos e caminhões',
    origin: 'Pneus, carrocerias e rampas com matéria orgânica de outras granjas ou frigoríficos',
    entry: 'Circulação de caminhões externos dentro da área limpa da propriedade',
    impact: 'Transporte mecânico do vírus pelas vias internas até a porta dos galpões.',
    barrier: 'Estacionamento externo, passagem pelo rodolúvio/arco de desinfecção e embarcadouro na cerca perimetral.',
    sectorIndex: 2,
    sectorLabel: '03 · Rodolúvio e controle de veículos',
  },
  {
    id: 'materiais',
    label: 'Roupas e materiais',
    origin: 'Calçados, roupas de rua, mãos e equipamentos compartilhados entre propriedades',
    entry: 'Acesso de pessoas ou utensílios sem higienização prévia',
    impact: 'Introdução direta do vírus por fômites nos setores produtivos.',
    barrier: 'Registro sanitário na entrada, banho, troca completa de roupa e botas, pedilúvio e equipamentos exclusivos.',
    sectorIndex: 4,
    sectorLabel: '05 · Barreira sanitária e pedilúvio',
  },
  {
    id: 'aerossois',
    label: 'Aerossóis',
    origin: 'Elevada eliminação viral no ar expirado por suínos infectados',
    entry: 'Alta densidade animal e proximidade sem separação sanitária entre fases',
    impact: 'Os suínos atuam como amplificadores virais, espalhando partículas infecciosas a curtas distâncias.',
    barrier: 'Cercamento perimetral, separação estrita por unidades (maternidade, recria e terminação) e vigilância diária.',
    sectorIndex: 9,
    sectorLabel: '10 · Crescimento e terminação',
  },
]

// Sinais clínicos interativos no suíno (coordenadas percentuais na ilustração SVG).
export const clinicalSigns = [
  {
    id: 'focinho',
    label: 'Focinho e boca',
    title: 'Vesículas no focinho e cavidade oral',
    x: 82, y: 45,
    detail: 'Formação de vesículas (bolhas) que se rompem deixando erosões dolorosas no espelho rostral, lábios, língua e gengiva. A sialorreia pode ocorrer, mas costuma ser menos evidente que em bovinos.',
    inspect: 'Inspecionar diariamente o espelho do focinho e os lábios durante o arraçoamento.',
  },
  {
    id: 'cascos',
    label: 'Cascos',
    title: 'Lesões vesiculares na banda coronária e espaço interdigital',
    x: 68, y: 84,
    detail: 'Vesículas esbranquiçadas e erosões na transição entre pele e casco (banda coronária), talões e região interdigital, podendo causar descolamento do estojo córneo.',
    inspect: 'Examinar bordas dos cascos e sinais de sangramento ou sensibilidade podal.',
  },
  {
    id: 'claudicacao',
    label: 'Claudicação',
    title: 'Claudicação intensa e relutância em caminhar',
    x: 34, y: 78,
    detail: 'Dor podal aguda leva os suínos a mancar intensamente, caminhar sobre os carpos, permanecer deitados ou recusar-se a levantar no manejo.',
    inspect: 'Atenção imediata quando vários animais do mesmo lote aparecem mancando ao mesmo tempo.',
  },
  {
    id: 'febre',
    label: 'Febre e apatia',
    title: 'Febre alta e queda no consumo alimentar',
    x: 48, y: 36,
    detail: 'Elevação acentuada da temperatura corporal (40 °C a 41 °C), prostração, amontoamento e redução brusca na ingestão de ração e no desempenho produtivo.',
    inspect: 'Registrar sobras de ração, apatia coletiva e hipertermia nas fichas do lote.',
  },
  {
    id: 'leitoes',
    label: 'Leitões',
    title: 'Miocardite aguda e morte súbita em leitões',
    x: 58, y: 54,
    detail: 'Em leitões lactentes e jovens, casos graves podem provocar lesão cardíaca viral (miocardite) e mortalidade súbita elevada, às vezes sem tempo para abrir vesículas.',
    inspect: 'Comunicar imediatamente qualquer pico inesperado de mortalidade na maternidade ou na unidade de recria.',
  },
]

export const status = {
  brasil:'Em maio de 2025, o Brasil recebeu da Organização Mundial de Saúde Animal (OMSA) o reconhecimento internacional de país livre de febre aftosa sem vacinação. Como não há vacinação de rotina, a prevenção depende diretamente da biosseguridade nas granjas, do controle de trânsito e da notificação imediata.',
  mundo:'Permanece o risco de reintrodução viral pela circulação internacional da doença, incluindo a expansão recente do sorotipo SAT 1, com ocorrências relatadas em 2026 na África, Oriente Médio, Europa e Ásia.',
  vacina:'Eventuais decisões de interdição, abate sanitário e vacinação emergencial cabem exclusivamente às autoridades veterinárias oficiais.',
  source:'Banner, Contexto epidemiológico; Plano, seção 2; Guia, seção 2',
}

export const scenario = 'Durante a inspeção matinal, um funcionário percebe vários suínos mancando, febris e com vesículas no focinho e nos cascos. Lembre-se: a suspeita clínica NÃO equivale à confirmação laboratorial.'
export const steps = [
  {title:'1. Identificar suspeita', q:'Como classificar os sinais clínicos observados no galpão?',
    options:['Suspeita de doença vesicular, compatível com febre aftosa e diagnósticos diferenciais.', 'Febre aftosa confirmada apenas pelo exame visual.'], answer:0,
    ok:'Correto: o quadro é classificado como suspeita de doença vesicular. Apenas exames laboratoriais oficiais diferenciam a febre aftosa de outras enfermidades vesiculares.'},
  {title:'2. Interditar circulação interna', q:'Qual a conduta imediata quanto a animais, pessoas, veículos e materiais?',
    options:['Transferir os suínos mancando para outro setor ou embarcar o lote.', 'Suspender toda movimentação de animais, pessoas, veículos e materiais potencialmente contaminados.'], answer:1,
    ok:'Correto: nenhum suíno suspeito deve ser deslocado e o acesso à propriedade deve ser imediatamente restringido para conter eventual disseminação.'},
  {title:'3. Notificação compulsória', q:'Quem deve ser comunicado e em que momento?',
    options:['Notificar IMEDIATAMENTE o Serviço Veterinário Oficial estadual e o responsável técnico.', 'Aguardar alguns dias para ver se os animais melhoram antes de avisar.'], answer:0,
    ok:'Correto: a febre aftosa é de notificação compulsória imediata ao Serviço Veterinário Oficial.'},
  {title:'4. Preservar rastreabilidade', q:'Enquanto aguarda a equipe oficial, o que a granja deve fazer?',
    options:['Colher amostras das vesículas por conta própria e enviar por transportadora.', 'Manter o isolamento, restringir acessos e separar fichas de lotes, GTAs e registros de entrada.'], answer:1,
    ok:'Correto: a granja mantém a contenção e organiza os registros sanitários e GTAs, sem colher material vesicular por conta própria.'},
  {title:'5. Investigação oficial', q:'Quem realiza o exame epidemiológico, a colheita de amostras e o envio laboratorial?',
    options:['O Serviço Veterinário Oficial, que conduz a investigação e define medidas proporcionais.', 'Os próprios funcionários da granja sem supervisão oficial.'], answer:0,
    ok:'Correto: a investigação clínica/epidemiológica, a colheita oficial e o diagnóstico por RT-PCR/ELISA cabem ao serviço oficial competente.'},
  {title:'6. Medidas oficiais de contenção', q:'De quem dependem interdição oficial, restrição de trânsito, abate sanitário e eventual vacinação emergencial?',
    options:['Exclusivamente da decisão das autoridades sanitárias competentes.', 'Da decisão particular do proprietário da granja.'], answer:0,
    ok:'Correto: confirmação, interdição da área, abate sanitário, desinfecção oficial e qualquer medida emergencial dependem de determinação oficial.'},
]

export const quiz = [
  {q:'Qual instalação junto à cerca evita que caminhões de transporte animal entrem na área limpa?', source:'Guia, seções 3 e 4',
    options:['Estacionamento externo', 'Embarcadouro e desembarcadouro', 'Unidade de recria'], answer:1},
  {q:'Para qual setor isolado seguem os suínos de reposição antes de ingressar nas unidades produtivas?', source:'Guia, seções 3, 4 e 5',
    options:['Unidade de quarentena', 'Unidade de maternidade', 'Unidade de recria'], answer:0},
  {q:'Nos suínos acometidos por febre aftosa, a sialorreia (salivação excessiva):', source:'Plano, seção 3',
    options:['É geralmente mais intensa que em bovinos.', 'Pode ocorrer, porém geralmente é menos evidente que em bovinos, predominando claudicação e lesões podais/rostrais.'], answer:1},
  {q:'Diante de suspeita de doença vesicular na granja, qual é a conduta obrigatória?', source:'Guia, seção 7',
    options:['Restringir movimentações e notificar imediatamente o Serviço Veterinário Oficial.', 'Transferir os animais suspeitos para a unidade de crescimento e terminação.', 'Colher amostras das lesões por conta própria.'], answer:0},
  {q:'Em maio de 2025, o Brasil recebeu da OMSA o reconhecimento internacional como país:', source:'Banner, Contexto epidemiológico',
    options:['Livre de febre aftosa com vacinação.', 'Livre de febre aftosa sem vacinação.'], answer:1},
]

export const top3 = ['Reconhecimento precoce dos sinais clínicos.', 'Notificação compulsória imediata ao Serviço Veterinário Oficial.', 'Controle sanitário rigoroso das propriedades.']
export const top3Source = 'Banner, Conclusão'

export const disinfectionBarriers = [
  {
    id: 'rodoluvio',
    title: 'Rodolúvio e arco de desinfecção',
    subtitle: 'Desinfecção de pneus, rodados e veículos',
    what: 'Bacia ou fosso raso impermeável preenchido com solução desinfetante na entrada de serviço, dimensionado para cobrir toda a volta dos pneus e associado ao arco de pulverização.',
    rules: [
      'Retirar previamente barro, esterco e matéria orgânica dos pneus e para-lamas (a matéria orgânica inativa o desinfetante).',
      'Usar produto autorizado pelo MAPA na concentração e tempo de contato do rótulo, protegendo o fosso da diluição por chuva.',
      'Restringir ao máximo a entrada: sempre que possível, manter caminhões no perímetro externo.',
    ],
    sectorIndex: 2,
    btnLabel: 'Ver Rodolúvio em 3D na granja',
  },
  {
    id: 'pediluvio',
    title: 'Pedilúvio sanitário',
    subtitle: 'Desinfecção das botas na barreira e nos galpões',
    what: 'Bandeja ou caixa rasa com lâmina de desinfetante posicionada na saída limpa do vestiário e na entrada de cada galpão produtivo ou unidade de quarentena.',
    rules: [
      'Nunca usar com sapatos de rua sujos: primeiro calçar as botas exclusivas da granja já limpas e escovadas.',
      'Submergir completamente a sola das duas botas respeitando a diluição recomendada pelo fabricante.',
      'Trocar e reabastecer a solução regularmente ou sempre que houver acúmulo de sujeira.',
    ],
    sectorIndex: 4,
    btnLabel: 'Ver Pedilúvio em 3D na granja',
  },
]

export const practices = [
  ['Controle de acesso e cercamento', 'Manter placas de acesso restrito, cerca perimetral íntegra, registro sanitário de visitantes e barreira com banho, troca de roupa/botas e pedilúvio.'],
  ['Veículos, rodolúvio e embarcadouro', 'Manter carros de visita fora da granja, desinfetar veículos autorizados no rodolúvio e operar embarque/desembarque na borda perimetral.'],
  ['Procedência, GTA e quarentena', 'Adquirir suínos apenas de origem regularizada com GTA, alojando animais de reposição em unidade de quarentena isolada com equipamentos exclusivos.'],
  ['Separação por unidades produtivas', 'Organizar maternidade, unidade de recria e crescimento/terminação em lotes separados ("todos dentro, todos fora"), com limpeza e vazio sanitário entre lotes.'],
  ['Higiene e desinfecção', 'Remover matéria orgânica antes de aplicar desinfetantes autorizados, respeitando diluição e tempo de contato do rótulo.'],
  ['Ração, água e controle de pragas', 'Abastecer silos pelo lado externo, vedar reservatórios de água, controlar pragas e proibir restos de alimentos contaminados.'],
  ['Vigilância clínica diária', 'Inspecionar diariamente locomoção, cascos, focinho, febre, consumo de ração e mortalidade, capacitando toda a equipe.'],
  ['Rastreabilidade e contingência', 'Manter escritório sanitário com fichas de lotes, GTAs e contato imediato do Serviço Veterinário Oficial para notificação compulsória.'],
]

export const conclusion = 'A manutenção do status brasileiro de país livre de febre aftosa sem vacinação exige aplicação contínua de biosseguridade e vigilância epidemiológica. Dada a elevada eliminação viral pelos suínos, reconhecer precocemente claudicação e lesões vesiculares e notificar imediatamente o Serviço Veterinário Oficial é decisivo para proteger a suinocultura nacional.'

export const refs = [
  ['BRASIL. Ministério da Agricultura e Pecuária. Vigilância à Febre Aftosa.', 'https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/febre-aftosa/combate-febre-aftosa'],
  ['BRASIL. Ministério da Agricultura e Pecuária. Febre Aftosa (PNEFA).', 'https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/febre-aftosa/programa-nacional-de-erradicacao-de-febre-aftosa-pnefa'],
  ['BRASIL. Ministério da Agricultura e Pecuária. Notificação de doenças relativas à suinocultura (e-SISBRAVET).', 'https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/sanidade-suidea/notificacao-de-doencas-relativas-a-suinocultura'],
  ['BRASIL. Ministério da Agricultura e Pecuária. Principais normas sanitárias vigentes: sanidade de suídeos.', 'https://www.gov.br/agricultura/pt-br/assuntos/sanidade-animal-e-vegetal/saude-animal/programas-de-saude-animal/sanidade-suidea/legislacao/legislacao-suideos/portugues/principais-normas-sanitarias-vigentes'],
]

export const note = 'Este ambiente virtual é um modelo acadêmico com finalidade educativa e não substitui projeto de engenharia, plano sanitário individual da granja, legislação estadual ou determinações do Serviço Veterinário Oficial.'

export const credits = {
  title:'Plano de biosseguridade contra doenças emergentes: febre aftosa em suínos',
  students:'Barbara de Castro Piauilino, Ellen Maria Rodrigues Silva, Milena Antônia Ferreira Corrêa Colaço, Milena Moiteiro Silva dos Santos, Victoria Luisa Acosta Mosquetti',
  advisors:'Andrea Parra e Renato Bueno Flores',
}

// Textos atualizados solicitados pela cliente para a seção "Objetivo do trabalho" (versão concisa para boa leitura em tela/projetor).
export const objective = {
  proposalTitle: 'Ambiente virtual tridimensional',
  proposal: 'O presente projeto propõe um ambiente virtual tridimensional que representa a estrutura e o funcionamento de uma granja suinícola tecnificada, integrando conhecimentos de sanidade animal e biosseguridade à tecnologia digital como ferramenta educativa voltada aos principais desafios sanitários da suinocultura, com ênfase na prevenção da febre aftosa.',
  purposeTitle: 'Finalidade didática e sanitária',
  purpose: 'Busca promover a compreensão dos princípios de biosseguridade aplicados à suinocultura por meio da simulação virtual, contemplando a identificação de fatores de risco, a análise das vias de transmissão viral e a aplicação de protocolos sanitários, ressaltando o papel da vigilância epidemiológica e da atuação médico-veterinária na proteção dos rebanhos.',
}
