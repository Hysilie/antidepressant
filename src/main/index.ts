import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

/* const iconPath =
  process.platform === 'win32'
    ? join(__dirname, '../../build/icon.ico') // Windows
    : process.platform === 'linux'
      ? join(__dirname, '../../build/icon.png') // Linux
      : join(__dirname, '../../build/icon.icns') // macOS
       */

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 500,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    icon: icon,
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
