//* preload.js

const {ipcRenderer, contextBridge} = require('electron');

const WINDOW_API = {
    makeDialog: (objectDialog) => ipcRenderer.send("makeDialog", objectDialog),
    askGenerationKeys: () => ipcRenderer.invoke("askGenerationKeys"),
    generateAndSaveKeys: () => ipcRenderer.send("generateAndSaveKeys"),
    getFile: (type) => ipcRenderer.invoke("getFile",type),
    saveTxtSignFile: (objectFile) => ipcRenderer.invoke("saveTxtSignFile",objectFile) 
}

contextBridge.exposeInMainWorld('api', WINDOW_API);