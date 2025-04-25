import React, { useState, useEffect } from "react";

const AddEntradaI = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [ingrediente, setIngrediente] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/ingredientes/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Ingredientes recibidos, renderizando...");
        setIngredientes(data.data);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/ingredientes/entrada", {
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
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">Agregar Entrada de Ingrediente</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Ingrediente</label>
            <select
              className="form-select"
              name="ingrediente"
              value={ingrediente}
              required
              onChange={(e) => setIngrediente(e.target.value)}
            >
              <option value="">Selecciona una opción</option>
              {ingredientes.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.nombre}>
                  {ingredient.nombre}
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

          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>

        {msg && <div className="alert alert-info mt-3">{msg}</div>}

        <a href="/" className="mt-3">Volver</a>
      </div>
    </div>
  );
};

export default AddEntradaI;
