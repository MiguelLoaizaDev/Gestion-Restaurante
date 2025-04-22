import React, { useState, useEffect } from "react";

const AddSalida = () => {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/productos/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Producos recibidos, renderizando...");
        console.log(data.data);
        setProductos(data.data);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/productos/salida", {
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
    <div>
      <h2>Agregar una salida</h2>
      <form action="/addSalidaP" method="post" onSubmit={handleSubmit}>
        <select name="producto" value={producto} onChange={(e) => setProducto(e.target.value)}>
          <option value="">Selecciona una opcion</option>
          {productos.map((product) => (
            <option key={product.id} value={product.nombre}>
              {product.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
      <a href="/">Volver</a>
      <p>{msg}</p>
    </div>
  );
};

export default AddSalida;
