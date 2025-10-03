import { Request, Response, NextFunction } from "express";

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  return next();
}