import request from "supertest";
import { app, startServer, stopServer } from "../index";
import { describe, it } from "@jest/globals";
import Project from "../models/project.model";
import sequelize from "../config/db";
import randomPort from "../utils/randomPort";

describe("GET /api/projects", () => {
  beforeAll(async () => {
    await startServer(randomPort());
    await sequelize.sync({ force: true });

    await Project.bulkCreate([
      {
        id: "d30145a0-1f9b-4026-bcf3-27c177780b6e",
        project_title: "New Project 1",
        project_id: "new_project_id_1",
        project_members: JSON.stringify(["member1", "member2"]),
        tasks_manager_url: "https://example.com/tasks",
        brand_guideline_url: "https://example.com/brand",
        ui_ux_url: "https://example.com/ui_ux",
        uml_url: "https://example.com/uml",
        fe_repo_url: "https://example.com/fe_repo",
        be_repo_url: "https://example.com/be_repo",
      },
      {
        id: "d30145a0-1f9b-4026-bcf3-27c177780b6c",
        project_title: "New Project 2",
        project_id: "new_project_id_2",
        project_members: JSON.stringify(["member1", "member2"]),
        tasks_manager_url: "https://example.com/tasks",
        brand_guideline_url: "https://example.com/brand",
        ui_ux_url: "https://example.com/ui_ux",
        uml_url: "https://example.com/uml",
        fe_repo_url: "https://example.com/fe_repo",
        be_repo_url: "https://example.com/be_repo",
      },
      {
        id: "d30145a0-1f9b-4026-bcf3-27c177780b6d",
        project_title: "New Project 3",
        project_id: "new_project_id_3",
        project_members: JSON.stringify(["member1", "member2"]),
        tasks_manager_url: "https://example.com/tasks",
        brand_guideline_url: "https://example.com/brand",
        ui_ux_url: "https://example.com/ui_ux",
        uml_url: "https://example.com/uml",
        fe_repo_url: "https://example.com/fe_repo",
        be_repo_url: "https://example.com/be_repo",
      },
    ]);
  });

  afterAll(async () => {
    await stopServer();
    await sequelize.close();
  });

  it("get all projects", async () => {
    const res = await request(app).get("/api/projects").expect(200);

    const data = res.body.data;

    expect(data).toBeInstanceOf(Array);
    for (let i = 0; i < 3; i++) {
      expect(data[i]).toHaveProperty("project_id", `new_project_id_${i + 1}`);
    }
  });

  it("get all projects with pagination", async () => {
    const res = await request(app)
      .get("/api/projects?page=2&pageSize=2")
      .expect(200);

    const data = res.body.data;

    expect(data).toHaveLength(1);
    expect(data[0]).toHaveProperty("project_id", "new_project_id_3");
  });

  it("get all projects with filter", async () => {
    const res = await request(app)
      .get("/api/projects?filter[project_title][$eq]=New Project 1")
      .expect(200);

    const data = res.body.data;

    expect(data).toHaveLength(1);
    expect(data[0]).toHaveProperty("project_title", "New Project 1");
  });

  it("get all projects with sort", async () => {
    const res = await request(app)
      .get("/api/projects?sort=project_id:desc")
      .expect(200);

    const data = res.body.data;

    for (let i = 0; i < data.length; i++) {
      expect(data[i]).toHaveProperty("project_id", `new_project_id_${3 - i}`);
    }
  });
});
