import { getSupabaseClient } from './supabase'

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = getSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) throw new ApiError('認証が必要です', 401)
  return { Authorization: `Bearer ${session.access_token}` }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    // 204 No Content などは空レスポンスの場合がある
    const text = await res.text()
    return text ? (JSON.parse(text) as T) : ({} as T)
  }
  const body = await res.json().catch(() => ({ message: res.statusText }))
  throw new ApiError(body.message ?? 'APIエラーが発生しました', res.status)
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${getApiBase()}${path}`, { headers })
  return handleResponse<T>(res)
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}
