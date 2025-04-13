import { usePlayer } from '../../providers/Player/usePlayer'
import React from 'react' // We let here the React import for Jest

/**
 * This is a basic implementation of the PlayerControls component, created without using SVG elements.
 * The decision to exclude SVGs was made to address a configuration issue that was causing problems.
 * This simplified version is intended to facilitate integration testing, specifically to verify the functionality
 * of the "Previous" and "Next" buttons.
 */
export const PlayerControls = (): JSX.Element => {
  const { next, previous } = usePlayer()

  return (
    <div>
      <img src="" alt="previous" onClick={previous} role="button" />
      <img src="" alt="next" onClick={next} role="button" />
    </div>
  )
}
