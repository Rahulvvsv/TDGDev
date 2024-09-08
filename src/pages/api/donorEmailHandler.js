import { fetchSingleBasedOnId } from "@/lib/firebase";
import { EmailHelperForBulkMailSending } from "@/lib/emailjs";
import { updateDocument } from "@/lib/firebase";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    res.status(200).json({ message: "Data received", data });
  } else if (req.method == "GET") {
    try {
      const { donorId, itemStatus } = req.query;

      // const userDetails = await fetchSingleBasedOnId(donorId);
      // updateDocument(donorId,{itemStatus:itemStatus})
      // //console.log(userDetails)
      res.status(200).send("<h1>Thank you for your input</h1>");
    } catch (e) {
      res.status(200).json({ message: "something went wrong" });
    }
  }
}
