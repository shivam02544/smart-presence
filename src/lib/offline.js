import { openDB } from 'idb';

const DB_NAME = 'smart-presence-offline';
const STORE_NAME = 'attendance-queue';

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
}

export async function saveOfflineAttendance(data) {
    const db = await initDB();
    await db.add(STORE_NAME, {
        ...data,
        timestamp: Date.now(),
        synced: false,
    });
}

export async function getOfflineRecords() {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
}

export async function clearSyncedRecords(ids) {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await Promise.all(ids.map(id => tx.store.delete(id)));
    await tx.done;
}
