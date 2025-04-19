import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import NavigationBar from "./components/NavigationBar"

import AppRoutes from "./routes"

function App() {
  return (
    <div className="app-container">
      <NavigationBar/>
      <AppRoutes />
    </div>
  );
}

export default App;