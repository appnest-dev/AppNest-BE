// models/project.js
const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/db");

const Project = sequelize.define(
  "project",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4(),
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
    timestamps: false,
  }
);

module.exports = Project;
