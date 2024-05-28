import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import sequelize from "./config/db";
import httpStatusText from "./utils/httpStatusText";
import projectsRouter from "./routes/projects.route";
import healthChecker from "./routes/healthChecker.route";

const PORT = process.env.PORT || 8080;

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthChecker);

app.use("/api/projects", projectsRouter);

// Global error handler
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

app.all("*", (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).json({
    status: httpStatusText.FAIL,
    message: "this resource is not available",
  });
});

app.listen(PORT, async () => {
  console.log(`listening on port ${PORT}`);
  try {
    await sequelize.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
