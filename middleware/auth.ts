import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../src/config/env";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ message: "Unauthorized" });

  if (!JWT_SECRET || typeof JWT_SECRET !== "string") {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // сохраняем минимальную инфу о пользователе в req.user
    (req as any).user = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
