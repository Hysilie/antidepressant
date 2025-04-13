import Container from '@renderer/components/Container'
import { useAuth } from '@renderer/providers/Auth/useAuth'
import { routes } from '@renderer/utils/Routes/routes'
import localStorageCleaner from '@renderer/utils/useLocalStorageCleaner'
import { getWeather } from '@renderer/utils/useWeather'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import mascot from '../../assets/icons/mascot.svg'
import sad from '../../assets/icons/sad.svg'
import HomePlayer from './HomePlayer'
import Header from '@renderer/components/Header'
import FeatherIcon from 'feather-icons-react'
import { useNavigate } from 'react-router-dom'
import SvgButton from '@renderer/components/SvgButton'
import clsx from 'clsx'
import { useLock } from '@renderer/providers/Preferences/Lock/useLock'
import LockedScreen from '@renderer/LockedScreen'
import Button from '@renderer/components/Button'

const HomeScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { isScreenLocked } = useLock()
  const { t } = useTranslation('translation', { keyPrefix: 'home' })
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const [weather, setWeather] = useState<string>('')
  const [isHovered, setIsHovered] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    localStorageCleaner()

    getWeather().then(setWeather)
  }, [])

  return isScreenLocked ? (
    <LockedScreen target="/" />
  ) : (
    <Container spacing="large" className="flex flex-col w-full h-full overflow-hidden">
      <Header
        icon={false}
        title={t('hello', { username: currentUser?.username ?? 'you' })}
        target=""
        extraButton={
          <FeatherIcon
            icon="settings"
            size={24}
            className="hover:scale-125 transition-transform duration-300 cursor-pointer"
            onClick={() => navigate(routes.preferences)}
          />
        }
      />

      <p className="flex gap-2 -mt-2 mb-4 font-accent text-gray-300">
        <span>{today}</span> | <span>{weather}</span>
      </p>
      <div className="flex flex-col flex-grow rounded-lg w-full">
        <div className="flex flex-grow gap-4 py-2">
          <div className="flex flex-col justify-center items-center p-4 border-2 border-black rounded-2xl w-full text-center">
            🚧🚧🚧🚧🚧 <br />
            Building <br />
            🚧🚧🚧🚧🚧🚧
            <Button mode="inline" onClick={() => navigate(routes.games)} label="Peak a view" />
          </div>
          <div className="flex flex-col gap-4 w-full text-center">
            <button
              type="button"
              onClick={() => navigate(routes.todo)}
              className="bg-primary p-4 border-2 border-black rounded-2xl w-full font-title hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              {t('todo')}
            </button>
            <button
              type="button"
              onClick={() => navigate(routes.journal)}
              className="bg-primary p-4 border-2 border-black rounded-2xl w-full font-title hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              {t('journal')}
            </button>
            <div className="relative flex justify-end items-end w-full h-full">
              <SvgButton
                src={clickCount > 5 ? sad : mascot}
                className="rotate-12"
                size={70}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setClickCount((prevCount) => prevCount + 1)}
                alt={'mascot'}
              />

              <div
                className={clsx(
                  '-top-5 -left-10 absolute bg-white opacity-0 px-4 py-2 border-2 border-black rounded-t-2xl rounded-l-2xl min-w-20 font-accent text-lg duration-300 ease-in-out',
                  isHovered && 'opacity-100 transition-opacity'
                )}
              >
                {clickCount > 5 ? t('sad') : t('mascot')}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 pb-6">
          <HomePlayer />
        </div>
      </div>
    </Container>
  )
}

export default HomeScreen
