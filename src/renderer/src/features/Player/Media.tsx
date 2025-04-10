import { useCallback, useState } from 'react'
import { usePlayer } from '@renderer/providers/Player/usePlayer'
import Tooltip from '@renderer/components/Tooltip'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'remeda'
import playlistIcon from '../../assets/icons/playlist.svg'
import PlaylistBottomSheet from './PlaylistBottomSheet'
import FeatherIcon from 'feather-icons-react'
import SvgButton from '@renderer/components/SvgButton'
import { backgroundsMap } from '@renderer/assets/backgrounds'
import { useTheme } from '@renderer/providers/Preferences/Theme/useTheme'

const Media = (): JSX.Element => {
  const { hex } = useTheme()
  const { openFolder, playlist, resetPlaylist } = usePlayer()
  const { t } = useTranslation('translation', { keyPrefix: 'player.tooltip' })
  const [openPlaylist, setOpenPlaylist] = useState(false)
  const [visible, setVisible] = useState(false)
  const handlePlaylist = useCallback((open: boolean) => {
    setVisible(open)
    setOpenPlaylist(open)
    if (!open) {
      setTimeout(() => setVisible(false), 400)
    }
  }, [])

  const formattedBackgroundUrl = `bg-${hex.slice(1)}.png`
  const backgroundUrl = backgroundsMap[formattedBackgroundUrl] ?? ''

  return (
    <div className="flex-grow overflow-hidden">
      <PlaylistBottomSheet {...{ visible, openPlaylist, handlePlaylist }} />
      <div className="top-8 right-3 absolute flex flex-col justify-center items-center gap-6">
        {!isEmpty(playlist) && (
          <Tooltip label={t('playlist')}>
            <SvgButton
              src={playlistIcon}
              alt={'playlist'}
              onClick={() => handlePlaylist(true)}
              size={32}
            />
          </Tooltip>
        )}
        <Tooltip label={t('folder')}>
          <FeatherIcon
            icon="folder-plus"
            size={20}
            fill="white"
            onClick={openFolder}
            className="hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer"
          />
        </Tooltip>
        {!isEmpty(playlist) && (
          <Tooltip label={t('reset')}>
            <FeatherIcon
              icon="trash-2"
              size={20}
              fill="white"
              onClick={resetPlaylist}
              className="hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer"
            />
          </Tooltip>
        )}
      </div>
      <div className="w-full h-full">
        <img src={backgroundUrl} className="w-full h-full object-cover" alt="background" />
      </div>
    </div>
  )
}

export default Media
