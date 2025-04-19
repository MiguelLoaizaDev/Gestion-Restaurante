import React, { useEffect, useState } from "react";

const Reporte = () => {
  const [reportesP, setReportesP] = useState([]);
  const [reportesI, setReportesI] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/showReporte")
      .then((res) => res.json())
      .then((data) => {
        console.log("Reportes: ", data.data);
        setReportesP(data.dataP);
        setReportesI(data.dataI)
      });
  }, []);
  return (
    <div>
      <h2>Reportes</h2>
      <ul>
        {reportesP.map((report)=>(
            <li>
                {report.producto} - {report.tipo} - {report.cantidad} - {report.fecha}
            </li>
        ))}
        {reportesI.map((report)=>(
            <li>
                {report.ingrediente} - {report.tipo} - {report.cantidad} - {report.fecha}
            </li>
        ))}
      </ul>
      <a href="/">Volver</a>
    </div>
  );
};

export default Reporte;
