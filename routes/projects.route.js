const express = require("express");
const {
  getAllProjects,
  getProjectById,
  createProject,
} = require("../controllers/projects.controller");

const router = express.Router();

router.route("/").get(getAllProjects).post(createProject);
router.route("/:projectId").get(getProjectById);

module.exports = router;
