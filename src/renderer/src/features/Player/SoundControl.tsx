import { FC, useState } from 'react'
import { usePlayer } from '@renderer/providers/Player/usePlayer'
import FeatherIcon from 'feather-icons-react'

interface SoundControlProps {
  isHoverHidden?: boolean
}

const SoundControl: FC<SoundControlProps> = ({ isHoverHidden }) => {
  const { volume, changeVolume, isMuted, toggleMute } = usePlayer()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && !isHoverHidden && (
        <div className="bottom-0 z-50 absolute flex flex-col justify-between items-center bg-transparent w-14 h-40 transition-all duration-200">
          <div className="relative flex justify-center items-center w-full h-full">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="bottom-20 absolute bg-white mx-2 border-2 border-black rounded-full w-28 h-2 rotate-[-90deg] appearance-none cursor-pointer volume-slider volume-slider"
            />
          </div>
        </div>
      )}

      <FeatherIcon
        icon={isMuted ? 'volume-x' : 'volume-2'}
        onClick={toggleMute}
        size={24}
        fill="white"
        className="z-[9995]"
      />
    </div>
  )
}

export default SoundControl
