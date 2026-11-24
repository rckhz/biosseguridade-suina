// Todo o conteúdo vem dos documentos da raiz do projeto:
//   Guia  = material-didatico/Guia_Granja_Suinicola_Biosseguridade_Febre_Aftosa.docx
//   Plano = material-didatico/Plano de Biosseguridade Contra Doenças Emergentes- Febre Aftosa.docx
// `source`: fonte do nome, da função e das medidas.
// `riskSource`: fonte do texto de risco. O texto é do documento, mas a associação de cada
// via de transmissão a um setor é do grupo (o documento não liga a via ao setor).

// Guia, seção 3: as três áreas da propriedade. Setores que o guia não coloca em nenhuma zona ficam sem zona.
export const zones = {
  externa: {name: 'Zona externa', color: '#c98f3e', text: 'Acesso de veículos, visitantes e fornecedores.'},
  transicao: {name: 'Zona de transição', color: '#c2b257', text: 'Portaria, cadastro, vestiário, higienização e troca de roupas/botas.'},
  interna: {name: 'Zona interna / limpa', color: '#3e8f72', text: 'Galpões e corredores de manejo controlados.'},
}

export const sectors = [
  {name:'Portaria e cerca perimetral', short:'Portaria', zone:'transicao',
    role:'Única entrada autorizada; separação física entre propriedade e via pública.',
    risk:'Movimentação de animais, pessoas e materiais entre propriedades.',
    measures:['Acesso somente com autorização.', 'Registro de entrada/saída.'],
    source:'Guia, seções 3 e 5', riskSource:'Plano, seção 3', x:-7.2, z:6.6, w:1.6, d:1.4},
  {name:'Estacionamento externo', short:'Estacionamento externo', zone:'externa',
    role:'Ponto de parada para veículos de visitantes; evitar ingresso desnecessário.',
    risk:'Veículos, equipamentos, roupas e calçados contaminados.',
    measures:['Parada dos veículos de visitantes do lado de fora.', 'Evitar ingresso desnecessário.', 'Fluxo de veículos preferencialmente restrito ao perímetro e pontos de transferência.'],
    source:'Guia, seções 3 e 4', riskSource:'Plano, seção 3', x:-8.3, z:9.7, w:2.5, d:1.4},
  {name:'Controle de veículos / entrega', short:'Veículos e entrega', zone:'externa',
    role:'Registro, avaliação sanitária, higienização quando indicada; preferir transferência na borda.',
    risk:'Veículos, equipamentos, roupas e calçados contaminados.',
    measures:['Restringir entrada e registrar transporte.', 'Aplicar limpeza/desinfecção apropriadas quando exigidas.', 'Preferir transferência na borda.'],
    source:'Guia, seções 3 e 5', riskSource:'Plano, seção 3', x:7, z:9.6, w:2.5, d:1.4},
  {name:'Recepção e registro', short:'Recepção e registro', zone:'transicao',
    role:'Autorização, histórico de contato com outros animais e orientação de visitantes.',
    risk:'Movimentação de animais, pessoas e materiais entre propriedades.',
    measures:['Autorização de visitantes.', 'Histórico de contato com outros animais.', 'Orientação de visitantes.'],
    source:'Guia, seção 3', riskSource:'Plano, seção 3', x:-3, z:4, w:2, d:1.6},
  {name:'Vestiário / barreira sanitária', short:'Barreira sanitária', zone:'transicao',
    role:'Troca de roupas e calçados; banho e protocolos conforme avaliação de risco.',
    risk:'Veículos, equipamentos, roupas e calçados contaminados.',
    measures:['Trocar calçados e vestimentas.', 'Lavar mãos.', 'Seguir protocolo local de higiene.'],
    source:'Guia, seções 3 e 5', riskSource:'Plano, seção 3', x:0, z:4, w:2, d:1.6},
  {name:'Área de quarentena / isolamento de introdução', short:'Quarentena', zone:null,
    role:'Setor separado dos animais residentes; admissão conforme protocolo veterinário.',
    risk:'Contato direto entre animais infectados e susceptíveis.',
    measures:['Não introduzir animais diretamente nos lotes.', 'Verificar procedência, documentação e condição sanitária.'],
    source:'Guia, seções 3 e 5', riskSource:'Plano, seção 3', x:-7, z:-4, w:3, d:2},
  {name:'Galpão de maternidade e leitões', short:'Maternidade', zone:'interna',
    role:'Ambiente para matrizes em parto e leitões; observação reforçada.',
    risk:'Em leitões, casos graves podem causar miocardite e morte súbita.',
    measures:['Observação reforçada.', 'Inspecionar diariamente apetite, locomoção, focinho, cascos e lesões suspeitas.'],
    source:'Guia, seções 3 e 5', riskSource:'Plano, seção 3', x:-1.5, z:-3.8, w:5, d:2},
  {name:'Galpões de creche e crescimento/terminação', short:'Creche e terminação', zone:'interna',
    role:'Lotes separados por fase; manejo por grupo e higiene entre lotes.',
    risk:'Aerossóis, com destaque para a elevada eliminação viral pelos suínos infectados.',
    measures:['Lotes separados por fase.', 'Manejo por grupo e higiene entre lotes.', 'Inspecionar diariamente apetite, locomoção, focinho, cascos e lesões suspeitas.'],
    source:'Guia, seções 3 e 5', riskSource:'Plano, seção 3', x:5, z:-3.8, w:5, d:2},
  {name:'Depósito de ração e insumos', short:'Depósito', zone:null,
    role:'Armazenamento protegido de pragas, umidade e contaminação.',
    risk:'Ingestão de alimentos ou materiais contaminados.',
    measures:['Proteger ração de pragas.', 'Impedir contato com materiais e resíduos contaminados.'],
    source:'Guia, seções 3 e 5', riskSource:'Plano, seção 3', x:5, z:0.1, w:3.5, d:2},
  {name:'Reservatório / sistema de água', short:'Reservatório de água', zone:null,
    role:'Proteção e monitoramento da fonte e pontos de fornecimento.',
    risk:'Contaminações e entrada de animais estranhos na granja.',
    measures:['Proteção da fonte.', 'Monitoramento da fonte e dos pontos de fornecimento.'],
    source:'Guia, seção 3', riskSource:'Guia, seção 6', x:8, z:2.6, w:2, d:2},
  {name:'Área de resíduos e animais mortos', short:'Resíduos', zone:null,
    role:'Separada da produção; recolhimento e destinação conforme legislação e orientação técnica.',
    risk:'Cruzar sem controle com a circulação limpa.',
    measures:['Separar da produção.', 'Procedimentos de retirada e destinação supervisionados.'],
    source:'Guia, seções 3 e 5', riskSource:'Guia, seção 4', x:8, z:-7, w:2, d:1.4},
  {name:'Sala de apoio e registros sanitários', short:'Registros', zone:null,
    role:'Plano escrito, fichas de lotes, ocorrências, movimentações e contatos de emergência.',
    risk:'Diante de suspeita, é preciso identificar movimentações recentes e possíveis contatos.',
    measures:['Documentar procedência, movimentações, inspeções e episódios clínicos.'],
    source:'Guia, seções 3 e 5', riskSource:'Plano, seção 5', x:3.2, z:4, w:2.3, d:1.7},
].map((s,i) => ({...s, code: String(i+1).padStart(2,'0')}))

