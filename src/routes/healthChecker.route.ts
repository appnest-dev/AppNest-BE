import { NextFunction, Request, Response, Router } from "express";
import asyncWrapper from "../middlewares/asyncWrapper";
import sequelize from "../config/db";
import httpStatusText from "../utils/httpStatusText";

const router = Router();

router.get(
  "/",
  asyncWrapper(async (_req: Request, res: Response, _next: NextFunction) => {
    await sequelize.authenticate();
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Database connection has been established successfully.",
    });
  })
);

export default router;
