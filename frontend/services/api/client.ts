/**
 * Fly Ayla Centralized API Client
 *
 * Frontend: Next.js
 * Backend: Railway
 *
 * Vercel Environment Variable:
 * VITE_API_URL=https://fly-ayla.up.railway.app/api
 */

// -----------------------------------------------------
// API BASE URL
// -----------------------------------------------------

const getApiBaseUrl = (): string => {
  /**
   * IMPORTANT:
   * This project is Next.js, so import.meta.env is NOT used.
   *
   * We keep the existing VITE_API_URL variable name,
   * but read it through process.env.
   */
  const envUrl =
    typeof process !== 'undefined'
      ? process.env.VITE_API_URL
      : undefined;

  if (envUrl) {
    return envUrl
      .trim()
      .replace(/\/+$/, '')
      .replace(/\/api\/?$/, '');
  }

  /**
   * Production fallback.
   *
   * This prevents the deployed Vercel frontend from
   * accidentally calling localhost.
   */
  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'production'
  ) {
    return 'https://fly-ayla.up.railway.app';
  }

  /**
   * Local development fallback.
   */
  return 'http://127.0.0.1:5000';
};

const BASE_URL = getApiBaseUrl();

// -----------------------------------------------------
// ACCESS TOKEN
// -----------------------------------------------------

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;

  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (token) {
      localStorage.setItem(
        'fly_ayla_access_token',
        token
      );
    } else {
      localStorage.removeItem(
        'fly_ayla_access_token'
      );
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
    const savedToken = localStorage.getItem(
      'fly_ayla_access_token'
    );

    if (savedToken) {
      accessToken = savedToken;
      return savedToken;
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

const normalizeEndpoint = (
  endpoint: string
): string => {
  // Complete external URL
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  let normalizedEndpoint = endpoint.trim();

  if (!normalizedEndpoint.startsWith('/')) {
    normalizedEndpoint =
      `/${normalizedEndpoint}`;
  }

  // Add /api exactly once
  if (
    normalizedEndpoint !== '/api' &&
    !normalizedEndpoint.startsWith('/api/')
  ) {
    normalizedEndpoint =
      `/api${normalizedEndpoint}`;
  }

  return normalizedEndpoint;
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
  const normalizedEndpoint =
    normalizeEndpoint(endpoint);

  const url =
    /^https?:\/\//i.test(normalizedEndpoint)
      ? normalizedEndpoint
      : `${BASE_URL}${normalizedEndpoint}`;

  // ---------------------------------------------------
  // DEBUG
  // ---------------------------------------------------

  if (
    typeof window !== 'undefined' &&
    process.env.NODE_ENV !== 'production'
  ) {
    console.log(
      '[Fly Ayla API]',
      options.method || 'GET',
      url
    );
  }

  // ---------------------------------------------------
  // HEADERS
  // ---------------------------------------------------

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // ---------------------------------------------------
  // AUTHORIZATION
  // ---------------------------------------------------

  const currentToken = getAccessToken();

  if (
    currentToken &&
    !options.skipAuth
  ) {
    headers.Authorization =
      `Bearer ${currentToken}`;
  }

  // ---------------------------------------------------
  // FETCH OPTIONS
  // ---------------------------------------------------

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  // Remove custom option before fetch()
  delete (
    fetchOptions as RequestOptions
  ).skipAuth;

  try {
    // -------------------------------------------------
    // MAIN REQUEST
    // -------------------------------------------------

    let response = await fetch(
      url,
      fetchOptions
    );

    // -------------------------------------------------
    // TOKEN REFRESH
    // -------------------------------------------------

    if (
      response.status === 401 &&
      !options.skipAuth &&
      !normalizedEndpoint.includes(
        '/auth/login'
      ) &&
      !normalizedEndpoint.includes(
        '/auth/register'
      ) &&
      !normalizedEndpoint.includes(
        '/auth/refresh'
      )
    ) {
      try {
        const refreshUrl =
          `${BASE_URL}/api/auth/refresh`;

        const refreshResponse =
          await fetch(refreshUrl, {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            credentials: 'include',
          });

        if (refreshResponse.ok) {
          const refreshData =
            await refreshResponse.json();

          if (
            refreshData.success &&
            refreshData.data?.accessToken
          ) {
            setAccessToken(
              refreshData.data.accessToken
            );

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

    const data =
      await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message:
          data.message ||
          data.error ||
          `Request failed with status ${response.status}`,
        error:
          data.error ||
          data.message,
      };
    }

    return data;
  } catch (error: any) {
    const isNetworkError =
      error?.message?.includes(
        'Failed to fetch'
      ) ||
      error?.name === 'TypeError' ||
      error?.message?.includes(
        'NetworkError'
      );

    return {
      success: false,
      message: isNetworkError
        ? 'Unable to connect to Fly Ayla flight servers. Please check your network connection.'
        : error?.message ||
          'Network connection failed',
      error: error?.message,
    };
  }
}

// -----------------------------------------------------
// GET
// -----------------------------------------------------

export const apiGet = <T = any>(
  endpoint: string,
  options: RequestOptions = {}
) => {
  return apiClient<T>(
    endpoint,
    {
      ...options,
      method: 'GET',
    }
  );
};

// -----------------------------------------------------
// POST
// -----------------------------------------------------

export const apiPost = <T = any>(
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
) => {
  return apiClient<T>(
    endpoint,
    {
      ...options,
      method: 'POST',
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }
  );
};

// -----------------------------------------------------
// PUT
// -----------------------------------------------------

export const apiPut = <T = any>(
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
) => {
  return apiClient<T>(
    endpoint,
    {
      ...options,
      method: 'PUT',
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }
  );
};

// -----------------------------------------------------
// PATCH
// -----------------------------------------------------

export const apiPatch = <T = any>(
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
) => {
  return apiClient<T>(
    endpoint,
    {
      ...options,
      method: 'PATCH',
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    }
  );
};

// -----------------------------------------------------
// DELETE
// -----------------------------------------------------

export const apiDelete = <T = any>(
  endpoint: string,
  options: RequestOptions = {}
) => {
  return apiClient<T>(
    endpoint,
    {
      ...options,
      method: 'DELETE',
    }
  );
};
