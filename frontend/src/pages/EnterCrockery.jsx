import React, { useEffect, useState } from 'react';

const categoriasFijas = [
    "plato",
    "vaso",
    "copa",
    "cuchara",
    "tenedor",
    "bowl",
    "jarra"
];

const EnterCrockery = () => {
    const [vajilla, setVajilla] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoria, setCategoria] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({ categoria: '', stock: '', motivo: '', cantidad: 0, op: 'sumar' });
    const motivosEntrada = ['comprado', 'surtido', 'ajuste'];
    const motivosSalida = ['cortesia', 'roto', 'extraviado'];

    useEffect(() => {
        fetch('/api/vajilla')
            .then(res => res.json())
            .then(data => {
                setVajilla(data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                alert('Error al cargar vajilla');
            });
    }, []);

    const categoriasVajilla = [...new Set(vajilla.map(v => v.categoria))];
    const vajillaFiltrada = categoria ? vajilla.filter(v => v.categoria === categoria) : vajilla;

    const handleEdit = (idx) => {
        const v = vajillaFiltrada[idx];
        setEditIndex(idx);
        setEditData({
            categoria: v.categoria ?? '',
            stock: v.stock ?? '',
            motivo: '',
            cantidad: 0,
            op: 'sumar'
        });
    };

    const handleSave = async () => {
        const pieza = vajillaFiltrada[editIndex];
        let nuevoStock = pieza.stock;
        if (editData.op === 'sumar') {
            nuevoStock = Number(pieza.stock) + Number(editData.cantidad);
        } else if (editData.op === 'restar') {
            nuevoStock = Number(pieza.stock) - Number(editData.cantidad);
        }
        const actualizado = {
            ...pieza,
            categoria: editData.categoria,
            stock: nuevoStock
        };
        await fetch(`/api/vajilla/${encodeURIComponent(pieza.nombre)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actualizado)
        });
        await fetch('/api/movimientos_inventario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: editData.op === 'sumar' ? 'entrada' : 'salida',
                motivo: editData.motivo,
                cantidad: editData.cantidad,
                productoId: pieza.nombre,
                categoria: 'vajilla'
            })
        });
        setEditIndex(null);
        setEditData({ categoria: '', stock: '', motivo: '', cantidad: 0, op: 'sumar' });
        setLoading(true);
        fetch('/api/vajilla')
            .then(res => res.json())
            .then(data => {
                setVajilla(data);
                setLoading(false);
            });
    };

    const handleCancel = () => {
        setEditIndex(null);
        setEditData({ categoria: '', stock: '', motivo: '', cantidad: 0, op: 'sumar' });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-4">
                <span className="me-2" style={{ fontSize: '2.2rem', color: '#007bff' }}>
                    <i className="bi bi-cup-hot-fill"></i>
                </span>
                <h1 className="fw-bold text-primary mb-0" style={{ letterSpacing: '1px' }}>Vajilla</h1>
            </div>
            {loading ? (
                <p className="text-secondary">Cargando vajilla...</p>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-primary bg-gradient text-white d-flex align-items-center" style={{ borderRadius: '0.5rem 0.5rem 0 0' }}>
                        <i className="bi bi-cup-hot me-2"></i>
                        <span className="fw-bold">Listado de Vajilla</span>
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
                                {categoriasVajilla.map((cat, idx) => (
                                    <option key={cat || idx} value={cat}>
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
                                    {vajillaFiltrada.map((v, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold text-dark">{v.nombre}</td>
                                            <td className="text-secondary">{v.categoria ? v.categoria.charAt(0).toUpperCase() + v.categoria.slice(1) : '-'}</td>
                                            <td className="text-center">{v.stock ?? '-'}</td>
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
                                    <h5 className="mb-3">Editar pieza: {vajillaFiltrada[editIndex].nombre}</h5>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-md-6">
                                            <label className="form-label">Categoría</label>
                                            <select className="form-select" value={editData.categoria} onChange={e => setEditData({ ...editData, categoria: e.target.value })}>
                                                <option value="">Selecciona categoría</option>
                                                {categoriasFijas.map(cat => (
                                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Stock actual: {vajillaFiltrada[editIndex].stock}</label>
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

export default EnterCrockery;
