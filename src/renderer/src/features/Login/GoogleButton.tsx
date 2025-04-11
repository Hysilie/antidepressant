import React from 'react'
import { useTranslation } from 'react-i18next'
import googleIcon from '../../assets/icons/google.svg'
import Button from '@renderer/components/Button'

interface GoogleButtonProps {
  signInWithGoogle: () => void
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ signInWithGoogle }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'login' })

  return (
    <div>
      <hr className="my-2 pb-2 border-black/10" />
      <Button
        label={t('google')}
        onClick={signInWithGoogle}
        iconLeft={<img src={googleIcon} alt="Google logo" className="w-5 h-5" />}
        style={{
          fontFamily: 'Quicksand, sans-serif',
          fontWeight: '600',
          color: 'black',
          fontSize: '0.875rem',
          textTransform: 'none'
        }}
      />
    </div>
  )
}

export default GoogleButton
