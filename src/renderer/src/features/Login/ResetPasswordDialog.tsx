import Button from '@renderer/components/Button'
import InputField from '@renderer/components/InputField'
import { Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { trimmedValues } from './utils/trimmedValues'

type ResetPasswordDialog = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: (email: string) => void
  emailLoginInput: string
}

const ResetPasswordDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  emailLoginInput
}: ResetPasswordDialog): JSX.Element | null => {
  const { t } = useTranslation('translation', { keyPrefix: 'login.dialog' })

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required')
  })

  return !open ? null : (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/30">
      <div className="bg-white shadow-xl p-6 rounded-2xl w-[90%] max-w-sm text-center">
        <h2 className="mb-2 font-bold text-xl">{title}</h2>
        <p className="mb-6 text-gray-700 text-sm">{description}</p>
        <Formik
          initialValues={{ email: emailLoginInput }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            const sanitizedValues = trimmedValues(values)
            const { email } = sanitizedValues
            onConfirm(email)
          }}
        >
          <Form className="flex flex-col items-center gap-4 mt-4">
            <InputField
              name={'email'}
              type="text"
              placeholder={t('placeholder')}
              className={'text-center border-2 border-black focus:outline-none focus:ring-0 '}
            />
            <div className="flex flex-col items-center gap-2">
              <Button type="submit" mode="inline" label={confirmLabel} />
              <Button
                label={cancelLabel}
                onClick={() => onOpenChange(false)}
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

export default ResetPasswordDialog
