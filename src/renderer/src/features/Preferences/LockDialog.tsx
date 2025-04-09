import Button from '@renderer/components/Button'
import InputField from '@renderer/components/InputField'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

type LockDialogProps = {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit' | 'check'
  updateStep?: 'checkCode' | 'newCode'
  onCheckCode: (code: number, toUnlockScreen?: boolean) => void
  onCreateCode?: (code: number) => void
  toUnlockScreen?: boolean
  onCancel?: () => void
}

const LockDialog = ({
  toUnlockScreen,
  open,
  onClose,
  updateStep,
  onCheckCode,
  onCancel,
  onCreateCode,
  mode
}: LockDialogProps): JSX.Element | null => {
  const { t } = useTranslation('translation', { keyPrefix: 'preferences.lockDialog' })

  const validationSchema = Yup.object().shape({
    code: Yup.string()
      .matches(/^\d{4}$/, 'Enter a valid 4-digit code')
      .required('Required')
  })

  const handleSubmit = (values: { code: string }): void => {
    const parsedCode = parseInt(values.code, 10)
    if (isNaN(parsedCode)) return
    if (mode === 'check') {
      onCheckCode(parsedCode, toUnlockScreen)
    }
    if (mode === 'create' && onCreateCode) {
      onCreateCode(parsedCode)
      onClose()
    } else {
      if (updateStep === 'checkCode') {
        onCheckCode(parsedCode)
      } else {
        if (onCreateCode) onCreateCode(parsedCode)
        onClose()
      }
    }
  }

  return !open ? null : (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/30">
      <div className="bg-white shadow-xl p-6 rounded-2xl w-[90%] max-w-sm text-center">
        <h2 className="mb-2 font-bold text-xl">
          {mode === 'create'
            ? t('titleCreate')
            : mode === 'check'
              ? t('titleVerify')
              : updateStep === 'checkCode'
                ? t('titleVerify')
                : t('titleCreateNew')}
        </h2>
        {mode === 'create' || updateStep === 'newCode' ? (
          <p className="mb-6 text-gray-700 text-sm">{t('content')}</p>
        ) : null}
        <Formik
          key={updateStep === 'newCode' ? 'new-code-reset' : 'lock-dialog'}
          initialValues={{ code: '' }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col items-center gap-4 mt-4">
            <InputField
              name={'code'}
              type="text"
              maxLength={4}
              placeholder={t('placeholder')}
              className={'text-center border-2 border-black focus:outline-none focus:ring-0 '}
            />

            <div className="flex flex-col items-center gap-2 w-full">
              <Button
                mode="inline"
                label={
                  mode === 'create'
                    ? t('titleCreate')
                    : updateStep === 'checkCode'
                      ? t('submitVerify')
                      : t('submitCreate')
                }
                type="submit"
              />
              <Button
                label={t('cancel')}
                onClick={mode === 'check' ? onCancel : onClose}
                type="button"
                color="bg-primary"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default LockDialog
