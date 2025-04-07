import { routes } from '@renderer/utils/Routes/routes'
import { Formik, Form } from 'formik'
import { Link } from 'react-router'

import { trimmedValues } from './utils/trimmedValues'
import { ToastContainer } from 'react-toastify'
import { useAuth } from '@renderer/providers/Auth/useAuth'
import { signUpValidationSchema } from './utils/Schemas/signUpValidation'
import Container from '@renderer/components/Container'
import Title from '@renderer/components/Title'
import { useTranslation } from 'react-i18next'
import InputField from '@renderer/components/InputField'
import Button from '@renderer/components/Button'

const SignUpScreen = (): JSX.Element => {
  const { handleRegister } = useAuth()
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
        <Form className="flex flex-col">
          <InputField name="username" label={t('username')} type="username" />
          <InputField name="email" label={t('email')} type="email" />
          <InputField name="password" label={t('password')} type="password" />
          <Button style={{ marginTop: 16 }} type="submit" label={t('submit')} />
        </Form>
      </Formik>
      <p className="block pt-4 text-xs text-center">
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
