/**
 * Fly Ayla Centralized API Client
 *
 * Frontend: Next.js
 * Backend: Railway
 *
 * Environment variable:
 * NEXT_PUBLIC_API_URL=https://fly-ayla.up.railway.app/api
 */

// -----------------------------------------------------
// API BASE URL
// -----------------------------------------------------

const getApiBaseUrl = () => {
  // Next.js public environment variable
  const envUrl =
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_API_URL
      : undefined;

  if (envUrl) {
    return envUrl.replace(/\/api\/?$/, '');
  }

  // Server-side fallback for local development
  if (
    typeof process !== 'undefined' &&
    process.env.INTERNAL_API_URL
  ) {
    return process.env.INTERNAL_API_URL.replace(/\/api\/?$/, '');
  }

  // Local backend fallback
  return 'http://127.0.0.1:5000';
};

const BASE_URL = getApiBaseUrl();

// -----------------------------------------------------
// ACCESS TOKEN
// -----------------------------------------------------

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;

  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (token) {
      localStorage.setItem('fly_ayla_access_token', token);
    } else {
      localStorage.removeItem('fly_ayla_access_token');
    }
  } catch {
    // Ignore localStorage errors
  }
};

export const getAccessToken = (): string | null => {
  if (accessToken) {
    return accessToken;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const saved = localStorage.getItem('fly_ayla_access_token');

    if (saved) {
      accessToken = saved;
      return saved;
    }
  } catch {
    // Ignore localStorage errors
  }

  return null;
};

// -----------------------------------------------------
// REQUEST OPTIONS
// -----------------------------------------------------

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

// -----------------------------------------------------
// ENDPOINT NORMALIZER
// -----------------------------------------------------

const normalizeEndpoint = (endpoint: string): string => {
  // Absolute URL
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  let normalized = endpoint.trim();

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  // Add /api only if it is not already present
  if (!normalized.startsWith('/api/')) {
    normalized = `/api${normalized}`;
  }

  return normalized;
};

// -----------------------------------------------------
// API CLIENT
// -----------------------------------------------------

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}> {
  const normalizedEndpoint = normalizeEndpoint(endpoint);

  // Build final URL
  const url = /^https?:\/\//i.test(normalizedEndpoint)
    ? normalizedEndpoint
    : `${BASE_URL}${normalizedEndpoint}`;

  // ---------------------------------------------------
  // HEADERS
  // ---------------------------------------------------

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // ---------------------------------------------------
  // AUTH TOKEN
  // ---------------------------------------------------

  const currentToken = getAccessToken();

  if (currentToken && !options.skipAuth) {
    headers.Authorization = `Bearer ${currentToken}`;
  }

  // ---------------------------------------------------
  // FETCH OPTIONS
  // ---------------------------------------------------

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  // Remove custom property before passing to fetch
  delete (fetchOptions as RequestOptions).skipAuth;

  try {
    // -------------------------------------------------
    // MAIN REQUEST
    // -------------------------------------------------

    let response = await fetch(url, fetchOptions);

    // -------------------------------------------------
    // SILENT TOKEN REFRESH
    // -------------------------------------------------

    if (
      response.status === 401 &&
      !options.skipAuth &&
      !normalizedEndpoint.includes('/auth/login') &&
      !normalizedEndpoint.includes('/auth/register') &&
      !normalizedEndpoint.includes('/auth/refresh')
    ) {
      try {
        const refreshUrl = `${BASE_URL}/api/auth/refresh`;

        const refreshRes = await fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();

          if (
            refreshData.success &&
            refreshData.data?.accessToken
          ) {
            setAccessToken(refreshData.data.accessToken);

            headers.Authorization =
              `Bearer ${refreshData.data.accessToken}`;

            response = await fetch(url, {
              ...fetchOptions,
              headers,
            });
          }
        } else {
          setAccessToken(null);
        }
      } catch {
        setAccessToken(null);
      }
    }

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          data.error ||
          `Request failed with status ${response.status}`,
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
        : error?.message || 'Network connection failed',
      error: error?.message,
    };
  }
}

// -----------------------------------------------------
// OPTIONAL HTTP HELPERS
// -----------------------------------------------------

export const apiGet = <T = any>(
  endpoint: string,
  options: RequestOptions = {}
) => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'GET',
  });
};

export const apiPost = <T = any>(
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
) => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
};

export const apiPut = <T = any>(
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
) => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
};

export const apiPatch = <T = any>(
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
) => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
};

export const apiDelete = <T = any>(
  endpoint: string,
  options: RequestOptions = {}
) => {
  return apiClient<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
};
