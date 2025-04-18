function Summary({ tables }) {
    const getCountByStatus = (status) => tables.filter((t) => t.status === status).length;
  
    return (
      <div className="w-100 w-md-25 border-top border-md-start p-4 bg-light">
        <h2 className="h4 mb-4">Resumen</h2>
        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="card text-center">
              <div className="card-body">
                <div
                  className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center mx-auto mb-2"
                  style={{ width: '40px', height: '40px' }}
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
                  style={{ width: '40px', height: '40px' }}
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
                  style={{ width: '40px', height: '40px' }}
                >
                  {getCountByStatus("reserved")}
                </div>
                <div className="small">Reservadas</div>
              </div>
            </div>
          </div>
        </div>
  
        <h3 className="h5 mb-3">Mesas ocupadas</h3>
        <div className="mb-4">
          {getCountByStatus("occupied") > 0 ? (
            tables
              .filter((t) => t.status === "occupied")
              .map((table) => (
                <div key={table.id} className="card mb-2">
                  <div className="card-body p-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">Mesa {table.id}</div>
                        <small className="text-muted">
                          {table.customerName || "Cliente sin nombre"} · {table.timeOccupied}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-muted">No hay mesas ocupadas</p>
          )}
        </div>
  
        <button className="btn btn-primary w-100">Gestionar reservas</button>
      </div>
    );
  }
  
  export default Summary;
  