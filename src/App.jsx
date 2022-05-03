import { useState } from 'react'
import LogoApp from './components/LogoApp'
import './styles/main.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="mainMenu">
      <div className='appInfo'>
        <LogoApp/>
        <span>RSA Tools</span>
      </div>
      <div className='menuInfo'>
        <p>
          Elige la herramienta RSA que deseas utilizar:
        </p>
      </div>
      <div className='mainButtons'>
        <button>
          Generar Llaves
        </button>
        <button>
          Cifrar/Descifrar
        </button>
        <button>
          Firmar/Verificar
        </button>
      </div>
      <footer className='developedBy'>
        <p>
          Desarrollado por David Arturo Oaxaca Pérez & Rubén Hernández Hernández 
        </p>
      </footer>
    </div>
  )
}

export default App
