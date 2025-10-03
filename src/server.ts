import express from "express";
import errorHandler from "../middleware/errorHandler";
import userRoutes from "../routes/user.routes"
import { AppDataSource } from "./config/data-source";
import app from "./app";

app.use(express.json());
app.use("/api", userRoutes);
app.use(errorHandler);


AppDataSource.initialize()
  .then(() => {
    console.log("📦 Database connected!");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("❌ DB connection error:", err));
