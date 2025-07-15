export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || 'API call failed');
  }
  return res.json();
}
