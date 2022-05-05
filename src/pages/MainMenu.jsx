import LogoApp from '../components/LogoApp'
import { Link } from 'react-router-dom';

const MainMenu = () => {

    const handleGenerationKeys = async () => {
        const startGeneration = await window.api.askGenerationKeys();

        if(startGeneration)
            window.api.generateAndSaveKeys();
    }

    return (
        <div className="mainMenu">
            <div className='appInfo'>
                <LogoApp />
                <span>RSA Tools</span>
            </div>
            <div className='menuInfo'>
                <p>
                    Elige la herramienta RSA que deseas utilizar:
                </p>
            </div>
            <div className='mainButtons'>
                <button onClick={() => handleGenerationKeys()}>
                    Generar Llaves
                </button>
                {/* <Link to="/cipher"> */}
                    <button onClick={() => {
                        const dialog={
                            title:"Coming soon...",
                            type:"info",
                            message:"Cifrar/Descifrar en construcción...",
                        }
                        window.api.makeDialog(dialog);
                    }}>
                        Cifrar/Descifrar
                    </button>
                {/* </Link> */}
                <Link to="/signature">
                    <button>
                        Firmar/Verificar
                    </button>
                </Link>
            </div>
            <footer className='developedBy'>
                <p>
                    Desarrollado por David Arturo Oaxaca Pérez & Rubén Hernández Hernández
                </p>
            </footer>
        </div>
    )
}

export default MainMenu;