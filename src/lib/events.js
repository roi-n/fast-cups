import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

const EVENTS_COLLECTION = 'events';

export async function createEvent({ name, startTime, endTime, adminUid, adminName }) {
  const ref = await addDoc(collection(db, EVENTS_COLLECTION), {
    name,
    adminUid,
    adminName,
    startTime,
    endTime,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getEvent(eventId) {
  const snap = await getDoc(doc(db, EVENTS_COLLECTION, eventId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function resetAllCups(eventId) {
  const cupsSnap = await getDocs(collection(db, EVENTS_COLLECTION, eventId, 'cups'));
  const batch = writeBatch(db);
  cupsSnap.docs.forEach((d) => batch.update(d.ref, { count: 0 }));
  await batch.commit();
}
