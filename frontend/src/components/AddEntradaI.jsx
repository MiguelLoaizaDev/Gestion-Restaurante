import React, { useState, useEffect } from "react";

const AddEntradaI = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [ingrediente, setIngrediente] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/showIngrediente")
      .then((res) => res.json())
      .then((data) => {
        console.log("Ingredientes recibidos, renderizando...");
        console.log(data.data);
        setIngredientes(data.data);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/addEntradaI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingrediente, cantidad }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIngrediente("");
        setCantidad("");
        setMsg(data.msg);
      });
  };

  return (
    <div>
      <h2>Agregar una entrada</h2>
      <form action="/addEntradaP" method="post" onSubmit={handleSubmit}>
        <select name="ingrediente" value={ingrediente} onChange={(e) => setIngrediente(e.target.value)}>
          <option value="">Selecciona una opcion</option>
          {ingredientes.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.nombre}>
              {ingredient.nombre}
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
      <p>{msg}</p>
      <a href="/">Volver</a>
    </div>
  );
};

export default AddEntradaI;
