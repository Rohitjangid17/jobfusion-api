
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { apiRoutes } from "./routes/index.js";
import { CLIENT_URL } from "./shared/constants/index.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "JobFusion API is running",
  });
});

app.use("/api/v1", apiRoutes);

export default app;
