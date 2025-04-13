import Button from '@renderer/components/Button'
import Container from '@renderer/components/Container'
import Header from '@renderer/components/Header'
import { routes } from '@renderer/utils/Routes/routes'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const GamesScreen = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'games' })
  const navigate = useNavigate()

  return (
    <Container spacing="large" className="flex flex-col w-full h-full overflow-x-hidden">
      <Header title={t('title')} icon={true} target={routes.home} />
      <div className="flex flex-col flex-grow px-2 rounded-lg w-full overflow-hidden">
        <Button label={t('peak.title')} onClick={() => navigate(routes.peak)} />
        <div className="flex-grow p-4 overflow-y-auto"></div>
      </div>
    </Container>
  )
}

export default GamesScreen
