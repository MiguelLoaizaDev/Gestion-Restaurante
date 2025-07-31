import React, { useEffect, useState } from 'react';

const EnterInputs = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoria, setCategoria] = useState('');

    useEffect(() => {
        fetch('/api/insumos')
            .then(res => res.json())
            .then(data => {
                setInsumos(data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                alert('Error al cargar insumos');
            });
    }, []);

    // Obtener categorías únicas de los insumos
    const categoriasInsumos = [...new Set(insumos.map(i => i.categoria))];
    const insumosFiltrados = categoria ? insumos.filter(i => i.categoria === categoria) : insumos;

    // Estado para edición
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({ categoria: '', stock: '', motivo: '', cantidad: 0, op: 'sumar' });

    // Motivos posibles
    const motivosEntrada = ['comprado', 'surtido', 'ajuste'];
    const motivosSalida = ['cortesia', 'expirado', 'uso'];

    // Abrir editor con datos actuales
    const handleEdit = (idx) => {
        const i = insumosFiltrados[idx];
        setEditIndex(idx);
        setEditData({
            categoria: i.categoria ?? '',
            stock: i.stock ?? '',
            motivo: '',
            cantidad: 0,
            op: 'sumar'
        });
    };

    // Guardar cambios
    const handleSave = async () => {
        const insumo = insumosFiltrados[editIndex];
        let nuevoStock = insumo.stock;
        if (editData.op === 'sumar') {
            nuevoStock = Number(insumo.stock) + Number(editData.cantidad);
        } else if (editData.op === 'restar') {
            nuevoStock = Number(insumo.stock) - Number(editData.cantidad);
        }
        // Actualizar insumo en backend (PUT para sobreescribir)
        const actualizado = {
            ...insumo,
            categoria: editData.categoria,
            stock: nuevoStock
        };
        await fetch(`/api/insumos/${encodeURIComponent(insumo.nombre)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actualizado)
        });
        // Registrar movimiento
        await fetch('/api/movimientos_inventario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: editData.op === 'sumar' ? 'entrada' : 'salida',
                motivo: editData.motivo,
                cantidad: editData.cantidad,
                productoId: insumo.nombre,
                categoria: 'insumos'
            })
        });
        setEditIndex(null);
        setEditData({ categoria: '', stock: '', motivo: '', cantidad: 0, op: 'sumar' });
        // Refrescar datos
        setLoading(true);
        fetch('/api/insumos')
            .then(res => res.json())
            .then(data => {
                setInsumos(data);
                setLoading(false);
            });
    };

    // Cancelar edición
    const handleCancel = () => {
        setEditIndex(null);
        setEditData({ categoria: '', stock: '', motivo: '', cantidad: 0, op: 'sumar' });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-4">
                <span className="me-2" style={{ fontSize: '2.2rem', color: '#007bff' }}>
                    <i className="bi bi-box2-fill"></i>
                </span>
                <h1 className="fw-bold text-primary mb-0" style={{ letterSpacing: '1px' }}>Insumos</h1>
            </div>
            {loading ? (
                <p className="text-secondary">Cargando insumos...</p>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-primary bg-gradient text-white d-flex align-items-center" style={{ borderRadius: '0.5rem 0.5rem 0 0' }}>
                        <i className="bi bi-box2 me-2"></i>
                        <span className="fw-bold">Listado de Insumos</span>
                    </div>
                    <div className="card-body">
                        <div className="mb-3 d-flex align-items-center">
                            <label className="form-label fw-semibold me-2 mb-0">Filtrar por categoría:</label>
                            <select
                                className="form-select w-auto d-inline-block"
                                value={categoria}
                                onChange={e => setCategoria(e.target.value)}
                                style={{ minWidth: 160 }}
                            >
                                <option value="">Todas</option>
                                {categoriasInsumos.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="table-responsive mb-0">
                            <table className="table table-hover table-bordered align-middle shadow-sm rounded">
                                <thead className="table-primary">
                                    <tr>
                                        <th className="text-center">Nombre</th>
                                        <th className="text-center">Categoría</th>
                                        <th className="text-center">Stock</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {insumosFiltrados.map((i, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold text-dark">{i.nombre}</td>
                                            <td className="text-secondary">{i.categoria ? i.categoria.charAt(0).toUpperCase() + i.categoria.slice(1) : ''}</td>
                                            <td className="text-center">{i.stock ?? '-'}</td>
                                            <td>
                                                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(idx)}>Editar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Formulario de edición inline */}
                        {editIndex !== null && (
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h5 className="mb-3">Editar insumo: {insumosFiltrados[editIndex].nombre}</h5>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-6">
                                            <label className="form-label">Categoría</label>
                                            <input type="text" className="form-control" value={editData.categoria} onChange={e => setEditData({ ...editData, categoria: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Stock actual: {insumosFiltrados[editIndex].stock}</label>
                                            <div className="input-group">
                                                <select className="form-select w-auto" value={editData.op} onChange={e => setEditData({ ...editData, op: e.target.value })}>
                                                    <option value="sumar">Sumar</option>
                                                    <option value="restar">Restar</option>
                                                </select>
                                                <input type="number" className="form-control" value={editData.cantidad} min={0} onChange={e => setEditData({ ...editData, cantidad: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="col-md-12 mt-3">
                                            <label className="form-label">Motivo</label>
                                            <select className="form-select" value={editData.motivo} onChange={e => setEditData({ ...editData, motivo: e.target.value })}>
                                                <option value="">Selecciona motivo</option>
                                                {(editData.op === 'sumar' ? motivosEntrada : motivosSalida).map(m => (
                                                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-3 d-flex gap-2">
                                        <button className="btn btn-success" onClick={handleSave}>Guardar</button>
                                        <button className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnterInputs;
