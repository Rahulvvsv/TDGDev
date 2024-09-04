// pages/api/auth/signin.ts
import { signIn } from "@/lib/auth/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    try {
      const { user, token } = await signIn(email, password);
      res.setHeader("Set-Cookie", [
        `access_token=${token}; HttpOnly; Path=/; Max-Age=3600`,
        `loggedIn=true; Path=/; Max-Age=3600`,
      ]);

      res
        .status(200)
        .json({ data: { user, token }, message: "success", error: false });
    } catch (error) {
      res.status(200).json({ message: error.message, data: [], error: true });
    }
  } else {
    res
      .status(405)
      .json({ message: "Method not allowed", data: [], error: true });
  }
}
