import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM ingredientes");
  const data = result.rows;
  res.json({
    data,
  });
});

router.post("/", async (req, res) => {
  const ingrediente = req.body.ingrediente;
  const unidad = req.body.unidad;
  if (ingrediente === "" || unidad === "") {
    res.json({ msgErr: "Especifique ambos campos porfavor!" });
  } else {
    const result = await db.query(
      "SELECT * FROM ingredientes WHERE nombre=$1",
      [ingrediente]
    );
    if (result.rows.length === 0) {
      await db.query(
        "INSERT INTO ingredientes (nombre,unidad) VALUES ($1,$2)",
        [ingrediente, unidad]
      );
      res.json({ msg: "Ingrediente añadido correctamente" });
    } else {
      res.json({ msg: "Ingrediente existente" });
    }
  }
});

router.post("/entrada", async (req, res) => {
  const result = await db.query("SELECT * FROM ingredientes");
  const data = result.rows;
  console.log(req.body);
  const ingrediente = req.body.ingrediente;

  const resultIngredient = await db.query(
    "SELECT * FROM ingredientes WHERE nombre=$1",
    [ingrediente]
  );
  const dataIngredient = resultIngredient.rows;
  const IngredientId = dataIngredient[0].id;

  const cantidad = req.body.cantidad;
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()}/${
    fecha.getMonth() + 1
  }/${fecha.getFullYear()}`;

  await db.query(
    "INSERT INTO movimientos_ingredientes (ingrediente_id,tipo,cantidad,fecha) VALUES ($1,'entrada',$2,$3)",
    [IngredientId, cantidad, fechaFormateada]
  );
  res.json({ data, msg: "entrada exitosa" });
});

router.post("/salida", async (req, res) => {
  const result = await db.query("SELECT * FROM ingredientes");
  const data = result.rows;
  const ingrediente = req.body.ingrediente;
  const resultIngredient = await db.query(
    "SELECT * FROM ingredientes WHERE nombre=$1",
    [ingrediente]
  );
  const dataIngredient = resultIngredient.rows;
  const IngredientId = dataIngredient[0].id;

  const cantidad = req.body.cantidad;
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()}/${
    fecha.getMonth() + 1
  }/${fecha.getFullYear()}`;

  await db.query(
    "INSERT INTO movimientos_ingredientes (ingrediente_id,tipo,cantidad,fecha) VALUES ($1,'salida',$2,$3)",
    [IngredientId, cantidad, fechaFormateada]
  );
  res.json({ data, msg: "salida exitosa" });
});

export default router;
