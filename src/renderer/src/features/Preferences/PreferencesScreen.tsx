import Button from '@renderer/components/Button'
import ColorPicker from '@renderer/components/ColorPicker'
import ConfirmDialog from '@renderer/components/ConfirmDialog'
import Container from '@renderer/components/Container'
import Header from '@renderer/components/Header'
import Logout from '@renderer/components/icons/Logout'
import Switch from '@renderer/components/Switch'
import { useAuth } from '@renderer/providers/Auth/useAuth'
import { useLock } from '@renderer/providers/Preferences/Lock/useLock'
import { PreferenceActionName, PreferencesStates } from '@renderer/providers/Preferences/types'
import { usePreferences } from '@renderer/providers/Preferences/usePreferences'
import { routes } from '@renderer/utils/Routes/routes'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LockDialog from './LockDialog'
import LockedScreen from '@renderer/LockedScreen'
import UsernameDialog from './UsernameDialog'

const PreferencesScreen = (): JSX.Element => {
  const { deleteAccount, logout, updateUsername } = useAuth()
  const { createLockCode, userAlreadyHasCode, checkCode, updateCodeStep, isScreenLocked } =
    useLock()
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

  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUsernameDialog, setShowUsernameDialog] = useState(false)
  const [openLockDialog, setOpenLockDialog] = useState(false)

  const { t } = useTranslation('translation', { keyPrefix: 'preferences' })

  return isScreenLocked ? (
    <LockedScreen target={routes.preferences} />
  ) : (
    <Container spacing="large" className="flex flex-col w-full h-full overflow-x-hidden">
      <Header icon title={t('title')} target={routes.home} />

      <div className="flex flex-col flex-grow rounded-lg w-full overflow-hidden">
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="flex flex-col gap-4 my-2">
            <Switch
              label={t('autoplay')}
              id="ToggleMusic"
              onChange={() => handlePreference('switch', 'musicAutoplay')}
              checked={musicAutoplay}
            />
            <Switch
              label={t('lock')}
              id="LockScreen"
              onChange={() => {
                handlePreference('switch', 'lockScreenEnabled')
                setDisplayCode(!lockScreenEnabled && !userAlreadyHasCode ? true : false)
              }}
              checked={lockScreenEnabled}
            />

            <ColorPicker />

            <div className="mt-1 border-b border-black" />
            {lockScreenEnabled ? (
              <Button
                label={t('change')}
                onClick={() => setOpenLockDialog(true)}
                type="button"
                mode="inline"
              />
            ) : null}
            <Button
              label={t('username')}
              onClick={() => setShowUsernameDialog(true)}
              type="button"
              mode="inline"
            />
            <Button
              label={t('reset')}
              onClick={() => setShowResetDialog(true)}
              type="button"
              mode="inline"
            />
            <Button
              label={t('delete')}
              onClick={() => setShowDeleteDialog(true)}
              type="button"
              mode="inline"
            />
          </div>
        </div>

        <div className="p-2">
          <Button
            label={t('logout')}
            color={'bg-primary'}
            iconLeft={<Logout />}
            onClick={logout}
            type="button"
          />
        </div>
      </div>
      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title={t('resetDialog.title')}
        description={t('resetDialog.content')}
        cancelLabel={t('resetDialog.cancel')}
        confirmLabel={t('resetDialog.confirm')}
        onConfirm={() => {
          resetAllPreferences()
          setShowResetDialog(false)
        }}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t('deleteDialog.title')}
        description={t('deleteDialog.content')}
        cancelLabel={t('deleteDialog.cancel')}
        confirmLabel={t('deleteDialog.confirm')}
        onConfirm={() => {
          deleteAccount()
          setShowDeleteDialog(false)
        }}
      />
      <LockDialog
        open={openLockDialog || displayCode}
        onClose={() => {
          setOpenLockDialog(false)
          setDisplayCode(false)
        }}
        mode={displayCode ? 'create' : 'edit'}
        updateStep={updateCodeStep}
        onCheckCode={checkCode}
        onCreateCode={createLockCode}
      />
      <UsernameDialog
        open={showUsernameDialog}
        onOpenChange={() => setShowUsernameDialog(false)}
        onConfirm={updateUsername}
        title={t('usernameDialog.title')}
        description={t('usernameDialog.content')}
        confirmLabel={t('usernameDialog.confirm')}
        cancelLabel={t('usernameDialog.cancel')}
      />
    </Container>
  )
}

export default PreferencesScreen
