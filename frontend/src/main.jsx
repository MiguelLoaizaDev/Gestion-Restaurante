import App from "./App.jsx";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Productos from "./components/Productos.jsx";
import NavigationBar from "./components/NavigationBar.jsx";
import AddEntrada from "./components/AddEntrada.jsx";
import AddSalida from "./components/AddSalida.jsx";
import Ingredientes from "./components/Ingredientes.jsx";
import Inventario from "./components/Inventario.jsx";
import Reporte from "./components/Reporte.jsx";
import AddEntradaI from "./components/AddEntradaI.jsx";
import AddSalidaI from "./components/AddSalidaI.jsx";


const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<NavigationBar />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/ingredientes" element={<Ingredientes />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/addEntrada" element={<AddEntrada />} />
      <Route path="/addSalida" element={<AddSalida />} />
      <Route path="/addEntradaI" element={<AddEntradaI />} />
      <Route path="/addSalidaI" element={<AddSalidaI />} />
      <Route path="/Reportes" element={<Reporte />} />
    </Routes>
  </BrowserRouter>
);
