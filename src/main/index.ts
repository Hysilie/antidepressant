import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../renderer/src/providers/Auth/firebase/firebase'

/*  Google  */
ipcMain.handle('auth:google-login', async () => {
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
      webPreferences: {
        nodeIntegration: false
      }
    })

    const CLIENT_ID = '425147394264-4h91sghs38v407c3gjqvqrfd7u7rlp23.apps.googleusercontent.com'
    const redirectUri = 'http://localhost'

    const providerUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=profile%20email%20openid`

    authWindow.loadURL(providerUrl)

    authWindow.webContents.on('will-redirect', async (_, url) => {
      if (url.startsWith('http://localhost')) {
        const match = url.match(/access_token=([^&]*)/)
        const token = match?.[1]
        if (token) {
          authWindow.close()
          try {
            const credential = GoogleAuthProvider.credential(null, token)
            const result = await signInWithCredential(auth, credential)
            const userData = {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            }
            resolve(userData)
          } catch (error) {
            console.error('❌ Error during sign-in:', error)
            reject(error)
          }
        } else {
          console.error('❌ No token found in redirect URL')
          reject(new Error('No token found'))
        }
      }
    })
  })
})

const iconPath =
  process.platform === 'win32'
    ? join(__dirname, '../../build/icon.ico') // Windows
    : process.platform === 'linux'
      ? join(__dirname, '../../build/icon.png') // Linux
      : join(__dirname, '../../build/icon.icns') // macOS

const getUserImagePath = (filename: string, userId: string): string =>
  path.join(app.getPath('userData'), 'images', userId, filename)

ipcMain.handle('save-image', async (_, buffer: ArrayBuffer, filename: string, userId: string) => {
  const folder = path.join(app.getPath('userData'), 'images', userId)
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })

  const filePath = getUserImagePath(filename, userId)
  await fs.promises.writeFile(filePath, Buffer.from(buffer))
})

ipcMain.handle('get-image-url', async (_, filename: string, userId: string) => {
  const filePath = getUserImagePath(filename, userId)
  return `file://${filePath}`
})

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 500,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.setAboutPanelOptions({
  iconPath: icon,
  applicationName: 'Antidepressant',
  applicationVersion: 'App Version : 1.0.0',
  version: '1.0.0',
  credits: 'Made with ❤️ by Hysilie'
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/**
 * Opens a file dialog to allow the user to select one or more audio files.
 *
 * @returns An object containing:
 * - `canceled`: A boolean indicating whether the dialog was canceled.
 * - `filePaths`: An array of strings representing the paths of the selected files.
 *
 * The dialog is configured with the following options:
 * - `properties`: Allows selecting multiple files (`multiSelections`) and ensures only files can be selected (`openFile`).
 * - `filters`: Restricts the selectable files to audio files with extensions `mp3`, `wav`, or `ogg`.
 */
ipcMain.handle('select-audio-files', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg'] }]
  })

  if (canceled) return []
  return filePaths
})

ipcMain.handle('open-external-link', async (_, url) => {
  await shell.openExternal(url)
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
