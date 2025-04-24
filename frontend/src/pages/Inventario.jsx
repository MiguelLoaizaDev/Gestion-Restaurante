import React, { useEffect, useState } from "react";

const Inventario = () => {
  const [inventarioP, setInventarioP] = useState([]);
  const [inventarioI, setInventarioI] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/inventario/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Inventario:", data.dataP, data.dataI);
        setInventarioP(data.dataP);
        setInventarioI(data.dataI);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Inventario</h1>

      <div className="mb-5">
        <h2 className="mb-3">Inventario de Ingredientes:</h2>
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Unidad</th>
              <th scope="col">Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventarioI.length > 0 ? (
              inventarioI.map((ingredient) => (
                <tr key={ingredient.id}>
                  <td>{ingredient.nombre}</td>
                  <td>{ingredient.unidad}</td>
                  <td>{ingredient.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No hay ingredientes en el inventario...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="mb-3">Inventario de Productos:</h2>
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Unidad</th>
              <th scope="col">Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventarioP.length > 0 ? (
              inventarioP.map((product) => (
                <tr key={product.id}>
                  <td>{product.nombre}</td>
                  <td>{product.unidad}</td>
                  <td>{product.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  No hay productos en el inventario...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <a href="/" className="btn btn-link">Volver al inicio</a>
      </div>
    </div>
  );
};

export default Inventario;