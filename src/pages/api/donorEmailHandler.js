import { fetchSingleBasedOnId } from "@/lib/firebase";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    res.status(200).json({ message: "Data received", data });
  } else if (req.method == "GET") {
    try {
      const { donorId } = req.query;
      const userDetails = await fetchSingleBasedOnId(donorId);
      console.log(userDetails)
      res.status(200).json({data:userDetails, message: "data received from get" });
      
    } catch (e) {
      res.status(200).json({ message: "something went wrong" });
    }
  }
}
