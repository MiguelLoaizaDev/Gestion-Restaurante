import React, { useState, useEffect } from 'react';
import BillingModal from '../components/BillingModal';
import PedidoDetailModal from '../components/PedidoDetailModal';

function ViewOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [selectedPedidoForBilling, setSelectedPedidoForBilling] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPedidoForDetail, setSelectedPedidoForDetail] = useState(null);
  const [filtroEstadisticas, setFiltroEstadisticas] = useState('hoy'); // 'hoy', 'todos', 'fecha'

  // Obtener pedidos desde la API
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pedidos');
        if (!response.ok) {
          throw new Error('Error al cargar los pedidos');
        }
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        setError('No se pudieron cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  // Obtener fecha de hoy en formato YYYY-MM-DD
  const getFechaHoy = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  // Filtrar pedidos para la tabla
  const pedidosFiltrados = pedidos.filter(pedido => {
    const cumpleEstado = filtroEstado === 'todos' || pedido.status === filtroEstado;
    const cumpleFecha = !filtroFecha || pedido.fecha.includes(filtroFecha);
    const cumpleBusqueda = !busqueda || 
      pedido.customerName.toLowerCase().includes(busqueda.toLowerCase()) ||
      pedido.mesaId.toString().includes(busqueda) ||
      pedido.pedido.some(producto => 
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    
    return cumpleEstado && cumpleFecha && cumpleBusqueda;
  });

  // Filtrar pedidos para estadísticas
  const pedidosParaEstadisticas = pedidos.filter(pedido => {
    const fechaPedido = new Date(pedido.fecha).toISOString().split('T')[0];
    
    switch (filtroEstadisticas) {
      case 'hoy':
        return fechaPedido === getFechaHoy();
      case 'todos':
        return true;
      case 'fecha':
        return !filtroFecha || pedido.fecha.includes(filtroFecha);
      default:
        return fechaPedido === getFechaHoy();
    }
  });

  // Formatear fecha
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

  // Formatear estado
  const formatearEstado = (estado) => {
    const estados = {
      'available': 'Disponible',
      'occupied': 'Ocupada',
      'reserved': 'Reservada'
    };
    return estados[estado] || estado;
  };

  // Formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(precio);
  };

  // Manejar facturación
  const handleBilling = (pedido) => {
    setSelectedPedidoForBilling(pedido);
    setShowBillingModal(true);
  };

  const handleCloseBillingModal = () => {
    setShowBillingModal(false);
    setSelectedPedidoForBilling(null);
  };

  // Manejar vista de detalles
  const handleViewDetails = (pedido) => {
    setSelectedPedidoForDetail(pedido);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedPedidoForDetail(null);
  };

  const handleBillingComplete = async (facturaData) => {
    try {
      // Aquí podrías enviar la factura al backend
      console.log('Factura completada:', facturaData);
      
      // Actualizar el estado del pedido a facturado
      const response = await fetch(`/api/pedidos/${facturaData.mesaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...facturaData,
          estado: 'facturado'
        })
      });

      if (response.ok) {
        // Recargar pedidos para mostrar el estado actualizado
        const updatedResponse = await fetch('/api/pedidos');
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setPedidos(updatedData);
        }
        
        // Mostrar mensaje apropiado
        if (facturaData.mesaLiberada) {
          alert(facturaData.mensaje || 'Factura generada exitosamente. La mesa ha sido liberada.');
        } else {
          alert('Factura generada exitosamente');
        }
      }
    } catch (error) {
      console.error('Error al completar la facturación:', error);
      alert('Error al completar la facturación');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Vista de Pedidos</h2>
          
          {/* Filtros */}
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Buscar:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Cliente, mesa o producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Estado:</label>
              <select
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="available">Disponible</option>
                <option value="occupied">Ocupada</option>
                <option value="reserved">Reservada</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Fecha:</label>
              <input
                type="date"
                className="form-control"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">&nbsp;</label>
              <div className="d-grid">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setFiltroEstado('todos');
                    setFiltroFecha('');
                    setBusqueda('');
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>

          {/* Filtro de estadísticas */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title">Filtro de Estadísticas:</h6>
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className={`btn btn-sm ${filtroEstadisticas === 'hoy' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setFiltroEstadisticas('hoy')}
                        >
                          📅 Hoy
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${filtroEstadisticas === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setFiltroEstadisticas('todos')}
                        >
                          📊 Todos
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${filtroEstadisticas === 'fecha' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setFiltroEstadisticas('fecha')}
                        >
                          📅 Fecha Específica
                        </button>
                      </div>
                    </div>
                    <div className="col-md-4">
                      {filtroEstadisticas === 'fecha' && (
                        <input
                          type="date"
                          className="form-control"
                          value={filtroFecha}
                          onChange={(e) => setFiltroFecha(e.target.value)}
                          placeholder="Seleccionar fecha"
                        />
                      )}
                    </div>
                    <div className="col-md-4">
                      <small className="text-muted">
                        {filtroEstadisticas === 'hoy' && `Mostrando datos del ${getFechaHoy()}`}
                        {filtroEstadisticas === 'todos' && 'Mostrando todos los datos'}
                        {filtroEstadisticas === 'fecha' && filtroFecha && `Mostrando datos del ${filtroFecha}`}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Pedidos</h5>
                  <h3>{pedidosParaEstadisticas.length}</h3>
                  <small>
                    {filtroEstadisticas === 'hoy' && 'Del día de hoy'}
                    {filtroEstadisticas === 'todos' && 'De todos los tiempos'}
                    {filtroEstadisticas === 'fecha' && filtroFecha && `Del ${filtroFecha}`}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Ventas</h5>
                  <h3>{formatearPrecio(pedidosParaEstadisticas.reduce((total, pedido) => total + pedido.total, 0))}</h3>
                  <small>
                    {filtroEstadisticas === 'hoy' && 'Del día de hoy'}
                    {filtroEstadisticas === 'todos' && 'De todos los tiempos'}
                    {filtroEstadisticas === 'fecha' && filtroFecha && `Del ${filtroFecha}`}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Mesas Ocupadas</h5>
                  <h3>{pedidosParaEstadisticas.filter(p => p.status === 'occupied').length}</h3>
                  <small>
                    {filtroEstadisticas === 'hoy' && 'Del día de hoy'}
                    {filtroEstadisticas === 'todos' && 'De todos los tiempos'}
                    {filtroEstadisticas === 'fecha' && filtroFecha && `Del ${filtroFecha}`}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <h5 className="card-title">Promedio por Pedido</h5>
                  <h3>{pedidosParaEstadisticas.length > 0 ? formatearPrecio(pedidosParaEstadisticas.reduce((total, pedido) => total + pedido.total, 0) / pedidosParaEstadisticas.length) : '$0'}</h3>
                  <small>
                    {filtroEstadisticas === 'hoy' && 'Del día de hoy'}
                    {filtroEstadisticas === 'todos' && 'De todos los tiempos'}
                    {filtroEstadisticas === 'fecha' && filtroFecha && `Del ${filtroFecha}`}
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de pedidos */}
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Mesa</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <p className="text-muted">No se encontraron pedidos con los filtros aplicados</p>
                    </td>
                  </tr>
                ) : (
                  pedidosFiltrados.map((pedido, index) => (
                    <tr key={index}>
                      <td>
                        <span className="badge bg-secondary fs-6">Mesa {pedido.mesaId}</span>
                      </td>
                      <td>
                        <strong>{pedido.customerName || 'Sin nombre'}</strong>
                      </td>
                      <td>
                        <span className={`badge ${
                          pedido.status === 'occupied' ? 'bg-danger' :
                          pedido.status === 'reserved' ? 'bg-warning' : 'bg-success'
                        }`}>
                          {formatearEstado(pedido.status)}
                        </span>
                      </td>
                      <td>
                        <div className="productos-lista">
                          {pedido.pedido.map((producto, idx) => (
                            <div key={idx} className="d-flex justify-content-between align-items-center mb-1">
                              <small>{producto.nombre}</small>
                              <small className="text-muted">{formatearPrecio(producto.precio)}</small>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong className="text-primary">{formatearPrecio(pedido.total)}</strong>
                      </td>
                      <td>
                        <small>{formatearFecha(pedido.fecha)}</small>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-sm btn-info"
                            onClick={() => handleViewDetails(pedido)}
                            title="Ver detalles del pedido"
                          >
                            👁️ Ver
                          </button>
                          {pedido.estado !== 'facturado' && (
                            <button
                              type="button"
                              className="btn btn-sm btn-success"
                              onClick={() => handleBilling(pedido)}
                              title="Facturar pedido"
                            >
                              💳 Facturar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación simple */}
          {pedidosFiltrados.length > 10 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#">
                      Anterior
                    </a>
                  </li>
                  <li className="page-item active">
                    <a className="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">
                      Siguiente
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Facturación */}
      {selectedPedidoForBilling && (
        <BillingModal
          pedido={selectedPedidoForBilling}
          showModal={showBillingModal}
          handleCloseModal={handleCloseBillingModal}
          onBillingComplete={handleBillingComplete}
        />
      )}

      {/* Modal de Detalles */}
      {selectedPedidoForDetail && (
        <PedidoDetailModal
          pedido={selectedPedidoForDetail}
          showModal={showDetailModal}
          handleCloseModal={handleCloseDetailModal}
        />
      )}
    </div>
  );
}

export default ViewOrders;
