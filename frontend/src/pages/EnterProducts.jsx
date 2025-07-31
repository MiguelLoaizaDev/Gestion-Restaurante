import React, { useEffect, useState } from 'react';

const EnterProducts = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoria, setCategoria] = useState('');

    // Estado para edición
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({ categoria: '', precio: '', stock: '', motivo: '', cantidad: 0, op: 'sumar' });

    // Motivos posibles
    const motivosEntrada = ['comprado', 'ajuste', 'surtido'];
    const motivosSalida = ['cortesia', 'expirado', 'venta'];

    const categoriasFijas = [
        "entrada",
        "plato fuerte", 
        "adicional",
        "postre",
        "Limonada",
        "Jugo",
        "gaseosa",
        "Cerveza",
        "vino"
    ];

    useEffect(() => {
        fetch('/api/productos')
            .then(res => res.json())
            .then(data => {
                setProductos(data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                alert('Error al cargar productos');
            });
    }, []);

    // Obtener categorías únicas de los productos
    const categoriasProductos = [...new Set(productos.map(p => p.categoria))];
    const productosFiltrados = categoria ? productos.filter(p => p.categoria === categoria) : productos;

    // Abrir editor con datos actuales
    const handleEdit = (idx) => {
        const p = productosFiltrados[idx];
        setEditIndex(idx);
        setEditData({
            categoria: p.categoria ?? '',
            precio: p.precio ?? '',
            stock: p.stock ?? '',
            motivo: '',
            cantidad: 0,
            op: 'sumar'
        });
    };

    // Guardar cambios (IDÉNTICO a ingredientes, solo cambian las rutas)
    const handleSave = async () => {
        const producto = productosFiltrados[editIndex];
        let nuevoStock = producto.stock;
        if (editData.op === 'sumar') {
            nuevoStock = Number(producto.stock) + Number(editData.cantidad);
        } else if (editData.op === 'restar') {
            nuevoStock = Number(producto.stock) - Number(editData.cantidad);
        }
        // Actualizar producto en backend (PUT para sobreescribir)
        const actualizado = {
            ...producto,
            categoria: editData.categoria,
            precio: editData.precio,
            stock: nuevoStock
        };
        await fetch(`/api/productos/${encodeURIComponent(producto.nombre)}`, {
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
                productoId: producto.nombre,
                categoria: 'productos'
            })
        });
        setEditIndex(null);
        setEditData({ categoria: '', precio: '', stock: '', motivo: '', cantidad: 0, op: 'sumar' });
        // Refrescar datos (con timestamp para evitar caché)
        setLoading(true);
        fetch(`/api/productos?t=${Date.now()}`)
            .then(res => res.json())
            .then(data => {
                setProductos(data);
                setLoading(false);
            });
    };

    // Cancelar edición
    const handleCancel = () => {
        setEditIndex(null);
        setEditData({ categoria: '', precio: '', stock: '', motivo: '', cantidad: 0, op: 'sumar' });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-4">
                <span className="me-2" style={{ fontSize: '2.2rem', color: '#007bff' }}>
                    <i className="bi bi-box-seam"></i>
                </span>
                <h1 className="fw-bold text-primary mb-0" style={{ letterSpacing: '1px' }}>Productos</h1>
            </div>
            {loading ? (
                <p className="text-secondary">Cargando productos...</p>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-primary bg-gradient text-white d-flex align-items-center" style={{ borderRadius: '0.5rem 0.5rem 0 0' }}>
                        <i className="bi bi-box-seam me-2"></i>
                        <span className="fw-bold">Listado de Productos</span>
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
                                {categoriasProductos.map(cat => (
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
                                        <th className="text-center">Precio</th>
                                        <th className="text-center">Stock</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosFiltrados.map((p, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold text-dark">{p.nombre}</td>
                                            <td className="text-secondary">{p.categoria ? p.categoria.charAt(0).toUpperCase() + p.categoria.slice(1) : ''}</td>
                                            <td className="text-success text-center">${p.precio ? p.precio.toLocaleString() : '-'}</td>
                                            <td className="text-center">{p.stock ?? '-'}</td>
                                            <td>
                                                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(idx)}>Editar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {/* Formulario de edición inline */}
            {editIndex !== null && (
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="mb-3">Editar producto: {productosFiltrados[editIndex].nombre}</h5>
                        <div className="row g-3 align-items-center">
                            <div className="col-md-4">
                                <label className="form-label">Categoría</label>
                                <select className="form-select" value={editData.categoria} onChange={e => setEditData({ ...editData, categoria: e.target.value })}>
                                    <option value="">Selecciona categoría</option>
                                    {categoriasFijas.map(cat => (
                                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Precio</label>
                                <input type="number" className="form-control" value={editData.precio} onChange={e => setEditData({ ...editData, precio: e.target.value })} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Stock actual: {productosFiltrados[editIndex].stock}</label>
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
    );
};

export default EnterProducts;