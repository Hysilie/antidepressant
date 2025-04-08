import { FC, PropsWithChildren, useCallback, useEffect, useRef, useState, MouseEvent } from 'react'
import { PlayerContext } from './PlayerContext'
import { Track } from './types'
import { usePlayerReducer } from './usePlayerReducer'
import { useAuth } from '../Auth/useAuth'

export const PlayerProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playlist, setPlaylist] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [trackName, setTrackName] = useState('')
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const { state, dispatch } = usePlayerReducer()
  const { isShuffle, isReplay, volume, isMuted } = state

  const togglePlayPause = (): void => {
    if (!audioRef.current) return

    if (audioRef.current.paused) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }

  const next = (): void => {
    if (playlist.length === 0) return
    const nextIndex = (currentTrackIndex + 1) % playlist.length
    playTrack(nextIndex)
  }

  const previous = (): void => {
    if (playlist.length === 0) return
    const previousIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length
    playTrack(previousIndex)
  }

  const handleReplay = useCallback((): void => dispatch({ type: 'replay' }), [dispatch])
  const handleShuffle = useCallback((): void => dispatch({ type: 'shuffle' }), [dispatch])

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

  const changeVolume = useCallback(
    (value: number) => dispatch({ type: 'volume', payload: Math.max(0, Math.min(1, value)) }),
    [dispatch]
  )

  const toggleMute = useCallback(() => dispatch({ type: 'mute' }), [dispatch])

  /**
   * Plays a track from the playlist at the specified index.
   *
   * @param trackIndex - The index of the track in the playlist to play.
   */
  const playTrack = useCallback(
    async (trackOrIndex: Track | number): Promise<void> => {
      try {
        const trackIndex =
          typeof trackOrIndex === 'number'
            ? trackOrIndex
            : playlist.findIndex((t) => t.filePath === trackOrIndex.filePath)

        const targetTrack = playlist[trackIndex]
        if (!targetTrack) return

        const { objectURL } = await createAudioSource(targetTrack.filePath)
        if (audioRef.current) {
          audioRef.current.src = objectURL
          setTrackName(targetTrack.trackname)
          setCurrentTrackIndex(trackIndex)
          await audioRef.current.play()
        }
      } catch (error) {
        console.error('An error occurred while trying to play the track:', error)
      }
    },
    [playlist]
  )

  /**
   * Loads the current track from the playlist, sets the audio source, and starts playback.
   */
  const loadTrack = useCallback(async (): Promise<void> => {
    if (playlist.length > 0 && audioRef.current) {
      const currentTrack = playlist[currentTrackIndex]
      const { objectURL } = await createAudioSource(currentTrack.filePath)
      audioRef.current.src = objectURL
      setTrackName(currentTrack.trackname)
      await audioRef.current.play()
    }
  }, [currentTrackIndex, playlist])

  /**
   * Prepares the audio track for playback by setting the audio source and track name.
   */
  const prepareTrack = useCallback(async (): Promise<void> => {
    if (playlist.length > 0 && audioRef.current) {
      const currentTrack = playlist[currentTrackIndex]
      const { objectURL } = await createAudioSource(currentTrack.filePath)
      audioRef.current.src = objectURL
      setTrackName(currentTrack.trackname)
    }
  }, [currentTrackIndex, playlist])

  /**
   * Opens a folder dialog to allow the user to select audio files and update playlist.
   */
  const openFolder = useCallback(async (): Promise<void> => {
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

      if (playlist.length === 0 && withIndexes.length > 0) {
        await playTrack(withIndexes[0])
      }
    } catch (error) {
      console.error('An error occurred while opening the folder:', error)
    }
  }, [currentTrackIndex, playTrack, playlist])

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

  /**
   * Restores the playlist from localStorage and validates the existence of each track's file.
   */
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

  const resetPlaylist = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
    }
    localStorage.removeItem('playlist')
    setPlaylist([])
    setCurrentTrackIndex(0)
    setTrackName('')
    setDuration(0)
    setCurrentTime(0)
    setProgress(0)
  }, [])

  // Autoplay music if the user's preferences allow it
  useEffect(() => {
    if (currentUser?.preferencesStates?.musicAutoplay) {
      loadTrack()
    }
  }, [currentUser?.preferencesStates?.musicAutoplay, loadTrack])

  // Restore the playlist from localStorage on component mount
  useEffect(() => {
    restorePlaylist()
  }, [restorePlaylist])

  // Prepare the first track if the playlist is loaded but no track is currently set
  useEffect(() => {
    if (playlist.length > 0 && !trackName) {
      prepareTrack()
    }
  }, [playlist, trackName, prepareTrack])

  // Save the playlist to localStorage whenever it changes
  useEffect(() => {
    if (playlist.length > 0) {
      localStorage.setItem('playlist', JSON.stringify(playlist))
    }
  }, [playlist])

  // Update the audio element's volume whenever the volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Reset the playlist if the user logs out
  useEffect(() => {
    if (!currentUser) {
      resetPlaylist()
    }
  }, [currentUser, resetPlaylist])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = (): void => setIsPlaying(true)
    const handlePause = (): void => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return (): void => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        togglePlayPause,
        next,
        previous,
        trackName,
        isPaused: !isPlaying,
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
        toggleMute,
        isReplay,
        isShuffle
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
