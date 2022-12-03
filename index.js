const { app, BrowserWindow, Menu } = require('electron')
const menu = require('./Menu');

Menu.setApplicationMenu(menu);

app.setName("S3DAL");
app.whenReady().then(() => {
  //createWindow();
})