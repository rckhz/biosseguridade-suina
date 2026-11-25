# Biosseguridade na Suinocultura

Ambiente virtual tridimensional e interativo de uma granja suinícola tecnificada fictícia voltado ao ensino da prevenção da **febre aftosa em suínos**. A propriedade reúne **14 instalações** distribuídas em **5 zonas de biosseguridade** (externa, externa/suja, transição, isolamento e interna/limpa). Ao selecionar cada ponto na maquete 3D ou na planta 2D, você visualiza sua função, medidas preventivas, risco sanitário associado e uma cena interna animada.

![Maquete da granja com a janela do interior da maternidade e a ficha do setor selecionado](docs/imagens/granja.jpg)

## Roteiro de exploração

1. Selecione **Explorar a propriedade** para percorrer os 14 setores — da **Portaria** (com placas de acesso restrito), **Rodolúvio**, **Barreira sanitária com pedilúvio** e **Embarcadouro perimetral** até a **Unidade de quarentena**, **Unidade de maternidade**, **Unidade de recria**, **Crescimento e terminação** e o **Escritório sanitário e GTA**. Use as setas **←** e **→** para avançar pelas fichas.
2. Em **Unidade de maternidade**, **Unidade de recria** e **Crescimento e terminação**, escolha **Ver por dentro** para abrir o galpão em corte na própria maquete.
3. Acione o botão **▶** para assistir à **animação guiada dos fluxos** (veículos, ração, pessoas, animais e resíduos) ou alterne para a **Planta 2D** e ative **Zonas** e **Fluxos**.
4. Clique em **Suspeita de febre aftosa: o que fazer?** ou em **Notificar SVO** para consultar o protocolo imediato e simular uma **notificação compulsória ao Serviço Veterinário Oficial**.

## Módulos interativos fora do mapa 3D

- **Conheça a Febre Aftosa**: agente etiológico (*Aphthovirus*, família Picornaviridae), diagnóstico e controle estruturados, atualização epidemiológica de **maio de 2025** (reconhecimento do Brasil pela OMSA como país livre sem vacinação), simulador interativo de **vias de transmissão** e **inspeção clínica interativa** no suíno (focinho, cascos, claudicação, febre e miocardite em leitões).
- **Simule uma Emergência & Quiz**: tomada de decisão em 6 etapas diante de suspeita vesicular, botão de comunicação imediata ao SVO e quiz final com revisão comentada.

![Simulação de suspeita de febre aftosa com o cenário, as etapas e as opções de resposta](docs/imagens/simulacao.jpg)

## Rodar no seu computador

Com Git, Node.js 22.12+ e npm instalados, execute:

```sh
git clone https://github.com/rckhz/biosseguridade-suina.git
cd biosseguridade-suina
npm ci
npm run dev
```

Abra o endereço local exibido pelo Vite. Para gerar a versão de produção em `dist/`, execute `npm run build`.

## Créditos

Trabalho acadêmico *Plano de biosseguridade contra doenças emergentes: febre aftosa em suínos*, de Barbara de Castro Piauilino, Ellen Maria Rodrigues Silva, Milena Antônia Ferreira Corrêa Colaço, Milena Moiteiro Silva dos Santos e Victoria Luisa Acosta Mosquetti, com orientação de Andrea Parra e Renato Bueno Flores.
