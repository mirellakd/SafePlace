# 🛡️ Safe Place

> Guia gratuito, em português simples, que ajuda pessoas com pouca familiaridade digital a **reconhecer golpes na internet**, saber **o que fazer quando algo dá errado** e **aprender a usar o celular com mais segurança**.

🔗 **[Abrir o site](https://mirellakd.github.io/SafePlace/)**

**Status:** V1 no ar · conteúdo em revisão com fontes oficiais · testes com usuária real em andamento

---

## 🎯 O problema

Golpes digitais atingem principalmente quem está começando a usar tecnologia. A orientação que existe costuma ser longa, cheia de jargão e difícil de encontrar **justamente na hora do susto**. O Safe Place reúne o essencial num só lugar, com tom acolhedor e **sem culpa**: qualquer pessoa pode cair, golpista é profissional.

## ✨ O que o site tem

| Página | O que oferece |
|---|---|
| **Início** | Caminhos rápidos conforme a situação: "recebi uma mensagem estranha", "quero comprar com segurança", "acho que caí em um golpe", "quero aprender a usar o celular" |
| **Golpes** | Biblioteca de golpes comuns, com exemplo, sinais de alerta e o que fazer |
| **Compras seguras** | Checklist "Posso confiar nesta loja?" com perguntas de sim ou não antes de comprar |
| **Proteção** | Checklist de hábitos de segurança |
| **Aprender no celular** | Lições curtas passo a passo |
| **Preciso de ajuda** | Triagem para quem acabou de clicar em algo suspeito ou acha que caiu em um golpe |

**Recursos de acessibilidade:** aumentar e diminuir a letra (A− / A+), modo de alto contraste, leitura em voz alta ("Ouvir esta página"), link para pular direto ao conteúdo, botão para pausar a faixa animada e fonte escolhida pela legibilidade (Atkinson Hyperlegible).

## 🧭 Decisões de projeto

| Decisão | Por quê |
|---|---|
| **Site estático, sem login e sem banco de dados** | O conteúdo muda pouco. Menos peças significam menos falhas, custo zero e nenhum dado pessoal coletado. |
| **Preferências e progresso salvos no próprio navegador** | Sem conta nem senha para lembrar, um problema a menos para o público-alvo. |
| **Controles de leitura sempre visíveis** | A pessoa ajusta o site às suas necessidades sem precisar procurar em menus. |
| **Linguagem simples e tom sem culpa** | Quem cai em golpe costuma sentir vergonha, e isso atrasa pedir ajuda. |
| **Publicação automática (GitHub Actions + GitHub Pages)** | Cada alteração aprovada vai ao ar sozinha, sem custo. |

## 🧰 Stack

- **React**, **TypeScript** e **Vite**
- **Tailwind CSS**
- **GitHub Actions** e **GitHub Pages** (build e publicação automáticas)

## 🚀 Como rodar localmente

Requisitos: [Node.js](https://nodejs.org) (versão LTS).

```bash
git clone https://github.com/mirellakd/SafePlace.git
cd SafePlace
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## 🔒 Privacidade

O site não tem servidor próprio e não coleta nem envia dados pessoais. Preferências e respostas dos checklists ficam salvas apenas no navegador de quem usa. As fontes são carregadas do Google Fonts.

> O conteúdo é informativo e não substitui a orientação do seu banco ou das autoridades. Em caso de dúvida, use sempre o canal oficial.

## 🤖 Uso de IA no desenvolvimento

Usei IA como ferramenta de apoio, e quero deixar isso claro:

- **A IA ajudou com:** protótipo visual e código inicial (Google AI Studio), planejamento e depuração (Claude)
- **Eu fiz e decidi:** público-alvo e escopo, estrutura de conteúdo, configuração do build e da publicação, diagnóstico e correção de problemas de dependências e de caminhos no deploy, testes no navegador e no celular

## 🗺️ Roadmap

- [x] **V1:** ajuda imediata, golpes, compras seguras, proteção, lições de celular e recursos de acessibilidade
- [ ] Revisão de todo o conteúdo com fontes oficiais, com a lista de fontes no repositório
- [ ] Teste com usuária real e ajustes a partir do que ela observar
- [ ] Quiz "Isso é golpe?" e tutoriais de notebook
- [ ] Assistente com IA para analisar mensagens suspeitas, com **conjunto de teste e métricas de acerto** documentados e chave de API protegida em um backend

## 📚 O que aprendi

- **Conflito de dependências no `npm install` (`ERESOLVE`):** entendi a causa (versões incompatíveis entre pacotes) e resolvi com um arquivo `.npmrc`, que também precisa ir ao repositório para o deploy automático funcionar.
- **Site sem estilo no GitHub Pages (erro 404 nos arquivos):** diagnostiquei pelo console do navegador e corrigi o caminho base (`base`) do Vite para a publicação em subpasta.
- **Merge entre repositório local e remoto:** resolvi um conflito de `.gitignore` e removi do commit arquivos que não deviam ficar públicos.
- **Projetar para quem tem pouca familiaridade digital** muda decisões de interface, de texto e de acessibilidade.

## 👤 Autora

**Mirella** · Uniritter - Ciência da Computação
 · [GitHub](https://github.com/mirellakd)