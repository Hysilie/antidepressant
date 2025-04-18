import { routes } from '@renderer/utils/Routes/routes'
import { Formik, Form } from 'formik'
import { Link } from 'react-router-dom'

import { trimmedValues } from './utils/trimmedValues'
import { ToastContainer } from 'react-toastify'
import { useAuth } from '@renderer/providers/Auth/useAuth'
import { signUpValidationSchema } from './utils/Schemas/signUpValidation'
import Container from '@renderer/components/Container'
import Title from '@renderer/components/Title'
import { useTranslation } from 'react-i18next'
import InputField from '@renderer/components/InputField'
import Button from '@renderer/components/Button'
import GoogleButton from './GoogleButton'

const SignUpScreen = (): JSX.Element => {
  const { handleRegister, signInWithGoogle } = useAuth()
  const { t } = useTranslation('translation', { keyPrefix: 'signup' })

  return (
    <Container spacing="large" primary style={{ overflow: 'scroll' }}>
      <ToastContainer />
      <Title label={t('title')} />
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={signUpValidationSchema}
        onSubmit={async (values) => {
          const sanitizedValues = trimmedValues(values)
          const { email, password, username } = sanitizedValues
          handleRegister(email, password, username)
        }}
      >
        {(formikProps) => {
          const { isSubmitting } = formikProps
          return (
            <Form className="flex flex-col -mt-2">
              <InputField name="username" label={t('username')} type="username" />
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

      <GoogleButton {...{ signInWithGoogle }} />
      <p className="block pt-2 text-xs text-center">
        {t('loginPrompt')}
        <Link to={routes.login} className="font-semibold">
          {t('loginLink')}
        </Link>
        .
      </p>
    </Container>
  )
}

export default SignUpScreen
