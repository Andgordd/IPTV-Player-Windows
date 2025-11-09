const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  saveConfig: (cfg) => ipcRenderer.invoke('save-config', cfg),
  loadConfig: () => ipcRenderer.invoke('load-config')
});
