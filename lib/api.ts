const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api'

export async function api<T=any>(path: string, init?: RequestInit): Promise<T>{
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { 'Accept': 'application/json', ...(init?.headers||{}) }, cache: 'no-store' })
  if(!res.ok) throw new Error(`API ${res.status}`)
  return res.json() as Promise<T>
}

export async function demo<T>(data:T, delay=150){ await new Promise(r=>setTimeout(r, delay)); return data }
