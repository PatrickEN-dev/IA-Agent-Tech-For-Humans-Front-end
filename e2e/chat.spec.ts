import { expect, test, type Page } from "@playwright/test";

/**
 * E2E com a API mockada.
 *
 * As respostas são fixtures, não o back-end real: assim este teste roda no CI deste
 * repositório sem clonar o outro. O que ele protege é o contrato do front — se um
 * campo da resposta mudar de nome, o teste quebra aqui e não em produção.
 */

const PERSONAS = {
  demo_mode: true,
  signup_enabled: true,
  aviso: "Ambiente de demonstração com dados fictícios. Não use seu CPF real.",
  personas: [
    {
      id: "52998224725",
      nome: "Maria Helena Santos",
      primeiro_nome: "Maria",
      cpf: "52998224725",
      cpf_formatado: "529.982.247-25",
      data_nascimento: "1990-05-15",
      score: 315,
      limite_atual: 500,
      max_limit_for_score: 1000,
      perfil: "Score 315 · limite R$ 500,00 · teto R$ 1.000,00",
    },
  ],
};

const INIT_RESPONSE = {
  session_id: "sessao-de-teste",
  message: "Olá! Bem-vindo ao Banco Ágil!\n\nQual é o seu CPF?",
  state: "collecting_cpf",
  authenticated: false,
  current_agent: "triage",
  available_actions: [],
};

const LOGIN_RESPONSE = {
  session_id: "sessao-de-teste",
  message: "Você entrou como Maria Helena Santos (cliente de demonstração).",
  state: "authenticated",
  authenticated: true,
  token: "token-de-teste",
  user_name: "Maria",
  current_agent: "triage",
  available_actions: ["consultar_limite", "solicitar_aumento", "cotacao_cambio", "atualizar_perfil"],
};

const LIMIT_RESPONSE = {
  session_id: "sessao-de-teste",
  message: "Seu limite atual: R$ 500,00\nScore: 315\nTeto para esse score: R$ 1.000,00",
  state: "authenticated",
  authenticated: true,
  user_name: "Maria",
  current_agent: "credit",
  available_actions: ["consultar_limite", "solicitar_aumento", "cotacao_cambio", "atualizar_perfil"],
};

async function mockApi(page: Page) {
  await page.route("**/api/unified/session/**", (route) =>
    route.fulfill({ status: 404, json: { detail: "Sessão não encontrada" } })
  );
  await page.route("**/api/demo/personas", (route) => route.fulfill({ json: PERSONAS }));
  await page.route("**/api/unified/init", (route) => route.fulfill({ json: INIT_RESPONSE }));
  await page.route("**/api/unified/demo-login", (route) => route.fulfill({ json: LOGIN_RESPONSE }));
  await page.route("**/api/unified/chat", (route) => route.fulfill({ json: LIMIT_RESPONSE }));
}

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test("o visitante entra em um clique, sem conhecer nenhum CPF", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Qual é o seu CPF?")).toBeVisible();

  const entrar = page.getByRole("button", { name: /Maria Helena Santos/ });
  await expect(entrar.first()).toBeVisible();
  await entrar.first().click();

  await expect(page.getByText(/cliente de demonstração/)).toBeVisible();

  await page.getByRole("button", { name: "Consultar limite" }).first().click();
  await expect(page.getByText(/R\$ 500,00/).first()).toBeVisible();
});

test("o aviso de dados fictícios aparece antes da identificação", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Não use seu CPF real/)).toBeVisible();
});

test("o seletor de personas também funciona no celular", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  // No celular não há painel lateral: o chip é a única porta de entrada visível.
  const chip = page.getByRole("button", { name: /Entrar como Maria/ });
  await expect(chip).toBeVisible();
  await chip.click();

  await expect(page.getByText(/cliente de demonstração/)).toBeVisible();
});

test("a máscara de CPF é aplicada enquanto o cliente digita", async ({ page }) => {
  await page.goto("/");

  const campo = page.getByRole("textbox", { name: "Mensagem" });
  await campo.fill("");
  await campo.pressSequentially("52998224725", { delay: 10 });

  await expect(campo).toHaveValue("529.982.247-25");
});

test("o chat continua utilizável quando a demonstração está desligada", async ({ page }) => {
  await page.route("**/api/demo/personas", (route) => route.fulfill({ status: 404, json: {} }));
  await page.goto("/");

  await expect(page.getByText("Qual é o seu CPF?")).toBeVisible();
  await expect(page.getByRole("button", { name: /Entrar como/ })).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "Mensagem" })).toBeEnabled();
});
