import { fetchData } from "@/lib/firebase";
import { updateDocument } from "@/lib/firebase";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    res.status(200).json({ message: "Data received", data });
  } else if (req.method == "GET") {
    try {
      const { donorId } = req.query;
      const userDetails = await fetchData(donorId);
      userDetails.forEach((element) => {
        if (element?.emailCount != undefined) {
          if (element.emailCount === 0) {
            // sendEmail();
            if (element.emailSentDate - currentDate >= 5) {
              const newEmailCount = element.emailCount + 1;
              const currentDate = new Date();
              updateDocument(element.id, {
                emailCount: newEmailCount,
                emailSentDate: currentDate,
              });
            }
          } else if (element.emailCount > 0 && element.emailCount < 3) {
            if (element.emailSentDate - currentDate == 10) {
              const newEmailCount = element.emailCount + 1;
              // sendEmail();
              const currentDate = new Date();
              updateDocument(element.id, {
                emailCount: newEmailCount,
                emailSentDate: currentDate,
              });
            }
          }
        }
      });

      res
        .status(200)
        .json({ data: userDetails, message: "data received from get" });
    } catch (e) {
      console.log(e.message);
      res.status(200).json({ message: "something went wrong" });
    }
  }
}
