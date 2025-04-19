import React, { useState, useEffect } from 'react'; // Importa React y los hooks aquí
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/NavigationBar'; // A
import './App.css';

function App() {
  const [mensaje, setMensaje] = useState('');  // Usamos el hook useState

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
    </div>
  );
}

export default App;
