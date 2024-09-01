// pages/api/upload.js
import formidable from "formidable";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { verifyToken } from "../auth/middleware/verifyToken/route";
import { db, storage } from "@/lib/firebase";
export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadImageWithReferences(db, userId, downloadURL, fileName) {
  const userRef = doc(db, "users", userId);
  const uploadDocRef = await addDoc(collection(db, "uploads"), {
    url: downloadURL,
    fileName: fileName,
    userRef: userRef, // Reference to the user
    createdAt: serverTimestamp(),
  });

  const uploadRef = doc(db, "uploads", uploadDocRef.id);

  await updateDoc(userRef, {
    uploads: arrayUnion(uploadRef),
  });

  return uploadDocRef;
}

async function uploadImageWithCorrectMimeType(file, userId) {
  // Function to get the file extension
  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  // Function to get MIME type based on file extension
  const getMimeType = (extension) => {
    const mimeTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
      // Add more as needed
    };
    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  };

  try {
    const extension = getFileExtension(file.originalFilename);
    const mimeType = getMimeType(extension);

    const storageRef = ref(
      storage,
      `uploads/${userId}/${file.originalFilename}`
    );

    const metadata = {
      contentType: mimeType,
    };
    const fs = require("fs");
    const fileBuffer = fs.readFileSync(file.filepath);

    const snapshot = await uploadBytes(storageRef, fileBuffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File uploaded successfully");
    return { downloadURL, fileName: file.originalFilename };
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const decodedToken = await verifyToken(req, res);
  if (!decodedToken) {
    return;
  }

  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Error parsing the file" });
      return;
    }

    const file = files["files"][0]; // Get the file object
    try {
      const userRefId = decodedToken.userRefId;

      const { downloadURL, fileName } = await uploadImageWithCorrectMimeType(
        file,
        userRefId
      );
      const docRef = await uploadImageWithReferences(
        db,
        userRefId,
        downloadURL,
        fileName
      );

      res.status(200).json({
        message: "File uploaded successfully",
        fileId: docRef.id,
        url: downloadURL,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error uploading the file" });
    }
  });
}
