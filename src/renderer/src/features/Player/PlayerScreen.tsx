import { usePlayer } from '@renderer/providers/Player/usePlayer'
import { routes } from '@renderer/utils/Routes/routes'
import { useNavigate } from 'react-router'

const PlayerScreen = (): JSX.Element => {
  const {
    next,
    previous,
    trackName,
    isPaused,
    openFolder,
    togglePlayPause,
    playlist,
    resetPlaylist,
    playTrack,
    currentTime,
    duration,
    progress,
    handleProgressClick,
    handleShuffle,
    handleReplay,
    volume,
    changeVolume,
    isMuted,
    toggleMute
  } = usePlayer()
  const navigate = useNavigate()

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div>
      <div>
        <button onClick={() => navigate(routes.home)}>back </button>
        PlayerScreen
      </div>
      <div>
        <p>{trackName}</p>
        <button onClick={previous}>⏮️</button>
        <button onClick={togglePlayPause}>{isPaused ? '▶️' : '⏸️'}</button>
        <button onClick={handleShuffle}>🔀</button>
        <button onClick={handleReplay}>🔁</button>
        <button onClick={next}>⏭️</button>

        <div className="flex audio-info align-center">
          <div className="time-container">
            <span>{formatTime(currentTime)}</span>
          </div>
          <div className="progress-container" onClick={handleProgressClick}>
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="time-container">
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
        />
        <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>

        <button onClick={openFolder}>📁 Ouvrir un dossier</button>
        <ul>
          Playlist :
          {playlist.map((music, index) => (
            <li onClick={() => playTrack(music.index)} key={index}>
              {music.trackname}
            </li>
          ))}
        </ul>

        <button onClick={resetPlaylist}> Reset </button>
      </div>
    </div>
  )
}

export default PlayerScreen
