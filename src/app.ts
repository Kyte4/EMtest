import express from "express";
import "./config/env"; 
import userRoutes from "../routes/user.routes";
import errorHandler from "../middleware/errorHandler";

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use(errorHandler);

export default app;