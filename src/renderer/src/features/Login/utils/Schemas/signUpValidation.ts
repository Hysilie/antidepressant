import * as Yup from 'yup'
import { passwordRegex } from './LoginValidation'

export const signUpValidationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Must be 3 characters or more')
    .max(20, 'Mist be 20 characters or less')
    .required('Required'),
  email: Yup.string().email('Invalid email adress').required('Required'),
  password: Yup.string()
    .min(12, 'Must be 12 characters or more')
    .matches(
      passwordRegex,
      'Must have at least one lowercase character, one uppercase character, one digit and one symbol'
    )
    .required('Required')
})
