import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../src/config/data-source";
import { User } from "../src/entities/user";
import { JWT_SECRET } from "../src/config/env";

const userRepo = () => AppDataSource.getRepository(User);

export async function register(req: Request, res: Response) {
  try {
    const { fullName, birthDate, email, password, role } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ message: "Missing fields" });

    const existing = await userRepo().findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = userRepo().create({
      fullName,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      email,
      password: hash,
      role: role === "admin" ? "admin" : "user",
      isActive: true,
    });
    await userRepo().save(user);
    
    const { password: _, ...safe } = user as any;
    console.log("📩 Register request:", req.body);
    return res.status(201).json(safe);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await userRepo().findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    if (!user.isActive) return res.status(403).json({ message: "User is blocked" });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const user = await userRepo().findOne({ where: { id } });
    if (!user) return res.status(404).json({ message: "Not found" });

    const requester = (req as any).user;
    if (!requester) return res.status(401).json({ message: "Unauthorized" });
    if (requester.role !== "admin" && requester.id !== user.id) return res.status(403).json({ message: "Forbidden" });

    const { password: _, ...safe } = user as any;
    return res.json(safe);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const requester = (req as any).user;
    if (!requester) return res.status(401).json({ message: "Unauthorized" });
    if (requester.role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const users = await userRepo().find();
    const safe = users.map((u) => {
      const { password, ...rest } = u as any;
      return rest;
    });
    return res.json(safe);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function blockUser(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const user = await userRepo().findOne({ where: { id } });
    if (!user) return res.status(404).json({ message: "Not found" });

    const requester = (req as any).user;
    if (!requester) return res.status(401).json({ message: "Unauthorized" });
    if (requester.role !== "admin" && requester.id !== user.id) return res.status(403).json({ message: "Forbidden" });

    user.isActive = false;
    await userRepo().save(user);
    const { password: _, ...safe } = user as any;
    return res.json(safe);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}



export default { register, login, getById, getAll, blockUser };