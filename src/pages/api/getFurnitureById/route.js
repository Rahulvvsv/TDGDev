import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request, res) {
  if (request.method !== "GET") {
    return res.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return res.json({ error: "ID parameter is required" }, { status: 400 });
    }
    const docRef = doc(db, "uploads", id);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return res.json(docSnap.data());
    } else {
      return res.json({ error: "Furniture item not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching furniture item:", error);
    return res.json({ error: "Internal server error" }, { status: 500 });
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("GET request received");
    return GET(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
