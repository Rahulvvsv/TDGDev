// lib/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export async function verifyToken(req, res) {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return null; // Return null to indicate verification failed
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log(error)
    res.status(403).json({ error: 'Unauthorized' });
    return null; // Return null to indicate verification failed
  }
}
