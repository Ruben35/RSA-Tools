//* preload.js

const {ipcRenderer, contextBridge} = require('electron');

const WINDOW_API = {
    makeDialog: (objectDialog) => ipcRenderer.send("makeDialog", objectDialog),
    askGenerationKeys: () => ipcRenderer.invoke("askGenerationKeys"),
    saveGeneratedKeys: (objectKeys) => ipcRenderer.send("saveGeneratedKeys", objectKeys),
    getFile: (type) => ipcRenderer.invoke("getFile",type),
}

contextBridge.exposeInMainWorld('api', WINDOW_API);