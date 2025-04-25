import React, { useEffect, useState } from "react";

const Productos = () => {
  const [producto, setProducto] = useState("");
  const [unidad, setUnidad] = useState("");
  const [productos, setProductos] = useState([]);
  const [msg, setMsg] = useState("");
  const [msgErr, setMsgErr] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/productos/")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.data);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/productos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto, unidad }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducto("");
        setUnidad("");
        setMsg(data.msg);
        setMsgErr(data.msgErr);

        return fetch("http://localhost:5000/api/productos/");
      })
      .then((res) => res.json())
      .then((data) => {
        setProductos(data.data);
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Productos</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="producto" className="form-label">
            Nombre del producto
          </label>
          <input
            type="text"
            className="form-control"
            id="producto"
            value={producto}
            required
            onChange={(e) => setProducto(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="unidad" className="form-label">
            Unidad
          </label>
          <select
            className="form-select"
            id="unidad"
            required
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="libras">Libras</option>
            <option value="unidad">Unidad</option>
            <option value="litro">Litro</option>
            <option value="paquete">Paquete</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Enviar
        </button>
      </form>

      {msg && <div className="alert alert-success">{msg}</div>}
      {msgErr && <div className="alert alert-danger">{msgErr}</div>}

      <div className="mb-4">
        <a href="/addEntrada" className="btn btn-outline-secondary me-2">
          Agregar una entrada
        </a>
        <a href="/addSalida" className="btn btn-outline-secondary">
          Agregar una salida
        </a>
      </div>

      <h2 className="mb-3">Lista de Productos</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Unidad</th>
          </tr>
        </thead>
        <tbody>
          {productos.length > 0 ? (
            productos.map((product) => (
              <tr key={product.id}>
                <td>{product.nombre}</td>
                <td>{product.unidad}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-muted">
                No hay productos para mostrar...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <a href="/" className="btn btn-link mt-3">
        Volver al inicio
      </a>
    </div>
  );
};

export default Productos;
