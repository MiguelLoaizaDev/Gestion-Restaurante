import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const vajilla = JSON.parse(fs.readFileSync('./vajilla.json', 'utf8'));

async function insertVajilla() {
    for (const item of vajilla) {
        try {
            await db.collection('vajilla').add(item);
            console.log(`Insertado: ${item.nombre}`);
        } catch (error) {
            console.error(`Error al insertar ${item.nombre}:`, error);
        }
    }
    console.log('¡Toda la vajilla ha sido insertada!');
    process.exit();
}

insertVajilla();
