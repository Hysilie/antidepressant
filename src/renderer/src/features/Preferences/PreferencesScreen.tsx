import { usePreferences } from '@renderer/providers/Preferences/usePreferences'
import { routes } from '@renderer/utils/Routes/routes'
import { useNavigate } from 'react-router'

const PreferencesScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const { deleteAccount } = usePreferences()
  return (
    <div>
      <button onClick={() => navigate(routes.home)}>back</button>
      PreferencesScreen
      <div>Turn off the music when app start</div>
      <div>Lock Screen Code</div>
      <div>Delete my data</div>
      <div onClick={deleteAccount}>Delete my account</div>
    </div>
  )
}

export default PreferencesScreen
