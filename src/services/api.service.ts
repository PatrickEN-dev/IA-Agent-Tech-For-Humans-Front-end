import axios, { AxiosInstance, AxiosError } from "axios";
import toast from "react-hot-toast";
import type {
  AuthRequest,
  AuthResponse,
  ChatRequest,
  ChatResponse,
  CreditLimitResponse,
  LimitIncreaseRequest,
  LimitIncreaseResponse,
  InterviewRequest,
  InterviewResponse,
  ExchangeRateResponse,
  APIError,
} from "@/types/api";

const API_BASE_URL = "/api";
const TOKEN_KEY = "banco_agil_token";

class ApiService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
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
      (error: AxiosError<APIError>) => {
        if (error.response?.status === 401) {
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError | Error): void {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
        errorMessage = "Servidor indisponível. Verifique se o backend está rodando.";
      } else if (error.response?.status === 404) {
        errorMessage = "Recurso não encontrado";
      } else if (error.response?.status === 401) {
        errorMessage = "Não autorizado";
      } else if (error.response?.status === 500) {
        errorMessage = "Erro interno do servidor";
      } else {
        errorMessage = error.response?.data?.message || "Erro na requisição";
      }
    } else {
      errorMessage = error.message || "Erro desconhecido";
    }

    toast.error(errorMessage);
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async authenticate(data: AuthRequest): Promise<AuthResponse | null> {
    try {
      const response = await this.client.post<AuthResponse>("/triage/authenticate", data);

      if (response.data.authenticated && response.data.token) {
        this.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      return null;
    }
  }

  async sendChatMessage(data: ChatRequest): Promise<ChatResponse | null> {
    try {
      const response = await this.client.post<ChatResponse>("/chat", data);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      return null;
    }
  }

  async getCreditLimit(): Promise<CreditLimitResponse | null> {
    try {
      const response = await this.client.get<CreditLimitResponse>("/credit/limit");
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      return null;
    }
  }

  async requestLimitIncrease(data: LimitIncreaseRequest): Promise<LimitIncreaseResponse | null> {
    try {
      const response = await this.client.post<LimitIncreaseResponse>(
        "/credit/request_increase",
        data
      );
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      return null;
    }
  }

  async submitInterview(data: InterviewRequest): Promise<InterviewResponse | null> {
    try {
      const response = await this.client.post<InterviewResponse>("/interview/submit", data);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      return null;
    }
  }

  async getExchangeRate(from: string, to: string): Promise<ExchangeRateResponse | null> {
    try {
      const response = await this.client.get<ExchangeRateResponse>("/exchange", {
        params: { from, to },
      });
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
      return null;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
