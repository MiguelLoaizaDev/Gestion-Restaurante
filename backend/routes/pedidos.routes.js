import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/platos", async (req, res) => {
  const result = await db.query("SELECT * FROM platos");
  const productos = result.rows;
  res.json({ data: productos });
});

router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM pedidos");
  const pedidos = result.rows;
  res.json({ data: pedidos });
});
router.get("/historial", async (req, res) => {
  const result = await db.query("SELECT * FROM pedidos_historial");
  const pedidos = result.rows;
  res.json({ data: pedidos });
});
router.get("/detalle/:id", async (req, res) => {
  const id = req.params.id;

  const result = await db.query(
    `SELECT pd.*, p.nombre, p.precio 
     FROM pedido_detalle pd 
     JOIN platos p ON pd.plato_id = p.id 
     WHERE pd.pedido_id = $1`,
    [id]
  );

  res.json({ data: result.rows });
});

router.post("/", async (req, res) => {
  const mesaId = req.body.mesaId;
  const pedidos = req.body.pedidos;
  const customerName = req.body.customerName;
  const notes = req.body.notes;

  if (pedidos.length > 0) {
    const result = await db.query(
      "INSERT INTO pedidos (mesa_id, fecha, customer_name, notes) VALUES ($1,NOW(),$2,$3) RETURNING id",
      [mesaId, customerName, notes]
    );
    const pedidoId = result.rows[0].id;
    for (const pedido of pedidos) {
      await db.query(
        "INSERT INTO pedido_detalle (pedido_id, plato_id, cantidad) VALUES ($1,$2,$3)",
        [pedidoId, pedido.platoId, pedido.cantidad || 1]
      );
    }
    res.json({ msg: "Pedido creado exitosamente!" });
  } else {
    console.log("Limpiando mesa");
  }
});

router.post("/historial/:id", async (req, res) => {
  const id = req.params.id;
  const mesaId = req.body.mesaId;
  const customerName = req.body.customerName;
  const notes = req.body.notes;
  await db.query(
    "INSERT INTO pedidos_historial (id,mesa_id,fecha,customer_name,notes) VALUES ($1,$2,NOW(),$3,$4)",
    [id, mesaId, customerName, notes]
  );
  await db.query("DELETE FROM pedidos WHERE $1=id", [id]);
});

router.post("/cancelar/:id", async (req, res) => {
  const id = req.params.id;
  console.log(`id de la mesa a elminar ${id}`);
  await db.query("DELETE FROM pedidos WHERE mesa_id=$1", [id]);
});

export default router;
