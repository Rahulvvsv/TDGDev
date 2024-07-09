import { fetchData } from "@/lib/firebase";
import { updateDocument } from "@/lib/firebase";
import { EmailHelperForBulkMailSending } from "@/lib/emailjs";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    res.status(200).json({ message: "Data received", data });
  } else if (req.method == "GET") {
    try {
      const userDetails = await fetchData();
      const currentDate = new Date();
      userDetails.filter(e=>e.status==="showOnPage").forEach(async (element) => {
        const baseUrl =
          "http://localhost:3000/donate/getReceipientsDetails/" + element.id;
        const pickedUpLink = baseUrl + `?itemStatus=pickedUp`;
        const scheduledLink = baseUrl + `?itemStatus=scheduled`;
        const stillAvailableLink = baseUrl + `?itemStatus=stillAvailable`;
        const donorFoundLink = baseUrl + `?itemStatus=donorFound`;
        let dataToSend = {
          to_email: element.email,
          pickedUpLink: pickedUpLink,
          scheduledLink: scheduledLink,
          stillAvailableLink: stillAvailableLink,
          donorFoundLink: donorFoundLink,
          image: element.imageUrl[0],
          donorName: element.name,
        };
        console.log(dataToSend.donorName)
        if (element?.emailCount != undefined) {
          if (element.emailCount === 0) {
            const emailSentDate = new Date(
              element.date.seconds * 1000 + element.date.nanoseconds / 1000000
            );
            let dateDifference = currentDate - emailSentDate;
            dateDifference = dateDifference / (1000 * 60 * 60 * 24);
            console.log(
              emailSentDate,
              currentDate,
              dateDifference.toFixed(),
              "from date difference"
            );
            if (dateDifference.toFixed() == 0) {
              console.log("in here")
              EmailHelperForBulkMailSending(dataToSend);
              const newEmailCount = element.emailCount + 1;
              const currentDate = new Date();
              updateDocument(element.id, {
                emailCount: newEmailCount,
                emailSentDate: currentDate,
              });
            }
          } else if (element.emailCount > 0 && element.emailCount < 3) {
            const emailSentDate = new Date(
              element.emailSentDate.seconds * 1000 + element.emailSentDate.nanoseconds / 1000000
            );
            let dateDifference = currentDate - emailSentDate;
            dateDifference = dateDifference / (1000 * 60 * 60 * 24);
            if (dateDifference.toFixed() == 10) {
              const newEmailCount = element.emailCount + 1;

              // sendEmail();
              EmailHelperForBulkMailSending(dataToSend);
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
