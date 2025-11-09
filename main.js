const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs-extra');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 760,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-file', async (event, filters) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'], filters });
  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('read-file', async (event, filePath, encoding='utf8') => {
  try { return await fs.readFile(filePath, encoding); } catch (e) { return { error: e.message }; }
});

ipcMain.handle('save-config', async (event, cfg) => {
  const cfgPath = path.join(app.getPath('userData'), 'config.json');
  await fs.writeJson(cfgPath, cfg, { spaces: 2 });
  return { ok: true };
});

ipcMain.handle('load-config', async () => {
  const cfgPath = path.join(app.getPath('userData'), 'config.json');
  if (await fs.pathExists(cfgPath)) return await fs.readJson(cfgPath);
  return null;
});
