import React, { useState, useEffect } from "react";

function TableModal({ table, showModal, handleCloseModal, updateTableStatus }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("entrada");
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState([]);

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("/api/productos"); // Cambia la URL según tu backend
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const agregarProducto = (producto) => {
    setPedido((prevPedido) => [...prevPedido, producto]);
  };

  const eliminarProducto = (index) => {
    setPedido((prevPedido) => prevPedido.filter((_, i) => i !== index));
  };

  const productosFiltrados = productos.filter(
    (producto) => producto.categoria === categoriaSeleccionada
  );

  if (!showModal) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Mesa {table?.id}</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* Columna para detalles de la mesa */}
              <div className="col-md-6">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Cliente</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre del cliente"
                      defaultValue={table?.customerName || ""}
                      onChange={(e) =>
                        updateTableStatus(table.id, table.status, { customerName: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={table?.status}
                      onChange={(e) => updateTableStatus(table.id, e.target.value)}
                    >
                      <option value="available">Disponible</option>
                      <option value="occupied">Ocupada</option>
                      <option value="reserved">Reservada</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Notas</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      defaultValue={table?.notes || ""}
                      onChange={(e) =>
                        updateTableStatus(table.id, table.status, { notes: e.target.value })
                      }
                    ></textarea>
                  </div>
                </form>
              </div>

              {/* Columna para generar el pedido */}
              <div className="col-md-6">
                <h5>Generar Pedido</h5>
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  >
                    <option value="entrada">Entradas</option>
                    <option value="comida criolla">Comida Criolla</option>
                    <option value="cortes de carne">Cortes de Carne</option>
                    <option value="aves y pescados">Aves y Pescados</option>
                    <option value="jugo">Jugos</option>
                    <option value="jarra de jugo">Jarras de Jugos</option>
                    <option value="cerveza">Cervezas</option>
                    <option value="vino">Vinos</option>
                  </select>
                </div>

                <ul className="list-group mb-3">
                  {productosFiltrados.map((producto, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {producto.nombre} - ${producto.precio}
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => agregarProducto(producto)}
                        disabled={producto.stock === 0}
                      >
                        Agregar
                      </button>
                    </li>
                  ))}
                </ul>

                <h6>Pedido Actual:</h6>
                <ul className="list-group">
                  {pedido.map((producto, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {producto.nombre} - ${producto.precio}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => eliminarProducto(index)}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Cerrar
            </button>
            <button className="btn btn-primary" onClick={handleCloseModal}>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableModal;
