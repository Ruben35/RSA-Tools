import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Signature ,Cipher, MainMenu } from './pages'
import './styles/main.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu/>} />
        <Route path="/cipher" element={<Cipher/>} />
        <Route path="/signature" element={<Signature/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
