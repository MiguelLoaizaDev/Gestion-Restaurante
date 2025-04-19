import React, { useEffect, useState } from "react";

const Productos = () => {
  const [ingrediente, setIngrediente] = useState("");
  const [unidad, setUnidad] = useState("");
  const [ingredientes, setIngredientes] = useState([])
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/showIngrediente")
      .then((res) => res.json())
      .then((data) => {
        console.log("Producos recibidos, renderizando...");
        console.log(data.data);
        setIngredientes(data.data)        
      });
  },[]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("producto enviado");

    fetch("http://localhost:5000/api/addIngrediente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingrediente, unidad }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('renderizando...');
        
        setIngrediente("");
        setUnidad("");
        setMsg(data.msg);

        return fetch("http://localhost:5000/api/showIngrediente");
      })
      .then((res)=>res.json())
      .then((data)=>{
        console.log('renderizando nuevamente...')
        console.log(data.data);
        setIngredientes(data.data)
      })
  };

  return (
    <div>
      <form action="/api/addProductos" method="post" onSubmit={handleSubmit}>
        <input
          type="text"
          name="producto"
          value={ingrediente}
          required
          onChange={(e) => setIngrediente(e.target.value)}
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
      <a href="/addEntradaI">Agregar una entrada</a>
      <br />
      <a href="/addSalidaI">Agregar una salida</a>
      <h2>Ingredientes</h2>
      {ingredientes.length>0?<ul>
        {ingredientes.map((ingred)=>(
          <li key={ingred.id}>
            {ingred.nombre}  - {ingred.unidad}
          </li>
        ))}
      </ul>:<p>No hay Ingredientes...</p>}
      <a href="/">Volver</a>
    </div>
  );
};

export default Productos;
