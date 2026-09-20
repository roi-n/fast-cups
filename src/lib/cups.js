import { arrayUnion, collection, doc, increment, onSnapshot, runTransaction, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const EVENTS_COLLECTION = 'events';
const CUPS_SUBCOLLECTION = 'cups';

function cupDoc(eventId, uid) {
  return doc(db, EVENTS_COLLECTION, eventId, CUPS_SUBCOLLECTION, uid);
}

export function watchLeaderboard(eventId, callback) {
  return onSnapshot(collection(db, EVENTS_COLLECTION, eventId, CUPS_SUBCOLLECTION), (snapshot) => {
    const rows = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
    rows.sort((a, b) => b.count - a.count);
    callback(rows);
  });
}

export async function drinkCup(eventId, user) {
  await Promise.all([
    setDoc(
      cupDoc(eventId, user.uid),
      { uid: user.uid, name: user.name, email: user.email, count: increment(1) },
      { merge: true },
    ),
    setDoc(doc(db, 'users', user.uid), { joinedEventIds: arrayUnion(eventId) }, { merge: true }),
  ]);
}

export async function undoCup(eventId, user) {
  const ref = cupDoc(eventId, user.uid);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists() ? snap.data().count || 0 : 0;
    if (current <= 0) return;
    tx.update(ref, { count: current - 1 });
  });
}
