import { FC, useCallback, useState } from 'react'
import SvgButton from '../../components/SvgButton'
import folder from '../../assets/icons/folder.svg'
import reset from '../../assets/icons/trash.svg'
import playlistIcon from '../../assets/icons/playlist.svg'
import { usePlayer } from '@renderer/providers/Player/usePlayer'
import Tooltip from '@renderer/components/Tooltip'
import { useTranslation } from 'react-i18next'
import { isEmpty } from 'remeda'
import PlaylistBottomSheet from './PlaylistBottomSheet'
type MediaProps = {
  background: string
}

const Media: FC<MediaProps> = ({ background }): JSX.Element => {
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
          <SvgButton src={folder} alt={'folder'} onClick={openFolder} size={20} />
        </Tooltip>
        {!isEmpty(playlist) && (
          <Tooltip label={t('reset')}>
            <SvgButton src={reset} alt={'reset'} onClick={resetPlaylist} size={20} />
          </Tooltip>
        )}
      </div>
      <div className="w-full h-full">
        <img src={background} className="w-full h-full object-cover" alt="background" />
      </div>
    </div>
  )
}

export default Media
