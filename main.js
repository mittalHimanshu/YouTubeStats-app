const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const url = require('url')
const path = require('path')
const { ipcMain } = require('electron')
let mainWindow

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 550,
		height: 300,
		// frame: false 
	})

	if (isDev) {
		mainWindow.loadURL('http://localhost:4200')
		mainWindow.webContents.openDevTools()
	} else {
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'dist/YouTubeStats-app/index.html'),
			protocol: 'file:',
			slashes: true
		}));
	}
	mainWindow.on('closed', function () {
		mainWindow = null
	})
}

ipcMain.on('close-window', event => {
	mainWindow.close()
})

ipcMain.on('minimize-window', event => {
	mainWindow.minimize()
})

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})