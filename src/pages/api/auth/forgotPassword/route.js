import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await sendPasswordResetEmail(auth, email);

    return res
      .status(200)
      .json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    return res
      .status(500)
      .json({ error: "Failed to send password reset email" });
  }
}
