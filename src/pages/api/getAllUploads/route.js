import { collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const uploadsCollection = collection(db, "uploads");
      const uploadSnapshot = await getDocs(uploadsCollection);

      const uploadsPromises = uploadSnapshot.docs.map(async (doc) => {
        const uploadData = doc.data();
        let userData = null;

        if (uploadData.userRef) {
          const userDoc = await getDoc(uploadData.userRef);
          if (userDoc.exists()) {
            userData = userDoc.data();
            delete userData.uploads;
          }
        }

        return {
          id: doc.id,
          images: uploadData.url,
          createdAt: uploadData.createdAt?.toDate().toISOString(),
          user: userData,
        };
      });

      const uploads = await Promise.all(uploadsPromises);

      res.status(200).json({ uploads });
    } catch (error) {
      console.error("Error fetching uploads:", error);
      res.status(500).json({ error: "Failed to fetch uploads" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
