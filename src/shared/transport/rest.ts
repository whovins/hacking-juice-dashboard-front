// fetch 래퍼. 토큰 헤더 주입과 에러 처리를 통일.
import { useAuthStore } from "../../config/auth-store"
const base = import.meta.env.VITE_API_BASE_URL as string

function headers(explicitToken?: string) {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  const storeToken = useAuthStore.getState().token;
  const token = explicitToken ?? storeToken
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

export async function get<T>(path: string, token?: string, signal?: AbortSignal) {
  const res = await fetch(`${base}${path}`, { headers: headers(token), signal })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

export async function post<T>(path: string, body: unknown, token?: string) {
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}
