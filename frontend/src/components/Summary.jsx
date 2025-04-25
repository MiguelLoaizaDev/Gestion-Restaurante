function Summary({ tables, pedidos, updateTableStatus}) {
  const getCountByStatus = (status) =>
    tables.filter((t) => t.status === status).length;
  const addPedido = async (id, mesaId, customerName, notes) => {
    try {
      await fetch(`api/pedidos/historial/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mesaId,
          customerName,
          notes,
        }),
      });
      alert("Pedido enviado");
    } catch (error) {
      console.log(error);
    }
  };
  const deletePedido = async (id) => {
    try {
      await fetch(`api/pedidos/cancelar/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const tablaDefualt = {
    status: "available",
    customerName: "",
    notas: "",
  };
  return (
    <div className="w-100 w-md-25 border-top border-md-start p-4 bg-light">
      <h2 className="h4 mb-4">Resumen</h2>
      <div className="row g-3 mb-4">
        <div className="col-4">
          <div className="card text-center">
            <div className="card-body">
              <div
                className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mx-auto mb-2"
                style={{ width: "40px", height: "40px" }}
              >
                {getCountByStatus("available")}
              </div>
              <div className="small">Disponibles</div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card text-center">
            <div className="card-body">
              <div
                className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center mx-auto mb-2"
                style={{ width: "40px", height: "40px" }}
              >
                {getCountByStatus("occupied")}
              </div>
              <div className="small">Ocupadas</div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card text-center">
            <div className="card-body">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mx-auto mb-2"
                style={{ width: "40px", height: "40px" }}
              >
                {getCountByStatus("reserved")}
              </div>
              <div className="small">Reservadas</div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="h5 mb-3">Pedidos</h3>
      
      <div className="mb-4">
        {console.log("Longitud de pedidos: ", pedidos)}
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <div key={pedido.id} className="card mb-2">
              <div className="card-body p-2">
                <div className="fw-bold">Pedido #{pedido.id}</div>
                <small className="text-muted">
                  Mesa: {pedido.mesa_id} · Cliente:{" "}
                  {pedido.customer_name || "Sin nombre"}
                </small>
              </div>
              <button
                onClick={() => {
                  addPedido(
                    pedido.id,
                    pedido.mesa_id,
                    pedido.customer_name,
                    pedido.notes
                  );
                  updateTableStatus(
                    pedido.mesa_id,
                    tablaDefualt.status,
                    tablaDefualt.customerName,
                    tablaDefualt.notas
                  );
                }}
                className="btn btn-success m-3 mt-1"
              >
                Confirmar pedido
              </button>
              <button
                onClick={() => {
                  deletePedido(pedido.mesa_id);
                  updateTableStatus(
                    pedido.mesa_id,
                    tablaDefualt.status,
                    tablaDefualt.customerName,
                    tablaDefualt.notas
                  );
                }}
                className="btn btn-danger m-3 mt-1"
              >
                Cancelar pedido
              </button>
            </div>
          ))
        ) : (
          <p className="text-muted">No hay pedidos</p>
        )}
      </div>

      <button className="btn btn-primary w-100">Gestionar reservas</button>
    </div>
  );
}

export default Summary;
