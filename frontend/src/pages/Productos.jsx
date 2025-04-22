import React, { useEffect, useState } from "react";

const Productos = () => {
  const [producto, setProducto] = useState("");
  const [unidad, setUnidad] = useState("");
  const [productos, setProductos] = useState([])
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/productos/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Producos recibidos, renderizando...");
        console.log(data.data);
        setProductos(data.data)        
      });
  },[]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("producto enviado");

    fetch("http://localhost:5000/api/productos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ producto, unidad }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('renderizando...');
        
        setProducto("");
        setUnidad("");
        setMsg(data.msg);

        return fetch("http://localhost:5000/api/productos/");
      })
      .then((res)=>res.json())
      .then((data)=>{
        console.log('renderizando nuevamente...')
        console.log(data.data);
        setProductos(data.data)
      })
  };

  return (
    <div>
      <form action="/api/addProductos" method="post" onSubmit={handleSubmit}>
        <input
          type="text"
          name="producto"
          value={producto}
          required
          onChange={(e) => setProducto(e.target.value)}
        />
        <select
          name="unidad"
          required
          onChange={(e) => setUnidad(e.target.value)}
        >
          <option value="">Selecciona una opcion</option>
          <option value="libras">Libras</option>
          <option value="unidad">Unidad</option>
          <option value="litro">Litro</option>
          <option value="paquete">Paquete</option>
        </select>
        <button type="submit">Enviar</button>
      </form>
      <p>{msg}</p>
      <a href="/addEntrada">Agregar una entrada</a>
      <br />
      <a href="/addSalida">Agregar una salida</a>
      <h2>Productos</h2>
      {productos.length>0?<ul>
        {productos.map((product)=>(
          <li key={product.id}>
            {product.nombre}  - {product.unidad}
          </li>
        ))}
      </ul>:<p>No hay productos...</p>}
      <a href="/">Volver</a>
    </div>
  );
};

export default Productos;
