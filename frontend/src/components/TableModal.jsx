import React, { useState, useEffect } from "react";

function TableModal({
  table,
  showModal,
  handleCloseModal,
  updateTableStatus,
  updatePedidos,
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("entrada");
  const [platos, setPlatos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [customerName, setCustomerName] = useState(table?.customer_name || "");
  const [status, setStatus] = useState(table?.status || "");
  const [notas, setNotas] = useState(table?.notes || "");

  const handleSubmit = async () => {
    try {
      await fetch("/api/pedidos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mesaId: table.id,
          customerName: customerName,
          notes: notas,
          pedidos: pedidos.map((p) => ({
            platoId: p.plato_id,
            cantidad: p.cantidad,
            
          })),
        }),
      });
    } catch (error) {
      console.log(error);
    }
    updatePedidos();
  };

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("/api/pedidos/platos"); // Cambia la URL según tu backend
        const data = await response.json();
        setPlatos(data.data);
      } catch (error) {
        console.error("Error al obtener los platos:", error);
      }
    };

    fetchProductos();
  }, []);

  const agregarPedido = (platoNombre) => {
    const plato = platos.find((p) => p.nombre === platoNombre);
    if (!plato) return;

    setPedidos((prevPedidos) => [
      ...prevPedidos,
      {
        plato_id: plato.id,
        nombre: plato.nombre,
        precio: plato.precio,
        cantidad: 1,
        customerName: table.customer_name,
        notes: table.notes,
      },
    ]);
  };

  const eliminarPedido = (index) => {
    setPedidos((prevPedido) => prevPedido.filter((_, i) => i !== index));
  };

  if (!showModal) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
              updateTableStatus(table.id, status, customerName, notas);
              handleCloseModal();
              console.log("Form enviado correctamente");
            }}
          >
            <div className="modal-header">
              <h5 className="modal-title">Mesa {table?.id}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                {/* Columna para detalles de la mesa */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Cliente</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre del cliente"
                      defaultValue={table.customer_name}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
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
                      defaultValue={table?.notes}
                      onChange={(e) => setNotas(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                {/* Columna para generar el pedido */}
                <div className="col-md-6">
                  <h5>Generar Pedido</h5>
                  <div className="mb-3">
                    <label className="form-label">Categoría</label>

                    <select
                      className="form-select"
                      defaultValue={categoriaSeleccionada}
                      onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                    >
                      <option value="">Entrada</option>
                      {platos.map((plato, index) => (
                        <option key={index} value={plato.nombre}>
                          {plato.nombre}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => agregarPedido(categoriaSeleccionada)}
                      className="btn btn-success mt-2"
                    >
                      añadir
                    </button>
                  </div>

                  <h6>Pedido Actual:</h6>
                  <ul className="list-group">
                    {pedidos.map((pedido, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {pedido.nombre} x{pedido.cantidad} - ${pedido.precio}
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarPedido(index)}
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
              <button className="btn btn-primary" type="submit">
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
