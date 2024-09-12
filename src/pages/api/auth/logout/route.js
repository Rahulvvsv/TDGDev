import { logout } from "@/lib/auth/auth";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await logout();
      res.setHeader(
        "Set-Cookie",
        `access_token=''; HttpOnly; Path=/; Max-Age=3600`
      );
      res.setHeader(
        "Set-Cookie",
        `loggedIn=false; HttpOnly; Path=/; Max-Age=3600`
      );

      res
        .status(200)
        .json({ error: false, message: "Logged out successfully", data: [] });
    } catch (error) {
      res.status(400).json({ error: false, message: error.message, data: [] });
    }
  } else {
    res
      .status(405)
      .json({ message: "Method not allowed", error: true, data: [] });
  }
}
