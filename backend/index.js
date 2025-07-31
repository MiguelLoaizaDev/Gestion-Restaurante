import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';

const app = express();
const PORT = 5000;

// Inicializar Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const db = admin.firestore();

// Permitir peticiones desde el frontend
app.use(express.json());
app.use(cors());

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido al backend de la API 🎉');
});

// Te falta esto:
app.get('/api/movimientos_inventario', (req, res) => {
  try {
    const movimientos = JSON.parse(fs.readFileSync('./movimientos_inventario.json', 'utf8'));
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron cargar los movimientos.' });
  }
});

// Ruta para registrar movimientos de inventario (entrada/salida)
app.post('/api/movimientos_inventario', (req, res) => {
  try {
    const movimiento = req.body;
    let movimientos = [];
    try {
      movimientos = JSON.parse(fs.readFileSync('./movimientos_inventario.json', 'utf8'));
    } catch (e) {
      movimientos = [];
    }
    movimientos.push({
      ...movimiento,
      fecha: new Date().toISOString()
    });
    fs.writeFileSync('./movimientos_inventario.json', JSON.stringify(movimientos, null, 2));
    res.status(201).json({ mensaje: 'Movimiento registrado exitosamente', movimiento });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo registrar el movimiento.' });
  }
});


// REEMPLAZA todas las rutas de productos con estas versiones limpias
// (copiadas exactamente de las rutas de ingredientes que funcionan)

// Ruta para obtener productos
app.get('/api/productos', (req, res) => {
  try {
    const productos = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron cargar los productos.' });
  }
});

// Ruta para crear producto
app.post('/api/productos', (req, res) => {
  try {
    const producto = req.body;
    let productos = [];
    try {
      productos = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
    } catch (e) {
      productos = [];
    }
    productos.push(producto);
    fs.writeFileSync('./products.json', JSON.stringify(productos, null, 2));
    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el producto.' });
  }
});

