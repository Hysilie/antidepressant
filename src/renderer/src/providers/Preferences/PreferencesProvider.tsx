import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useReducer } from 'react'
import { PreferencesContext } from './PreferencesContext'
import { defaultPreferencesState, isPreferencesStates } from './utils'
import { useAuth } from '../Auth/useAuth'
import { PreferencesAction, PreferencesStates } from './types'
import debounce from 'lodash/debounce'
import { db } from '../Auth/firebase/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export const PreferencesProvider: FC<PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth()

  /**
   * Reducer function to manage the state of preferences.
   *
   * @param state - The current state of preferences.
   * @param action - The action to be performed on the state.
   * @returns The updated state of preferences based on the action type.
   *
   * Action Types:
   * - `'reset'`: Resets the state to the default preferences state.
   * - `'get'`: Retrieves the current user's preferences state if valid; otherwise, returns the default preferences state.
   * - `'set'`: Updates a specific key in the state with a new value if the key is provided.
   * - `'switch'`: Toggles the boolean value of a specific key in the state if the key is provided.
   */
  const reducer = (state: PreferencesStates, action: PreferencesAction): PreferencesStates => {
    switch (action.type) {
      case 'reset': {
        return defaultPreferencesState
      }
      case 'get': {
        if (!isPreferencesStates(currentUser?.preferencesStates)) {
          return defaultPreferencesState
        }
        return currentUser.preferencesStates
      }
      case 'set': {
        return action.key != null ? { ...state, [action.key]: action.value } : state
      }
      case 'switch':
      default:
        return action.key != null
          ? {
              ...state,
              [action.key]: !state?.[action.key]
            }
          : state
    }
  }

  const [preferencesStates, dispatch] = useReducer(reducer, defaultPreferencesState)

  const resetAllPreferences = (): void => dispatch({ type: 'reset' })

  const deleteAccount = (): void => console.log('Delete Account')

  /**
   * Filters out undefined values from the given preferences object.
   *
   * @returns A new preferences object with all entries where the value is `undefined` removed.
   */
  const getCleanPreferences = (preferences: PreferencesStates): PreferencesStates =>
    Object.fromEntries(
      Object.entries(preferences).filter(([, value]) => value !== undefined)
    ) as PreferencesStates

  const updatePreferencesInFirestore = useCallback(async () => {
    try {
      if (!currentUser) {
        throw new Error('User is not defined')
      }
      const userRef = doc(db, 'Users', currentUser?.uid)
      const cleanedPreferences = getCleanPreferences(preferencesStates)
      await updateDoc(userRef, { preferencesStates: cleanedPreferences })
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ ...currentUser, preferencesStates: cleanedPreferences })
      )
    } catch (error) {
      console.error('Failed to update preferences in Firestore:', error)
    }
  }, [currentUser, preferencesStates])

  /**
   * Debounce the updatePreferencesInFirestore function to minimize Firestore writes.
   *
   */
  const debounceUpdatePreferences = useMemo(
    () =>
      debounce(() => {
        updatePreferencesInFirestore()
      }, 800),
    [updatePreferencesInFirestore]
  )

  useEffect(() => {
    dispatch({ type: 'get' })
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      debounceUpdatePreferences(preferencesStates)
    }
  }, [currentUser, debounceUpdatePreferences, preferencesStates])

  /**
   * Ensure any pending preference updates are flushed before the component unmounts.
   */
  useEffect(() => {
    return (): void => {
      debounceUpdatePreferences.flush()
    }
  }, [debounceUpdatePreferences])

  return (
    <PreferencesContext.Provider
      value={{
        deleteAccount,
        preferencesStates,
        resetAllPreferences,
        dispatchPreferences: dispatch
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}
