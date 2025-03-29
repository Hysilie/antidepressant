import { FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { PlayerContext } from './PlayerContext'

export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playlist, setPlaylist] = useState<string[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [trackName, setTrackName] = useState('')
  const [isPaused, setIsPaused] = useState(true)

  const togglePlayPause = (): void => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play()
        setIsPaused(false)
      } else {
        audioRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const next = (): void => {
    if (currentTrackIndex >= playlist.length - 1) return
    setCurrentTrackIndex(currentTrackIndex + 1)
  }

  const previous = (): void => {
    if (currentTrackIndex <= 0) return
    setCurrentTrackIndex(currentTrackIndex - 1)
  }

  /**
   * Opens a folder dialog to allow the user to select audio files and update playlist.
   */
  const openFolder = async (): Promise<void> => {
    const files = await window.electronAPI.selectAudioFiles()
    if (!files || files.length === 0) return
    setPlaylist(files)
    setCurrentTrackIndex(0)
  }

  const loadTrack = useCallback(async (): Promise<void> => {
    if (playlist.length > 0 && audioRef.current) {
      const filePath = playlist[currentTrackIndex]
      const { objectURL, trackname } = await createAudioSource(filePath)
      audioRef.current.src = objectURL
      setTrackName(trackname)
      await audioRef.current.play()
      setIsPaused(false)
    }
  }, [currentTrackIndex, playlist])

  /**
   * Creates an audio source from a given file path and generate a Blob URL for the audio data.
   * Also extract trackname removing file extension
   *
   * @param filePath - The path to the audio file to be processed.
   * @returns A promise that resolves to an object containing:
   * - `objectURL`: A Blob URL representing the audio source.
   * - `trackname`: The name of the track derived from the file name.
   */
  const createAudioSource = async (
    filePath: string
  ): Promise<{ objectURL: string; trackname: string }> => {
    const buffer = await window.electronAPI.readAudioFile(filePath)
    const extension = filePath.split('.').pop()
    const mimeType =
      extension === 'wav' ? 'audio/wav' : extension === 'ogg' ? 'audio/ogg' : 'audio/mpeg'

    const blob = new Blob([buffer], { type: mimeType })
    const objectURL = URL.createObjectURL(blob)

    const name = filePath.split(/[\\/]/).pop() || ''
    const trackname = name.replace(/\.(mp3|mp4|flac|wav|ogg)$/, '')

    return { objectURL, trackname }
  }

  useEffect(() => {
    loadTrack()
  }, [currentTrackIndex, loadTrack, playlist])

  return (
    <PlayerContext.Provider
      value={{ togglePlayPause, next, previous, trackName, isPaused, openFolder }}
    >
      {children}
      <audio ref={audioRef} hidden />
    </PlayerContext.Provider>
  )
}
