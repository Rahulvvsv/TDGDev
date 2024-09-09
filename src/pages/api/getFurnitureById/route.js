import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";

import { verifyToken } from "../auth/middleware/verifyToken/route";
export async function GET(request, res) {
  if (request.method !== "GET") {
    return res
      .status(405)
      .json({ error: true, data: {}, message: "Method not allowed" });
  }

  try {
    const baseUrl = "http://localhost:3000";

    const url = new URL(request.url, baseUrl);
    const id = url.searchParams.get("id");
    const sendEnquiries = url.searchParams.get("sendEnquiries") === "true";
    // Print the cookies in the request
    const cookies = request.cookies;
    console.log("Cookies:", cookies);
    const decodedToken = await verifyToken(request, res, false);
    let alreadyRequested = false;

    if (decodedToken != null) {
      const userRefId = decodedToken.userRefId;
      console.log(userRefId, "from here man");

      if (userRefId) {
        const userRequestsRef = collection(db, "userRequests");
        const q = query(
          userRequestsRef,
          where("userRef", "==", doc(db, "users", userRefId)),
          where("uploadedImageRef", "==", doc(db, "uploads", id))
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          alreadyRequested = true;
        }
      }
    }
    if (!id) {
      return res
        .status(400)
        .json({ error: true, data: {}, message: "ID parameter is required" });
    }
    const docRef = doc(db, "uploads", id);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const furnitureData = docSnap.data();
      const responseData = {
        ...furnitureData,
        id: docSnap.id,
        alreadyRequested,
      };

      if (sendEnquiries && furnitureData.allRequests) {
        const allRequestsData = await Promise.all(
          furnitureData.allRequests.map(async (requestRef) => {
            const requestSnap = await getDoc(requestRef);
            if (requestSnap.exists()) {
              const requestData = requestSnap.data();
              if (requestData.userRef) {
                const userSnap = await getDoc(requestData.userRef);
                if (userSnap.exists()) {
                  let userData = userSnap.data();
                  delete requestData.userRef;
                  return {
                    ...requestData,
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                  };
                }
              }
              return requestData;
            }
            return null;
          })
        );
        responseData.allRequests = allRequestsData.filter(Boolean);
      } else {
        delete responseData.allRequests;
      }

      return res.status(200).json({
        data: responseData,
        error: false,
        message: "data",
      });
    } else {
      return res
        .status(404)
        .json({ error: true, data: {}, message: "Furniture item not found" });
    }
  } catch (error) {
    console.error("Error fetching furniture item:", error);
    return res
      .status(500)
      .json({ data: {}, error: true, message: "Internal server error" });
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return GET(req, res);
  } else {
    return res
      .status(405)
      .json({ data: {}, error: true, message: "Method not allowed" });
  }
}
