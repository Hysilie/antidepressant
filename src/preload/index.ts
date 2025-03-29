import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'fs'
import fsPromises from 'fs/promises'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

/**
 * Reads the contents of the specified file into a buffer.
 *
 * @constant buffer - A Buffer object containing the data of the file.
 * @see {@link  https://nodejs.org/api/buffer.html for more information about Buffer objects.}
 * @see {@link https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options | fs.readFileSync Documentation}
 */

contextBridge.exposeInMainWorld('electronAPI', {
  selectAudioFiles: () => ipcRenderer.invoke('select-audio-files'),
  readAudioFile: async (filePath: string): Promise<Uint8Array> => {
    const buffer = await fsPromises.readFile(filePath)
    return new Uint8Array(buffer)
  },
  checkFileExists: (filePath) => {
    try {
      return fs.existsSync(filePath)
    } catch (error) {
      console.log(`Error : ${error}, file not found`)
      return false
    }
  }
})
