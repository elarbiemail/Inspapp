// Simple localStorage wrapper with versioning
const KEY = 'inspapp:data:v1';

export function load<T>(fallback: T): T {
  try { const raw = localStorage.getItem(KEY); if (!raw) return fallback; return JSON.parse(raw) as T } catch { return fallback }
}

export function save<T>(data: T) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
