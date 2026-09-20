import { collection, doc, increment, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const CUPS_COLLECTION = 'cups';

export function watchLeaderboard(callback) {
  return onSnapshot(collection(db, CUPS_COLLECTION), (snapshot) => {
    const rows = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
    rows.sort((a, b) => b.count - a.count);
    callback(rows);
  });
}

export async function drinkCup(user) {
  await setDoc(
    doc(db, CUPS_COLLECTION, user.uid),
    { name: user.name, email: user.email, count: increment(1) },
    { merge: true },
  );
}
