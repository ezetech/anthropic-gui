const path = require('path');

const { app, BrowserWindow } = require('electron');

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
    process.env.NODE_ENV === 'DEV'
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  );
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
