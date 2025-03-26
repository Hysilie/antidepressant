export interface AuthContextData {
  currentUser: User | undefined
  handleConnexion: (email: string, password: string) => void
  handleRegister: (email: string, password: string, username: string) => void
  logout: () => void
  loading: boolean
}

export interface User {
  uid: string // Firebase Ref
  username: string
  email: string
  isLock?: boolean
  theme?: string
}
