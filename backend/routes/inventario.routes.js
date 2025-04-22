import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const resultP = await db.query(
    "SELECT p.id,p.nombre,p.unidad,COALESCE(SUM(CASE WHEN m.tipo = 'entrada' THEN m.cantidad ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN m.tipo = 'salida' THEN m.cantidad ELSE 0 END), 0) AS total FROM productos p LEFT JOIN movimientos m ON p.id = m.producto_id GROUP BY p.id, p.nombre, p.unidad"
  );
  const dataP = resultP.rows;
  const resultI = await db.query(
    "SELECT i.id, i.nombre, i.unidad, COALESCE(SUM(CASE WHEN mi.tipo = 'entrada' THEN mi.cantidad ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN mi.tipo = 'salida' THEN mi.cantidad ELSE 0 END), 0) AS total FROM ingredientes i LEFT JOIN movimientos_ingredientes mi ON i.id = mi.ingrediente_id GROUP BY i.id, i.nombre, i.unidad"
  );
  const dataI = resultI.rows;
  res.json({ dataP, dataI });
});
router.get("/reporte", async (req, res) => {
  const resultP = await db.query(
    "SELECT m.id, p.nombre AS producto, m.tipo, m.cantidad, TO_CHAR(m.fecha, 'DD/MM/YYYY') AS fecha FROM movimientos m JOIN productos p ON m.producto_id = p.id"
  );
  const dataP = resultP.rows;
  const resultI = await db.query(
    "SELECT mi.id, i.nombre AS ingrediente, mi.tipo,mi.cantidad, TO_CHAR(mi.fecha, 'DD/MM/YYYY') AS fecha FROM movimientos_ingredientes mi JOIN ingredientes i ON mi.ingrediente_id = i.id;"
  );
  const dataI = resultI.rows;

  res.json({ dataP, dataI });
});

export default router;
