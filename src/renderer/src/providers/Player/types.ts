export interface PlayerContextData {
  username: string
  isConnected: boolean
  redirectToSpotifyLogin: () => void
  isLoading: boolean
}
