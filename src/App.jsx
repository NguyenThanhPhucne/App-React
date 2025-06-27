// src/App.jsx
import { BrowserRouter as Router } from "react-router-dom"
import AppRoutes from "./appRoutes/Routes"
import "./index.css"

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  )
}

export default App
