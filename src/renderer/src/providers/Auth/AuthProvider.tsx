import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { User } from './types'
import { AuthContext } from './AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { isDefined } from 'remeda'
import { routes } from '@renderer/utils/Routes/routes'
import { toast } from 'react-toastify'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth, db } from './firebase/firebase'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * Synchronizes the current user state with localStorage or Firebase Auth state changes.
   */
  useEffect(() => {
    const cachedUser = localStorage.getItem('currentUser')
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser)
        setCurrentUser(parsed)
        setLoading(false)
        return
      } catch (e) {
        console.warn('Erreur parsing localStorage currentUser', e)
      }
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('onAuthStateChanged:', user)
      if (!user) {
        setCurrentUser(undefined)
        setLoading(false)
        return
      }

      try {
        const docRef = doc(db, 'Users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const { email, uid, username, preferencesStates, lockScreenCode } = docSnap.data()
          const userData: User = { email, uid, username, preferencesStates }
          setCurrentUser({ ...userData, lockScreenCode })
          localStorage.setItem('currentUser', JSON.stringify(userData))
        }
      } catch (error) {
        console.error('Error fetching user document:', error)
      } finally {
        setLoading(false)
      }
    })

    return (): void => unsubscribe()
  }, [])

  useEffect(() => {
    if (isDefined(currentUser)) {
      if (location.pathname === routes.login || location.pathname === routes.signup) {
        navigate(routes.home, { replace: true })
      }
    }
  }, [currentUser, location.pathname, navigate])

  /**
   * Connect a user with firebase email and password method
   *
   * @param email
   * @param password
   * @returns The promise is resolved when the connexion is done
   */
  const handleConnexion = async (email: string, password: string): Promise<void> => {
    if (!email || !password) {
      toast.error('An unknown error occurred', { position: 'bottom-center' })
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { position: 'bottom-center' })
      } else {
        toast.error('An unknown error occurred', { position: 'bottom-center' })
      }
    }
  }

  /**
   * Create a user with firebase email and password method and create doc to Users table
   *
   * @param email
   * @param password
   * @param username
   * @returns The promise is resolved when the register is done
   */
  const handleRegister = async (
    email: string,
    password: string,
    username: string
  ): Promise<void> => {
    if (!email || !password || !username) {
      toast.error('An unknown error occurred', { position: 'bottom-center' })
      return
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      const user = auth.currentUser
      if (user) {
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          username: username,
          uid: user.uid
        })
      }
      toast.success('User registered successfully ☀️', { position: 'top-center' })
      setTimeout(() => navigate(routes.login), 6000)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { position: 'bottom-center' })
      } else {
        toast.error('An unknown error occurred', { position: 'bottom-center' })
      }
    }
  }

  const deleteAccount = useCallback(async (): Promise<void> => {
    try {
      if (!currentUser || !auth.currentUser) {
        throw new Error('User is not defined')
      }
      const userRef = doc(db, 'Users', currentUser?.uid)
      await deleteDoc(userRef)
      await deleteUser(auth?.currentUser)

      setCurrentUser(undefined)
      navigate(routes.login, { replace: true })
    } catch (error) {
      console.error('Error deleting user account:', error)
    }
  }, [currentUser, navigate])

  /**
   * Log out the user with firebase method and clean local storage
   */
  const logout = (): void => {
    if (auth.currentUser) auth.signOut()
    setCurrentUser(undefined)
    localStorage.clear()
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        handleConnexion,
        handleRegister,
        logout,
        loading,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
