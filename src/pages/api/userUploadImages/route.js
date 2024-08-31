// pages/api/upload.js
import formidable from 'formidable';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from "../auth/middleware/verifyToken/route";
import { storage, db } from '@/lib/firebase';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing
  },
};

export default async function handler(req, res) {
    const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: "gs://tdgdev.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const decodedToken = await verifyToken(req, res);
  if (!decodedToken) {
    return; // Token verification failed
  }

  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the file' });
      return;
    }

    const file = files["files"][0]; // Get the file object
    try {
      // Generate a unique name for the file using UUID
      const fileName = `${uuidv4()}-${file.originalFilename}`;
      const fileRef = ref(storage, `uploads/${fileName}`);

      await uploadBytes(fileRef, file);

      console.log(decodedToken)
      // Get the download URL
      const downloadURL = await getDownloadURL(fileRef);

      // Store the file metadata in Firestore
      const docRef = await addDoc(collection(db, 'uploads'), {
        url: downloadURL,
        userId: decodedToken.uid,
        name:decodedToken.name,
        createdAt: new Date(),
      });

      res.status(200).json({ message: 'File uploaded successfully', fileId: docRef.id, url: downloadURL });
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Error uploading the file' });
    }
  });
}