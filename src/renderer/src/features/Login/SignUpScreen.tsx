import { routes } from '@renderer/utils/Routes/routes'
import { Formik, Field, ErrorMessage, Form } from 'formik'
import { Link } from 'react-router'

import { trimmedValues } from './utils/trimmedValues'
import { ToastContainer } from 'react-toastify'
import { signUpValidationSchema } from './utils/Schemas/SignUpValidation'
import { useAuth } from '@renderer/providers/Auth/useAuth'

const SignUpScreen = (): JSX.Element => {
  const { handleRegister } = useAuth()

  return (
    <div>
      <ToastContainer />
      <div>SignUp</div>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={signUpValidationSchema}
        onSubmit={async (values) => {
          const sanitizedValues = trimmedValues(values)
          const { email, password, username } = sanitizedValues
          handleRegister(email, password, username)
        }}
      >
        <Form>
          <div>
            <label htmlFor="username">Username</label>
            <Field name="username" type="text" />
            <ErrorMessage name="username" />
          </div>
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
      <Link to={routes.login}>Already signed up ? Go to login </Link>
    </div>
  )
}

export default SignUpScreen
