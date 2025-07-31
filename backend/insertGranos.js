import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const granos = JSON.parse(fs.readFileSync('./granos.json', 'utf8'));

async function insertGranos() {
    for (const grano of granos) {
        try {
            await db.collection('granos').add(grano);
            console.log(`Insertado: ${grano.nombre}`);
        } catch (error) {
            console.error(`Error al insertar ${grano.nombre}:`, error);
        }
    }
    console.log('¡Todos los granos han sido insertados!');
    process.exit();
}

insertGranos();
