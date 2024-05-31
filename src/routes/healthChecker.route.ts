import express from "express";
import sequelize from "../config/db";
import "dotenv/config";

const BASE_URL = `http://localhost:${process.env.PORT}/api`;

interface HealthCheckResponse {
  uptime: number;
  database: boolean;
  projectsRoute?: boolean;
}

const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
};

const checkProjectsRouteHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/projects`);
    return response.ok;
  } catch (error) {
    console.error("`/projects` route health check failed:", error);
    return false;
  }
};

const healthCheck = async (): Promise<HealthCheckResponse> => {
  const uptime = process.uptime();
  const isDatabaseHealthy = await checkDatabaseHealth();
  const isProjectsRouteHealthy = await checkProjectsRouteHealth();

  return {
    uptime,
    database: isDatabaseHealthy,
    projectsRoute: isProjectsRouteHealthy,
  };
};

const healthCheckRouter = express.Router();

healthCheckRouter.get("/", async (_, res) => {
  try {
    const health = await healthCheck();
    res.status(200).json(health);
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default healthCheckRouter;
