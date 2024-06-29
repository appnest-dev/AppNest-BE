import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/db";

// Define attributes for the Project model
export interface ProjectAttributes {
  id: string;
  project_title: string;
  project_id: string;
  project_members?: string;
  tasks_manager_url?: string;
  brand_guideline_url?: string;
  ui_ux_url?: string;
  uml_url?: string;
  fe_repo_url?: string;
  be_repo_url?: string;
  last_updated?: Date;
}

// Define creation attributes for the Project model
interface ProjectCreationAttributes
  extends Optional<ProjectAttributes, "id" | "last_updated"> {}

// Extend the Sequelize Model class
class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes
{
  public id!: string;
  public project_title!: string;
  public project_id!: string;
  public project_members?: string;
  public tasks_manager_url?: string;
  public brand_guideline_url?: string;
  public ui_ux_url?: string;
  public uml_url?: string;
  public fe_repo_url?: string;
  public be_repo_url?: string;
  public last_updated?: Date;
}

// Define the model with Sequelize
Project.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuidv4,
    },
    project_title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "project_title cannot be null",
        },
        notEmpty: {
          msg: "project_title cannot be empty",
        },
        isString(value: any) {
          if (typeof value !== "string") {
            throw new Error("project_title must be a string");
          }
        },
      },
    },
    project_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "project_id",
        msg: "project_id should be unique",
      },
      validate: {
        notNull: {
          msg: "project_id cannot be null",
        },
        notEmpty: {
          msg: "project_id cannot be empty",
        },
        isString(value: any) {
          if (typeof value !== "string") {
            throw new Error("project_id must be a string");
          }
        },
      },
    },
    project_members: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("project_members");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: string[]) {
        this.setDataValue("project_members", JSON.stringify(value));
      },
      validate: {
        isArr(value: any) {
          if (!Array.isArray(JSON.parse(value)))
            throw new Error("project_members must be an array");
        },
      },
    },
    tasks_manager_url: {
      type: DataTypes.TEXT,
      validate: {
        isString(value: any) {
          if (typeof value !== "string") {
            throw new Error("tasks_manager_url must be a string");
          }
        },
      },
    },
    brand_guideline_url: {
      type: DataTypes.TEXT,
      validate: {
        isString(value: any) {
          if (typeof value !== "string") {
            throw new Error("brand_guideline_url must be a string");
          }
        },
      },
    },
    ui_ux_url: {
      type: DataTypes.TEXT,
      validate: {
        isString(value: any) {
          if (typeof value !== "string") {
            throw new Error("ui_ux_url must be a string");
          }
        },
      },
    },
    uml_url: {
      type: DataTypes.TEXT,
      validate: {
        isString(value: any) {
          if (typeof value !== "string") {
            throw new Error("uml_url must be a string");
          }
        },
      },
    },
    fe_repo_url: {
      type: DataTypes.TEXT,
      validate: {
        isString(value: any) {
          if (typeof value !== "string") {
            throw new Error("fe_repo_url must be a string");
          }
        },
      },
    },
    be_repo_url: {
      type: DataTypes.TEXT,
      validate: {
        isString(value: any) {
          if (typeof value !== "string") {
            throw new Error("be_repo_url must be a string");
          }
        },
      },
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "project",
    sequelize,
    timestamps: false,
  }
);

export default Project;
