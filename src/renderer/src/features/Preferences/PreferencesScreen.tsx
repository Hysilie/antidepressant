import { useAuth } from '@renderer/providers/Auth/useAuth'
import { useLock } from '@renderer/providers/Preferences/Lock/useLock'
import { colorOptions } from '@renderer/providers/Preferences/Theme/colors'
import { useTheme } from '@renderer/providers/Preferences/Theme/useTheme'
import {
  PreferenceActionName,
  PreferencesStates,
  Theme
} from '@renderer/providers/Preferences/types'
import { usePreferences } from '@renderer/providers/Preferences/usePreferences'
import { routes } from '@renderer/utils/Routes/routes'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'

const PreferencesScreen = (): JSX.Element => {
  const navigate = useNavigate()
  const { deleteAccount } = useAuth()
  const { createLockCode, userAlreadyHasCode, checkCode, updateCodeStep } = useLock()
  const { resetAllPreferences, dispatchPreferences, preferencesStates } = usePreferences()
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
  const { setColor, color } = useTheme()

  return (
    <div>
      <button onClick={() => navigate(routes.home)}>back</button>
      PreferencesScreen
      <br />
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
      <h1 className="font-title text-primary text-3xl">Theme : {color}</h1>
      <div className="flex flex-wrap gap-3 mt-4">
        {colorOptions.map(({ hex, name }) => (
          <button
            key={hex}
            onClick={() => setColor(name as Theme)}
            className="border-2 rounded-full w-10 h-10"
            style={{
              backgroundColor: hex
            }}
            title={hex}
          />
        ))}
      </div>
    </div>
  )
}

export default PreferencesScreen
