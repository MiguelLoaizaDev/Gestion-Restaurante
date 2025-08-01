import React, { useState, useEffect } from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaDownload, FaPrint, FaCalendarAlt } from 'react-icons/fa';

function Reports() {
  const [facturas, setFacturas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoReporte, setTipoReporte] = useState('diario'); // diario, semanal, quincenal, mensual
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [reporteData, setReporteData] = useState(null);

  // Obtener datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [facturasRes, pedidosRes, productosRes] = await Promise.all([
          fetch('/api/facturas'),
          fetch('/api/pedidos'),
          fetch('/api/productos')
        ]);

        const [facturasData, pedidosData, productosData] = await Promise.all([
          facturasRes.json(),
          pedidosRes.json(),
          productosRes.json()
        ]);

        setFacturas(facturasData);
        setPedidos(pedidosData);
        setProductos(productosData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular fechas según el tipo de reporte
  const calcularFechas = () => {
    const hoy = new Date();
    const inicio = new Date();
    const fin = new Date();

    switch (tipoReporte) {
      case 'diario':
        inicio.setDate(hoy.getDate());
        fin.setDate(hoy.getDate());
        break;
      case 'semanal':
        inicio.setDate(hoy.getDate() - 7);
        fin.setDate(hoy.getDate());
        break;
      case 'quincenal':
        inicio.setDate(hoy.getDate() - 15);
        fin.setDate(hoy.getDate());
        break;
      case 'mensual':
        inicio.setMonth(hoy.getMonth() - 1);
        fin.setDate(hoy.getDate());
        break;
      default:
        break;
    }

    return {
      inicio: inicio.toISOString().split('T')[0],
      fin: fin.toISOString().split('T')[0]
    };
  };

  // Actualizar fechas cuando cambie el tipo de reporte
  useEffect(() => {
    const fechas = calcularFechas();
    setFechaInicio(fechas.inicio);
    setFechaFin(fechas.fin);
  }, [tipoReporte]);

  // Filtrar datos por rango de fechas
  const datosFiltrados = facturas.filter(factura => {
    const fechaFactura = factura.fecha ? factura.fecha.split('T')[0] : '';
    return fechaFactura >= fechaInicio && fechaFactura <= fechaFin;
  });

  // Calcular estadísticas de ventas
  const calcularEstadisticasVentas = () => {
    const stats = {
      totalVentas: 0,
      totalFacturas: datosFiltrados.length,
      totalPropinas: 0,
      metodosPago: {
        efectivo: { cantidad: 0, monto: 0 },
        dataphone: { cantidad: 0, monto: 0 },
        qr: { cantidad: 0, monto: 0 },
        nequi: { cantidad: 0, monto: 0 }
      },
      productosVendidos: {},
      bebidasVendidas: {},
      categorias: {}
    };

    datosFiltrados.forEach(factura => {
      stats.totalVentas += factura.totalFinal || 0;
      stats.totalPropinas += factura.propina || 0;

      // Método de pago
      const metodo = factura.metodoPago || 'efectivo';
      if (stats.metodosPago[metodo]) {
        stats.metodosPago[metodo].cantidad++;
        stats.metodosPago[metodo].monto += factura.totalFinal || 0;
      }

      // Productos vendidos
      if (factura.pedido) {
        factura.pedido.forEach(producto => {
          const nombre = producto.nombre;
          const precio = producto.precio;
          const categoria = producto.categoria || 'Sin categoría';

          // Contar productos
          if (!stats.productosVendidos[nombre]) {
            stats.productosVendidos[nombre] = { cantidad: 0, monto: 0 };
          }
          stats.productosVendidos[nombre].cantidad++;
          stats.productosVendidos[nombre].monto += precio;

          // Contar bebidas (asumiendo que tienen categoría 'bebidas' o similar)
          if (categoria.toLowerCase().includes('bebida') || 
              categoria.toLowerCase().includes('drink') ||
              nombre.toLowerCase().includes('jugo') ||
              nombre.toLowerCase().includes('gaseosa') ||
              nombre.toLowerCase().includes('cerveza') ||
              nombre.toLowerCase().includes('vino') ||
              nombre.toLowerCase().includes('agua')) {
            if (!stats.bebidasVendidas[nombre]) {
              stats.bebidasVendidas[nombre] = { cantidad: 0, monto: 0 };
            }
            stats.bebidasVendidas[nombre].cantidad++;
            stats.bebidasVendidas[nombre].monto += precio;
          }

          // Contar por categorías
          if (!stats.categorias[categoria]) {
            stats.categorias[categoria] = { cantidad: 0, monto: 0 };
          }
          stats.categorias[categoria].cantidad++;
          stats.categorias[categoria].monto += precio;
        });
      }
    });

    return stats;
  };

  const estadisticas = calcularEstadisticasVentas();

  // Obtener productos más vendidos
  const productosMasVendidos = Object.entries(estadisticas.productosVendidos)
    .sort((a, b) => b[1].cantidad - a[1].cantidad)
    .slice(0, 10);

  // Obtener bebidas más vendidas
  const bebidasMasVendidas = Object.entries(estadisticas.bebidasVendidas)
    .sort((a, b) => b[1].cantidad - a[1].cantidad)
    .slice(0, 10);

  // Obtener categorías más vendidas
  const categoriasMasVendidas = Object.entries(estadisticas.categorias)
    .sort((a, b) => b[1].monto - a[1].monto)
    .slice(0, 5);

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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generar reporte
  const generarReporte = () => {
    const reporte = {
      tipo: tipoReporte,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      estadisticas: estadisticas,
      productosMasVendidos: productosMasVendidos,
      bebidasMasVendidas: bebidasMasVendidas,
      categoriasMasVendidas: categoriasMasVendidas,
      facturas: datosFiltrados,
      fechaGeneracion: new Date().toISOString()
    };

    setReporteData(reporte);
    console.log('Reporte generado:', reporte);
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando datos para reportes...</p>
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
              <FaChartBar className="me-2" />
              Reportes de Ventas
            </h2>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={generarReporte}
              >
                <FaChartLine className="me-2" />
                Generar Reporte
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Configuración del Reporte</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <label className="form-label">Tipo de Reporte:</label>
                  <select
                    className="form-select"
                    value={tipoReporte}
                    onChange={(e) => setTipoReporte(e.target.value)}
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Fecha Inicio:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    disabled={tipoReporte !== 'personalizado'}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Fecha Fin:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    disabled={tipoReporte !== 'personalizado'}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">&nbsp;</label>
                  <div className="d-grid">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        const fechas = calcularFechas();
                        setFechaInicio(fechas.inicio);
                        setFechaFin(fechas.fin);
                      }}
                    >
                      <FaCalendarAlt className="me-2" />
                      Actualizar Fechas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del período */}
          <div className="alert alert-info">
            <strong>Período del Reporte:</strong> {formatearFecha(fechaInicio)} - {formatearFecha(fechaFin)}
            <br />
            <strong>Total Facturas:</strong> {estadisticas.totalFacturas} | 
            <strong> Total Ventas:</strong> {formatearPrecio(estadisticas.totalVentas)} | 
            <strong> Total Propinas:</strong> {formatearPrecio(estadisticas.totalPropinas)}
          </div>

          {/* Métodos de Pago */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Ventas por Método de Pago</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {Object.entries(estadisticas.metodosPago).map(([metodo, data]) => (
                      <div key={metodo} className="col-md-3 mb-3">
                        <div className="card border">
                          <div className="card-body text-center">
                            <h6 className="card-title">
                              {metodo === 'efectivo' && '💵 Efectivo'}
                              {metodo === 'dataphone' && '💳 Datáfono'}
                              {metodo === 'qr' && '📱 QR'}
                              {metodo === 'nequi' && '🟢 Nequi'}
                            </h6>
                            <h4 className="text-primary">{formatearPrecio(data.monto)}</h4>
                            <small className="text-muted">{data.cantidad} transacciones</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Productos más vendidos */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Top 10 Productos Más Vendidos</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productosMasVendidos.map(([producto, data], index) => (
                          <tr key={producto}>
                            <td>
                              <span className={`badge ${index < 3 ? 'bg-warning' : 'bg-secondary'}`}>
                                {index + 1}
                              </span>
                            </td>
                            <td>{producto}</td>
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
                  <h5 className="mb-0">Top 10 Bebidas Más Vendidas</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Bebida</th>
                          <th>Cantidad</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bebidasMasVendidas.length > 0 ? (
                          bebidasMasVendidas.map(([bebida, data], index) => (
                            <tr key={bebida}>
                              <td>
                                <span className={`badge ${index < 3 ? 'bg-info' : 'bg-secondary'}`}>
                                  {index + 1}
                                </span>
                              </td>
                              <td>{bebida}</td>
                              <td>{data.cantidad}</td>
                              <td>{formatearPrecio(data.monto)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted">
                              No hay bebidas registradas en este período
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categorías más vendidas */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Ventas por Categoría</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {categoriasMasVendidas.map(([categoria, data], index) => (
                      <div key={categoria} className="col-md-4 mb-3">
                        <div className="card border">
                          <div className="card-body text-center">
                            <h6 className="card-title">{categoria}</h6>
                            <h5 className="text-success">{formatearPrecio(data.monto)}</h5>
                            <small className="text-muted">{data.cantidad} productos vendidos</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detalle de facturas */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Detalle de Facturas del Período</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Mesa</th>
                      <th>Cliente</th>
                      <th>Método Pago</th>
                      <th>Subtotal</th>
                      <th>Propina</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <p className="text-muted">No hay facturas para este período</p>
                        </td>
                      </tr>
                    ) : (
                      datosFiltrados.map((factura, index) => (
                        <tr key={index}>
                          <td>
                            <small>{formatearFecha(factura.fecha)}</small>
                          </td>
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
    </div>
  );
}

export default Reports;