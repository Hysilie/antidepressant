import { useTranslation } from 'react-i18next'
import Container from './Container'
import mascot from '../assets/icons/mascot.svg'
const Loader = (): JSX.Element => {
  const { t } = useTranslation('translation', { keyPrefix: 'login' })

  return (
    <Container spacing="large" className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col justify-center items-center gap-6 text-center">
        <img src={mascot} className="w-20 h-20 text-gray-200 animate-[spin_3s_linear_infinite]" />
        <p className="bg-primary px-4 py-2 border-2 border-black rounded-2xl font-semibold text-xl">
          {t('loader')}
        </p>
      </div>
    </Container>
  )
}

export default Loader
