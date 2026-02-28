import axios, { AxiosRequestConfig } from "axios";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiBaseUrl = rawBaseUrl.replace(/\/+$/, "");

export function buildApiUrl(path: string): string {
  const cleanPath = path.replace(/^\/+/, "");
  return `${apiBaseUrl}/${cleanPath}`;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  isFormData?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = buildApiUrl(path);

  const headers: Record<string, string> = {};
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }
  if (!options.isFormData && options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const config: AxiosRequestConfig = {
    method: options.method ?? "GET",
    url,
    headers,
    data: options.body,
  };

  try {
    const response = await axios<T>(config);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const detail = err.response.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : `Request failed with status ${err.response.status}`;
      throw new Error(message);
    }
    throw err;
  }
}
