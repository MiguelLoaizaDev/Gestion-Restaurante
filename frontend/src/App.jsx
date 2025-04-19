import React, { useState, useEffect } from 'react'; // Importa React y los hooks aquí
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import ShowInventory from './pages/ShowInventory';
import EnterProducts from './pages/EnterProducts';
import EnterIngredients from './pages/EnterIngredients';
import Reports from './pages/Reports';

function App() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Hacemos la solicitud a la API
    fetch('/api/saludo')
      .then((res) => res.json())
      .then((data) => setMensaje(data.mensaje))  // Actualizamos el estado con el mensaje
      .catch((err) => console.error('Error al conectar con el backend:', err));
  }, []);  // Solo se ejecuta una vez cuando el componente se monta

  return (
    <div className="min-vh-100 bg-light">
      <NavigationBar children={mensaje}/>
      <Router>
        <div className="mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ViewInventory" element={<ShowInventory />} />
            <Route path="/EnterProduct" element={<EnterProducts />} />
            <Route path="/EnterIngredient" element={<EnterIngredients />} />
            <Route path="/Reports" element={<Reports />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
