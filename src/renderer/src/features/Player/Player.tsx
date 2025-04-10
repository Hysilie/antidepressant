import { usePlayer } from '@renderer/providers/Player/usePlayer'
import { FC } from 'react'
import nextIcon from '../../assets/icons/next.svg'
import previousIcon from '../../assets/icons/previous.svg'
import playIcon from '../../assets/icons/play.svg'
import pauseIcon from '../../assets/icons/pause.svg'
import SvgButton from '../../components/SvgButton'
import AutoScrollText from './AutoScrollText'
import SoundControl from './SoundControl'
import FeatherIcon from 'feather-icons-react'
type PlayerProps = {
  opacityColor: string
}

const Player: FC<PlayerProps> = ({ opacityColor }): JSX.Element => {
  const {
    next,
    previous,
    trackName,
    isPaused,
    togglePlayPause,
    currentTime,
    duration,
    progress,
    handleProgressClick,
    handleShuffle,
    handleReplay,
    isShuffle,
    isReplay
  } = usePlayer()

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="relative py-4" style={{ backgroundColor: opacityColor }}>
      <div className="flex justify-between items-center pt-0 pb-4 w-full">
        <div className="flex-1 px-4">
          <AutoScrollText>{trackName || 'No track playing'}</AutoScrollText>
        </div>
        <div className="px-4">
          <SoundControl />
        </div>
      </div>
      <div className="flex items-center gap-2 px-4">
        <div className="text-xs">
          <span>{formatTime(currentTime)}</span>
        </div>
        <div className="bg-[#00000020] rounded-3xl w-full h-2" onClick={handleProgressClick}>
          <div
            className="bg-white border-2 border-black rounded-xl h-full transition-all duration-200 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-xs">
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="relative flex justify-center items-center gap-3 py-2">
        <div className="bottom-6 left-14 absolute">
          <FeatherIcon
            icon="repeat"
            color={isReplay ? 'white' : 'black'}
            size={18}
            onClick={handleReplay}
          />
        </div>

        <SvgButton src={previousIcon} alt="previous" onClick={previous} size={40} />
        <SvgButton
          src={!isPaused ? pauseIcon : playIcon}
          alt="play/pause"
          onClick={togglePlayPause}
          size={54}
        />
        <SvgButton src={nextIcon} alt="next" onClick={next} size={40} />
      </div>

      <div className="right-14 bottom-10 absolute">
        <FeatherIcon
          icon="shuffle"
          color={isShuffle ? 'white' : 'black'}
          size={18}
          onClick={handleShuffle}
        />
      </div>
    </div>
  )
}

export default Player
