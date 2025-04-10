import { routes } from '@renderer/utils/Routes/routes'
import Media from './Media'
import Player from './Player'
import Header from '@renderer/components/Header'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@renderer/providers/Preferences/Theme/useTheme'
import { useExtractColors } from 'react-extract-colors'

const PlayerScreen = (): JSX.Element => {
  const { hex } = useTheme()
  const background = `src/assets/backgrounds/${hex.replace('#', 'bg-')}.png`
  const { t } = useTranslation('translation', { keyPrefix: 'player' })
  const { dominantColor } = useExtractColors(background)
  const opacityColor = dominantColor?.replace('255', '0.90') ?? hex
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header icon title={t('title')} target={routes.home} className="bg-primary px-6 py-2 h-16" />
      <Media />
      <Player opacityColor={opacityColor} />
    </div>
  )
}

export default PlayerScreen
