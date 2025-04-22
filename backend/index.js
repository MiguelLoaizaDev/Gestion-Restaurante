// IMPORTACIONES
import express from "express";
import cors from "cors";

//IMPORTO LAS RUTAS
import productoRoutes from './routes/producto.routes.js'
import inventarioRoutes from './routes/inventario.routes.js'
import ingredientesRoutes from './routes/ingredientes.routes.js'

//USOS Y CONSTANTES
const app = express();
const PORT = 5000;


// Permitir peticiones desde el frontend
app.use(cors());

//Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RUTAS 
app.get("/",(req,res)=>{
  res.send("Holaaa")
})
app.use('/api/productos',productoRoutes)
app.use('/api/inventario',inventarioRoutes)
app.use('/api/ingredientes',ingredientesRoutes)



app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
