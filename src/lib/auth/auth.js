// lib/auth.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export async function signUp(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  console.log(userCredential)
  const token = jwt.sign({ uid: userCredential.user.uid, name:userCredential.user.email }, secret, { expiresIn: '1h' });
  return { user: userCredential.user, token };
}

export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  console.log(userCredential)
  const token = jwt.sign({ uid: userCredential.user.uid,name:userCredential.user.email }, secret, { expiresIn: '1h' });
  return { user: userCredential.user, token };
}

export async function logout() {
  await signOut(auth);
}
