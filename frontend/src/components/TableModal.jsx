function TableModal({ table, showModal, handleCloseModal, updateTableStatus }) {
  if (!showModal) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Mesa {table?.id}</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
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
