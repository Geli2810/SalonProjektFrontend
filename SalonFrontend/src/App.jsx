import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CustomersSlide from './Store/Components/CustomersSlide.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <CustomersSlide />
      </div>
    </>
  )
}

export default App
