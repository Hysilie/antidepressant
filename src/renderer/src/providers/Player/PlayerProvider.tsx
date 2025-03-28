import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { PlayerContext } from './PlayerContext'
import {
  CLIENT_ID,
  REDIRECT_URI,
  SPOTIFY_SCOPES,
  SPOTIFY_URL_API_TOKEN,
  SPOTIFY_URL_AUTHORIZE,
  SPOTIFY_URL_ME
} from './utils'
import { generatePKCE } from './spotifyChallenge'

export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'))
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  /*
   * Redirect to Spotify using PKCE flow.
   */
  const redirectToSpotifyLogin = async (): Promise<void> => {
    setIsLoading(true)
    const { codeVerifier, codeChallenge } = await generatePKCE()
    localStorage.setItem('code_verifier', codeVerifier)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SPOTIFY_SCOPES,
      redirect_uri: REDIRECT_URI,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    })

    window.location.href = `${SPOTIFY_URL_AUTHORIZE}${params.toString()}`
  }

  /**
   * Fetches an access token from PKCE flow. It retrieves the code_verifier from local storage and uses it along with
   * the authorization code to request an access token from the Spotify API.
   *
   */
  const fetchToken = useCallback(async () => {
    try {
      const codeVerifierStored = localStorage.getItem('code_verifier')

      if (!code || !codeVerifierStored) return

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: codeVerifierStored
      })
      const response = await fetch(SPOTIFY_URL_API_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      })
      const data = await response.json()
      if (data.access_token) {
        const expiresAt = Date.now() + data.expires_in * 1000

        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('access_token_expires_at', expiresAt.toString())

        setToken(data.access_token)
        window.history.replaceState({}, document.title, window.location.pathname)
      } else {
        console.error('Failed to fetch token:', data)
      }
    } catch (error) {
      console.error('Unexpected error while fetching token:', error)
    }
  }, [code])

  /**
   * Return the user profile, the data provides useful informations in order to use Web PlayBack API
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!token) return

      const res = await fetch(SPOTIFY_URL_ME, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()
      console.log('👤 Profil Spotify:', data)
      setUsername(data.display_name)
    } catch (error) {
      console.error('Unexpected error while fetching user profile:', error)
    }
  }, [token])

  /**
   * Check if the token is expired from local storage
   * */
  const isTokenExpired = (): boolean => {
    const expiresAt = parseInt(localStorage.getItem('access_token_expires_at') || '0', 10)
    return Date.now() > expiresAt
  }

  /**
   * Refreshes the Spotify access token using the stored refresh token.
   */
  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) return

      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID
      })

      const response = await fetch(SPOTIFY_URL_API_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      })

      const data = await response.json()

      if (data.access_token) {
        const expiresAt = Date.now() + data.expires_in * 1000
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('access_token_expires_at', expiresAt.toString())
        setToken(data.access_token)
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      console.error('Unexpected error while fetching refreshtoken:', error)
    }
  }, [])

  /*
   * Guard to prevent multiple token requests
   */
  useEffect(() => {
    if (!username) {
      fetchUserProfile()
    }
    if (!token && code) {
      const alreadyFetched = localStorage.getItem('token_fetched')
      if (!alreadyFetched) {
        localStorage.setItem('token_fetched', '1')
        fetchToken()
      }
    } else if (token) {
      if (isTokenExpired()) {
        refreshAccessToken()
      } else {
        setIsConnected(true)
      }
    }
  }, [token, code, fetchToken, fetchUserProfile, refreshAccessToken, username])

  return (
    <PlayerContext.Provider value={{ username, isConnected, redirectToSpotifyLogin, isLoading }}>
      {children}
    </PlayerContext.Provider>
  )
}
