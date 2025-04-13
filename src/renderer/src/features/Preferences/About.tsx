import { FC } from 'react'
import { useTranslation } from 'react-i18next'

type AboutProps = {
  open: boolean
  onClose: () => void
}
const About: FC<AboutProps> = ({ open, onClose }): JSX.Element | undefined => {
  const { t } = useTranslation('translation', { keyPrefix: 'about' })

  return open ? (
    <div
      onClick={onClose}
      className="z-50 fixed inset-0 flex justify-center items-center bg-black/30"
    >
      <div className="bg-white shadow-xl p-4 rounded-2xl w-[90%] max-w-sm text-center">
        <h2 className="mb-2 font-bold text-xl">{t('by')} </h2>
        <div className="flex flex-col gap-1 py-2 text-sm text-left">
          <p>{t('cats')}</p>
          <p>{t('todo')}</p>
          <p>{t('music')}</p>
          <p>{t('journal')}</p>
        </div>
        <a
          href="https://github.com/Hysilie/antidepressant"
          target="_blank"
          className="text-gray-400 text-sm"
          rel="noreferrer"
        >
          {t('version')}
        </a>
      </div>
    </div>
  ) : undefined
}

export default About
