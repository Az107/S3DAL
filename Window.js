const { app, BrowserWindow } = require('electron');

const createWindow = (filePath = undefined) => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    win.loadFile('view/index.html');
    win.setIcon('assets/S3DAL.png');
    
    win.webContents.on('did-finish-load', () => {
            if (filePath) {
                win.setRepresentedFilename(filePath);
                win.webContents.send('file-path', filePath);
            }
            win.webContents.openDevTools();
        });
}

module.exports = createWindow;