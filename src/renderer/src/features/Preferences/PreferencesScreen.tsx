import { PreferenceActionName, PreferencesStates } from '@renderer/providers/Preferences/types'
import { usePreferences } from '@renderer/providers/Preferences/usePreferences'
import { routes } from '@renderer/utils/Routes/routes'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { isDefined } from 'remeda'

const PreferencesScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const { deleteAccount, resetAllPreferences, dispatchPreferences, preferencesStates } =
    usePreferences()
  const { musicAutoplay, lockCode } = preferencesStates
  const handlePreference = useCallback(
    (
      typeValue: PreferenceActionName,
      keyValue?: keyof PreferencesStates,
      actionValue?: unknown
    ) => {
      dispatchPreferences({ type: typeValue, key: keyValue, value: actionValue })
    },
    [dispatchPreferences]
  )

  return (
    <div>
      <button onClick={() => navigate(routes.home)}>back</button>
      PreferencesScreen
      <div onClick={() => handlePreference('switch', 'musicAutoplay')}>
        Turn off the music when app start : {musicAutoplay ? 'true' : 'false'}
      </div>
      {isDefined(lockCode) ? (
        <div onClick={() => handlePreference('set', 'lockCode')}>Remove lockcode</div>
      ) : (
        <div onClick={() => handlePreference('set', 'lockCode', 1234)}>
          Lock Screen Code: {lockCode}
        </div>
      )}
      <div>Delete my data</div>
      <div onClick={resetAllPreferences}>Reset all preferences</div>
      <div onClick={deleteAccount}>Delete my account</div>
    </div>
  )
}

export default PreferencesScreen
