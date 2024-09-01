// lib/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { auth, db } from "../firebase";
import { addDoc } from "firebase/firestore";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export async function signUp(email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const docRef = await addDoc(collection(db, "users"), {
    // name: name,
    email: email,
    // name: decodedToken.name,
    createdAt: new Date(),
  });

  const token = jwt.sign(
    { uid: userCredential.user.uid, docRef, name: userCredential.user.email },
    secret,
    { expiresIn: "1h" }
  );

  return { user: userCredential.user, token };
}

export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const usersRef = collection(db, "users");
  let userRefId = "";
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    console.log("No user found with this email");
  } else {
    const userDoc = querySnapshot.docs[0];
    userRefId = userDoc.id;
  }

  const token = jwt.sign(
    {
      uid: userCredential.user.uid,
      userRefId,
      name: userCredential.user.email,
    },
    secret,
    { expiresIn: "1h" }
  );
  return { user: userCredential.user, token };
}

export async function logout() {
  await signOut(auth);
}
