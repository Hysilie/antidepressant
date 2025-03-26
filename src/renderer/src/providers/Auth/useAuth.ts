import { useContext } from 'react'
import { isEmpty } from 'remeda'
import { AuthContextData } from './types'
import { AuthContext } from './AuthContext'

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext)

  if (isEmpty(context)) {
    throw new Error('useAuth must be used withing a AuthProvider')
  }
  return context
}
