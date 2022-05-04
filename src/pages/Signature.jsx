import LogoApp from '../components/LogoApp'
import BackIcon from '../assets/icons/back.svg?component'
import { Link } from 'react-router-dom';
import TogglePair from '../components/TogglePair';
import { useState } from 'react';
import SelectFile from '../components/SelectFile';
const Signature = () => {

    const [processType, setProcessType] = useState("Firmar");

    return (
        <div className="mainContainer">
            <aside>
                <Link to="/">
                    <div className='back'>
                        <div>
                            <BackIcon />
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
                <span>Archivo a {processType==="Firmar"?"firmar":"validar"}:</span>
                <SelectFile type="txt"/>
            </div>
        </div>
    );
}

export default Signature;