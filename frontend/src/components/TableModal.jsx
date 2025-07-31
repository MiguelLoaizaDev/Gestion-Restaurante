import React, { useState, useEffect } from "react";

function TableModal({ table, showModal, handleCloseModal, updateTableStatus }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("entrada");
  const [productos, setProductos] = useState([]);
  const [pedido, setPedido] = useState([]);
  const [formData, setFormData] = useState({
    customerName: table?.customerName || "",
    status: table?.status || "available",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Actualizar estado de la mesa con todos los cambios
    updateTableStatus(table.id, formData.status, {
      customerName: formData.customerName,
      pedido: pedido,
    });

    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!showModal) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Mesa {table?.id}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Columna para detalles de la mesa */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Cliente</label>
                    <input
                      type="text"
                      className="form-control"
                      name="customerName"
                      placeholder="Nombre del cliente"
                      value={formData.customerName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="available">Disponible</option>
                      <option value="occupied">Ocupada</option>
                      <option value="reserved">Reservada</option>
                    </select>
                  </div>
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
                      {[...new Set(productos.map(p => p.categoria))].map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ul className="list-group mb-3">
                    {productosFiltrados.map((producto, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
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
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TableModal;
