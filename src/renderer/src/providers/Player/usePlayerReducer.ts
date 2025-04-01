import { Dispatch, useReducer } from 'react'
import { PlayerAction, PlayerState } from './types'

const initialPlayerState: PlayerState = {
  isPaused: true,
  isShuffle: false,
  isReplay: false,
  volume: 1,
  isMuted: false,
  volumeBeforeMute: 1
}

function reducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'play_pause':
      return { ...state, isPaused: !state.isPaused }

    case 'replay':
      return { ...state, isReplay: !state.isReplay }

    case 'shuffle':
      return { ...state, isShuffle: !state.isShuffle }

    case 'volume':
      return {
        ...state,
        volume: action.payload,
        isMuted: action.payload === 0,
        volumeBeforeMute: action.payload === 0 ? state.volumeBeforeMute : action.payload
      }

    case 'mute':
      if (state.isMuted) {
        return {
          ...state,
          isMuted: false,
          volume: state.volumeBeforeMute
        }
      } else {
        return {
          ...state,
          isMuted: true,
          volumeBeforeMute: state.volume,
          volume: 0
        }
      }

    default:
      return state
  }
}

export const usePlayerReducer = (): {
  state: PlayerState
  dispatch: Dispatch<PlayerAction>
} => {
  const [state, dispatch] = useReducer(reducer, initialPlayerState)

  return {
    state,
    dispatch
  }
}
