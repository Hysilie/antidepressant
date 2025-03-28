// https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

/**
 * Generates a code verifier string of the specified length.
 * A code verifier is a random string used in the OAuth 2.0 PKCE flow.
 *
 * @param length - The desired length of the code verifier.
 * @returns A randomly generated code verifier string consisting of
 * uppercase letters, lowercase letters, and digits.
 *
 */
/**
 * Generates a code verifier string of the specified length.
 */
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(values, (x) => possible[x % possible.length]).join('')
}

/**
 * Encodes an ArrayBuffer to a base64url string.
 */
const base64encode = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Returns the SHA-256 hash of the input string.
 */
const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return await crypto.subtle.digest('SHA-256', data)
}

/**
 * Generates the PKCE pair (code_verifier + code_challenge).
 */
export const generatePKCE = async (): Promise<{ codeVerifier: string; codeChallenge: string }> => {
  const codeVerifier = generateRandomString(64)
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed)
  return { codeVerifier, codeChallenge }
}
