import { Request, Response, NextFunction } from "express";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  // invalid JSON body
  if (err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  // Postgres unique violation
  if (err.code === "23505") {
    return res.status(409).json({ message: "Resource already exists", detail: err.detail });
  }

  // validation libraries (class-validator / custom)
  if (err.name === "ValidationError" || Array.isArray(err?.errors)) {
    return res.status(400).json({ message: "Validation failed", errors: err.errors || err });
  }

  const status = err.status || 500;
  const payload: any = { message: err.message || "Internal Server Error" };
  if (process.env.NODE_ENV !== "production") payload.stack = err.stack;
  return res.status(status).json(payload);
}
