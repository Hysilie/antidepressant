import * as Yup from 'yup'

export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).+$/

export const loginValidationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string()
    .min(12, 'Must be 12 characters or more')
    .matches(
      passwordRegex,
      'Must have at least one lowercase character, one uppercase character, one digit and one symbol'
    )
    .required('Required')
})
