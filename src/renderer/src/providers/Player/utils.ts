export const CLIENT_ID = 'c1a687e8380d40919b16c24d90cfb651'

export const REDIRECT_URI = 'http://localhost:5173/player'

/**
 * URL for obtaining the Spotify API token.
 * Is used to exchange client credentials or authorization codes for an access token.
 */
export const SPOTIFY_URL_API_TOKEN = 'https://accounts.spotify.com/api/token'

/**
 * URL for accessing the Spotify "Me" endpoint.
 * It provides informations about the current authenticated user.
 */
export const SPOTIFY_URL_ME = 'https://api.spotify.com/v1/me'

/**
 * URL for initiating the Spotify authorization process.
 * Used to redirect users to Spotify's authorization page.
 */
export const SPOTIFY_URL_AUTHORIZE = 'https://accounts.spotify.com/authorize?'

/**
 * Scopes required for Spotify API access.
 * These scopes define the permissions the application is requesting from the user.
 *
 * - `streaming`: Allows playback of Spotify tracks. Mandatory for Web Playback API.
 * - `user-read-email`: Grants access to the user's email address.
 * - `user-read-private`: Grants access to the user's private account details.
 * - `user-read-playback-state`: Allows reading the user's current playback state.
 * - `user-modify-playback-state`: Allows modifying the user's playback state.
 */
export const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state'
].join(' ')
