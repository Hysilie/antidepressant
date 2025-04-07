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

const PreferencesScreen = (): JSX.Element => {
  const { deleteAccount, logout } = useAuth()
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

  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [openLockDialog, setOpenLockDialog] = useState(false)

  const { t } = useTranslation('translation', { keyPrefix: 'preferences' })

  return (
    <Container spacing="large" primary style={{ overflow: 'scroll' }}>
      <Header icon title={t('title')} target={routes.home} />

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

        <div className="my-2 border-b border-black" />
        {lockScreenEnabled ? (
          <Button
            label={t('change')}
            onClick={() => setOpenLockDialog(true)}
            type="button"
            mode="inline"
          />
        ) : null}
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

      <div className="mt-8">
        <Button label={t('logout')} iconLeft={<Logout />} onClick={logout} type="button" />
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
    </Container>
  )
}

export default PreferencesScreen
