//* preload.js

const {ipcRenderer, contextBridge} = require('electron');

const WINDOW_API = {
    makeDialog: (objectDialog) => ipcRenderer.send("makeDialog", objectDialog),
    askGenerationKeys: () => ipcRenderer.invoke("askGenerationKeys"),
    generateAndSaveKeys: () => ipcRenderer.send("generateAndSaveKeys"),
    getFile: (type) => ipcRenderer.invoke("getFile",type),
    signAndSaveTxtFile: (objectFile, keyFile) => ipcRenderer.invoke("signAndSaveTxtFile", objectFile, keyFile),
    verifySignedTxtFile: (objectFile, keyFile) => ipcRenderer.invoke("verifySignedTxtFile", objectFile, keyFile),
}

contextBridge.exposeInMainWorld('api', WINDOW_API);