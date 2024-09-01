import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { verifyToken } from "../auth/middleware/verifyToken/route";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const decodedToken = await verifyToken(req, res);
    if (!decodedToken) {
      return;
    }

    const userRefId = decodedToken.userRefId;
    const userId = doc(db, "users", userRefId);
    const { uploadedImageRefId, action } = req.body;

    if (!uploadedImageRefId || !action) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const uploadRef = doc(db, "uploads", uploadedImageRefId);
      let result;
      switch (action) {
        case "like":
          result = await addLike(uploadRef, userId);
          break;
        case "unlike":
          result = await removeLike(uploadRef, userId);
          break;
        default:
          return res.status(400).json({ error: "Invalid action" });
      }

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error processing like action:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    const { uploadId } = req.query;

    if (!uploadId) {
      return res.status(400).json({ error: "Missing uploadId" });
    }

    try {
      const uploadRef = doc(db, "uploads", uploadId);
      const result = await getLikesCount(uploadRef);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error("Error getting likes count:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function addLike(uploadRef, userId) {
  const likeQuery = query(
    collection(db, "likes"),
    where("uploadRef", "==", uploadRef),
    where("userId", "==", userId)
  );
  const likeSnapshot = await getDocs(likeQuery);

  if (likeSnapshot.empty) {
    await addDoc(collection(db, "likes"), {
      uploadRef,
      userId,
      createdAt: new Date(),
    });

    await updateDoc(uploadRef, {
      likesCount: increment(1),
    });

    return { success: true, message: "Like added successfully" };
  } else {
    return { success: false, message: "User has already liked this upload" };
  }
}

async function removeLike(uploadRef, userId) {
  const likeQuery = query(
    collection(db, "likes"),
    where("uploadRef", "==", uploadRef),
    where("userId", "==", userId)
  );
  const likeSnapshot = await getDocs(likeQuery);

  if (!likeSnapshot.empty) {
    await deleteDoc(likeSnapshot.docs[0].ref);

    await updateDoc(uploadRef, {
      likesCount: increment(-1),
    });

    return { success: true, message: "Like removed successfully" };
  } else {
    return { success: false, message: "Like not found" };
  }
}

async function getLikesCount(uploadRef) {
  const uploadSnap = await getDoc(uploadRef);

  if (uploadSnap.exists()) {
    return { success: true, count: uploadSnap.data().likesCount || 0 };
  } else {
    return { success: false, message: "Upload not found" };
  }
}
