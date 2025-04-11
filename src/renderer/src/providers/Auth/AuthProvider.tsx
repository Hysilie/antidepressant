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
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth, db } from './firebase/firebase'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { defaultPreferencesState } from '../Preferences/utils'

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

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('auth:google-login')
      const { accessToken, uid, email, displayName } = result

      const credential = GoogleAuthProvider.credential(null, accessToken)
      await signInWithCredential(auth, credential)

      const userDocRef = doc(db, 'Users', uid)
      const userSnap = await getDoc(userDocRef)

      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          uid,
          email,
          username: displayName ?? 'Anonymous',
          preferencesStates: defaultPreferencesState
        })
      }

      const userData: User = {
        uid,
        email,
        username: displayName ?? 'Anonymous',
        preferencesStates: defaultPreferencesState,
        lockScreenCode: undefined
      }

      localStorage.setItem('currentUser', JSON.stringify(userData))
      setCurrentUser(userData)
      navigate(routes.home, { replace: true })
    } catch (err) {
      console.error('Google auth failed:', err)
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
  const logout = async (): Promise<void> => {
    try {
      if (auth.currentUser) {
        await auth.signOut()
        setCurrentUser(undefined)
        localStorage.clear()
      }
    } catch (error) {
      console.error('Error during sign out:', error)
      toast.warn(
        'Session expired. Please sign in again or contact support if the issue persists.',
        { position: 'bottom-center' }
      )
    }
  }

  /*
   * Send reset password
   */
  const sendResetPassword = (email: string): void => {
    const auth = getAuth()
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success('Email sent successfully ☀️', { position: 'top-center' })
      })
      .catch((error) => {
        console.error('Error sending user email:', error)

        // ..
      })
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        handleConnexion,
        handleRegister,
        logout,
        loading,
        deleteAccount,
        sendResetPassword,
        signInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
