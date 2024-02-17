import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export const Firebase = ()=>{
    console.log(app);
}


export const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'formData'));
    const fetchedData = [];
    querySnapshot.forEach((doc) => {
    fetchedData.push({ id: doc.id, ...doc.data() });
    });
    return fetchedData; 

};;


export const upLoadData = async (formData) =>{
        try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `images/${formData.image.name}`);
      await uploadBytes(imageRef, formData.image);

      // Add data (including image URL) to Firebase Firestore
      const docRef = await addDoc(collection(db, 'formData'), {
        name: formData.name,
        email: formData.email,
        age: formData.age,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/images%2F${encodeURIComponent(formData.image.name)}?alt=media`
      });
      console.log('Document written with ID: ', docRef.id);
    //   setFormData({ name: '', email: '', age: '', image: null });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
}