import { Request, Response, NextFunction } from "express";
import { Op, OrderItem } from "sequelize";
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

    let where = {};
    const filter = query.filter;
    if (filter) {
      const filterKey = Object.keys(filter)[0];
      const filterOperation = Object.keys(filter[filterKey])[0].slice(1);
      const filterValue = filter[filterKey][`$${filterOperation}`];
      where = {
        [filterKey]: {
          [Op[filterOperation as keyof typeof Op]]: filterValue,
        },
      };
    }

    let order: OrderItem[] = [];
    const sort = query.sort;
    if (sort) {
      const [sortKey, sortMethod] = sort.split(":");
      order = [[sortKey, sortMethod.toUpperCase() || "ASC"]];
    }

    const projects = await Project.findAll({
      offset,
      limit,
      where,
      order,
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

    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Project Found Successfully",
      data: project,
    });
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
  async (req: Request, res: Response, next): Promise<void> => {
    const id = req.params.projectId;

    const project = await Project.findByPk(id);
    if (!project) {
      const error = AppError.create(
        "Project Not Found",
        404,
        httpStatusText.FAIL
      );
      return next(error);
    }

    await project.update(req.body);
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Project Updated Successfully",
      data: project,
    });
  }
);

export const deleteProject = asyncWrapper(
  async (req: Request, res: Response, next): Promise<void> => {
    const id = req.params.projectId;

    const project = await Project.findByPk(id);
    if (!project) {
      const error = AppError.create(
        "Project Not Found",
        400,
        httpStatusText.FAIL
      );
      return next(error);
    }

    await Project.destroy({ where: { id } });
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      message: "Project Deleted Successfully",
    });
  }
);
