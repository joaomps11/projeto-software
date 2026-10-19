# Portal de Extensão UNICAP — Arquitetura do Front-end

Guia rápido para desenvolver neste projeto. Consulte também `../PROJECT_BRAIN.md`
(índice geral em wikilinks), `../SPRINT_PLAN.md` (roteiro) e `../DESIGN.md` (design system).

## Stack

- **Vite + React 18 (JSX, sem TS)** — build e dev server.
- **React Router v6** — roteamento; sessão mock em `SessionContext`.
- **Tailwind CSS** com tokens Material 3 (`index.html` define as CSS vars; `tailwind.config.js` mapeia cores/fontes).
- **Vitest + Testing Library** — testes de unidade e componente.
- **ESLint (flat config) + Prettier** — qualidade e formatação.

## Estrutura por módulos

```text
src/
  components/
    ui/            # Design system compartilhado (Button, Badge, Card, Input,
                   #   Modal, Icons, ErrorBoundary). Nada de regra de negócio aqui.
    layout/        # AppLayout (shell autenticado: header, nav, footer)
  contexts/        # SessionContext — perfil, login/logout, rotas
  modules/         # Um diretório por domínio, autocontido:
    auth/                  # LoginForm (fluxo de acesso por perfil)
    public/                # Vitrine pública
    project-submission/    # Fluxo docente de submissão em etapas
    project-tracking/      # Acompanhamento (frequência, marcos, relatórios)
    manager-dashboard/     # Painel gestor (KPIs, filtros, prazos)
    settings/              # Configurações da conta (perfil, notificações, privacidade)
  utils/           # format.js — formatação pt-BR; download.js — exportação CSV/TXT
  App.jsx          # Rotas, proteção por perfil e wrapper da vitrine autenticada
```

### Anatomia de um módulo

Cada módulo segue o mesmo padrão (facilita manutenção e onboarding):

```text
modules/<nome>/
  data/            # Dados mock centralizados (troca futura por API)
  hooks/           # Estado local reutilizável (ex.: useSubmissionDraft)
  components/      # Componentes de apresentação do domínio
  <NomeModulo>.jsx # Orquestrador (composição + estado de página)
  logic|validation # Regras de negócio PURAS (sem React) — testáveis direto
  *.test.jsx|js    # Testes do módulo
```

**Regra de ouro:** regra de negócio vive em funções puras; componentes apenas
renderizam e delegam. Isso mantém os testes rápidos e o código previsível.

## Convenções

- **Componentes:** `PascalCase.jsx`, default export, `PropTypes` explícitos.
- **Funções/variáveis:** `camelCase`; dados em `kebab` não são usados no código.
- **Ícones:** sempre de `components/ui/Icons.jsx` (named exports) — nunca SVG inline novo.
- **Modal:** use `components/ui/Modal.jsx` (Escape, backdrop, scroll lock, foco) — não crie overlay manual.
- **Formatação:** `Intl.NumberFormat`/`DateTimeFormat` pt-BR via `utils/format.js`.
- **Exportações:** CSV/TXT via `utils/download.js` (`toCsv` + `downloadTextFile`), com o
  conteúdo montado por funções puras no `logic` do módulo (ex.: `buildProjectsCsv`,
  `buildFrequencyCsv`) — testáveis sem tocar na UI.
- **Estilos:** só classes Tailwind com tokens do design system; sem cores fixas fora do tema.
- **Acessibilidade:** `aria-label` em controles icônicos, `aria-current` em paginação/stepper,
  `role="status"` para contadores dinâmicos, foco visível preservado.

## Comandos

```bash
bun install            # instalar dependências
bun run dev            # servidor de desenvolvimento
bun run test           # vitest em modo watch
bun run test -- --run  # rodar toda a suíte uma vez
bun run lint           # eslint (deve terminar sem erros)
bun run build          # build de produção (dist/)
```

## Qualidade (critério de "pronto")

1. Escopo implementado seguindo a anatomia de módulo.
2. Regras críticas cobertas por testes (unidade para lógica, componente para UI).
3. `bun run test -- --run`, `bun run lint` e `bun run build` todos verdes.
4. Sem regressão de acessibilidade básica (labels, contraste, foco).
5. Documentação do módulo atualizada no `PROJECT_BRAIN.md` quando o escopo muda.
