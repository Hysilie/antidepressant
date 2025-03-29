export interface PlayerContextData {
  isPaused: boolean
  trackName: string
  togglePlayPause: () => void
  next: () => void
  previous: () => void
  openFolder: () => void
}
