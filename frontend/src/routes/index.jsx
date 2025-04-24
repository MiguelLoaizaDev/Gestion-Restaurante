import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Productos from "../pages/Productos";
import Ingredientes from "../pages/Ingredientes";
import Inventario from "../pages/Inventario";
import AddEntrada from "../pages/AddEntrada"
import AddSalida  from "../pages/AddSalida"
import AddEntradaI from "../pages/AddEntradaI"
import AddSalidaI  from "../pages/AddSalidaI"
import Reporte from "../pages/Reporte"
import Pedidos from '../pages/Pedidos'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/ingredientes" element={<Ingredientes />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/addEntrada" element={<AddEntrada />} />
      <Route path="/addSalida" element={<AddSalida />} />
      <Route path="/addEntradaI" element={<AddEntradaI />} />
      <Route path="/addSalidaI" element={<AddSalidaI />} />
      <Route path="/Reportes" element={<Reporte />} />
      <Route path="/historialPedidos" element={<Pedidos />} />
    </Routes>
  );
};

export default AppRoutes;
