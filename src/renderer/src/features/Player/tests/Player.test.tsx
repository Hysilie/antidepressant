/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import { PlayerContext } from '../../../providers/Player/PlayerContext'
import { PlayerControls } from '../PlayerControls'
import React from 'react' // We let here the React import for Jest

test('\n🧪✨ Integration tests for Player Controls: ', () => {
  const mockNext = jest.fn()
  const mockPrevious = jest.fn()

  jest.mock('../../../providers/Player/usePlayer', () => ({
    usePlayer: (): { next: jest.Mock; previous: jest.Mock } => ({
      next: jest.fn(),
      previous: jest.fn()
    })
  }))

  render(
    <PlayerContext.Provider
      value={{
        next: mockNext,
        previous: mockPrevious,
        togglePlayPause: jest.fn(),
        trackName: 'Mock Song',
        isPaused: false,
        openFolder: jest.fn(),
        playlist: [],
        resetPlaylist: jest.fn(),
        playTrack: jest.fn(),
        handleReplay: jest.fn(),
        handleShuffle: jest.fn(),
        currentTime: 0,
        duration: 0,
        progress: 0,
        handleProgressClick: jest.fn(),
        volume: 1,
        changeVolume: jest.fn(),
        isMuted: false,
        toggleMute: jest.fn(),
        isReplay: false,
        isShuffle: false
      }}
    >
      <PlayerControls />
    </PlayerContext.Provider>
  )

  fireEvent.click(screen.getByRole('button', { name: 'next' }))
  expect(mockNext).toHaveBeenCalled()

  fireEvent.click(screen.getByRole('button', { name: 'previous' }))
  expect(mockPrevious).toHaveBeenCalled()
})
