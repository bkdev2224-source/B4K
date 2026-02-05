/**
 * Validate IDs before passing to MongoDB queries.
 * Prevents malformed or operator-injection attempts.
 */

const OBJECTID_HEX_LEN = 24
const OBJECTID_HEX = /^[a-fA-F0-9]{24}$/
const SAFE_ID = /^[a-zA-Z0-9_-]{1,100}$/

export function isValidId(id: string | null | undefined): id is string {
  if (!id || typeof id !== 'string') return false
  const trimmed = id.trim()
  if (trimmed.length === 0) return false
  return OBJECTID_HEX.test(trimmed) || SAFE_ID.test(trimmed)
}
