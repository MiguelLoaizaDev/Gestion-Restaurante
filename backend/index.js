import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Permitir peticiones desde el frontend
app.use(cors());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido al backend de la API 🎉');
});

// Ruta de saludo
app.get('/api/saludo', (req, res) => {
    console.log("Petición recibida en /api/saludo");
    res.json({ mensaje: 'Hola desde el backend 🎉' });
  });
  

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
