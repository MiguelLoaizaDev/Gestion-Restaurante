import admin from 'firebase-admin';
import fs from 'fs';

// Inicializa Firebase Admin con tu clave de servicio
const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Lee los productos desde el archivo JSON
const productos = JSON.parse(fs.readFileSync('./products.json', 'utf8'));

// Función para insertar productos en la colección "productos"
async function insertProducts() {
    for (const producto of productos) {
        try {
            await db.collection('productos').add(producto);
            console.log(`Insertado: ${producto.nombre}`);
        } catch (error) {
            console.error(`Error al insertar ${producto.nombre}:`, error);
        }
    }
    console.log('¡Todos los productos han sido insertados!');
    process.exit();
}

insertProducts();