import { MouseEvent } from 'react'

export interface Track {
  index: number
  trackname: string
  filePath: string
}
export interface PlayerContextData {
  playlist: Track[]
  isPaused: boolean
  isReplay: boolean
  isShuffle: boolean
  trackName: string
  currentTime: number
  duration: number
  progress: number
  volume: number
  isMuted: boolean
  toggleMute: () => void
  changeVolume: (value: number) => void
  handleProgressClick: (event: MouseEvent<HTMLDivElement>) => void
  togglePlayPause: () => void
  next: () => void
  previous: () => void
  openFolder: () => void
  resetPlaylist: () => void
  playTrack: (trackIndex: number) => void
  handleReplay: () => void
  handleShuffle: () => void
}

export interface PlayerState {
  isShuffle: boolean
  isReplay: boolean
  volume: number
  isMuted: boolean
  volumeBeforeMute: number
}

export type PlayerAction =
  | { type: 'replay' }
  | { type: 'shuffle' }
  | { type: 'volume'; payload: number }
  | { type: 'mute' }
