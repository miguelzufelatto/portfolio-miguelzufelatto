# Design System do Portfólio

## 1. Introdução
Este é o design system para o portfólio pessoal e profissional de Miguel Zufelatto. O objetivo visual é transmitir uma imagem direta, técnica, acessível e sem distrações desnecessárias. A estética utiliza tipografia monoespaçada para reforçar a identidade de engenharia de software e análise de dados, remetendo a um ambiente de terminal limpo e funcional.

## 2. Fundações

- **Paleta de Cores:**
  - `--text`: `#eeeeec` (Cor principal do texto, oferece alto contraste sem forçar a vista)
  - `--background`: `#0b0b09` (Fundo escuro, tom profundo para conforto visual)
  - `--primary`: `#868469` (Cor de destaque para CTAs e links importantes)
  - `--secondary`: `#4e4d3b` (Cor de apoio, boa para bordas ou fundos de cards)
  - `--accent`: `#6e6b4e` (Cor de interação, como o estado de hover dos botões)

- **Tipografia:**
  - **Família Principal:** Monospace (ex: Fira Code, JetBrains Mono, Space Mono ou Roboto Mono via Google Fonts).
  - **Títulos (Headings):** Monospace - Pesos: 600 (Semibold) e 700 (Bold).
  - **Texto normal (Body):** Monospace - Peso: 400 (Regular).
  - *Nota:* Textos monoespaçados exigem um controle cuidadoso de tamanho da fonte (font-size) e altura da linha (line-height) para não cansar a leitura em parágrafos mais longos, como na seção "Sobre".

- **Espaçamento e Layout:**
  - **Base/Pequeno:** 8px (Para espaços internos de botões ou entre ícones e textos)
  - **Médio:** 16px (Para parágrafos e margens entre elementos irmãos)
  - **Grande:** 32px (Para espaçamento entre blocos de conteúdo)
  - **Extra Grande:** 64px a 80px (Para separar as seções principais do site: Hero, Sobre, Habilidades, Projetos)
  - **Container Máximo:** Limitar a largura do conteúdo (ex: `max-width: 800px` ou `900px`). Como fontes mono ocupam mais espaço horizontal, manter a linha de texto controlada é essencial.

## 3. Componentes

- **Botões:**
  - **Regras gerais:** - Arredondamento (border-radius) de 4px.
    - Fonte em negrito (bold).
    - Padding (espaçamento interno) base de `12px 24px`.
    - Transição suave (transition) de `0.2s` no hover.
  - **Botão Primário (CTA do Hero):** Fundo `--primary`, texto escuro (invertido para contraste). No estado de hover, muda para a cor `--accent`.

- **Pills / Tags de Habilidades:**
  - Usados na seção "Habilidades" para substituir as barras de progresso.
  - Formato: Fundo `--secondary` com opacidade ou contorno simples (border), texto em `--text`.
  - Arredondamento de 4px e padding interno de `8px 16px`. Exibidos em formato de flexbox (wrap) lado a lado.

- **Cards de Projetos:**
  - Fundo sutilmente mais claro que o fundo da página (ou borda de 1px usando `--secondary`).
  - Arredondamento de 4px.
  - Padding interno de 24px.
  - Título em negrito, descrição de 2 linhas, seguidos pelas Tags de Tecnologias usadas (menores que as tags de habilidades) e um link/botão para o projeto.

## 4. Guia de Uso e Boas Práticas
- **CSS Variables:** Utilizar rigorosamente as variáveis de cores (`var(--nome-da-cor)`) e espaçamentos no CSS raiz.
- **Mobile-First:** Garantir que o container se adapte a telas menores (100% de largura com padding lateral de 16px em celulares).
- **Alinhamento e Estrutura:** Centralizar os elementos da seção Hero. Para as seções de texto (Sobre, Projetos), manter o alinhamento à esquerda. O alinhamento à esquerda estruturado fica visualmente muito forte com fontes monoespaçadas, lembrando a leitura estruturada de um editor de código.