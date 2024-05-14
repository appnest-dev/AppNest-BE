/*
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

const updateProject = asyncWrapper(async (req, res) => {
  const id = req.params.projectId;
  await Project.update(req.body, { where: { id } });
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Project Updated Successfully",
  });
});

const deleteProject = asyncWrapper(async (req, res) => {
  const id = req.params.projectId;
  await Project.destroy({ where: { id } });
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Project Deleted Successfully",
  });
});

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
*/

import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import asyncWrapper from "../middlewares/asyncWrapper";
import Project from "../models/project.model";
import AppError from "../utils/AppError";
import httpStatusText from "../utils/httpStatusText";

interface Filter {
  [key: string]: { [operation: string]: any };
}

export const getAllProjects = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const query = req.query as {
      page?: string;
      pageSize?: string;
      filter?: Filter;
      sort?: string;
    };

    const page = parseInt(query.page || "1");
    const limit = parseInt(query.pageSize || "5");
    const offset = (page - 1) * limit;

    const filter = query.filter;
    const filterKey = filter && Object.keys(filter)[0];
    const filterOperation =
      filter &&
      (Object.keys(filter[filterKey as string] || {})[0].slice(
        1
      ) as keyof typeof Op);
    const filterValue =
      filter && filter[filterKey as string][`$${filterOperation}`];
    const filterExists = !!filterKey && !!filterOperation && !!filterValue;

    // filter Example                                  filterKey   filterOp    filterValue
    // filter[project_id][$eq]=new_project_id_2 => { project_id: { '$eq': 'new_project_id_3' } }

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

    res.status(200).json({ status: httpStatusText.SUCCESS, data: projects });
  }
);

export const getProjectById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) {
      const error = AppError.create(
        "Project Not Found",
        404,
        httpStatusText.FAIL
      );
      return next(error);
    }
    res.status(200).json({ status: httpStatusText.SUCCESS, data: project });
  }
);

export const createProject = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    await Project.create(req.body);
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      message: "Project Created Successfully",
    });
  }
);

export const updateProject = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.projectId;
    await Project.update(req.body, { where: { id } });
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Project Updated Successfully",
    });
  }
);

export const deleteProject = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.projectId;
    await Project.destroy({ where: { id } });
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Project Deleted Successfully",
    });
  }
);
