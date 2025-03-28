import { routes } from '@renderer/utils/Routes/routes'
import { useNavigate } from 'react-router'

const SettingsScreen = (): JSX.Element => {
  const navigate = useNavigate()
  return (
    <div>
      <button onClick={() => navigate(routes.home)}>back</button>
      SettingsScreen
    </div>
  )
}

export default SettingsScreen
