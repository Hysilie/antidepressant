import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  /**
   * Extends the global `Window` interface to include custom properties and methods
   * for interacting with the Electron API and other application-specific functionality.
   *
   * @property electron - Provides access to the Electron API.
   * @property electronAPI - Contains methods for interacting with audio files.
   * @property electronAPI.selectAudioFiles - Opens a file dialog to select audio files and returns their paths as a Promise.
   * @property electronAPI.readAudioFile - Reads the content of an audio file at the specified path and returns it as a Promise of a Uint8Array.
   * @property api - A placeholder for additional application-specific functionality, typed as `unknown`.
   */
  interface Window {
    electron: ElectronAPI
    electronAPI: {
      selectAudioFiles: () => Promise<string[]>
      readAudioFile: (filePath: string) => Promise<Uint8Array>
    }
    api: unknown
  }
}
