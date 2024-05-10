const { Op } = require("sequelize");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Project = require("../models/project.model");
const AppError = require("../utils/AppError");
const httpStatusText = require("../utils/httpStatusText");

const getAllProjects = asyncWrapper(async (req, res) => {
  const query = req.query;

  const page = query.page || 1;
  const limit = query.pageSize || 5;
  const offset = (page - 1) * limit;

  const filter = query.filter;
  const filterKey = filter && Object.keys(filter)[0];
  const filterOperation =
    filter && Object.keys(Object.values(filter)[0])[0].slice(1);
  const filterValue = filter && Object.values(Object.values(filter)[0])[0];
  const filterExists =
    filterKey && filterOperation && filterValue ? true : false;

  // filter Example                                  filterKey   filterOp    filterValue
  // filter[project_id][$eq]=new_project_id_2 => { project_id: { '$eg': 'new_project_id_3' } }

  const sort = query.sort;
  const sortKey = sort && sort.split(":")[0];
  const sortMethod = (sort && sort.split(":")[1].toUpperCase()) || "ASC";

  const projects = await Project.findAll({
    offset,
    limit,
    ...(filterExists && {
      where: {
        [filterKey]: {
          [Op[filterOperation]]: filterValue,
        },
      },
    }),
    ...(sortKey && { order: [[sortKey, sortMethod]] }),
  });

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: projects });
});

const getProjectById = asyncWrapper(async (req, res, next) => {
  const project = await Project.findByPk(req.params.projectId);
  if (!project) {
    const error = AppError.create(
      "Project Not Found",
      404,
      httpStatusText.FAIL
    );
    return next(error);
  }
  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: project });
});

const createProject = asyncWrapper(async (req, res) => {
  await Project.create(req.body);
  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    message: "Project Created Successfully",
  });
});

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
};
