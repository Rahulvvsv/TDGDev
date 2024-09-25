import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export const updateDocument = async (documentId, newData) => {
  let docRef = doc(db, "uploads", documentId);
  let result = await setDoc(docRef, newData, { merge: true });
};
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { uploadedId, status } = req.body;
    // console.log(uploadedId, status, "uploadedId, status request received");
    try {
      let visibleStatus = "showOnPage";
      if (status == "Available") {
        visibleStatus = "showOnPage";
      } else {
        visibleStatus = "donorFound";
      }
      await updateDocument(uploadedId, {
        itemStatus: status,
        status: visibleStatus,
      });
      res.status(200).json({ data: user, error: false, message: "success" });
    } catch (error) {
      res.status(200).json({ error: true, data: {}, message: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
