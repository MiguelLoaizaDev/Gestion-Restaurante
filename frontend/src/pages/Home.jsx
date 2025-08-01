import { useState, useEffect } from "react";
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
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState(null);
    const [activeTab, setActiveTab] = useState("floor");
    const [showModal, setShowModal] = useState(false);

    // Cargar el estado real de las mesas desde el backend
    useEffect(() => {
        const fetchMesas = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/mesas');
                if (!response.ok) {
                    throw new Error('Error al cargar las mesas');
                }
                const data = await response.json();
                setTables(data);
            } catch (error) {
                console.error('Error al obtener las mesas:', error);
                // Fallback: crear mesas por defecto si hay error
                setTables(Array.from({ length: 15 }, (_, i) => ({
                    id: i + 1,
                    status: TableStatus.AVAILABLE,
                    capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
                    customerName: '',
                    pedido: [],
                    timeOccupied: undefined
                })));
            } finally {
                setLoading(false);
            }
        };

        fetchMesas();
    }, []);

    // Función para recargar mesas (útil cuando se factura un pedido)
    const reloadMesas = async () => {
        try {
            const response = await fetch('/api/mesas');
            if (response.ok) {
                const data = await response.json();
                setTables(data);
            }
        } catch (error) {
            console.error('Error al recargar las mesas:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTable(null);
    };

    const updateTableStatus = async (id, status, data = {}) => {
        try {
            // Actualizar en el backend
            const response = await fetch(`/api/mesas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    customerName: data.customerName || '',
                    pedido: data.pedido || []
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la mesa');
            }

            // Actualizar estado local
            setTables(prevTables =>
                prevTables.map((table) => {
                    if (table.id === id) {
                        return {
                            ...table,
                            status,
                            customerName: data.customerName || table.customerName,
                            pedido: data.pedido || table.pedido,
                            timeOccupied: status === TableStatus.OCCUPIED ? new Date().toLocaleTimeString() : table.timeOccupied,
                        };
                    }
                    return table;
                })
            );
        } catch (error) {
            console.error('Error al actualizar la mesa:', error);
            alert('Error al actualizar la mesa. Por favor, inténtalo de nuevo.');
        }
        
        handleCloseModal();
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando mesas...</p>
                </div>
            </div>
        );
    }

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
