import { Router } from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller";

const router = Router();

router.route("/").get(getAllProjects).post(createProject);
router
  .route("/:projectId")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;
