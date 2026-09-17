# Banco Ágil - Front-end do Assistente Virtual

Interface de chat (Next.js 14 + Tailwind) para o agente bancário do
[back-end](https://github.com/PatrickEN-dev/IA-Agent-Tech-For-Humans-Back-end).

Produção: https://ia-agent-tech-for-humans-frontend.vercel.app/

## Como funciona

- Toda a conversa passa pelos endpoints `POST /api/unified/init` e `POST /api/unified/chat` do back-end.
- O Next.js faz proxy de `/api/*` para `BACKEND_URL` (ver `next.config.mjs`), evitando CORS.
- O back-end devolve `state`, `available_actions` e `redirect_suggestion`; o front usa isso para:
  - mostrar **respostas rápidas** clicáveis (menu após login, sim/não em ofertas, moedas, tipo de emprego);
  - trocar o placeholder e o teclado (`inputMode`) conforme a etapa (CPF, valores, data);
  - exibir o botão "Iniciar novo atendimento" ao encerrar.
- O primeiro acesso tolera o cold start do back-end no Render: timeout de 60 s, até 3 tentativas
  e um aviso "o assistente está iniciando".

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
├── components/chat/     # ChatContainer, ChatMessages, ChatFooter, QuickReplies, ChatInput...
├── components/ui/       # primitivos (Button, Input, Avatar...)
├── hooks/useChat.ts     # estado da conversa, init com retry, envio de mensagens
├── services/api.service.ts  # axios + sessão em sessionStorage
└── types/               # contratos da API (estados iguais aos do back-end)
```