export const isBarn = i => i===6 || i===7

// Guia, seção 4. Cores do guia: verde para percurso controlado, amarelo para pontos de verificação,
// vermelho para rotas proibidas ou de alto risco.
export const flowLegend = 'Verde: percurso controlado · Amarelo: pontos de verificação · Vermelho: rotas proibidas ou de alto risco.'
// Cada fluxo tem um ou mais trajetos (`paths`) em coordenadas da maquete [x, z].
// O traçado é didático: a sequência vem do guia, a posição no mapa é do grupo.
export const flows = [
  {id:'pessoas', name:'Pessoas', note:'rua → portaria → registro → vestiário/barreira → galpões autorizados → saída controlada', color:'#2f7d62', dash:false,
    paths:[[[-4.6,11.1],[-4.6,5.4],[0,5.4],[0,-1.85],[5,-1.85]]]},
  {id:'animais', name:'Animais', note:'origem regularizada → conferência documental e sanitária → quarentena definida pelo responsável técnico → setor de produção', color:'#c08a2a', dash:false,
    paths:[[[-5.4,11.1],[-5.4,2.4],[-8.2,2.4],[-8.2,-2.55],[-3.3,-2.55]]]},
  {id:'racao', name:'Ração e insumos', note:'fornecedores → ponto de recebimento externo → depósito → distribuição interna por equipamentos dedicados', color:'#2f7d62', dash:true,
    paths:[[[6.4,11.1],[6.4,1.45]]]},
  {id:'veiculos', name:'Veículos', note:'preferencialmente restrito ao perímetro e pontos de transferência', color:'#c08a2a', dash:true,
    paths:[[[-12.5,11.05],[-8.3,11.05],[-8.3,10.55]],[[12.5,11.05],[7.6,11.05],[7.6,10.45]]]},
  {id:'residuos', name:'Resíduos', note:'galpões → área de coleta identificada → destinação', color:'#b2453a', dash:false,
    paths:[[[-1.5,-5.3],[8,-5.3],[8,-6.2]]]},
]
