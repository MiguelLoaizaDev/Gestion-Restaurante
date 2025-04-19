// IMPORTACIONES
import express from "express";
import cors from "cors";
import env from "dotenv";
import pg from "pg";

//USOS Y CONSTANTES
const app = express();
const PORT = 5000;

// Permitir peticiones desde el frontend
app.use(cors());

//Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

env.config();
//BASE DE DATOS
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Bienvenido al backend de la API 🎉");
});

// Ruta de saludo
app.get("/api/showProducto", async (req, res) => {
  const result = await db.query("SELECT * FROM productos");
  const data = result.rows;
  res.json({
    data,
  });
});
app.get("/api/showIngrediente", async (req, res) => {
  const result = await db.query("SELECT * FROM ingredientes");
  const data = result.rows;
  res.json({
    data,
  });
});
app.get("/api/showInventario", async (req, res) => {
  
  const resultP= await db.query("SELECT p.id,p.nombre,p.unidad,COALESCE(SUM(CASE WHEN m.tipo = 'entrada' THEN m.cantidad ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN m.tipo = 'salida' THEN m.cantidad ELSE 0 END), 0) AS total FROM productos p LEFT JOIN movimientos m ON p.id = m.producto_id GROUP BY p.id, p.nombre, p.unidad")
  const dataP=resultP.rows
  const resultI= await db.query("SELECT i.id, i.nombre, i.unidad, COALESCE(SUM(CASE WHEN mi.tipo = 'entrada' THEN mi.cantidad ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN mi.tipo = 'salida' THEN mi.cantidad ELSE 0 END), 0) AS total FROM ingredientes i LEFT JOIN movimientos_ingredientes mi ON i.id = mi.ingrediente_id GROUP BY i.id, i.nombre, i.unidad")
  const dataI=resultI.rows
  res.json({ dataP,dataI });
});
app.get("/api/showReporte",async(req,res)=>{
  const resultP=await db.query("SELECT m.id, p.nombre AS producto, m.tipo, m.cantidad, TO_CHAR(m.fecha, 'DD/MM/YYYY') AS fecha FROM movimientos m JOIN productos p ON m.producto_id = p.id")
  const dataP=resultP.rows
  const resultI=await db.query("SELECT mi.id, i.nombre AS ingrediente, mi.tipo,mi.cantidad, TO_CHAR(mi.fecha, 'DD/MM/YYYY') AS fecha FROM movimientos_ingredientes mi JOIN ingredientes i ON mi.ingrediente_id = i.id;")
  const dataI=resultI.rows
  
  res.json({dataP,dataI})
})

// RUTAS POST
app.post("/api/addProducto", async (req, res) => {
  const producto = req.body.producto;
  const unidad = req.body.unidad;
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
});
app.post("/api/addIngrediente", async (req, res) => {
  const ingrediente = req.body.ingrediente;
  const unidad = req.body.unidad;
  const result = await db.query("SELECT * FROM ingredientes WHERE nombre=$1", [
    ingrediente,
  ]);
  if (result.rows.length === 0) {
    await db.query("INSERT INTO ingredientes (nombre,unidad) VALUES ($1,$2)", [
      ingrediente,
      unidad,
    ]);
    res.json({ msg: "Ingrediente añadido correctamente" });
  } else {
    res.json({ msg: "Ingrediente existente" });
  }
});
app.post("/api/addEntradaP", async (req, res) => {
  const result = await db.query("SELECT * FROM productos");
  const data = result.rows;
  const producto = req.body.producto;
  const resultProduct = await db.query(
    "SELECT * FROM productos WHERE nombre=$1",
    [producto]
  );
  const dataProduct = resultProduct.rows;
  const productId=dataProduct[0].id;

  const cantidad = req.body.cantidad;
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
  
  await db.query("INSERT INTO movimientos (producto_id,tipo,cantidad,fecha) VALUES ($1,'entrada',$2,$3)",[
    productId,cantidad,fechaFormateada
  ])
  res.json({ data, msg: "entrada exitosa" });
});
app.post("/api/addSalidaP", async (req, res) => {
  const result = await db.query("SELECT * FROM productos");
  const data = result.rows;
  const producto = req.body.producto;
  const resultProduct = await db.query(
    "SELECT * FROM productos WHERE nombre=$1",
    [producto]
  );
  const dataProduct = resultProduct.rows;
  const productId=dataProduct[0].id;

  const cantidad = req.body.cantidad;
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
  
  await db.query("INSERT INTO movimientos (producto_id,tipo,cantidad,fecha) VALUES ($1,'salida',$2,$3)",[
    productId,cantidad,fechaFormateada
  ])
  res.json({ data, msg: "salida exitosa" });
});
app.post("/api/addEntradaI", async (req, res) => {
  const result = await db.query("SELECT * FROM ingredientes");
  const data = result.rows;
  const ingrediente = req.body.ingrediente;
  const resultIngredient = await db.query(
    "SELECT * FROM ingredientes WHERE nombre=$1",
    [ingrediente]
  );
  const dataIngredient = resultIngredient.rows;
  const IngredientId=dataIngredient[0].id;

  const cantidad = req.body.cantidad;
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
  
  await db.query("INSERT INTO movimientos_ingredientes (ingrediente_id,tipo,cantidad,fecha) VALUES ($1,'entrada',$2,$3)",[
    IngredientId,cantidad,fechaFormateada
  ])
  res.json({ data, msg: "entrada exitosa" });
});
app.post("/api/addSalidaI", async (req, res) => {
  const result = await db.query("SELECT * FROM ingredientes");
  const data = result.rows;
  const ingrediente = req.body.ingrediente;
  const resultIngredient = await db.query(
    "SELECT * FROM ingredientes WHERE nombre=$1",
    [ingrediente]
  );
  const dataIngredient = resultIngredient.rows;
  const IngredientId=dataIngredient[0].id;

  const cantidad = req.body.cantidad;
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
  
  await db.query("INSERT INTO movimientos_ingredientes (ingrediente_id,tipo,cantidad,fecha) VALUES ($1,'salida',$2,$3)",[
    IngredientId,cantidad,fechaFormateada
  ])
  res.json({ data, msg: "salida exitosa" });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
