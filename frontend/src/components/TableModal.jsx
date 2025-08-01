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

  // Cargar datos existentes de la mesa cuando se abre el modal
  useEffect(() => {
    if (table && showModal) {
      setFormData({
        customerName: table.customerName || "",
        status: table.status || "available",
      });
      setPedido(table.pedido || []);
    }
  }, [table, showModal]);

  const agregarProducto = (producto) => {
    setPedido((prevPedido) => [...prevPedido, producto]);
  };

  const eliminarProducto = (index) => {
    setPedido((prevPedido) => prevPedido.filter((_, i) => i !== index));
  };

  const productosFiltrados = productos.filter(
    (producto) => producto.categoria === categoriaSeleccionada
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Solo guardar el pedido si hay productos en él
    if (pedido.length > 0) {
      // Preparar los datos del pedido para enviar al backend
      const pedidoData = {
        mesaId: table.id,
        customerName: formData.customerName,
        status: "occupied", // Forzar estado a "Ocupada" cuando hay pedido
        pedido: pedido,
        total: pedido.reduce((total, producto) => total + producto.precio, 0),
        fecha: new Date().toISOString()
      };

      try {
        const response = await fetch('/api/pedidos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pedidoData)
        });

        if (!response.ok) {
          throw new Error('Error al guardar el pedido');
        }

        const result = await response.json();
        console.log('Pedido guardado exitosamente:', result);
      } catch (error) {
        console.error('Error guardando el pedido:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
        alert('Error al guardar el pedido. Por favor, inténtalo de nuevo.');
        return; // No cerrar el modal si hay error
      }
    }

    // Actualizar estado de la mesa - si hay pedido, forzar a "occupied"
    const estadoFinal = pedido.length > 0 ? "occupied" : formData.status;
    updateTableStatus(table.id, estadoFinal, {
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
              {/* Sección superior: Cliente y Estado */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Cliente</label>
                    <input
                      type="text"
                      className="form-control"
                      name="customerName"
                      placeholder="Nombre del cliente"
                      value={formData.customerName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Estado de la Mesa</label>
                    <select
                      className="form-select"
                      name="status"
                      value={pedido.length > 0 ? "occupied" : formData.status}
                      onChange={handleInputChange}
                      disabled={pedido.length > 0}
                    >
                      <option value="available">Disponible</option>
                      <option value="occupied">Ocupada</option>
                      <option value="reserved">Reservada</option>
                    </select>
                    {pedido.length > 0 && (
                      <div className="alert alert-info mt-2 mb-0" role="alert">
                        <small>
                          <i className="bi bi-info-circle me-1"></i>
                          El estado cambiará automáticamente a "Ocupada" al guardar el pedido
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Separador visual */}
              <hr className="my-4" />

              {/* Sección inferior: Generar Pedido */}
              <div className="row">
                <div className="col-12">
                  <h5 className="mb-3">
                    {pedido.length > 0 ? 'Continuar Pedido' : 'Generar Pedido'}
                  </h5>
                  
                  <div className="row">
                    <div className="col-md-6">
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

                      <div className="productos-lista" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <ul className="list-group">
                          {productosFiltrados.map((producto, index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <div>
                                <strong>{producto.nombre}</strong>
                                <br />
                                <small className="text-muted">${producto.precio}</small>
                              </div>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => agregarProducto(producto)}
                                disabled={producto.stock === 0}
                              >
                                Agregar
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h6 className="mb-3">Pedido Actual:</h6>
                      <div className="pedido-lista" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {pedido.length === 0 ? (
                          <p className="text-muted text-center py-3">No hay productos en el pedido</p>
                        ) : (
                          <ul className="list-group">
                            {pedido.map((producto, index) => (
                              <li
                                key={index}
                                className="list-group-item d-flex justify-content-between align-items-center"
                              >
                                <div>
                                  <strong>{producto.nombre}</strong>
                                  <br />
                                  <small className="text-muted">${producto.precio}</small>
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => eliminarProducto(index)}
                                >
                                  Eliminar
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      
                      {pedido.length > 0 && (
                        <div className="mt-3 p-3 bg-light rounded">
                          <h6>Total del Pedido:</h6>
                          <p className="h5 text-primary">
                            ${pedido.reduce((total, producto) => total + producto.precio, 0).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
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
                {pedido.length > 0 ? 'Actualizar pedido' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TableModal;
