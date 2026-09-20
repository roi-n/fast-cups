import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

async function fetchEventSummary(eventId, eventData) {
  const cupsSnap = await getDocs(collection(db, 'events', eventId, 'cups'));
  const rows = cupsSnap.docs.map((d) => d.data());
  rows.sort((a, b) => (b.count || 0) - (a.count || 0));
  const winner = rows.length > 0 && rows[0].count > 0 ? { name: rows[0].name, count: rows[0].count } : null;
  const endTime = eventData.endTime.toDate().getTime();

  return {
    id: eventId,
    name: eventData.name,
    endTime,
    isEnded: Date.now() > endTime,
    winner,
  };
}

export async function getMyEvents(user) {
  const eventDataById = new Map();

  const createdSnap = await getDocs(query(collection(db, 'events'), where('adminUid', '==', user.uid)));
  createdSnap.docs.forEach((d) => eventDataById.set(d.id, d.data()));

  const userSnap = await getDoc(doc(db, 'users', user.uid));
  const joinedIds = userSnap.exists() ? userSnap.data().joinedEventIds || [] : [];

  await Promise.all(
    joinedIds
      .filter((id) => !eventDataById.has(id))
      .map(async (id) => {
        const eventSnap = await getDoc(doc(db, 'events', id));
        if (eventSnap.exists()) {
          eventDataById.set(id, eventSnap.data());
        }
      }),
  );

  const events = await Promise.all(
    Array.from(eventDataById.entries()).map(([id, data]) => fetchEventSummary(id, data)),
  );
  events.sort((a, b) => b.endTime - a.endTime);

  return events;
}
