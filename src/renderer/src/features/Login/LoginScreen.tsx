import { routes } from '@renderer/utils/Routes/routes'
import { Link } from 'react-router'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { trimmedValues } from './utils/trimmedValues'
import { ToastContainer } from 'react-toastify'

import { useAuth } from '@renderer/providers/Auth/useAuth'
import { loginValidationSchema } from './utils/Schemas/LoginValidation'

const LoginScreen = (): JSX.Element => {
  const { handleConnexion } = useAuth()

  return (
    <div>
      <ToastContainer />
      <div>Login</div>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values) => {
          const sanitizedValues = trimmedValues(values)
          const { email, password } = sanitizedValues
          handleConnexion(email, password)
        }}
      >
        <Form>
          <div>
            <label htmlFor="email">Email</label>
            <Field name="email" type="text" />
            <ErrorMessage name="email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Field name="password" type="text" />
            <ErrorMessage name="password" />
          </div>
          <button type="submit">Submit</button>
        </Form>
      </Formik>

      <Link to={routes.signup}>No account ? Go Signup </Link>
    </div>
  )
}

export default LoginScreen
