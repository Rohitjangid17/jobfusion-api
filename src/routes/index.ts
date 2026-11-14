
import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";

export const apiRoutes = Router();

// apiRoutes.get("/", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Welcome to JobFusion API",
//     version: "v1",
//   });
// });

apiRoutes.use("/auth", authRoutes);