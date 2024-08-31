// pages/api/auth/signup.ts

import { signUp } from "@/lib/auth/auth";
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const { user, token } = await signUp(email, password);
         res.setHeader('Set-Cookie', `access_token=${token}; HttpOnly; Path=/; Max-Age=3600`);
 
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
