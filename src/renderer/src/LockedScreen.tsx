import Container from './components/Container'
import { useLock } from './providers/Preferences/Lock/useLock'
import LockDialog from './features/Preferences/LockDialog'
import { useNavigate } from 'react-router'
import { routes } from './utils/Routes/routes'

const LockedScreen = (): JSX.Element => {
  const { checkCode } = useLock()
  const navigate = useNavigate()

  return (
    <Container spacing="large" primary>
      <LockDialog
        open={true}
        onClose={() => navigate(routes.journal)}
        mode={'check'}
        onCheckCode={checkCode}
        onCancel={() => navigate(routes.home)}
        toUnlockScreen
      />
    </Container>
  )
}

export default LockedScreen
