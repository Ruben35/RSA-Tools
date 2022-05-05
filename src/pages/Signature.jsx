import LogoApp from '../components/LogoApp'
import BackIcon from '../assets/icons/back.svg?component'
import { Link } from 'react-router-dom';
import TogglePair from '../components/TogglePair';
import { useState } from 'react';
import SelectFile from '../components/SelectFile';

const Signature = () => {

    const [processType, setProcessType] = useState("Firmar");
    const [textFile, setTextFile] = useState(null);
    const [keyFile, setKeyFile] = useState(null);

    const startSignOrVerfication = async () => {
        //Validating existance of textFile and KeyFile
        if(textFile == null || keyFile == null){
            window.api.makeDialog({
                title: processType +" archivo",
                message: "Selecciona un archivo y la llave...",
                type: "warning"
            });
            return
        }

        //Initialize of process of sign or verification
        var allGood = false;

        if(processType==="Firmar"){
            allGood = await window.api.signAndSaveTxtFile(textFile, keyFile); // * Process of signing
        }else{
            var result = await window.api.verifySignedTxtFile(textFile, keyFile); // * Process of verification
            allGood = !result.error;

            if(allGood){
                var isValid = result.verified; // Here is the result of the verification process.

                var fileName = textFile.path.split("\\");
                fileName = fileName[fileName.length -1];
      
                window.api.makeDialog({
                    title: "Verificación de Archivo.",
                    message: "El archivo "+fileName+" "+(isValid ? "es auntentico ya que corresponde a su firma."
                                                                 :"no es autentico ya que no corresponde a su firma."),
                    type: (isValid ? "info" : "error")
                });
            }
        }
        //Refreshing if there was no error.
        if(allGood)
            window.location.reload(false)
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
                <SelectFile type="pem" onChange={(v) => setKeyFile(v)}/>
                <div className='buttonMake'>
                    <button onClick={startSignOrVerfication}>{processType==="Firmar"?"Firmar":"Verificar"}</button>
                </div>
            </div>
        </div>
    );
}

export default Signature;