import { routes } from '@renderer/utils/Routes/routes'
import { Link } from 'react-router-dom'
import { Formik, Form, FormikProps } from 'formik'
import { trimmedValues } from './utils/trimmedValues'
import { ToastContainer } from 'react-toastify'

import { useAuth } from '@renderer/providers/Auth/useAuth'
import { loginValidationSchema } from './utils/Schemas/LoginValidation'
import Button from '@renderer/components/Button'
import Container from '@renderer/components/Container'
import Title from '@renderer/components/Title'
import InputField from '@renderer/components/InputField'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import ResetPasswordDialog from './ResetPasswordDialog'
import GoogleButton from './GoogleButton'

const LoginScreen = (): JSX.Element => {
  const { handleConnexion, sendResetPassword, signInWithGoogle } = useAuth()
  const { t } = useTranslation('translation', { keyPrefix: 'login' })
  const [openDialog, setOpenDialog] = useState(false)
  const formRef = useRef<FormikProps<{ email: string; password: string }> | null>(null)

  return (
    <Container spacing="large" primary className="w-full">
      <ToastContainer />
      <Title label={t('title')} />

      <Formik
        initialValues={{ email: '', password: '' }}
        innerRef={formRef}
        validationSchema={loginValidationSchema}
        onSubmit={async (values) => {
          const sanitizedValues = trimmedValues(values)
          const { email, password } = sanitizedValues
          handleConnexion(email, password)
        }}
      >
        {(formikProps) => {
          const { isSubmitting } = formikProps
          return (
            <Form className="flex flex-col w-full">
              <InputField name="email" label={t('email')} type="email" />
              <InputField name="password" label={t('password')} type="password" />
              <Button
                style={{ marginTop: 16 }}
                type="submit"
                label={t('submit')}
                loading={isSubmitting}
              />
            </Form>
          )
        }}
      </Formik>
      <div className="pb-2 w-full text-xs text-center" onClick={() => setOpenDialog(true)}>
        <p className="hover:scale-105 transition-transform duration-300 cursor-pointer">
          {t('reset')}
        </p>
      </div>
      <ResetPasswordDialog
        onConfirm={sendResetPassword}
        open={openDialog}
        title={t('dialog.title')}
        description={t('dialog.content')}
        onOpenChange={() => setOpenDialog(false)}
        confirmLabel={t('dialog.confirm')}
        cancelLabel={t('dialog.cancel')}
        emailLoginInput={formRef.current?.values.email ?? ''}
      />
      <GoogleButton {...{ signInWithGoogle }} />

      <p className="bottom-4 left-[115px] absolute text-xs text-center l">
        {t('signupPrompt')}
        <Link to={routes.signup} className="font-semibold">
          {t('signupLink')}
        </Link>
      </p>
    </Container>
  )
}

export default LoginScreen
