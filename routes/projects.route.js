const express = require("express");
const {
  getAllProjects,
  getProjectById,
} = require("../controllers/projects.controller");

const router = express.Router();

router.route("/").get(getAllProjects);
router.route("/:projectId").get(getProjectById);

module.exports = router;
