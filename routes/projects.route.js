const express = require("express");
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
} = require("../controllers/projects.controller");

const router = express.Router();

router.route("/").get(getAllProjects).post(createProject);
router.route("/:projectId").get(getProjectById).put(updateProject);

module.exports = router;
