import axios, { AxiosInstance, AxiosError } from "axios";
import type { UnifiedChatResponse, ApiError, HealthResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;
const TOKEN_KEY = "auth_token";
const SESSION_KEY = "chat_session_id";

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
          this.clearToken();
          this.clearSession();
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  clearToken(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }

  setSessionId(sessionId: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
  }

  getSessionId(): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(SESSION_KEY);
    }
    return null;
  }

  clearSession(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async healthCheck(): Promise<HealthResponse | null> {
    try {
      const response = await this.client.get<HealthResponse>("/health");
      return response.data;
    } catch {
      return null;
    }
  }

  async initUnifiedChat(): Promise<UnifiedChatResponse> {
    const response = await this.client.post<UnifiedChatResponse>("/unified/init");

    this.setSessionId(response.data.session_id);

    if (response.data.token) {
      this.setToken(response.data.token);
    }

    return response.data;
  }

  async sendUnifiedMessage(message: string): Promise<UnifiedChatResponse> {
    const sessionId = this.getSessionId();

    const response = await this.client.post<UnifiedChatResponse>("/unified/chat", {
      session_id: sessionId,
      message,
    });

    this.setSessionId(response.data.session_id);

    if (response.data.token) {
      this.setToken(response.data.token);
    }

    return response.data;
  }

  logout(): void {
    this.clearToken();
    this.clearSession();
  }
}

export const apiService = new ApiService();
export default apiService;
