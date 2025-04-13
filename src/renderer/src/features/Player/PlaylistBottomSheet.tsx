import { FC, useEffect, useRef } from 'react'
import SvgButton from '../../components/SvgButton'
import close from '../../assets/icons/close.svg'
import { usePlayer } from '@renderer/providers/Player/usePlayer'
import { useTranslation } from 'react-i18next'
import AutoScrollText from './AutoScrollText'

type PlaylistBottomSheetProps = {
  visible: boolean
  openPlaylist: boolean
  handlePlaylist: (value: boolean) => void
}

const PlaylistBottomSheet: FC<PlaylistBottomSheetProps> = ({
  handlePlaylist,
  openPlaylist,
  visible
}): JSX.Element | null => {
  const { t } = useTranslation('translation', { keyPrefix: 'player' })
  const { playlist, trackName, playTrack } = usePlayer()
  const currentTrackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (openPlaylist && currentTrackRef.current) {
      currentTrackRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [openPlaylist])

  return visible ? (
    <div className="overflow-hidden">
      <div
        className={`fixed inset-0 z-[9998] bg-black/30 transition-opacity duration-300 ${
          openPlaylist ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => handlePlaylist(false)}
      />

      <div
        className={`
          fixed bottom-0 z-[9999] w-full h-5/6 bg-primary rounded-t-2xl
          ${openPlaylist ? 'slide-up' : 'slide-down'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center px-4 py-4 font-bold text-black">
            <span>{t('playlist', { number: playlist.length })}</span>
            <SvgButton onClick={() => handlePlaylist(false)} src={close} alt={'close'} size={20} />
          </div>

          <div className="flex-grow space-y-2 px-4 pt-2 pb-6 overflow-y-auto">
            {playlist.map((track, index) => {
              const isCurrent = track.trackname === trackName
              return (
                <div
                  ref={isCurrent ? currentTrackRef : null}
                  key={track.filePath}
                  onClick={() => playTrack(index)}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-all 
                    ${
                      isCurrent
                        ? 'bg-white text-black font-body ring-2 ring-black'
                        : 'bg-black/5 text-black/80 hover:bg-white/20'
                    }
                  `}
                >
                  <span className="pr-2 w-full text-left truncate">
                    {isCurrent ? <AutoScrollText>{trackName}</AutoScrollText> : track.trackname}
                  </span>
                  {isCurrent && (
                    <span className="bg-white px-2 py-0.5 border-2 border-black rounded-full font-body font-bold text-black text-xs">
                      {t('playing')}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default PlaylistBottomSheet
