import { useState, useEffect } from 'react'
import './App.css'
import Title from './components/Title.jsx'

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Title />
    </div>
  )
}

export default App
