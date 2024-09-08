import {
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  arrayUnion,
  where,
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
      console.log(userRefId, "userRefId");
      const userRef = doc(db, "users", userRefId);
      const { uploadedImageRefId, question } = req.body;

      const uploadedImageRef = doc(db, "uploads", uploadedImageRefId);

      if (!uploadedImageRefId || !question) {
        return res.status(400).json({
          data: {},
          error: true,
          message: "Missing required fields",
        });
      }
      // Check if there's an existing entry with the same userRef and uploadedImageRef
      const existingRequestQuery = await getDocs(
        query(
          collection(db, "userRequests"),
          where("userRef", "==", userRef),
          where("uploadedImageRef", "==", uploadedImageRef)
        )
      );

      let userRequestRef;

      if (!existingRequestQuery.empty) {
        // If an existing entry is found, update it by adding the new question to the questions array
        const existingDoc = existingRequestQuery.docs[0];
        userRequestRef = existingDoc.ref;
        await updateDoc(userRequestRef, {
          questions: arrayUnion(question),
        });
      } else {
        // If no existing entry is found, create a new one
        userRequestRef = await addDoc(collection(db, "userRequests"), {
          uploadedImageRef: uploadedImageRef,
          userRef: userRef,
          questions: [question],
          createdAt: new Date(),
        });
      }

      await updateDoc(userRef, {
        myRequests: arrayUnion(doc(db, "userRequests", userRequestRef.id)),
      });

      await updateDoc(uploadedImageRef, {
        allRequests: arrayUnion(doc(db, "userRequests", userRequestRef.id)),
      });

      res.status(201).json({
        data: { requestId: userRequestRef.id },
        error: false,
        message: "Request stored successfully",
      });
    } catch (error) {
      console.error("Error storing request:", error);
      res.status(500).json({
        data: {},
        error: true,
        message: "Failed to store request",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      data: {},
      error: true,
      message: `Method ${req.method} Not Allowed`,
    });
  }
}
