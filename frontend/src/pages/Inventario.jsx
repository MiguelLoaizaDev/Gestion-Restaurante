import React, { useEffect, useState } from "react";

const Inventario = () => {
  const [inventarioP, setInventarioP] = useState([]);
  const [inventarioI, setInventarioI] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/inventario/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Inventario: ", data.dataP,data.dataI);
        setInventarioP(data.dataP);
        setInventarioI(data.dataI);
      });
  },[]);
  return (
    <div>
      <h2>Inventario Productos:</h2>
      <ul>
        {inventarioP.map((prod)=>(
            <li>
                {prod.nombre} - {prod.unidad} - {prod.total}
            </li>
        ))}
      </ul>
      <h2>Inventario Ingredientes:</h2>
      <ul>
        {inventarioI.map((ingred)=>(
            <li>
                {ingred.nombre} - {ingred.unidad} - {ingred.total}
            </li>
        ))}
      </ul>
      <a href="/">Volver</a>
    </div>
  );
};

export default Inventario;
