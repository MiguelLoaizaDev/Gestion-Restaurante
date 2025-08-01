import React, { useState, useEffect } from 'react';

function BillingModal({ pedido, showModal, handleCloseModal, onBillingComplete }) {
    const [formData, setFormData] = useState({
        metodoPago: 'efectivo',
        propina: 10,
        propinaPersonalizada: '',
        incluirPropina: true
    });

    const [subtotal, setSubtotal] = useState(0);
    const [totalPropina, setTotalPropina] = useState(0);
    const [totalFinal, setTotalFinal] = useState(0);

    // Calcular totales cuando cambie el pedido o la propina
    useEffect(() => {
        if (pedido) {
            const subtotalCalculado = pedido.pedido.reduce((total, producto) => total + producto.precio, 0);
            setSubtotal(subtotalCalculado);

            const propinaCalculada = formData.incluirPropina ?
                (subtotalCalculado * formData.propina / 100) : 0;
            setTotalPropina(propinaCalculada);

            setTotalFinal(subtotalCalculado + propinaCalculada);
        }
    }, [pedido, formData.propina, formData.incluirPropina]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePropinaChange = (porcentaje) => {
        setFormData(prev => ({
            ...prev,
            propina: porcentaje,
            propinaPersonalizada: ''
        }));
    };

    const handlePropinaPersonalizada = (e) => {
        const valor = parseFloat(e.target.value) || 0;
        setFormData(prev => ({
            ...prev,
            propinaPersonalizada: e.target.value,
            propina: valor
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const facturaData = {
            mesaId: pedido.mesaId,
            customerName: pedido.customerName,
            pedido: pedido.pedido,
            subtotal: subtotal,
            propina: totalPropina,
            totalFinal: totalFinal,
            metodoPago: formData.metodoPago,
            porcentajePropina: formData.propina,
            fecha: new Date().toISOString(),
            estado: 'facturado'
        };

        try {
            // Enviar la factura al backend
            const response = await fetch('/api/facturas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(facturaData)
            });

            if (!response.ok) {
                throw new Error('Error al generar la factura');
            }

            const result = await response.json();
            console.log('Factura generada exitosamente:', result);

            // Llamar a la función de callback con información adicional
            onBillingComplete({
                ...facturaData,
                mesaLiberada: true,
                mensaje: 'Factura generada exitosamente. La mesa ha sido liberada.'
            });

            handleCloseModal();
        } catch (error) {
            console.error('Error al generar la factura:', error);
            alert('Error al generar la factura. Por favor, inténtalo de nuevo.');
        }
    };

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(precio);
    };

    if (!showModal || !pedido) return null;

    return (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Facturar Mesa {pedido.mesaId}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleCloseModal}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Información del cliente */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h6 className="text-muted">Cliente: {pedido.customerName || 'Sin nombre'}</h6>
                                    <p className="text-muted mb-0">Fecha: {new Date(pedido.fecha).toLocaleString('es-ES')}</p>
                                </div>
                            </div>

                            {/* Detalle del pedido */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h6>Detalle del Pedido:</h6>
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Producto</th>
                                                    <th className="text-end">Precio</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedido.pedido.map((producto, index) => (
                                                    <tr key={index}>
                                                        <td>{producto.nombre}</td>
                                                        <td className="text-end">{formatearPrecio(producto.precio)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Método de pago */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h6>Método de Pago:</h6>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="metodoPago"
                                                    id="efectivo"
                                                    value="efectivo"
                                                    checked={formData.metodoPago === 'efectivo'}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="efectivo">
                                                    💵 Efectivo
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="metodoPago"
                                                    id="dataphone"
                                                    value="dataphone"
                                                    checked={formData.metodoPago === 'dataphone'}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="dataphone">
                                                    💳 Datáfono
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="metodoPago"
                                                    id="qr"
                                                    value="qr"
                                                    checked={formData.metodoPago === 'qr'}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="qr">
                                                    📱 QR
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="metodoPago"
                                                    id="nequi"
                                                    value="nequi"
                                                    checked={formData.metodoPago === 'nequi'}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="nequi">
                                                    🟢 Nequi
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Propina */}
                            <div className="row mb-4">
                                <div className="col-12">
                                    <h6>Propina:</h6>
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="incluirPropina"
                                                    id="incluirPropina"
                                                    checked={formData.incluirPropina}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="incluirPropina">
                                                    Incluir propina
                                                </label>
                                            </div>
                                        </div>
                                        {formData.incluirPropina && (
                                            <div className="col-md-6">
                                                <div className="btn-group" role="group">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${formData.propina === 5 ? 'btn-primary' : 'btn-outline-primary'}`}
                                                        onClick={() => handlePropinaChange(5)}
                                                    >
                                                        5%
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${formData.propina === 10 ? 'btn-primary' : 'btn-outline-primary'}`}
                                                        onClick={() => handlePropinaChange(10)}
                                                    >
                                                        10%
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${formData.propina === 15 ? 'btn-primary' : 'btn-outline-primary'}`}
                                                        onClick={() => handlePropinaChange(15)}
                                                    >
                                                        15%
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm ${formData.propina === 20 ? 'btn-primary' : 'btn-outline-primary'}`}
                                                        onClick={() => handlePropinaChange(20)}
                                                    >
                                                        20%
                                                    </button>
                                                </div>
                                                <div className="mt-2">
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        placeholder="Propina personalizada (%)"
                                                        value={formData.propinaPersonalizada}
                                                        onChange={handlePropinaPersonalizada}
                                                        style={{ width: '150px' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Resumen de totales */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h6 className="card-title">Resumen de Facturación:</h6>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p className="mb-1">Subtotal: <strong>{formatearPrecio(subtotal)}</strong></p>
                                                    {formData.incluirPropina && (
                                                        <p className="mb-1">Propina ({formData.propina}%): <strong>{formatearPrecio(totalPropina)}</strong></p>
                                                    )}
                                                    <hr />
                                                    <h5 className="text-primary">Total a Pagar: <strong>{formatearPrecio(totalFinal)}</strong></h5>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="mb-1"><small className="text-muted">Método: {formData.metodoPago.toUpperCase()}</small></p>
                                                    <p className="mb-1"><small className="text-muted">Mesa: {pedido.mesaId}</small></p>
                                                    <p className="mb-1"><small className="text-muted">Productos: {pedido.pedido.length}</small></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCloseModal}
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-success">
                                💳 Generar Factura
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BillingModal; 