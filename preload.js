const { contextBridge, ipcRenderer } = require('electron');
const models = JSON.parse(path.readFileSync('models.json', 'utf8'))


contextBridge.exposeInMainWorld('electron', {
    models: models
  // Add any functions or variables you want to expose to the renderer process
});