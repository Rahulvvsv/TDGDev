import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { query, where } from "firebase/firestore";
import { verifyToken } from "../auth/middleware/verifyToken/route";
export function sortByTimestamp(data) {
  return data.sort((a, b) => {
    if (a?.date?.seconds === b?.date?.seconds) {
      return b?.date?.nanoseconds - a?.date?.nanoseconds;
    }
    return b?.date?.seconds - a?.date?.seconds;
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { location } = req.query;
      console.log(location, "location");
      // let querySnapshot;
      const fetchedData = {};

      let querySnapshot;
      if (location && location !== "undefined") {
        const q = query(
          collection(db, "uploads"),
          where("location", "==", location)
        );
        querySnapshot = await getDocs(q);
      } else {
        querySnapshot = await getDocs(collection(db, "uploads"));
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        delete data.userRef;
        fetchedData[doc.id] = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString(),
          liked: false,
        };
      });

      const decodedToken = await verifyToken(req, res, false);
      if (decodedToken != null) {
        const userRefId = decodedToken.userRefId;
        // Fetch likes data for the user
        const likesRef = collection(db, "likes");
        const likesQuery = query(
          likesRef,
          where("userId", "==", doc(db, "users", userRefId))
        );
        const likesSnapshot = await getDocs(likesQuery);

        const userLikes = [];
        likesSnapshot.forEach((doc) => {
          let imageId = doc.data().uploadRef.id;
          console.log(imageId, "imageId");
          if (Object.keys(fetchedData).includes(imageId)) {
            fetchedData[imageId].liked = true;
            console.log(imageId, "fetchedData[imageId]");
          }
        });
      }

      const sortedUploads = sortByTimestamp(Object.values(fetchedData));
      res.status(200).json({
        data: sortedUploads,
        message: "Uploads fetched successfully",
        error: false,
      });
    } catch (error) {
      console.error("Error fetching uploads:", error.message);
      res.status(500).json({
        message: error.message,
        data: [],
        error: true,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
