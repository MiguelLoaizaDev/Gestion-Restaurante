import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const insumos = JSON.parse(fs.readFileSync('./insumos.json', 'utf8'));

async function insertInsumos() {
    for (const insumo of insumos) {
        try {
            await db.collection('insumos').add(insumo);
            console.log(`Insertado: ${insumo.nombre}`);
        } catch (error) {
            console.error(`Error al insertar ${insumo.nombre}:`, error);
        }
    }
    console.log('¡Todos los insumos han sido insertados!');
    process.exit();
}

insertInsumos();
