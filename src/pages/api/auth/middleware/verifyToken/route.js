// lib/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export async function verifyToken(req, res, strict = true) {
  const token = req.cookies.access_token;
  if (!token && strict) {
    res
      .status(401)
      .json({ message: "No token provided", error: true, data: [] });
    return null; // Return null to indicate verification failed
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    //console.log(error)
    if (strict) {
      res.status(403).json({ error: "Unauthorized" });
    }
    return null; // Return null to indicate verification failed
  }
}
