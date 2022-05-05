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

    const startSignOrVerfication = () => {
        if(textFile == null || keyFile == null){
            window.api.makeDialog({
                title: processType +" archivo",
                message: "Selecciona un archivo y la llave...",
                type: "warning"
            });
            return
        }

        if(processType==="Firmar"){
            // TODO: Process of signature with textFile.data and keyFile.data
            var objectFile = {
                path: textFile.path,
                data:  textFile.data //! Change with the new string content
            }

            window.api.saveTxtSignFile(objectFile)

        }else{
            // TODO: Process of verification with textFile.data and keyFile.data

            var isValid = true; // TODO: This flag is the one to check if is a valid sign.

            var fileName = textFile.path.split("\\");
            fileName = fileName[fileName.length -1];
  
            window.api.makeDialog({
                title: "Verificación de Archivo.",
                message: "El archivo "+fileName+" "+(isValid ? "es auntentico ya que corresponde su firma."
                                                             :"no es autentico ya que no corresponde su firma."),
                type: (isValid ? "info" : "error")
            });
        }
 
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