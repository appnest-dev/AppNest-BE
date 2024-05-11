const express = require("express");
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projects.controller");

const router = express.Router();

router.route("/").get(getAllProjects).post(createProject);
router
  .route("/:projectId")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
