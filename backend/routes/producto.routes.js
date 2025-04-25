import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM productos");
  res.json({ data: result.rows });
});

router.post("/", async (req, res) => {
  const producto = req.body.producto;
  const unidad = req.body.unidad;
  if (producto === "" || unidad === "") {
    res.json({ msgErr: "Especifique ambos campos porfavor!" });
  } else {
    const result = await db.query("SELECT * FROM productos WHERE nombre=$1", [
      producto,
    ]);
    if (result.rows.length === 0) {
      await db.query("INSERT INTO productos (nombre,unidad) VALUES ($1,$2)", [
        producto,
        unidad,
      ]);
      res.json({ msg: "Producto añadido correctamente" });
    } else {
      res.json({ msg: "Producto existente" });
    }
  }
});

router.post("/entrada", async (req, res) => {
  const result = await db.query("SELECT * FROM productos");
  const data = result.rows;
  const producto = req.body.producto;
  const resultProduct = await db.query(
    "SELECT * FROM productos WHERE nombre=$1",
    [producto]
  );
  const dataProduct = resultProduct.rows;
  const productId = dataProduct[0].id;

  const cantidad = req.body.cantidad;
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()}/${
    fecha.getMonth() + 1
  }/${fecha.getFullYear()}`;

  await db.query(
    "INSERT INTO movimientos (producto_id,tipo,cantidad,fecha) VALUES ($1,'entrada',$2,$3)",
    [productId, cantidad, fechaFormateada]
  );
  res.json({ data, msg: "entrada exitosa" });
});

router.post("/salida", async (req, res) => {
  const result = await db.query("SELECT * FROM productos");
  const data = result.rows;
  const producto = req.body.producto;
  const resultProduct = await db.query(
    "SELECT * FROM productos WHERE nombre=$1",
    [producto]
  );
  const dataProduct = resultProduct.rows;
  const productId = dataProduct[0].id;

  const cantidad = req.body.cantidad;
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()}/${
    fecha.getMonth() + 1
  }/${fecha.getFullYear()}`;

  await db.query(
    "INSERT INTO movimientos (producto_id,tipo,cantidad,fecha) VALUES ($1,'salida',$2,$3)",
    [productId, cantidad, fechaFormateada]
  );
  res.json({ data, msg: "salida exitosa" });
});

export default router;
