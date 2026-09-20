import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser) return callback(null);
    callback({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      picture: firebaseUser.photoURL,
    });
  });
}

export async function signIn() {
  await signInWithPopup(auth, provider);
}

export function signOut() {
  return firebaseSignOut(auth);
}
