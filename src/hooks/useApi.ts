"use client";

import { useCallback } from "react";
import axios, { AxiosInstance, AxiosError } from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "/api/backend";

interface ApiResult<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export const useApi = () => {
  const client: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleError = useCallback((error: AxiosError | Error): string => {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
        return "Servidor indisponível. Verifique se o backend está rodando.";
      }
      if (error.response?.status === 404) {
        return "Recurso não encontrado";
      }
      if (error.response?.status === 401) {
        return "Não autorizado";
      }
      if (error.response?.status === 500) {
        return "Erro interno do servidor";
      }
      return error.response?.data?.message || "Erro na requisição";
    }
    return error.message || "Erro desconhecido";
  }, []);

  const get = useCallback(
    async <T>(url: string): Promise<ApiResult<T>> => {
      try {
        const response = await client.get<T>(url);
        return {
          data: response.data,
          success: true,
        };
      } catch (error) {
        const errorMessage = handleError(error as AxiosError);
        toast.error(errorMessage);
        return {
          error: errorMessage,
          success: false,
        };
      }
    },
    [client, handleError]
  );

  const post = useCallback(
    async <T>(url: string, data?: any): Promise<ApiResult<T>> => {
      try {
        const response = await client.post<T>(url, data);
        return {
          data: response.data,
          success: true,
        };
      } catch (error) {
        const errorMessage = handleError(error as AxiosError);
        toast.error(errorMessage);
        return {
          error: errorMessage,
          success: false,
        };
      }
    },
    [client, handleError]
  );

  const put = useCallback(
    async <T>(url: string, data?: any): Promise<ApiResult<T>> => {
      try {
        const response = await client.put<T>(url, data);
        return {
          data: response.data,
          success: true,
        };
      } catch (error) {
        const errorMessage = handleError(error as AxiosError);
        toast.error(errorMessage);
        return {
          error: errorMessage,
          success: false,
        };
      }
    },
    [client, handleError]
  );

  const del = useCallback(
    async <T>(url: string): Promise<ApiResult<T>> => {
      try {
        const response = await client.delete<T>(url);
        return {
          data: response.data,
          success: true,
        };
      } catch (error) {
        const errorMessage = handleError(error as AxiosError);
        toast.error(errorMessage);
        return {
          error: errorMessage,
          success: false,
        };
      }
    },
    [client, handleError]
  );

  const setAuthToken = useCallback(
    (token: string) => {
      client.defaults.headers.Authorization = `Bearer ${token}`;
    },
    [client]
  );

  const clearAuthToken = useCallback(() => {
    delete client.defaults.headers.Authorization;
  }, [client]);

  return {
    get,
    post,
    put,
    del,
    setAuthToken,
    clearAuthToken,
  };
};
