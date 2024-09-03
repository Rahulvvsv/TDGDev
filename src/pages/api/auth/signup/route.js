import { signUp } from "@/lib/auth/auth";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name, phone } = req.body;
    try {
      const { user, token } = await signUp(email, password, name, phone);

      res.setHeader("Set-Cookie", [
        `access_token=${token}; HttpOnly; Path=/; Max-Age=3600`,
        `loggedIn=true; HttpOnly; Path=/; Max-Age=3600`,
      ]);

      res.status(200).json({ data: user, error: false, message: "success" });
    } catch (error) {
      res.status(200).json({ error: true, data: {}, message: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
