import { routes } from '@renderer/utils/Routes/routes'
import { Link } from 'react-router'
import { Formik, Form } from 'formik'
import { trimmedValues } from './utils/trimmedValues'
import { ToastContainer } from 'react-toastify'

import { useAuth } from '@renderer/providers/Auth/useAuth'
import { loginValidationSchema } from './utils/Schemas/LoginValidation'
import Button from '@renderer/components/Button'
import Container from '@renderer/components/Container'
import Title from '@renderer/components/Title'
import InputField from '@renderer/components/InputField'
import { useTranslation } from 'react-i18next'

const LoginScreen = (): JSX.Element => {
  const { handleConnexion } = useAuth()
  const { t } = useTranslation('translation', { keyPrefix: 'login' })

  return (
    <Container spacing="large" primary>
      <ToastContainer />
      <Title label={t('title')} />

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values) => {
          const sanitizedValues = trimmedValues(values)
          const { email, password } = sanitizedValues
          handleConnexion(email, password)
        }}
      >
        <Form className="flex flex-col">
          <InputField name="email" label={t('email')} type="email" />
          <InputField name="password" label={t('password')} type="password" />
          <Button style={{ marginTop: 16 }} type="submit" label={t('submit')} />
        </Form>
      </Formik>

      <p className="block pt-4 text-xs text-center">
        {t('signupPrompt')}
        <Link to={routes.signup} className="font-semibold">
          {t('signupLink')}
        </Link>
      </p>
    </Container>
  )
}

export default LoginScreen