// Ruta PUT con debug - reemplaza tu ruta actual
app.put('/api/productos/:nombre', (req, res) => {
  console.log('=== DEBUG PUT PRODUCTOS ===');
  console.log('Nombre recibido:', req.params.nombre);
  console.log('Body recibido:', req.body);

  try {
    const nombre = req.params.nombre;
    const actualizado = req.body;

    console.log('Intentando leer products.json...');
    let productos = [];
    try {
      productos = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
      console.log('Productos leídos:', productos.length);
    } catch (e) {
      console.log('Error leyendo archivo, usando array vacío:', e.message);
      productos = [];
    }

    let encontrado = false;
    productos = productos.map(p => {
      if (p.nombre === nombre) {
        console.log('Producto encontrado, actualizando:', p.nombre);
        encontrado = true;
        return { ...p, ...actualizado };
      }
      return p;
    });

    if (!encontrado) {
      console.log('Producto NO encontrado');
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    console.log('Escribiendo archivo...');
    fs.writeFileSync('./products.json', JSON.stringify(productos, null, 2));
    console.log('Archivo escrito exitosamente');
    console.log('=== FIN DEBUG ===');

    res.json({ mensaje: 'Producto actualizado exitosamente', producto: actualizado });
  } catch (error) {
    console.log('ERROR EN PUT:', error);
    res.status(500).json({ error: 'No se pudo actualizar el producto.' });
  }
});

// Ruta para crear un pedido
app.use(express.json());

app.post('/api/pedidos', (req, res) => {
  try {
    const pedido = req.body;
    // Leer pedidos existentes o crear array vacío si no existe
    let pedidos = [];
    try {
      pedidos = JSON.parse(fs.readFileSync('./pedidos.json', 'utf8'));
    } catch (e) {
      pedidos = [];
    }
    // Agregar el nuevo pedido
    pedidos.push({
      ...pedido,
      fecha: new Date().toISOString()
    });
    // Guardar el array actualizado
    fs.writeFileSync('./pedidos.json', JSON.stringify(pedidos, null, 2));
    res.status(201).json({ mensaje: 'Pedido creado exitosamente', pedido });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el pedido.' });
  }
});

// Ruta para obtener ingredientes
app.get('/api/ingredientes', (req, res) => {
  try {
    const ingredientes = JSON.parse(fs.readFileSync('./ingredientes.json', 'utf8'));
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron cargar los ingredientes.' });
  }
});

// Ruta para obtener granos
app.get('/api/granos', (req, res) => {
  try {
    const granos = JSON.parse(fs.readFileSync('./granos.json', 'utf8'));
    res.json(granos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron cargar los granos.' });
  }
});

// Ruta para actualizar ingrediente por nombre
app.put('/api/ingredientes/:nombre', (req, res) => {
  try {
    const nombre = req.params.nombre;
    const actualizado = req.body;
    let ingredientes = [];
    try {
      ingredientes = JSON.parse(fs.readFileSync('./ingredientes.json', 'utf8'));
    } catch (e) {
      ingredientes = [];
    }
    let encontrado = false;
    ingredientes = ingredientes.map(i => {
      if (i.nombre === nombre) {
        encontrado = true;
        return { ...i, ...actualizado };
      }
      return i;
    });
    if (!encontrado) {
      return res.status(404).json({ error: 'Ingrediente no encontrado.' });
    }
    fs.writeFileSync('./ingredientes.json', JSON.stringify(ingredientes, null, 2));
    res.json({ mensaje: 'Ingrediente actualizado exitosamente', ingrediente: actualizado });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el ingrediente.' });
  }
});

// Ruta para crear grano
app.post('/api/granos', (req, res) => {
  try {
    const grano = req.body;
    let granos = [];
    try {
      granos = JSON.parse(fs.readFileSync('./granos.json', 'utf8'));
    } catch (e) {
      granos = [];
    }
    granos.push(grano);
    fs.writeFileSync('./granos.json', JSON.stringify(granos, null, 2));
    res.status(201).json({ mensaje: 'Grano creado exitosamente', grano });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el grano.' });
  }
});

// Ruta para actualizar grano por nombre
app.put('/api/granos/:nombre', (req, res) => {
  try {
    const nombre = req.params.nombre;
    const actualizado = req.body;
    let granos = [];
    try {
      granos = JSON.parse(fs.readFileSync('./granos.json', 'utf8'));
    } catch (e) {
      granos = [];
    }
    let encontrado = false;
    granos = granos.map(g => {
      if (g.nombre === nombre) {
        encontrado = true;
        return { ...g, ...actualizado };
      }
      return g;
    });
    if (!encontrado) {
      return res.status(404).json({ error: 'Grano no encontrado.' });
    }
    fs.writeFileSync('./granos.json', JSON.stringify(granos, null, 2));
    res.json({ mensaje: 'Grano actualizado exitosamente', grano: actualizado });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el grano.' });
  }
});

// Ruta para obtener insumos
app.get('/api/insumos', (req, res) => {
  try {
    const insumos = JSON.parse(fs.readFileSync('./insumos.json', 'utf8'));
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron cargar los insumos.' });
  }
});

// Ruta para crear insumo
app.post('/api/insumos', (req, res) => {
  try {
    const insumo = req.body;
    let insumos = [];
    try {
      insumos = JSON.parse(fs.readFileSync('./insumos.json', 'utf8'));
    } catch (e) {
      insumos = [];
    }
    insumos.push(insumo);
    fs.writeFileSync('./insumos.json', JSON.stringify(insumos, null, 2));
    res.status(201).json({ mensaje: 'Insumo creado exitosamente', insumo });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el insumo.' });
  }
});

// Ruta para actualizar insumo por nombre
app.put('/api/insumos/:nombre', (req, res) => {
  try {
    const nombre = req.params.nombre;
    const actualizado = req.body;
    let insumos = [];
    try {
      insumos = JSON.parse(fs.readFileSync('./insumos.json', 'utf8'));
    } catch (e) {
      insumos = [];
    }
    let encontrado = false;
    insumos = insumos.map(i => {
      if (i.nombre === nombre) {
        encontrado = true;
        return { ...i, ...actualizado };
      }
      return i;
    });
    if (!encontrado) {
      return res.status(404).json({ error: 'Insumo no encontrado.' });
    }
    fs.writeFileSync('./insumos.json', JSON.stringify(insumos, null, 2));
    res.json({ mensaje: 'Insumo actualizado exitosamente', insumo: actualizado });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo actualizar el insumo.' });
  }
});

// Ruta para obtener vajilla
app.get('/api/vajilla', (req, res) => {
  try {
    const vajilla = JSON.parse(fs.readFileSync('./vajilla.json', 'utf8'));
    res.json(vajilla);
  } catch (error) {
    res.status(500).json({ error: 'No se pudo cargar la vajilla.' });
  }
});

// Ruta para crear vajilla
app.post('/api/vajilla', (req, res) => {
  try {
    const pieza = req.body;
    let vajilla = [];
    try {
      vajilla = JSON.parse(fs.readFileSync('./vajilla.json', 'utf8'));
    } catch (e) {
      vajilla = [];
    }
    vajilla.push(pieza);
    fs.writeFileSync('./vajilla.json', JSON.stringify(vajilla, null, 2));
    res.status(201).json({ mensaje: 'Pieza de vajilla creada exitosamente', pieza });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear la pieza de vajilla.' });
  }
});

// Ruta para crear ingrediente
app.post('/api/ingredientes', (req, res) => {
  try {
    const ingrediente = req.body;
    let ingredientes = [];
    try {
      ingredientes = JSON.parse(fs.readFileSync('./ingredientes.json', 'utf8'));
    } catch (e) {
      ingredientes = [];
    }
    ingredientes.push(ingrediente);
    fs.writeFileSync('./ingredientes.json', JSON.stringify(ingredientes, null, 2));
    res.status(201).json({ mensaje: 'Ingrediente creado exitosamente', ingrediente });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo crear el ingrediente.' });
  }
});

// Ruta para obtener pedidos
app.get('/api/pedidos', (req, res) => {
  try {
    const pedidos = JSON.parse(fs.readFileSync('./pedidos.json', 'utf8'));
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron cargar los pedidos.' });
  }
});

// Ruta para obtener reportes
app.get('/api/reportes', (req, res) => {
  try {
    const reportes = JSON.parse(fs.readFileSync('./reportes.json', 'utf8'));
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: 'No se pudieron cargar los reportes.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
