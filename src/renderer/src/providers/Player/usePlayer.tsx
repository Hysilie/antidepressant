import { useContext } from 'react'
import { isEmpty } from 'remeda'
import { PlayerContextData } from './types'
import { PlayerContext } from './PlayerContext'

export const usePlayer = (): PlayerContextData => {
  const context = useContext(PlayerContext)

  if (isEmpty(context)) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
