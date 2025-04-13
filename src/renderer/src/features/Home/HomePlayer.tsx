import { usePlayer } from '@renderer/providers/Player/usePlayer'
import nextIcon from '../../assets/icons/next.svg'
import previousIcon from '../../assets/icons/previous.svg'
import playIcon from '../../assets/icons/play.svg'
import pauseIcon from '../../assets/icons/pause.svg'
import SvgButton from '../../components/SvgButton'

import FeatherIcon from 'feather-icons-react'
import AutoScrollText from '../Player/AutoScrollText'
import SoundControl from '../Player/SoundControl'
import { useNavigate } from 'react-router-dom'
import { routes } from '@renderer/utils/Routes/routes'

const HomePlayer = (): JSX.Element => {
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
    openFolder,
    isReplay
  } = usePlayer()
  const navigate = useNavigate()

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="relative bg-primary border-2 border-black rounded-2xl h-28 hover:scale-105 transition-transform duration-300">
      <div className="flex justify-between items-center pt-0 pb-2 w-full">
        <div className="flex-1 px-4 pt-2 pb-1">
          <AutoScrollText>{trackName || 'No track playing'}</AutoScrollText>
        </div>
        <div className="px-4">
          <FeatherIcon
            icon="maximize-2"
            size={16}
            className="hover:scale-125 transition-transform duration-300 cursor-pointer"
            onClick={() => navigate(routes.player)}
          />
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

      <div className="flex justify-center items-center gap-3 py-2">
        <FeatherIcon
          icon="repeat"
          color={isReplay ? 'white' : 'black'}
          size={18}
          onClick={handleReplay}
          className="hover:scale-125 transition-transform duration-300 cursor-pointer"
        />
        <div className="flex justify-center items-center gap-2">
          <SvgButton src={previousIcon} alt="previous" onClick={previous} size={24} />
          <SvgButton
            src={!isPaused ? pauseIcon : playIcon}
            alt="play/pause"
            onClick={togglePlayPause}
            size={32}
          />
          <SvgButton src={nextIcon} alt="next" onClick={next} size={24} />
        </div>

        <FeatherIcon
          icon="shuffle"
          color={isShuffle ? 'white' : 'black'}
          size={18}
          onClick={handleShuffle}
          className="hover:scale-125 transition-transform duration-300 cursor-pointer"
        />
        <div className="bottom-2 left-4 absolute">
          <FeatherIcon
            icon="folder-plus"
            size={20}
            fill="white"
            onClick={openFolder}
            className="hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer"
          />
        </div>
        <div className="right-4 bottom-2 absolute">
          <SoundControl isHoverHidden />
        </div>
      </div>
    </div>
  )
}

export default HomePlayer
