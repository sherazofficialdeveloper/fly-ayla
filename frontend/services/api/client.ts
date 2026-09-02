/**
 * Fly Ayla Centralized API Client
 */

const getApiBaseUrl = () => {
  // If running in browser, relative path "" allows Next.js rewrite proxy to forward to backend port 5000
  if (typeof window !== 'undefined') {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && envUrl.startsWith('https://')) {
      return envUrl.replace(/\/api\/?$/, '');
    }
    return '';
  }

  // Server-side inside Next.js (SSR / API routes if any)
  if (typeof process !== 'undefined' && process.env?.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL.replace(/\/api\/?$/, '');
  }
  return 'http://127.0.0.1:5000';
};

const BASE_URL = getApiBaseUrl();

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    try {
      localStorage.setItem('fly_ayla_access_token', token);
    } catch {
      // ignore
    }
  } else {
    try {
      localStorage.removeItem('fly_ayla_access_token');
    } catch {
      // ignore
    }
  }
};

export const getAccessToken = (): string | null => {
  if (accessToken) return accessToken;
  try {
    const saved = localStorage.getItem('fly_ayla_access_token');
    if (saved) {
      accessToken = saved;
      return saved;
    }
  } catch {
    // ignore
  }
  return null;
};

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  // Normalize endpoint
  let normalizedEndpoint = endpoint;
  if (!normalizedEndpoint.startsWith('http')) {
    if (!normalizedEndpoint.startsWith('/')) {
      normalizedEndpoint = `/${normalizedEndpoint}`;
    }
    if (!normalizedEndpoint.startsWith('/api')) {
      normalizedEndpoint = `/api${normalizedEndpoint}`;
    }
  }

  const url = normalizedEndpoint.startsWith('http')
    ? normalizedEndpoint
    : `${BASE_URL}${normalizedEndpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const currentToken = getAccessToken();
  if (currentToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // include cookies for refresh tokens
  };

  try {
    let response = await fetch(url, fetchOptions);

    // If 401, attempt silent token refresh once (unless it's an auth endpoint itself)
    if (
      response.status === 401 &&
      !options.skipAuth &&
      !normalizedEndpoint.includes('/auth/login') &&
      !normalizedEndpoint.includes('/auth/register') &&
      !normalizedEndpoint.includes('/auth/refresh')
    ) {
      try {
        const refreshUrl = BASE_URL ? `${BASE_URL}/api/auth/refresh` : '/api/auth/refresh';
        const refreshRes = await fetch(refreshUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.success && refreshData.data?.accessToken) {
            setAccessToken(refreshData.data.accessToken);
            headers['Authorization'] = `Bearer ${refreshData.data.accessToken}`;
            response = await fetch(url, { ...fetchOptions, headers });
          }
        } else {
          setAccessToken(null);
        }
      } catch {
        setAccessToken(null);
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.error || `Request failed with status ${response.status}`,
        error: data.error || data.message,
      };
    }

    return data;
  } catch (error: any) {
    const isNetwork =
      error?.message?.includes('Failed to fetch') ||
      error?.name === 'TypeError' ||
      error?.message?.includes('NetworkError');

    return {
      success: false,
      message: isNetwork
        ? 'Unable to connect to Fly Ayla flight servers. Please check your network connection.'
        : (error.message || 'Network connection failed'),
      error: error.message,
    };
  }
}
