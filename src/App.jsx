import { Routes, Route, HashRouter } from 'react-router-dom'
import { Signature ,Cipher, MainMenu } from './pages'
import './styles/main.css'

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainMenu/>} />
        <Route path="/cipher" element={<Cipher/>} />
        <Route path="/signature" element={<Signature/>} />
      </Routes>
    </HashRouter>
  )
}

export default App
