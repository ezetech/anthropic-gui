const path = require('path');

const { app, BrowserWindow } = require('electron');

const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');

const isDev = process.env.NODE_ENV === 'DEV';

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 1060,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      enableRemoteModule: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );

  if (isDev) {
    win.webContents.once('dom-ready', async () => {
      await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err))
        .finally(() => {
          win.webContents.openDevTools();
        });
    });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
