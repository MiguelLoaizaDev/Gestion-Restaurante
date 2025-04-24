import React, { useEffect, useState } from "react";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [detallesPorPedido, setDetallesPorPedido] = useState({});
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/pedidos/historial");
        const data = await response.json();
        setPedidos(data.data);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const handleDetalle = async (id) => {
    if (detallesPorPedido[id]) return;

    try {
      const response = await fetch(`/api/pedidos/detalle/${id}`);
      const data = await response.json();

      const info = data.data || [];
      const subtotal = info.reduce(
        (acc, p) => acc + Number(p.precio) * (p.cantidad || 1),
        0
      );

      setDetallesPorPedido((prev) => ({
        ...prev,
        [id]: { info, subtotal },
      }));
    } catch (error) {
      console.log("Error al cargar detalle:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Historial de Pedidos</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div>
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => {
              const collapseId = `collapseWidthExample-${pedido.id}`;
              const detalle = detallesPorPedido[pedido.id];

              return (
                <div key={pedido.id} className="mb-4 border p-3 rounded shadow">
                  <div>
                    <p><strong>ID DEL PEDIDO:</strong> {pedido.id}</p>
                    <p><strong>MESA:</strong> {pedido.mesa_id}</p>
                    <p><strong>FECHA:</strong> {pedido.fecha}</p>
                    <p><strong>CLIENTE:</strong> {pedido.customer_name}</p>
                    <p><strong>NOTAS:</strong> {pedido.notas}</p>
                  </div>

                  <button
                    className="btn btn-primary mb-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded="false"
                    aria-controls={collapseId}
                    onClick={() => handleDetalle(pedido.id)}
                  >
                    {detalle ? "Ocultar detalles" : "Ver detalles"}
                  </button>

                  <div style={{ minHeight: "120px" }}>
                    <div className="collapse" id={collapseId}>
                      <div className="card card-body" style={{ width: "300px" }}>
                        {detalle ? (
                          <>
                            {detalle.info.map((plato, index) => (
                              <div key={index} className="mb-2">
                                <p><strong>Plato:</strong> {plato.nombre}</p>
                                <p><strong>Precio:</strong> ${Number(plato.precio).toFixed(2)}</p>
                                <p><strong>Cantidad:</strong> {plato.cantidad}</p>
                              </div>
                            ))}
                            <p>
                              <strong>Subtotal:</strong> ${detalle.subtotal.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p>Cargando detalles...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No hay pedidos disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Pedidos;
