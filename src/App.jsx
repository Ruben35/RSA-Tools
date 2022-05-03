import { useState } from 'react'
import { MainMenu } from './pages'
import './styles/main.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MainMenu/>
  )
}

export default App
