import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  getBlob,
} from "firebase/storage";

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
const auth = getAuth(app);

export { auth, app, db, storage };

export const Firebase = async () => {
  ////console.log(app);
};

export const updateDocument = async (documentId, newData) => {
  let docRef = doc(db, "newData", documentId);
  let result = await setDoc(docRef, newData, { merge: true });
};

export const updateTestimonialDocument = async (documentId, newData) => {
  let docRef = doc(db, "testimonials", documentId);
  let result = await setDoc(docRef, newData, { merge: true });
};

export function sortByTimestamp(data) {
  return data.sort((a, b) => {
    if (a?.date?.seconds === b?.date?.seconds) {
      return b?.date?.nanoseconds - a?.date?.nanoseconds;
    }
    return b?.date?.seconds - a?.date?.seconds;
  });
}

export const updateClientDetails = async (documentId, newData) => {
  // Reference to the document you want to update
  let docRef = doc(db, "contactDonarList", documentId);

  // Update the document
  let result = await setDoc(docRef, newData, { merge: true });
};

export const fetchDataLocation = async (location) => {
  ////console.log("heree")
  const q = query(collection(db, "uploads"), where("location", "==", location));

  const querySnapshot = await getDocs(q);
  const fetchedData = [];

  querySnapshot.forEach((doc) => {
    fetchedData.push({ id: doc.id, ...doc.data() });
  });
  let sortedElements = sortByTimestamp(fetchedData);
  return sortedElements;
};

export const fetchDataBasedOnId = async () => {
  let AllData = await fetchClientData();

  let OwnerAndClientDetails = AllData.map(async (e) => {
    if (e.donarId != undefined) {
      let docRef = doc(db, "newData", e.donarId);
      const querySnapshot = await getDoc(docRef);
      let donarDetails = querySnapshot.data();
      return { client: e, owner: donarDetails };
    }
  });

  return Promise.all(OwnerAndClientDetails);
};

export const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, "uploads"));
  const fetchedData = [];
  //console.log("calling");
  querySnapshot.forEach((doc) => {
    fetchedData.push({ id: doc.id, ...doc.data() });
    delete fetchedData.userRef;
  });
  let sortedElements = sortByTimestamp(fetchedData);
  return sortedElements;
};

export const fetchTestimonialData = async () => {
  const querySnapshot = await getDocs(collection(db, "testimonials"));
  const fetchedData = [];
  querySnapshot.forEach((doc) => {
    fetchedData.push({ id: doc.id, ...doc.data() });
  });
  let sortedElements = sortByTimestamp(fetchedData);
  return sortedElements;
};

export const upLoadData = async (formData) => {
  try {
    const imageUrls = [];
    for (const image of formData.image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);

      const downloadURL = await getDownloadURL(imageRef);
      imageUrls.push(downloadURL);
    }
    const docRef = await addDoc(collection(db, "newData"), {
      name: formData.fullName || "",
      productName: formData.tof || "",
      description: formData.desc || "",
      email: formData.email || "",
      phone: formData.phone || "",
      location: formData.location || "",
      imageUrl: imageUrls,
      date: new Date(),
      status: "hidden",
      emailCount: 0,
      emailSentDate: null,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const uploadTestimonial = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "testimonials"), {
      name: formData.fullName || "",
      email: formData.email || "",
      location: formData.location || "",
      date: new Date(),
      status: "hidden",
      testimonial: formData.testimonial,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const uploadContactForm = async (formData) => {
  try {
    const docRef = await addDoc(collection(db, "contactDonarList"), {
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      anyQuestions: formData.question || "",
      donarId: formData.donarId || "",
      date: new Date(),
      status: "newReq",
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const fetchClientData = async () => {
  const querySnapshot = await getDocs(collection(db, "contactDonarList"));
  const fetchedData = [];
  querySnapshot.forEach((doc) => {
    fetchedData.push({ id: doc.id, ...doc.data() });
  });
  return fetchedData;
};

export const fetchSingleBasedOnId = async (donarId) => {
  try {
    let docRef = doc(db, "newData", donarId);
    const querySnapshot = await getDoc(docRef);
    let donarDetails = querySnapshot.data();
    return { donarDetails: donarDetails };
  } catch (e) {
    return "invalid user";
  }
};
