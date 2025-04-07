import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { LockContext } from './LockContext'
import { useAuth } from '@renderer/providers/Auth/useAuth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@renderer/providers/Auth/firebase/firebase'

// TODO - Validate user code

export const LockProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()
  const [isScreenLocked, setIsScreenLocked] = useState(true)
  const userAlreadyHasCode = currentUser?.lockScreenCode != null

  const [updateCodeStep, setUpdateCodeStep] = useState<'checkCode' | 'newCode'>('checkCode')

  const checkCode = useCallback(
    async (code: number, toUnlockScreen?: boolean): Promise<boolean> => {
      try {
        if (!currentUser) {
          throw new Error('User is not defined')
        }
        const userRef = doc(db, 'Users', currentUser.uid)
        const userDoc = await getDoc(userRef)
        const isValid = userDoc.data()?.lockScreenCode === code
        if (isValid && toUnlockScreen) setIsScreenLocked(false)
        if (isValid) setUpdateCodeStep('newCode')
        return isValid
      } catch (error) {
        console.error('Error checking code:', error)
        return false
      }
    },
    [currentUser]
  )

  const createLockCode = useCallback(
    async (code: number): Promise<void> => {
      try {
        if (!currentUser) {
          throw new Error('User is not defined')
        }
        const userRef = doc(db, 'Users', currentUser?.uid)
        await updateDoc(userRef, { lockScreenCode: code })
        setUpdateCodeStep('checkCode')
      } catch (error) {
        console.log(error)
      }
    },
    [currentUser]
  )

  useEffect(() => {
    if (currentUser?.preferencesStates?.lockScreenEnabled != null) {
      setIsScreenLocked(currentUser?.preferencesStates?.lockScreenEnabled)
    }
  }, [currentUser])

  return (
    <LockContext.Provider
      value={{ isScreenLocked, createLockCode, userAlreadyHasCode, checkCode, updateCodeStep }}
    >
      {children}
    </LockContext.Provider>
  )
}
