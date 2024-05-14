import { DataTypes, Model, Optional } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/db";

// Define attributes for the Project model
interface ProjectAttributes {
  id: string;
  project_title: string;
  project_id: string;
  project_members: string[];
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
  public project_members!: string[];
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
    },
    project_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    project_members: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    tasks_manager_url: {
      type: DataTypes.TEXT,
    },
    brand_guideline_url: {
      type: DataTypes.TEXT,
    },
    ui_ux_url: {
      type: DataTypes.TEXT,
    },
    uml_url: {
      type: DataTypes.TEXT,
    },
    fe_repo_url: {
      type: DataTypes.TEXT,
    },
    be_repo_url: {
      type: DataTypes.TEXT,
    },
    last_updated: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "project",
    sequelize, // pass the sequelize instance
    timestamps: false,
  }
);

export default Project;
