# Biosseguridade na Suinocultura

Uma visita virtual a uma granja fictícia para estudar a prevenção da febre aftosa em suínos. A maquete reúne **12 setores**. Ao selecionar um deles, você descobre o que acontece ali, quais cuidados fazem parte da rotina e onde encontrar a explicação no material do grupo.

![Tela inicial do site com a maquete da granja e a ficha do setor selecionado](docs/imagens/granja.jpg)

## Um roteiro pela granja

1. Selecione **Explorar a propriedade** para começar pelo primeiro setor. Arraste a maquete para girar a câmera e use as setas **←** e **→** para passar de uma ficha à seguinte.
2. Em um galpão, escolha **Ver por dentro**. Depois, volte à vista geral e abra a **planta 2D** para localizar o galpão em relação às outras instalações.
3. Ative **Mostrar zonas** e **Mostrar fluxos**. Na legenda, selecione um percurso por vez para acompanhar a circulação de pessoas, animais, ração, veículos ou resíduos.

## Da visita à simulação

Em **Materiais Didáticos**, a simulação apresenta uma suspeita de febre aftosa. Você escolhe como agir, lê a explicação e avança para a próxima etapa. O quiz encerra a visita com cinco perguntas e uma revisão das respostas. O banner acadêmico em PDF e os links nas fichas permitem consultar as fontes durante o estudo.

![Simulação de suspeita de febre aftosa com o cenário, as etapas e as opções de resposta](docs/imagens/simulacao.jpg)

## Rodar no seu computador

Com Git, Node.js 22.12+ e npm instalados, execute:

```sh
git clone https://github.com/rckhz/biosseguridade-suina.git
cd biosseguridade-suina
npm ci
npm run dev
```

Abra o endereço local que o Vite mostrar no terminal. Para gerar a versão de produção em `dist/`, execute `npm run build`. Os dois comandos também preparam as versões dos documentos que o site exibe no navegador.

A interface foi feita com React e a maquete usa Three.js com React Three Fiber. O conteúdo e as fichas dos setores ficam em [src](src/), e os documentos originais estão em [material-didatico](material-didatico/).

## Créditos

Trabalho acadêmico *Plano de biosseguridade contra doenças emergentes: febre aftosa em suínos*, de Barbara de Castro Piauilino, Ellen Maria Rodrigues Silva, Milena Antônia Ferreira Corrêa Colaço, Milena Moiteiro Silva dos Santos e Victoria Luisa Acosta Mosquetti, com orientação de Andrea Parra e Renato Bueno Flores.
