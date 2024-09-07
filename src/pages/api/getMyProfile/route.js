import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyToken } from "../auth/middleware/verifyToken/route";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const decodedToken = await verifyToken(req, res);
      if (!decodedToken) {
        return;
      }

      const userRefId = decodedToken.userRefId;
      const userDoc = doc(db, "users", userRefId);

      const userSnapshot = await getDoc(userDoc);
      const userData = userSnapshot.data();

      // Fetch uploads data
      let uploads = [];
      if (userData?.uploads && userData.uploads.length > 0) {
        const uploadsPromises = userData.uploads.map(async (uploadRef) => {
          const uploadSnapshot = await getDoc(uploadRef);
          const uploadData = uploadSnapshot.data();

          let allRequests = [];
          if (uploadData.allRequests != undefined) {
            const requestPromises = uploadData.allRequests.map(
              async (userRef) => {
                const userSnapshot = await getDoc(userRef);
                let requestData = userSnapshot.data();
                let userData = await getDoc(userSnapshot.data().userRef);
                userData = userData.data();
                userData = {
                  email: userData.email,
                  phone: userData.phone,
                  question: requestData.question,
                };

                let data = {
                  id: userSnapshot.id,
                  user: userData,
                };

                return data;
              }
            );
            allRequests = await Promise.all(requestPromises);
          }

          let data = {
            id: uploadSnapshot.id,
            files: uploadData.files,
            typeOfFurniture: uploadData.typeOfFurniture,
            description: uploadData.description,
            location: uploadData.location,
            allRequests,
          };
          return data;
        });
        uploads = await Promise.all(uploadsPromises);
      }

      // Fetch myRequests data
      let myRequests = [];
      if (userData.myRequests && userData.myRequests.length > 0) {
        const myRequestsPromises = userData.myRequests.map(
          async (requestRef) => {
            const requestSnapshot = await getDoc(requestRef);
            const requestData = requestSnapshot.data();
            const requestedImage = requestData.uploadedImageRef;

            let uploadedImageData = null;
            if (requestedImage) {
              const uploadedImageSnapshot = await getDoc(requestedImage);
              uploadedImageData = uploadedImageSnapshot.data();
              uploadedImageData = {
                id: uploadedImageSnapshot.id,
                url: uploadedImageData.url,
              };
            }

            let data = {
              id: requestSnapshot.id,
              uploadedImage: uploadedImageData,
            };

            return data;
          }
        );
        myRequests = await Promise.all(myRequestsPromises);
      }

      // Prepare the response
      const response = {
        email: userData.email,
        createdAt: userData.createdAt.toDate().toISOString(),
        uploads,
        myRequests,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
