import {
  doc,
  addDoc,
  updateDoc,
  collection,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyToken } from "../auth/middleware/verifyToken/route";
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const decodedToken = await verifyToken(req, res);
      if (!decodedToken) {
        return;
      }

      const userRefId = decodedToken.userRefId;
      const userRef = doc(db, "users", userRefId);
      const { uploadedImageRefId, question } = req.body;
      const uploadedImageRef = doc(db, "uploads", uploadedImageRefId);

      if (!uploadedImageRefId || !question) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const userRequestRef = await addDoc(collection(db, "userRequests"), {
        uploadedImageRef: uploadedImageRef,
        userRef: userRef,
        question,
        createdAt: new Date(),
      });

      await updateDoc(userRef, {
        myRequests: arrayUnion(doc(db, "userRequests", userRequestRef.id)),
      });

      await updateDoc(uploadedImageRef, {
        allRequests: arrayUnion(doc(db, "userRequests", userRequestRef.id)),
      });

      res.status(201).json({
        message: "Request stored successfully",
        requestId: userRequestRef.id,
      });
    } catch (error) {
      console.error("Error storing request:", error);
      res.status(500).json({ error: "Failed to store request" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
