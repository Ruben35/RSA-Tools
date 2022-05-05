// * main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow,dialog, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
// Modules to create functionality
const JSZip = require('jszip');
const fs = require('fs');
const zip = new JSZip();
// Modules of crypto
var keypair = require('keypair');
var forge = require('node-forge');

var mainWindow;

const createWindow = () => {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 960,
    height: 600,
    maximizable: false,
    resizable: false,
    autoHideMenuBar: true,
    title: "RSA Tools",
    icon: __dirname + '/icons/Logo-RSA-Tools-1024x1024.png',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '/preload.js')
    }
  })

  // and load Vite Dev Preview when development or
  // load index.html of the app when build.
  mainWindow.loadURL(
      isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "/../build/index.html")}`
  )

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle("askGenerationKeys", async (event) => {

    const result = await dialog.showMessageBox(mainWindow, {
      title: 'Generar Llaves RSA',
      message: '¿Deseas generar un nuevo par de llaves RSA?',
      type: 'question',
      noLink: true,
      buttons: ['Si','No']
    })

    return result.response == 0;
  })

  // * FUNCTION FOR GENERATE KEY PAIR
  ipcMain.on("generateAndSaveKeys", async (event) => {
    //Requesting path to save the keys
    const result = await dialog.showSaveDialog(mainWindow,{
      title: 'Guardar llaves RSA...',
      filters:[{name:'ZIP Compressed Files', extensions:['zip']}],
      defaultPath: "RSA_KEYS.zip",
      buttonLabel: "Guardar",
    })

    if(!result.canceled){
      //* Generate keys
      var pair = keypair();
      
      //Writing keys on a .zip
      try{
        zip.file("PRIVATE_KEY.pem",pair.private);
        zip.file("PUBLIC_KEY.pem",pair.public);

        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream(result.filePath))
            .on('finish', function () {
                displaySimpleMessage("Generar Llaves RSA", "Llaves generadas exitosamente en: "+result.filePath, "info");
            });
      }catch(err){
        displaySimpleMessage("Error: Generar Llaves RSA", "No se pudo escribir el archivo comprimido con el par de llaves.", "error");
        console.error(err);
      }
    }
  })

  ipcMain.on("makeDialog",(event, objectDialog) => {
    displaySimpleMessage(objectDialog.title, objectDialog.message, objectDialog.type)
  })

  ipcMain.handle("getFile", async (event, type) =>{
    //Requesting File
    var dialogOptions = {
      title: "Selecciona archivo...",
      properties: ['openFile']
    }
    if(type==='txt')
      dialogOptions.filters=[{name:"Text Document", extensions:["txt"]}]
    else if(type==='pem')
      dialogOptions.filters=[{name:"Key File", extensions:["pem"]}]

    const result = await dialog.showOpenDialog(mainWindow, dialogOptions)

    if(result.canceled)
      return null
    
    //Reading data
    const dataString = fs.readFileSync(result.filePaths[0]).toString('utf-8');
    return { path:result.filePaths[0], data:dataString};  
  })

  // * FUNCTION FOR SIGN AND SAVE A TXT FILE
  ipcMain.handle("signAndSaveTxtFile", async (event, objectFile, keyFile) => {
    //Requesting path to save the new signed TextFile
    previousFileName=objectFile.path.split("\\");
    previousFileName=previousFileName[previousFileName.length - 1];
    newFileName=previousFileName.replace(".txt","") + "_SIGNED.txt"
    newPath=objectFile.path.replace(previousFileName,newFileName);

    const result = await dialog.showSaveDialog(mainWindow,{
      title: 'Guardar nuevo archivo firmado...',
      filters:[{name:'Text Document Signed', extensions:['txt']}],
      defaultPath: newPath,
      buttonLabel: "Guardar",
    })

    if(!result.canceled){
      // * Process of signaling the file
      try{ 
        var dataStringWithSign = signStringFile( objectFile.data, keyFile.data )

        try{
          fs.writeFileSync(result.filePath, dataStringWithSign)
          displaySimpleMessage("Generar Archivo Firmado", "Archivo firmado exitosamente en: "+result.filePath, "info");
          return true;
        }catch(f){
          displaySimpleMessage("Error: Generar Archivo Firmado", "No se pudo escribir el archivo firmado.", "error");
          console.error(f);
        }
      }catch(e){
        displaySimpleMessage("Error: Generar Archivo Firmado", "La llave introducida no es la privada o no está en un correcto formato (.pem).", "error");
        console.error(e)
      }
    }
  })
  
  ipcMain.handle("verifySignedTxtFile", (event, objectFile, keyFile) => {
    var result = {
      error: true,
      verified: false,
    }

    //Validating signed file.
    var dataFileArray = objectFile.data.split("\n---BEGIN DIGITAL SIGNATURE---\n");
    if(dataFileArray.length != 2){
      displaySimpleMessage("Error: Verificación de Firma", "Texto sin firma o con formato de firma incorrecto.", "error");
      return result;
    }

    var originalFile = dataFileArray[0];
    var signature = dataFileArray[1];
    try{
      // * Verifying DigitalSignature
      result.verified=verifyStringFile(originalFile, signature, keyFile.data);
      result.error=false;
    }catch(e){
      displaySimpleMessage("Error: Verificación de Firma", "La llave introducida no es la pública o no está en un correcto formato (.pem).", "error");
      console.error(e)
    }
    
    return result;
  })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require("electron-squirrel-startup")) {
  app.quit();
} 

// In this file you can include the rest of your app's specific main process
// code.

const displaySimpleMessage = (title, message, type) => {
  dialog.showMessageBox(mainWindow, {
    title: title,
    message: message,
    type: type,
    noLink: true,
    buttons: ['Okey']
  })
}

const signStringFile = ( fileDataString , privateKeyPEMString ) => {
  var privateKey = forge.pki.privateKeyFromPem(privateKeyPEMString);

  //Hash of fileDataString
  var md = forge.md.sha1.create();
      md.update(fileDataString, 'utf8');
  //Signature
  var signature = privateKey.sign(md);
  //Encoding to Base64 for better read on txt file
  var signatureBase64 = forge.util.encode64(signature);
  
  return fileDataString+"\n---BEGIN DIGITAL SIGNATURE---\n"+signatureBase64;
}

const verifyStringFile = ( fileDataString, signatureBase64, publicKeyPEMString ) => {
  var publicKey = forge.pki.publicKeyFromPem(publicKeyPEMString);

  //Hash of fileDataString
  var digest = forge.md.sha1.create();
  digest.update(fileDataString, 'utf8');
  //Decoding signature of Base64
  signature= forge.util.decode64(signatureBase64);
  //Verifying signature
  var verified = false;
  try{
    verified = publicKey.verify(digest.digest().bytes(), signature);
  }catch(e){
    //The publicKey doesn't match with the signature.
  }

  return verified;
}