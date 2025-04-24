import { useState, useEffect } from "react";
import TableModal from "../components/TableModal";
import TableCard from "../components/TableCard";
import TableListRow from "../components/TableListRow";
import Summary from "../components/Summary";

const TableStatus = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  RESERVED: "reserved",
};

function Home() {
  const [tables, setTables] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("/api/mesas");
        const data = await response.json();
        setTables(data.data);
      } catch (error) {
        console.error("Error al cargar las mesas:", error);
      }
    };

    fetchTables();
  }, []);
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch("/api/pedidos/");
        const data = await response.json();
        setPedidos(data.data);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);


  const [selectedTable, setSelectedTable] = useState(null);
  const [activeTab, setActiveTab] = useState("floor");
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTable(null);
  };

  const updatePedidos=async()=>{
    const response=await fetch('api/pedidos/')
    const pedidosActualizados=response.json()
    setPedidos(pedidosActualizados)
  }

  const updateTableStatus = async (id, status, customerName, notas = {}) => {
    try {
      await fetch(`/api/mesas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          customerName,
          notas,
          timeOccupied:
            status === TableStatus.OCCUPIED
              ? new Date().toLocaleTimeString()
              : null,
        }),
      });
      const response = await fetch("/api/mesas");
      const mesasActualizadas = await response.json();
      setTables(mesasActualizadas.data);
      const response1 = await fetch("/api/pedidos");
      const pedidosActualizados = await response1.json();
      setPedidos(pedidosActualizados.data);
    } catch (error) {
      console.error("Error actualizando mesa", error);
    }

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

      <Summary tables={tables} pedidos={pedidos} updatePedidos={updatePedidos} updateTableStatus={updateTableStatus}/>

      {selectedTable && (
        <TableModal
          table={selectedTable}
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          updateTableStatus={updateTableStatus}
          updatePedidos={updatePedidos}
        />
      )}
    </div>
  );
}

export default Home;
