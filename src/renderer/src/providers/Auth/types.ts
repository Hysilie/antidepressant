import { PreferencesStates } from '../Preferences/types'

export interface AuthContextData {
  currentUser: User | undefined
  handleConnexion: (email: string, password: string) => void
  handleRegister: (email: string, password: string, username: string) => void
  sendResetPassword: (email: string) => void
  deleteAccount: () => void
  logout: () => void
  loading: boolean
}

export interface User {
  uid: string
  username: string
  email: string
  lockScreenCode?: number
  preferencesStates: PreferencesStates
}
