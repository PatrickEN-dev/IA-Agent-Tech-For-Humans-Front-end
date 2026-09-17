import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  UnifiedChatResponse,
  ApiError,
  DemoPersonasResponse,
  SessionSnapshot,
  SignupRequest,
  SignupResponse,
  SuggestedCpfResponse,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;
// O backend no plano free do Render dorme apos 15 min; a primeira chamada pode levar ~1 min.
const INIT_TIMEOUT = Math.max(API_TIMEOUT, 60000);
const TOKEN_KEY = "auth_token";
const SESSION_KEY = "chat_session_id";

function storageGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // Navegacao privada ou storage bloqueado: a conversa segue so em memoria.
  }
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  getToken(): string | null {
    return storageGet(TOKEN_KEY);
  }

  getSessionId(): string | null {
    return storageGet(SESSION_KEY);
  }

  private remember(response: UnifiedChatResponse): void {
    storageSet(SESSION_KEY, response.session_id);
    if (response.token) {
      storageSet(TOKEN_KEY, response.token);
    }
  }

  /**
   * Retoma a conversa de uma sessao anterior, se ela ainda existir no servidor.
   *
   * Chamado antes do `init` no carregamento da pagina: sem isso, um F5 descarta a
   * conversa inteira e o cliente precisa se identificar de novo.
   */
  async resumeSession(): Promise<SessionSnapshot | null> {
    const sessionId = this.getSessionId();
    if (!sessionId) return null;

    try {
      const response = await this.client.get<SessionSnapshot>(
        `/unified/session/${encodeURIComponent(sessionId)}`
      );
      return response.data;
    } catch {
      // 404 (sessao expirada) ou servidor reiniciado: segue para o init normal.
      return null;
    }
  }

  /** Personas de demonstracao. Devolve null fora do modo demo (o back-end responde 404). */
  async getPersonas(): Promise<DemoPersonasResponse | null> {
    try {
      const response = await this.client.get<DemoPersonasResponse>("/demo/personas");
      return response.data;
    } catch {
      return null;
    }
  }

  /**
   * Entra como uma persona em uma unica chamada.
   *
   * Nao e o mesmo que enviar CPF e data como duas mensagens: isso exibiria o CPF como
   * se o visitante o tivesse digitado e deixaria a sessao pela metade se a segunda
   * chamada falhasse.
   */
  async demoLogin(personaId: string): Promise<UnifiedChatResponse> {
    const response = await this.client.post<UnifiedChatResponse>("/unified/demo-login", {
      session_id: this.getSessionId(),
      persona_id: personaId,
    });

    this.remember(response.data);
    return response.data;
  }

  async suggestCpf(): Promise<SuggestedCpfResponse> {
    const response = await this.client.get<SuggestedCpfResponse>("/signup/suggested-cpf");
    return response.data;
  }

  async signup(payload: SignupRequest): Promise<SignupResponse> {
    const response = await this.client.post<SignupResponse>("/signup", payload);
    return response.data;
  }

  async initUnifiedChat(): Promise<UnifiedChatResponse> {
    // Sessao nova: descarta token/sessao anteriores para nao enviar credencial velha.
    this.logout();

    const response = await this.client.post<UnifiedChatResponse>("/unified/init", undefined, {
      timeout: INIT_TIMEOUT,
    });

    this.remember(response.data);
    return response.data;
  }

  async sendUnifiedMessage(message: string): Promise<UnifiedChatResponse> {
    const response = await this.client.post<UnifiedChatResponse>("/unified/chat", {
      session_id: this.getSessionId(),
      message,
    });

    this.remember(response.data);
    return response.data;
  }

  logout(): void {
    storageSet(TOKEN_KEY, null);
    storageSet(SESSION_KEY, null);
  }
}

export const apiService = new ApiService();
export default apiService;
