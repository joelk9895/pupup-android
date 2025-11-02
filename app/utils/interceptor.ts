import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// const BASE_URL = 'https://pupup-backend-72w39.ondigitalocean.app';
const BASE_URL = 'https://lobster-app-2z8q5.ondigitalocean.app';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type LoginResponse = {
  id: number;
  email: string;
  name: string;
  profile_img: string;
  description: string;
  insta_link: string;
  tiktok_link: string;
  onboarding_questions: Record<string, any>;
  is_breeder: boolean;
  token: string;
};

export type ErrorResponse = { detail: string };

export type UploadResponse = { img_url: string };

export class APIError extends Error {
  public status?: number;
  public original?: any;

  constructor(message: string, status?: number, original?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.original = original;
  }
}


const forceLogoutSubscribers = new Set<() => void>();
export function onForceLogout(cb: () => void) {
  forceLogoutSubscribers.add(cb);
  return () => forceLogoutSubscribers.delete(cb);
}
function emitForceLogout() {
  forceLogoutSubscribers.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.warn('forceLogout subscriber error', e);
    }
  });
}

async function getAuthToken(provided?: string | null): Promise<string | null> {
  if (provided) return provided;
  try {
    const t = await AsyncStorage.getItem('auth_token');
    return t;
  } catch (e) {
    return null;
  }
}

function buildUrl(endpoint: string, params?: Record<string, any>) {
  const url = `${BASE_URL}/${endpoint.replace(/^\/+/, '')}`;
  if (!params || Object.keys(params).length === 0) return url;
  const esc = encodeURIComponent;
  const query = Object.entries(params)
    .map(([k, v]) => `${esc(k)}=${esc(String(v))}`)
    .join('&');
  return `${url}?${query}`;
}

async function parseJsonSafe<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn('JSON parse error', err);
    throw new APIError(`Invalid JSON response: ${text}`, response.status, text);
  }
}

async function request<T>(
  endpoint: string,
  method: HTTPMethod,
  params?: Record<string, any> | null,
  authToken?: string | null
): Promise<T> {
  const token = await getAuthToken(authToken ?? null);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isQuery = method === 'GET' || method === 'DELETE';
  const url = isQuery ? buildUrl(endpoint, (params as Record<string, any>) ?? undefined) : `${BASE_URL}/${endpoint.replace(/^\/+/, '')}`;

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (!isQuery && params) {
    fetchOptions.body = JSON.stringify(params);
  }

  const res = await fetch(url, fetchOptions);

  if (res.status === 401) {
    console.warn('401 - Unauthorized. Emitting forceLogout.');
    emitForceLogout();
  }

  if (!res.ok) {
    let parsed: any = null;
    try {
      parsed = await parseJsonSafe<any>(res);
    } catch (parseErr) {
      throw parseErr;
    }

    if (parsed && parsed.detail) {
      throw new APIError(parsed.detail, res.status, parsed);
    }

    throw new APIError(parsed ? JSON.stringify(parsed) : res.statusText, res.status, parsed);
  }

  return parseJsonSafe<T>(res);
}

export async function apiGet<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  return request<T>(endpoint, 'GET', params);
}
export async function apiPost<T>(endpoint: string, body?: Record<string, any>, authToken?: string | null): Promise<T> {
  return request<T>(endpoint, 'POST', body ?? null, authToken ?? null);
}
export async function apiPut<T>(endpoint: string, body?: Record<string, any>, authToken?: string | null): Promise<T> {
  return request<T>(endpoint, 'PUT', body ?? null, authToken ?? null);
}
export async function apiDelete<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  return request<T>(endpoint, 'DELETE', params ?? null);
}


export async function uploadImage(
  image: { uri: string; name?: string; type?: string },
  authToken?: string | null
): Promise<UploadResponse> {
  const token = await getAuthToken(authToken ?? null);
  const url = `${BASE_URL}/admin/upload-image`;

  const form = new FormData();
  const filename = image.name ?? `photo.${image.uri.split('.').pop() ?? 'jpg'}`;
  const type = image.type ?? (Platform.OS === 'ios' ? 'image/jpeg' : 'image/jpeg');

  // @ts-ignore - FormData append of RN file
  form.append('file', { uri: image.uri, name: filename, type });

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: form as any,
  });

  if (res.status === 401) {
    console.warn('401 - Unauthorized uploading image. Emitting forceLogout.');
    emitForceLogout();
  }

  if (!res.ok) {
    try {
      const parsed = await parseJsonSafe<any>(res);
      if (parsed?.detail) throw new APIError(parsed.detail, res.status, parsed);
      throw new APIError(parsed ? JSON.stringify(parsed) : res.statusText, res.status, parsed);
    } catch (err) {
      throw err;
    }
  }

  const parsed = await parseJsonSafe<UploadResponse>(res);
  return parsed;
}

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  uploadImage,
  onForceLogout,
  APIError,
};