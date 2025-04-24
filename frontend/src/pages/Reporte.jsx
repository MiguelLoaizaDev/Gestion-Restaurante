import React, { useEffect, useState } from "react";

const Reporte = () => {
  const [reportesP, setReportesP] = useState([]);
  const [reportesI, setReportesI] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/inventario/reporte")
      .then((res) => res.json())
      .then((data) => {
        console.log("Reportes: ", data.dataP, data.dataI);
        setReportesP(data.dataP);
        setReportesI(data.dataI);
        console.log(data.dataI)
      });
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Reportes de Inventario</h1>

      <div className="mb-5">
        <h2 className="mb-3">Reportes de Productos:</h2>
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Unidad</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reportesP.length > 0 ? (
              reportesP.map((report, i) => (
                <tr key={i}>
                  <td>{report.producto}</td>
                  <td>{report.tipo}</td>
                  <td>{report.cantidad}</td>
                  <td>{report.fecha}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No hay movimientos de productos que mostrar...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="mb-3">Reportes de Ingredientes:</h2>
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Unidad</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {reportesI.length > 0 ? (
              reportesI.map((report, i) => (
                <tr key={i}>
                  <td>{report.ingrediente}</td>
                  <td>{report.tipo}</td>
                  <td>{report.cantidad}</td>
                  <td>{report.fecha}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No hay movimientos de ingredientes que mostrar...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <a href="/" className="btn btn-link">Volver al inicio</a>
      </div>
    </div>
  );
};

export default Reporte;
