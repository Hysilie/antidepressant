import { FC, PropsWithChildren, useCallback, useEffect, useRef, useState, MouseEvent } from 'react'
import { PlayerContext } from './PlayerContext'
import { Track } from './types'
import { isEmpty } from 'remeda'

export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [trackName, setTrackName] = useState('')
  const [isPaused, setIsPaused] = useState(true)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isReplay, setIsReplay] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const volumeBeforeMute = useRef(1)

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

  const handleReplay = useCallback(() => setIsReplay((prev) => !prev), [])
  const handleShuffle = useCallback(() => setIsShuffle((prev) => !prev), [])

  /**
   * Handles the click event on the progress bar to update the audio playback position.
   *
   * @param event - The mouse event triggered by clicking on the progress bar.
   *   - `event.currentTarget`: The progress bar element that was clicked.
   *   - `event.nativeEvent.offsetX`: The horizontal offset of the click relative to the progress bar.
   *
   * @remarks
   * This function calculates the new playback position based on the click position
   * on the progress bar and updates the `currentTime` of the audio element.
   */
  const handleProgressClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (!audioRef.current) return

    const progressBar = event.currentTarget
    const clickX = event.nativeEvent.offsetX
    const progressBarWidth = progressBar.clientWidth

    const newProgress = (clickX / progressBarWidth) * 100
    const newTime = (newProgress / 100) * duration

    audioRef.current.currentTime = newTime
  }

  const updateDuration = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }, [])

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0)
    }
  }, [])

  const changeVolume = useCallback((value: number): void => {
    const vol = Math.min(1, Math.max(0, value))
    setVolume(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }, [])

  const toggleMute = useCallback((): void => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volumeBeforeMute.current
        setVolume(volumeBeforeMute.current)
        setIsMuted(false)
      } else {
        volumeBeforeMute.current = volume
        audioRef.current.volume = 0
        setVolume(0)
        setIsMuted(true)
      }
    }
  }, [isMuted, volume])

  /**
   * Plays a track from the playlist at the specified index.
   *
   * @param trackIndex - The index of the track in the playlist to play.
   * @returns A promise that resolves when the track starts playing.
   */
  const playTrack = useCallback(
    async (trackIndex: number): Promise<void> => {
      try {
        if (isEmpty(playlist)) {
          return
        }

        setCurrentTrackIndex(trackIndex)
        const currentTrack = playlist[trackIndex]
        if (audioRef.current) {
          const { objectURL } = await createAudioSource(currentTrack.filePath)
          audioRef.current.src = objectURL
          setTrackName(currentTrack.trackname)
          await audioRef.current.play()
          setIsPaused(false)
        }
      } catch (error) {
        console.error('An error occurred while trying to play the track:', error)
      }
    },
    [playlist]
  )

  const loadTrack = useCallback(async (): Promise<void> => {
    if (playlist.length > 0 && audioRef.current) {
      const currentTrack = playlist[currentTrackIndex]
      const { objectURL } = await createAudioSource(currentTrack.filePath)
      audioRef.current.src = objectURL
      setTrackName(currentTrack.trackname)
      await audioRef.current.play()
      setIsPaused(false)
    }
  }, [currentTrackIndex, playlist])

  /**
   * Opens a folder dialog to allow the user to select audio files and update playlist.
   */
  const openFolder = async (): Promise<void> => {
    try {
      const files = await window.electronAPI.selectAudioFiles()
      if (!files || files.length === 0) return

      const newTracks: Track[] = files.map((filePath) => {
        const name = filePath.split(/[\\/]/).pop() || ''
        const trackname = name.replace(/\.(mp3|mp4|flac|wav|ogg)$/, '')
        return { index: 0, trackname, filePath }
      })

      const merged = [...playlist, ...newTracks]
      const unique = Array.from(new Map(merged.map((track) => [track.filePath, track])).values())

      const withIndexes = unique.map((track, i) => ({ ...track, index: i }))

      setPlaylist(withIndexes)
      setCurrentTrackIndex(playlist.length === 0 ? 0 : currentTrackIndex)
      localStorage.setItem('playlist', JSON.stringify(withIndexes))
    } catch (error) {
      console.error('An error occurred while opening the folder:', error)
    }
  }

  /**
   * Creates an audio source from a given file path and generate a Blob URL for the audio data.
   * Also extract trackname removing file extension
   *
   * @param filePath - The path to the audio file to be processed.
   * @returns A promise that resolves to an object containing:
   * - `objectURL`: A Blob URL representing the audio source.
   */
  const createAudioSource = async (filePath: string): Promise<{ objectURL: string }> => {
    try {
      const buffer = await window.electronAPI.readAudioFile(filePath)
      const extension = filePath.split('.').pop()
      const mimeType =
        extension === 'wav' ? 'audio/wav' : extension === 'ogg' ? 'audio/ogg' : 'audio/mpeg'

      const blob = new Blob([buffer], { type: mimeType })
      const objectURL = URL.createObjectURL(blob)

      return { objectURL }
    } catch (error) {
      console.error('An error occurred while creating the audio source:', error)
      throw error
    }
  }

  const restorePlaylist = useCallback(async () => {
    try {
      const stored = localStorage.getItem('playlist')
      if (!stored) return

      const storedTracks: Track[] = JSON.parse(stored)

      const validTracks: Track[] = []
      for (const track of storedTracks) {
        const exists = await window.electronAPI.checkFileExists(track.filePath)
        if (exists) validTracks.push(track)
      }

      if (validTracks.length > 0) {
        setPlaylist(validTracks)
        setCurrentTrackIndex(0)
      }
    } catch (error) {
      console.error('An error occurred while restoring the playlist:', error)
    }
  }, [])

  const resetPlaylist = (): void => {
    localStorage.removeItem('playlist')
    setPlaylist([])
  }

  useEffect(() => {
    loadTrack()
  }, [currentTrackIndex, loadTrack, playlist])

  useEffect(() => {
    restorePlaylist()
  }, [restorePlaylist])

  useEffect(() => {
    if (playlist.length > 0) {
      localStorage.setItem('playlist', JSON.stringify(playlist))
    }
  }, [playlist])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  return (
    <PlayerContext.Provider
      value={{
        togglePlayPause,
        next,
        previous,
        trackName,
        isPaused,
        openFolder,
        playlist,
        resetPlaylist,
        playTrack,
        handleReplay,
        handleShuffle,
        currentTime,
        duration,
        progress,
        handleProgressClick,
        volume,
        changeVolume,
        isMuted,
        toggleMute
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onLoadedMetadata={updateDuration}
        onTimeUpdate={updateProgress}
        onEnded={() => {
          if (isReplay) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0
            }
            audioRef.current?.play()
          } else if (isShuffle) {
            const randomIndex = Math.floor(Math.random() * playlist.length)
            playTrack(randomIndex)
          } else {
            next()
          }
        }}
      />
    </PlayerContext.Provider>
  )
}
