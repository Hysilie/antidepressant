import { loginValidationSchema } from '../utils/Schemas/LoginValidation'
import { signUpValidationSchema } from '../utils/Schemas/signUpValidation'
describe('\n🧪 ✨ Login ValidationSchema with multiple values:', () => {
  test('validate Schema with empty object', async () => {
    const emptySchema = {}
    await expect(loginValidationSchema.validate(emptySchema)).rejects.toThrow()
  })

  test('validate Schema with valid data', async () => {
    const validSchema = {
      email: 'user@email.com',
      password: 'StrongPassword@123'
    }
    await expect(loginValidationSchema.validate(validSchema)).resolves.toBeTruthy()
  })

  test('validate Schema with missing email', async () => {
    const invalidSchema = {
      password: 'password'
    }
    await expect(loginValidationSchema.validate(invalidSchema)).rejects.toThrow()
  })

  test('validate Schema with invalid password', async () => {
    const invalidSchema = {
      email: 'user@email.com',
      password: '123'
    }
    await expect(loginValidationSchema.validate(invalidSchema)).rejects.toThrow()
  })
})

describe('\n🧪 ✨ SignUp ValidationSchema with multiple values:', () => {
  test('validate Schema with empty object', async () => {
    const emptySchema = {}
    await expect(signUpValidationSchema.validate(emptySchema)).rejects.toThrow()
  })

  test('validate Schema with valid data', async () => {
    const validSchema = {
      username: 'Username',
      email: 'user@email.com',
      password: 'StrongPassword@123'
    }
    await expect(signUpValidationSchema.validate(validSchema)).resolves.toBeTruthy()
  })

  test('validate Schema with missing username', async () => {
    const invalidSchema = {
      email: 'user@email.com',
      password: 'password'
    }
    await expect(signUpValidationSchema.validate(invalidSchema)).rejects.toThrow()
  })
  test('validate Schema with missing email', async () => {
    const invalidSchema = {
      username: 'Username',
      password: 'password'
    }
    await expect(signUpValidationSchema.validate(invalidSchema)).rejects.toThrow()
  })

  test('validate Schema with missing password', async () => {
    const invalidSchema = {
      username: 'Username',
      email: 'user@email.com'
    }
    await expect(signUpValidationSchema.validate(invalidSchema)).rejects.toThrow()
  })

  test('validate Schema with invalid password', async () => {
    const invalidSchema = {
      username: 'Username',
      email: 'user@email.com',
      password: '123'
    }
    await expect(signUpValidationSchema.validate(invalidSchema)).rejects.toThrow()
  })
})
