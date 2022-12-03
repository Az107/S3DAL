const {Menu, MenuItem, app, BrowserWindow, dialog } = require('electron')
const createWindow = require('./Window');
const menu = new Menu();
menu.append(new MenuItem({
    label: 'Archivo',
    submenu: [
        // Agregar las opciones secundarias del submenú "Archivo"
        {
            label: 'Ocultar otros',
            // Definir la acción que se ejecutará al hacer clic en esta opción
            click: () => {
                // Obtener una lista de todas las ventanas de la aplicación
                const mainWindow = BrowserWindow.getFocusedWindow();
                const windows = BrowserWindow.getAllWindows();
                
            // Ocultar todas las ventanas excepto la ventana activa
            windows.forEach(win => {
            if (win !== mainWindow) {
                win.hide();
            }
            });
        }
      },
      {
        label: 'Ocultar S3DAL',
        // Definir la acción que se ejecutará al hacer clic en esta opción
        click: () => {
            const mainWindow = BrowserWindow.getFocusedWindow();
            mainWindow.hide();
        }
      },
      {type: 'separator'},
      {
        label: 'Salir de  S3DAL',
        // Definir la acción que se ejecutará al hacer clic en esta opción
        click: () => {
          app.quit();
        },
        accelerator: 'Cmd+Q'
      }
    ]
  }));

// Agregar el submenú "Archivo" a la barra de menú
menu.append(new MenuItem({
  label: 'Archivo',
  submenu: [
    // Agregar las opciones secundarias del submenú "Archivo"
    {
      label: 'Nuevo',
      // Definir la acción que se ejecutará al hacer clic en esta opción
      click: () => {
        createWindow();
      },
      accelerator: 'Cmd+N'
    },
    {
      label: 'Abrir...',
      // Definir la acción que se ejecutará al hacer clic en esta opción
      click: () => {
        const filePaths = dialog.showOpenDialogSync(undefined, {
            // Permite seleccionar solo archivos .obj
            filters: [{ name: 'Object files', extensions: ['obj'] }],
            // Permite seleccionar solo un archivo
            properties: ['openFile'],
          });
  
          // Si se seleccionó un archivo, obtén su ruta
          if (filePaths && filePaths.length > 0) {
            const filePath = filePaths[0];
  
            createWindow(filePath);
            console.log(filePath);
          }
      }
    },
    {type: 'separator'},
    {
        label: 'Cerrar ventana',
        // Definir la acción que se ejecutará al hacer clic en esta opción
        click: () => {
            const mainWindow = BrowserWindow.getFocusedWindow();
            mainWindow.close();
        },
        accelerator: 'Cmd+W'
    },
    {
        label: 'Cerrar todas las ventanas',
        // Definir la acción que se ejecutará al hacer clic en esta opción
        click: () => {
            const windows = BrowserWindow.getAllWindows();
            windows.forEach(window => window.close());
        },
    },
  ]
}));

menu.append(new MenuItem({
    label: 'Objeto',
    submenu: [
      // Agregar las opciones secundarias del submenú "Archivo"
      {
        label: 'Pausar animacion',
        // Definir la acción que se ejecutará al hacer clic en esta opción
        click: () => {
            BrowserWindow.getFocusedWindow().webContents.send('stop-animation');
        }
      },
      {
        label: 'Cambiar color',
        // Definir la acción que se ejecutará al hacer clic en esta opción
        click: () => {
        }
      },
      {
        label: 'Importar textura...',
        click: () => {}
      }
    ]
  }));

module.exports = menu;
