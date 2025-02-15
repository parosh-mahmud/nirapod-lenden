//pages/api/auth/login.js

import { serialize } from "cookie";
import { verifyIdToken } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Verify the Firebase token (for security)
    const decodedToken = await verifyIdToken(token);

    // Set cookie on the server
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    return res
      .status(200)
      .json({ message: "Login successful", admin: decodedToken.admin });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
