import { Router } from "express";
import * as userCtrl from "../controlles/user.controllers";
import auth from "../middleware/auth";
import isAdmin from "../middleware/isAdmin";

const router = Router();

// public
router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

// protected
router.get("/users/:id", auth, userCtrl.getById);
router.post("/users/:id/block", auth, userCtrl.blockUser);

// admin only
router.get("/users", auth, isAdmin, userCtrl.getAll);
console.log("✅ userRoutes loaded");
export default router;