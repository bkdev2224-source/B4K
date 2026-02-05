/**
 * Stable fetcher for SWR. Returns JSON or throws on non-ok response.
 */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Failed to fetch (${res.status}). ${text}`)
  }
  return (await res.json()) as T
}
