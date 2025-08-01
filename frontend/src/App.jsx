import React, { useState, useEffect } from 'react'; // Importa React y los hooks aquí
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import EnterProducts from './pages/EnterProducts';
import EnterIngredients from './pages/EnterIngredients';
import EnterGrains from './pages/EnterGrains';
import EnterInputs from './pages/EnterInputs';
import EnterCrockery from './pages/EnterCrockery';
import ViewOrders from './pages/ViewOrders';
import Reports from './pages/Reports';
import CuadreCaja from './pages/CuadreCaja';

function App() {

  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <NavigationBar />
        <div className="mt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/EnterProducts" element={<EnterProducts />} />
            <Route path="/EnterIngredients" element={<EnterIngredients />} />
            <Route path="/EnterGrains" element={<EnterGrains />} />
            <Route path="/EnterInputs" element={<EnterInputs />} />
            <Route path="/EnterCrockery" element={<EnterCrockery />} />
            <Route path="/ViewOrders" element={<ViewOrders />} />
            <Route path="/Reports" element={<Reports />} />
            <Route path="/CuadreCaja" element={<CuadreCaja />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
