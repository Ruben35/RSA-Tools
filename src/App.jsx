import { useState } from 'react'
import LogoApp from './components/LogoApp'
import './styles/main.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="mainMenu">
      <div>
        <LogoApp/>
        <span></span>
      </div>
    </div>
  )
}

export default App
