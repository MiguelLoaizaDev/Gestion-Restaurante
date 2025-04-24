import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM mesas");
  const mesas = result.rows;
  res.json({ data:mesas });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  const customerName = req.body.customerName;
  const notes = req.body.notas;
  const timeOccupied = req.body.timeOccupied;
  console.log("Estado de mesa",status);
  console.log(`id de la mesa: ${id}, el cliente: ${customerName}`);
  console.log(`Time occupied: ${timeOccupied}`);
  
  
  
  const result = await db.query(
    "UPDATE mesas SET status=$1, customer_name=$2, notes=$3, time_occupied=$4 WHERE id = $5 RETURNING *",
    [status, customerName || "", notes || "", timeOccupied || null, id]
  );
  const data = result.rows[0];
  res.json({ data });
});

export default router