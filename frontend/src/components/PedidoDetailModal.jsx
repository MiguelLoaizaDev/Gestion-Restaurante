import React from 'react';

function PedidoDetailModal({ pedido, showModal, handleCloseModal }) {
    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(precio);
    };

    const formatearFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatearEstado = (estado) => {
        const estados = {
            'available': 'Disponible',
            'occupied': 'Ocupada',
            'reserved': 'Reservada',
            'facturado': 'Facturado'
        };
        return estados[estado] || estado;
    };

    if (!showModal || !pedido) return null;

    const totalPedido = pedido.pedido.reduce((total, producto) => total + producto.precio, 0);

    return (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Detalles del Pedido - Mesa {pedido.mesaId}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleCloseModal}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* Información general */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h6 className="text-muted">Información del Cliente</h6>
                                <p><strong>Nombre:</strong> {pedido.customerName || 'Sin nombre'}</p>
                                <p><strong>Mesa:</strong> {pedido.mesaId}</p>
                                <p><strong>Estado:</strong>
                                    <span className={`badge ms-2 ${pedido.status === 'occupied' ? 'bg-danger' :
                                            pedido.status === 'reserved' ? 'bg-warning' :
                                                pedido.status === 'facturado' ? 'bg-success' : 'bg-secondary'
                                        }`}>
                                        {formatearEstado(pedido.status)}
                                    </span>
                                </p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="text-muted">Información del Pedido</h6>
                                <p><strong>Fecha:</strong> {formatearFecha(pedido.fecha)}</p>
                                <p><strong>Total Productos:</strong> {pedido.pedido.length}</p>
                                <p><strong>Total Pedido:</strong> <span className="text-primary fw-bold">{formatearPrecio(totalPedido)}</span></p>
                            </div>
                        </div>

                        {/* Detalle de productos */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h6>Productos del Pedido</h6>
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Producto</th>
                                                <th>Categoría</th>
                                                <th className="text-end">Precio</th>
                                                <th className="text-center">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedido.pedido.map((producto, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <strong>{producto.nombre}</strong>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info">
                                                            {producto.categoria}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <strong>{formatearPrecio(producto.precio)}</strong>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                                            {producto.stock}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="table-dark">
                                            <tr>
                                                <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                                <td className="text-end"><strong>{formatearPrecio(totalPedido)}</strong></td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Estadísticas del pedido */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h6>Estadísticas del Pedido</h6>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="card bg-primary text-white">
                                            <div className="card-body text-center">
                                                <h6 className="card-title">Productos</h6>
                                                <h4>{pedido.pedido.length}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-success text-white">
                                            <div className="card-body text-center">
                                                <h6 className="card-title">Total</h6>
                                                <h4>{formatearPrecio(totalPedido)}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-info text-white">
                                            <div className="card-body text-center">
                                                <h6 className="card-title">Promedio</h6>
                                                <h4>{pedido.pedido.length > 0 ? formatearPrecio(totalPedido / pedido.pedido.length) : '$0'}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-warning text-white">
                                            <div className="card-body text-center">
                                                <h6 className="card-title">Categorías</h6>
                                                <h4>{[...new Set(pedido.pedido.map(p => p.categoria))].length}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información adicional */}
                        {pedido.estado === 'facturado' && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="alert alert-success">
                                        <h6>✅ Pedido Facturado</h6>
                                        <p className="mb-1"><strong>Método de pago:</strong> {pedido.metodoPago?.toUpperCase() || 'No especificado'}</p>
                                        {pedido.propina && (
                                            <p className="mb-1"><strong>Propina:</strong> {formatearPrecio(pedido.propina)} ({pedido.porcentajePropina}%)</p>
                                        )}
                                        {pedido.totalFinal && (
                                            <p className="mb-0"><strong>Total final:</strong> {formatearPrecio(pedido.totalFinal)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCloseModal}
                        >
                            Cerrar
                        </button>
                        {pedido.estado !== 'facturado' && (
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => {
                                    handleCloseModal();
                                    // Aquí podrías abrir el modal de facturación
                                    // window.location.href = `/facturar/${pedido.mesaId}`;
                                }}
                            >
                                💳 Facturar este pedido
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PedidoDetailModal; 