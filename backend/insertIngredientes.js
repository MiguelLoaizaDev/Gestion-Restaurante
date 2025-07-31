import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const ingredientes = JSON.parse(fs.readFileSync('./ingredientes.json', 'utf8'));

async function insertIngredientes() {
    for (const ingrediente of ingredientes) {
        try {
            await db.collection('ingredientes').add(ingrediente);
            console.log(`Insertado: ${ingrediente.nombre}`);
        } catch (error) {
            console.error(`Error al insertar ${ingrediente.nombre}:`, error);
        }
    }
    console.log('¡Todos los ingredientes han sido insertados!');
    process.exit();
}

insertIngredientes();
