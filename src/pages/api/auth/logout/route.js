import { logout } from '@/lib/auth/auth';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await logout();
      res.setHeader('Set-Cookie', `access_token=''; HttpOnly; Path=/; Max-Age=3600`);


      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
