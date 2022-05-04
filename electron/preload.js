//* preload.js

const {ipcRenderer, contextBridge} = require('electron');

const WINDOW_API = {
    askGenerationKeys: () => ipcRenderer.invoke("askGenerationKeys"),
    saveGeneratedKeys: (objectKeys) => ipcRenderer.send("saveGeneratedKeys", objectKeys)
}

contextBridge.exposeInMainWorld('api', WINDOW_API);