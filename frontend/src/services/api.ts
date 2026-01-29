const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      // Add default headers here if needed (e.g. 'Content-Type': 'application/json')
      // For FormData, we let the browser set Content-Type automatically
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        // Try to parse error message from JSON response
        let errorMessage = 'Network response was not ok';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // If parsing fails, use default or status text
            errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    
    const headers = options?.headers || {};
    // Only set JSON content type if it's not FormData
    if (!isFormData && !(headers as Record<string, string>)['Content-Type']) {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
    }

    return this.request<T>(endpoint, { ...options, method: 'POST', body, headers });
  }

  put<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
    const isFormData = body instanceof FormData;
    const headers = options?.headers || {};
    if (!isFormData && !(headers as Record<string, string>)['Content-Type']) {
         (headers as Record<string, string>)['Content-Type'] = 'application/json';
         body = JSON.stringify(body);
    }
    return this.request<T>(endpoint, { ...options, method: 'PUT', body, headers });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiService(API_URL);
