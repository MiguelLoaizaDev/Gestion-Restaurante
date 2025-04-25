import React, { useState, useEffect } from "react";

const AddEntrada = () => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/productos/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Productos recibidos, renderizando...");
        setProductos(data.data);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/productos/entrada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto, cantidad }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducto("");
        setCantidad("");
        setMsg(data.msg);
      });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">Agregar una entrada</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Producto</label>
            <select
              className="form-select"
              name="producto"
              value={producto}
              required
              onChange={(e) => setProducto(e.target.value)}
            >
              <option value="">Selecciona una opción</option>
              {productos.map((product) => (
                <option key={product.id} value={product.nombre}>
                  {product.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Cantidad</label>
            <input
              type="number"
              className="form-control"
              name="cantidad"
              value={cantidad}
              required
              min="0"
              step="any"
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>

        {msg && <div className="alert alert-info mt-3">{msg}</div>}

        <a href="/" className="mt-3" >Volver</a>
      </div>
    </div>
  );
};

export default AddEntrada;
