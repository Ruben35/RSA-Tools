import LogoApp from '../components/LogoApp'
import BackIcon from '../assets/icons/back.svg?component'
import { Link } from 'react-router-dom';
import TogglePair from '../components/TogglePair';
import { useState } from 'react';
import SelectFile from '../components/SelectFile';
import CryptoJS from 'crypto-js';
import rsa from 'js-crypto-rsa';

const Signature = () => {

    const [processType, setProcessType] = useState("Firmar");
    const [textFile, setTextFile] = useState(null);
    const [keyFile, setKeyFile] = useState(null);

    const startSignOrVerfication = () => {
        var enc = new TextEncoder()
        var dec = new TextDecoder();

        if(textFile == null || keyFile == null){
            window.api.makeDialog({
                title: processType +" archivo",
                message: "Selecciona un archivo y la llave...",
                type: "warning"
            });
            return
        }

        if(processType==="Firmar"){
            const private_key = JSON.parse(keyFile.data);
            
            rsa.sign(
                enc.encode(textFile.data),
                private_key,
                'SHA-256'
                ).then( (signature) => {
                // now you get the signature in Uint8Array
                var objectFile = {
                    path: textFile.path,
                    data:  textFile.data + "\n====DIGITAL-SIGNATURE====\n" + dec.decode(signature) // Cast Uint8Array to String
                }

                window.api.saveTxtSignFile(objectFile)
                
            });

        }else{
            // TODO: Process of verification with textFile.data and keyFile.data
            var file_elements = textFile.data.split("\n====DIGITAL-SIGNATURE====\n");
            const public_key = JSON.parse(keyFile.data);

            console.log(file_elements[0]);
            console.log(file_elements[1]);

            rsa.verify(
                enc.encode(file_elements[0]),
                enc.encode(file_elements[1]),
                public_key,
                'SHA-256'
            ).then( (valid) => {
                console.log(valid);
                var fileName = textFile.path.split("\\");
                fileName = fileName[fileName.length -1];
    
                window.api.makeDialog({
                    title: "Verificación de Archivo.",
                    message: "El archivo "+fileName+" "+(valid ? "es auntentico ya que corresponde su firma."
                                                                :"no es autentico ya que no corresponde su firma."),
                    type: (valid ? "info" : "error")
                });
            });
        }
 
        //window.location.reload(false)
    }

    return (
        <div className="mainContainer">
            <aside>
                <Link to="/">
                    <div className='back'>
                        <div>
                            <BackIcon/>
                        </div>
                    </div>
                </Link>
                <div className='appInfo'>
                    <LogoApp />
                    <span>RSA Tools</span>
                </div>
                <TogglePair 
                    firstOption="Firmar"
                    secondOption="Verificar"
                    onChange={(value) => setProcessType(value)}
                />
            </aside>
            <div>
                <span>Archivo a {processType==="Firmar"?"firmar":"verificar"}:</span>
                <SelectFile type="txt" onChange={(v) => setTextFile(v)}/>
                <span>{processType==="Firmar"?"Llave privada:":"Llave pública:"}</span>
                <SelectFile type="jwk" onChange={(v) => setKeyFile(v)}/>
                <div className='buttonMake'>
                    <button onClick={startSignOrVerfication}>{processType==="Firmar"?"Firmar":"Verificar"}</button>
                </div>
            </div>
        </div>
    );
}

export default Signature;