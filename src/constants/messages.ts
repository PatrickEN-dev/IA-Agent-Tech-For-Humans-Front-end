export const MESSAGES = {
  WELCOME: `Ola! Bem-vindo ao Banco Agil

Sou seu assistente virtual inteligente e estou aqui para ajuda-lo.

Para comecarmos, preciso validar sua identidade.

Por favor, digite seu CPF (apenas numeros):`,

  CPF_INVALID: `CPF invalido

O CPF deve ter exatamente 11 digitos.

Por favor, digite novamente:`,

  CPF_RECEIVED: `CPF recebido!

Agora preciso confirmar sua identidade.

Por favor, digite sua data de nascimento no formato DD/MM/AAAA:`,

  BIRTHDATE_INVALID: `Data invalida

Por favor, use o formato DD/MM/AAAA.

Exemplo: 15/05/1990`,

  VALIDATING: "Validando suas informacoes...",

  AUTH_SUCCESS: `Autenticacao realizada com sucesso!

Seja bem-vindo(a)!

Como posso ajuda-lo(a) hoje?

Voce pode me pedir:
- "limite" - Consultar seu limite de credito
- "aumento" - Solicitar aumento de limite
- "cambio" - Ver cotacoes de moedas
- "perfil" - Atualizar seu perfil financeiro
- "sair" - Encerrar atendimento

Digite sua solicitacao:`,

  AUTH_FAILURE: (attempts: number) =>
    `Dados incorretos

CPF ou data de nascimento nao conferem.

Tentativas restantes: ${attempts}

${
  attempts > 0
    ? "Por favor, digite seu CPF novamente:"
    : "Acesso bloqueado. Entre em contato com o suporte pelo telefone 0800-123-4567."
}`,

  SERVER_ERROR: `Erro ao conectar com o servidor.

Por favor, verifique sua conexao e tente novamente.

Digite seu CPF para tentar novamente:`,

  LIMIT_REQUEST_PROMPT: `Solicitacao de Aumento de Limite

Qual valor de limite voce gostaria de solicitar?

Digite apenas o valor (exemplo: 20000):`,

  LIMIT_INVALID: `Valor invalido

Por favor, digite apenas o valor desejado (exemplo: 20000):`,

  LIMIT_ERROR: `Erro ao processar solicitacao de aumento.

Por favor, tente novamente mais tarde.

Posso ajudar com mais alguma coisa?`,

  INTERVIEW_START: `Atualizacao de Perfil Financeiro

Vamos atualizar suas informacoes para melhorar seu score!

Qual e sua renda mensal? (exemplo: 5000):`,

  INTERVIEW_ERROR: `Erro ao processar entrevista.

Por favor, tente novamente mais tarde.

Posso ajudar com mais alguma coisa?`,

  CREDIT_ERROR: "Erro ao consultar limite. Por favor, tente novamente.",

  EXCHANGE_ERROR: "Erro ao consultar cotacoes. Por favor, tente novamente.",

  GOODBYE: `Atendimento Encerrado

Foi um prazer atende-lo(a)!

Obrigado por usar o Banco Agil.

Ate a proxima!`,

  HELP: `Como posso ajudar?

Opcoes disponiveis:
- "limite" - Consultar seu limite de credito atual
- "aumento" - Solicitar aumento de limite
- "cambio" - Ver cotacoes de moedas (Dolar, Euro)
- "perfil" - Atualizar seu perfil financeiro
- "sair" - Encerrar atendimento

Digite o que voce precisa:`,

  NOT_UNDERSTOOD: `Nao entendi sua solicitacao.

Posso ajudar com:
- "limite" - Consultar seu limite de credito
- "aumento" - Solicitar aumento de limite
- "cambio" - Ver cotacoes de moedas
- "perfil" - Atualizar perfil financeiro
- "ajuda" - Ver todas as opcoes
- "sair" - Encerrar atendimento

O que voce gostaria de fazer?`,

  GENERIC_ERROR:
    "Desculpe, ocorreu um erro ao processar sua solicitacao. Por favor, tente novamente.",

  CONTINUE_HELP: "Posso ajudar com mais alguma coisa?",
} as const;

export const PLACEHOLDERS = {
  CPF: "Digite seu CPF (apenas numeros)...",
  BIRTHDATE: "Digite sua data (DD/MM/AAAA)...",
  LIMIT: "Digite o valor desejado...",
  INTERVIEW: "Digite sua resposta...",
  DEFAULT: "Digite sua mensagem...",
} as const;
