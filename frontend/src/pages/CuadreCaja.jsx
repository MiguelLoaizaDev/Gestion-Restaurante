import React, { useState, useEffect } from 'react';
import { FaCashRegister, FaSave, FaPrint, FaDownload } from 'react-icons/fa';

function CuadreCaja() {
    const [facturas, setFacturas] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
    const [cuadreData, setCuadreData] = useState(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [observaciones, setObservaciones] = useState('');

    // Obtener datos del día seleccionado
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Obtener facturas
                const facturasResponse = await fetch('/api/facturas');
                const facturasData = await facturasResponse.json();

                // Obtener pedidos
                const pedidosResponse = await fetch('/api/pedidos');
                const pedidosData = await pedidosResponse.json();

                setFacturas(facturasData);
                setPedidos(pedidosData);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtrar datos por fecha
    const facturasDelDia = facturas.filter(factura =>
        factura.fecha && factura.fecha.includes(fechaSeleccionada)
    );

    const pedidosDelDia = pedidos.filter(pedido =>
        pedido.fecha && pedido.fecha.includes(fechaSeleccionada)
    );

    // Calcular estadísticas del día
    const calcularEstadisticas = () => {
        const stats = {
            totalVentas: 0,
            totalPropinas: 0,
            totalFacturas: facturasDelDia.length,
            totalPedidos: pedidosDelDia.length,
            metodosPago: {
                efectivo: { cantidad: 0, monto: 0 },
                dataphone: { cantidad: 0, monto: 0 },
                qr: { cantidad: 0, monto: 0 },
                nequi: { cantidad: 0, monto: 0 }
            },
            propinas: {
                '5%': { cantidad: 0, monto: 0 },
                '10%': { cantidad: 0, monto: 0 },
                '15%': { cantidad: 0, monto: 0 },
                '20%': { cantidad: 0, monto: 0 },
                'personalizada': { cantidad: 0, monto: 0 }
            }
        };

        facturasDelDia.forEach(factura => {
            stats.totalVentas += factura.totalFinal || 0;
            stats.totalPropinas += factura.propina || 0;

            // Método de pago
            const metodo = factura.metodoPago || 'efectivo';
            if (stats.metodosPago[metodo]) {
                stats.metodosPago[metodo].cantidad++;
                stats.metodosPago[metodo].monto += factura.totalFinal || 0;
            }

            // Propinas
            const porcentajePropina = factura.porcentajePropina || 0;
            if (porcentajePropina > 0) {
                if ([5, 10, 15, 20].includes(porcentajePropina)) {
                    const key = `${porcentajePropina}%`;
                    stats.propinas[key].cantidad++;
                    stats.propinas[key].monto += factura.propina || 0;
                } else {
                    stats.propinas.personalizada.cantidad++;
                    stats.propinas.personalizada.monto += factura.propina || 0;
                }
            }
        });

        return stats;
    };

    const estadisticas = calcularEstadisticas();

    // Formatear precio
    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(precio);
    };

    // Formatear fecha
    const formatearFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Guardar cuadre
    const handleSaveCuadre = async () => {
        try {
            const cuadreData = {
                fecha: fechaSeleccionada,
                estadisticas: estadisticas,
                facturas: facturasDelDia,
                pedidos: pedidosDelDia,
                observaciones: observaciones,
                fechaCreacion: new Date().toISOString(),
                usuario: 'Admin' // En un sistema real, esto vendría del usuario logueado
            };

            const response = await fetch('/api/cuadres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cuadreData)
            });

            if (response.ok) {
                alert('Cuadre de caja guardado exitosamente');
                setShowSaveModal(false);
                setObservaciones('');
            } else {
                throw new Error('Error al guardar el cuadre');
            }
        } catch (error) {
            console.error('Error al guardar cuadre:', error);
            alert('Error al guardar el cuadre de caja');
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 pt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando datos del cuadre de caja...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-5">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">
                            <FaCashRegister className="me-2" />
                            Cuadre de Caja
                        </h2>
                        <div className="d-flex gap-2">
                            <input
                                type="date"
                                className="form-control"
                                value={fechaSeleccionada}
                                onChange={(e) => setFechaSeleccionada(e.target.value)}
                            />
                            <button
                                className="btn btn-success"
                                onClick={() => setShowSaveModal(true)}
                            >
                                <FaSave className="me-2" />
                                Guardar Cuadre
                            </button>
                        </div>
                    </div>

                    {/* Fecha del cuadre */}
                    <div className="alert alert-info">
                        <strong>Fecha del Cuadre:</strong> {formatearFecha(fechaSeleccionada)}
                    </div>

                    {/* Resumen principal */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card bg-primary text-white">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Total Ventas</h5>
                                    <h3>{formatearPrecio(estadisticas.totalVentas)}</h3>
                                    <small>{estadisticas.totalFacturas} facturas</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-success text-white">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Total Propinas</h5>
                                    <h3>{formatearPrecio(estadisticas.totalPropinas)}</h3>
                                    <small>Recaudado</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-info text-white">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Facturas</h5>
                                    <h3>{estadisticas.totalFacturas}</h3>
                                    <small>Procesadas</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-warning text-white">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Pedidos</h5>
                                    <h3>{estadisticas.totalPedidos}</h3>
                                    <small>Totales</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desglose por método de pago */}
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Métodos de Pago</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Método</th>
                                                    <th>Cantidad</th>
                                                    <th>Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(estadisticas.metodosPago).map(([metodo, data]) => (
                                                    <tr key={metodo}>
                                                        <td>
                                                            {metodo === 'efectivo' && '💵 Efectivo'}
                                                            {metodo === 'dataphone' && '💳 Datáfono'}
                                                            {metodo === 'qr' && '📱 QR'}
                                                            {metodo === 'nequi' && '🟢 Nequi'}
                                                        </td>
                                                        <td>{data.cantidad}</td>
                                                        <td>{formatearPrecio(data.monto)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Desglose de Propinas</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Porcentaje</th>
                                                    <th>Cantidad</th>
                                                    <th>Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(estadisticas.propinas).map(([porcentaje, data]) => (
                                                    data.cantidad > 0 && (
                                                        <tr key={porcentaje}>
                                                            <td>{porcentaje}</td>
                                                            <td>{data.cantidad}</td>
                                                            <td>{formatearPrecio(data.monto)}</td>
                                                        </tr>
                                                    )
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detalle de facturas */}
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Detalle de Facturas del Día</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Mesa</th>
                                            <th>Cliente</th>
                                            <th>Método Pago</th>
                                            <th>Subtotal</th>
                                            <th>Propina</th>
                                            <th>Total</th>
                                            <th>Hora</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facturasDelDia.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4">
                                                    <p className="text-muted">No hay facturas para esta fecha</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            facturasDelDia.map((factura, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <span className="badge bg-secondary">Mesa {factura.mesaId}</span>
                                                    </td>
                                                    <td>{factura.customerName || 'Sin nombre'}</td>
                                                    <td>
                                                        {factura.metodoPago === 'efectivo' && '💵 Efectivo'}
                                                        {factura.metodoPago === 'dataphone' && '💳 Datáfono'}
                                                        {factura.metodoPago === 'qr' && '📱 QR'}
                                                        {factura.metodoPago === 'nequi' && '🟢 Nequi'}
                                                    </td>
                                                    <td>{formatearPrecio(factura.subtotal || 0)}</td>
                                                    <td>{formatearPrecio(factura.propina || 0)}</td>
                                                    <td>
                                                        <strong className="text-primary">
                                                            {formatearPrecio(factura.totalFinal || 0)}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        <small>
                                                            {new Date(factura.fecha).toLocaleTimeString('es-ES', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </small>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para guardar cuadre */}
            {showSaveModal && (
                <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Guardar Cuadre de Caja</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowSaveModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Observaciones (opcional):</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        placeholder="Agregar observaciones sobre el cuadre..."
                                    ></textarea>
                                </div>
                                <div className="alert alert-info">
                                    <strong>Resumen del cuadre:</strong>
                                    <ul className="mb-0 mt-2">
                                        <li>Total ventas: {formatearPrecio(estadisticas.totalVentas)}</li>
                                        <li>Total propinas: {formatearPrecio(estadisticas.totalPropinas)}</li>
                                        <li>Facturas procesadas: {estadisticas.totalFacturas}</li>
                                        <li>Fecha: {formatearFecha(fechaSeleccionada)}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowSaveModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleSaveCuadre}
                                >
                                    <FaSave className="me-2" />
                                    Guardar Cuadre
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CuadreCaja; 