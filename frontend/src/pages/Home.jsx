import { useState } from "react";
import TableModal from '../components/TableModal';
import TableCard from '../components/TableCard';
import TableListRow from '../components/TableListRow';
import Summary from '../components/Summary';

const TableStatus = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  RESERVED: "reserved"
};

function Home() {
  const [tables, setTables] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      status: TableStatus.AVAILABLE,
      capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
    }))
  );

  const [selectedTable, setSelectedTable] = useState(null);
  const [activeTab, setActiveTab] = useState("floor");
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTable(null);
  };

  const updateTableStatus = (id, status, data = {}) => {
    setTables(
      tables.map((table) => {
        if (table.id === id) {
          return {
            ...table,
            status,
            ...data,
            timeOccupied: status === TableStatus.OCCUPIED ? new Date().toLocaleTimeString() : undefined,
          };
        }
        return table;
      })
    );
    handleCloseModal();
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <div className="w-100 w-md-75 p-4">
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "floor" ? "active" : ""}`}
              onClick={() => setActiveTab("floor")}
            >
              Floor View
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "list" ? "active" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              List View
            </button>
          </li>
        </ul>

        {activeTab === "floor" && (
          <div className="container-fluid">
            <div className="row g-4">
              {tables.map((table) => (
                <div key={table.id} className="col-6 col-md-4 col-lg-3">
                  <TableCard
                    table={table}
                    setSelectedTable={setSelectedTable}
                    setShowModal={setShowModal}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Mesa</th>
                  <th>Capacidad</th>
                  <th>Estado</th>
                  <th>Cliente</th>
                  <th>Hora</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <TableListRow
                    key={table.id}
                    table={table}
                    setSelectedTable={setSelectedTable}
                    setShowModal={setShowModal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Summary tables={tables} />

      {selectedTable && (
        <TableModal
          table={selectedTable}
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          updateTableStatus={updateTableStatus}
        />
      )}
    </div>
  );
}

export default Home;
