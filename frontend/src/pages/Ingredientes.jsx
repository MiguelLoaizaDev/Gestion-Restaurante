import React, { useEffect, useState } from "react";

const Ingredientes = () => {
  const [ingrediente, setIngrediente] = useState("");
  const [unidad, setUnidad] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
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
    console.log("Ingrediente enviado");

    fetch("http://localhost:5000/api/ingredientes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingrediente, unidad }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Ingrediente agregado, renderizando...");
        setIngrediente("");
        setUnidad("");
        setMsg(data.msg);

        return fetch("http://localhost:5000/api/ingredientes/");
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("Renderizando nuevamente...");
        setIngredientes(data.data);
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Agregar y Ver Ingredientes</h1>

      {/* Formulario para agregar ingrediente */}
      <form className="mb-4" method="post" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="ingrediente" className="form-label">
            Nombre del Ingrediente
          </label>
          <input
            type="text"
            id="ingrediente"
            className="form-control"
            name="producto"
            value={ingrediente}
            required
            onChange={(e) => setIngrediente(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="unidad" className="form-label">
            Unidad
          </label>
          <select
            id="unidad"
            name="unidad"
            className="form-select"
            required
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

      {msg && <p className="text-success">{msg}</p>}

      {/* Enlaces para agregar entradas o salidas */}
      <div className="mb-4">
        <a href="/addEntradaI" className="btn btn-link">
          Agregar una entrada
        </a>
        <br />
        <a href="/addSalidaI" className="btn btn-link">
          Agregar una salida
        </a>
      </div>

      {/* Tabla de ingredientes */}
      <h2 className="mb-3">Ingredientes Disponibles</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Unidad</th>
          </tr>
        </thead>
        <tbody>
          {ingredientes.length > 0 ? (
            ingredientes.map((ingredient) => (
              <tr key={ingredient.id}>
                <td>{ingredient.nombre}</td>
                <td>{ingredient.unidad}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center text-muted">
                No hay ingredientes para mostrar...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Enlace para volver */}
      <a href="/" className="btn btn-link">
        Volver al inicio
      </a>
    </div>
  );
};

export default Ingredientes;
