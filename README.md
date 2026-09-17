# Banco Ágil - Front-end do Assistente Virtual

Interface de chat (Next.js 14 + Tailwind) para o agente bancário do
[back-end](https://github.com/PatrickEN-dev/IA-Agent-Tech-For-Humans-Back-end).

Produção: https://ia-agent-tech-for-humans-frontend.vercel.app/

## Como funciona

- Toda a conversa passa pelos endpoints `POST /api/unified/init` e `POST /api/unified/chat` do back-end.
- O Next.js faz proxy de `/api/*` para `BACKEND_URL` (ver `next.config.mjs`), evitando CORS.
- O back-end devolve `state`, `available_actions` e `redirect_suggestion`; o front usa isso para:
  - mostrar **respostas rápidas** clicáveis (menu após login, sim/não em ofertas, moedas, tipo de emprego);
  - oferecer o chip **"Cancelar"** enquanto um fluxo de coleta está aberto (`available_actions` inclui `cancelar`);
  - trocar o placeholder e o teclado (`inputMode`) conforme a etapa (CPF, valores, data);
  - exibir o botão "Iniciar novo atendimento" ao encerrar.
- Erros HTTP viram mensagens amigáveis no chat (inclusive o `detail` em lista dos erros 422).
- O primeiro acesso tolera o cold start do back-end no Render: timeout de 60 s, até 3 tentativas
  e um aviso "o assistente está iniciando".

## Interface

- Cartão de chat centralizado no desktop e tela cheia no celular; tema claro/escuro automático
  (`prefers-color-scheme`) via tokens de cor em `globals.css`, sem variantes `dark:` nos componentes.
- Mensagens agrupadas por autor com um avatar e um horário por grupo; linhas "Rótulo: valor" do
  back-end (limite, score, cotação) viram cartões de dados.
- Barra de progresso das etapas (identificação, entrevista, câmbio), chips com ícones, estado de
  conexão no cabeçalho, saudação com o nome do cliente e tela de encerramento.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # BACKEND_URL=http://localhost:8000
npm run dev                  # http://localhost:3000
```

O back-end precisa estar rodando em `BACKEND_URL` (`python app.py` no repositório do back-end).

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `BACKEND_URL` | `http://localhost:8000` | URL do back-end (usada pelo proxy do Next) |
| `NEXT_PUBLIC_API_URL` | `/api` | Base das chamadas no browser (mantém o proxy) |
| `NEXT_PUBLIC_API_TIMEOUT` | `30000` | Timeout das mensagens em ms (o init usa no mínimo 60 s) |

## Scripts

```bash
npm run dev     # desenvolvimento
npm run lint    # eslint
npm run build   # build de produção (também valida os tipos)
```

## Estrutura

```
src/
├── app/                 # layout e página única
├── components/chat/     # ChatContainer, ChatHeader, ChatMessages, ChatFooter, FlowProgress, QuickReplies, ChatInput
├── components/ui/       # primitivos (Button, Avatar, BrandMark)
├── lib/utils.ts         # cn, ids, formatação de hora e de erros da API
├── hooks/useChat.ts     # estado da conversa, init com retry, envio de mensagens
├── services/api.service.ts  # axios + sessão em sessionStorage
└── types/               # contratos da API (estados iguais aos do back-end)
```
