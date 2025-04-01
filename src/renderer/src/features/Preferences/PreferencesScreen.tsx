import { useLock } from '@renderer/providers/Preferences/Lock/useLock'
import { PreferenceActionName, PreferencesStates } from '@renderer/providers/Preferences/types'
import { usePreferences } from '@renderer/providers/Preferences/usePreferences'
import { routes } from '@renderer/utils/Routes/routes'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'

const PreferencesScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const { createLockCode, userAlreadyHasCode, checkCode, updateCodeStep } = useLock()
  const { deleteAccount, resetAllPreferences, dispatchPreferences, preferencesStates } =
    usePreferences()
  const { musicAutoplay, lockScreenEnabled } = preferencesStates
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
  const [displayCode, setDisplayCode] = useState(false)
  const [code, setCode] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <div>
      <button onClick={() => navigate(routes.home)}>back</button>
      PreferencesScreen
      <div onClick={() => handlePreference('switch', 'musicAutoplay')}>
        Turn off the music when app start : {musicAutoplay ? 'true' : 'false'}
      </div>
      <div
        onClick={() => {
          handlePreference('switch', 'lockScreenEnabled')
          setDisplayCode(!lockScreenEnabled && !userAlreadyHasCode ? true : false)
        }}
      >
        LockCode {lockScreenEnabled ? 'true' : 'false'}
      </div>
      {displayCode ? (
        <form>
          <input
            placeholder="display code 4 digit number"
            value={code}
            name=""
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={() => {
              createLockCode(parseInt(code, 10))
              setDisplayCode(false)
            }}
          >
            submit
          </button>
        </form>
      ) : null}
      <div>Delete my data</div>
      <div onClick={resetAllPreferences}>Reset all preferences</div>
      <div onClick={deleteAccount}>Delete my account</div>
      <div onClick={() => setOpenDialog(true)}>Change Lock Code : </div>
      {openDialog ? (
        <>
          {updateCodeStep === 'checkCode' ? (
            <div>
              <input placeholder="Enter current code" onChange={(e) => setCode(e.target.value)} />
              <button
                onClick={() => {
                  checkCode(parseInt(code, 10))
                  setCode('')
                }}
              >
                Verify
              </button>
            </div>
          ) : (
            <div>
              <input
                placeholder="Enter new code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                onClick={() => {
                  createLockCode(parseInt(code, 10))
                  setOpenDialog(false)
                }}
              >
                Submit New Code
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}

export default PreferencesScreen
