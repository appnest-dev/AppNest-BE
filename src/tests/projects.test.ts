import request, { Response } from "supertest";
import { app, startServer, stopServer } from "../index";
import { afterAll, describe, it } from "@jest/globals";
import Project, { ProjectAttributes } from "../models/project.model";
import sequelize from "../config/db";
import randomPort from "../utils/randomPort";
import useTransaction from "../utils/useTransaction";
import stringWithArticle from "../utils/stringWithArticle";

const PROJECTS = [
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
    last_updated: new Date("2024-06-23T03:01:22.000Z"),
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
    last_updated: new Date("2024-06-24T03:01:22.000Z"),
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
    last_updated: new Date("2024-06-25T03:01:22.000Z"),
  },
];

const requiredProps = [
  { title: "project_title", dataType: "string" },
  { title: "project_id", dataType: "string" },
];

const nonRequiredProps = [
  { title: "project_members", dataType: "array" },
  { title: "tasks_manager_url", dataType: "string" },
  { title: "brand_guideline_url", dataType: "string" },
  { title: "ui_ux_url", dataType: "string" },
  { title: "uml_url", dataType: "string" },
  { title: "fe_repo_url", dataType: "string" },
  { title: "be_repo_url", dataType: "string" },
];

const mainPayload = {
  id: "caebcd6d-e9d2-46eb-b1cf-bf2337f0829e",
  project_title: "New Project 4",
  project_id: "new_project_id_4",
  project_members: ["member1 new", "member2 new"],
  tasks_manager_url: "https://example.com/tasks/new",
  brand_guideline_url: "https://example.com/brand/new",
  ui_ux_url: "https://example.com/ui_ux/new",
  uml_url: "https://example.com/uml/new",
  fe_repo_url: "https://example.com/fe_repo/new",
  be_repo_url: "https://example.com/be_repo/new",
  last_updated: "2024-06-25T03:47:25.000Z",
};

const BASE_URL = "/api/projects";

function getCorrectedTypeData(res: Response) {
  return res.body.data.map((project: (typeof PROJECTS)[0]) => ({
    ...project,
    last_updated: new Date(project.last_updated),
  }));
}

describe("/api/projects", () => {
  beforeAll(async () => {
    await startServer(randomPort());
    await sequelize.sync({ force: true });
    await Project.bulkCreate(PROJECTS);
  });

  afterAll(async () => {
    await stopServer();
    await sequelize.close();
  });

  useTransaction();

  describe("GET /api/projects", () => {
    describe("get all projects", () => {
      it("get all projects", async () => {
        const res = await request(app).get(BASE_URL).expect(200);

        const data: typeof PROJECTS = getCorrectedTypeData(res);

        data.forEach((project, index) => {
          expect(project).toEqual(PROJECTS[index]);
        });
      });

      it("get all projects with pagination", async () => {
        const res = await request(app)
          .get("/api/projects?page=2&pageSize=2")
          .expect(200);

        const data: typeof PROJECTS = getCorrectedTypeData(res);

        expect(data).toHaveLength(1);
        expect(data).toEqual([PROJECTS[2]]);
      });

      it("get all projects with filter", async () => {
        const res = await request(app)
          .get("/api/projects?filter[project_title][$eq]=New Project 1")
          .expect(200);

        const data: typeof PROJECTS = getCorrectedTypeData(res);

        expect(data).toHaveLength(1);
        expect(data).toEqual([PROJECTS[0]]);
      });

      it("get all projects with sort", async () => {
        const res = await request(app)
          .get("/api/projects?sort=project_id:desc")
          .expect(200);

        const data: typeof PROJECTS = getCorrectedTypeData(res);

        data.forEach((project, index) => {
          expect(project).toEqual(PROJECTS[2 - index]);
        });
      });
    });

    describe("get project by ID", () => {
      it("get project by ID", async () => {
        const res = await request(app)
          .get(`${BASE_URL}/d30145a0-1f9b-4026-bcf3-27c177780b6d`)
          .expect(200);

        const data = {
          ...res.body.data,
          last_updated: new Date(res.body.data.last_updated),
        };

        expect(data).toEqual(PROJECTS[2]);
        expect(res.body.message).toBe("Project Found Successfully");
      });

      it("get project by non-existed ID", async () => {
        const res = await request(app)
          .get(`${BASE_URL}/d30145a0-1f9b-4026-bcf3-27c177780b6b`)
          .expect(404);

        expect(res.body.message).toBe("Project Not Found");
      });
    });
  });

  describe("POST /api/projects", () => {
    it("create project", async () => {
      const postRes = await request(app)
        .post(BASE_URL)
        .send({ ...mainPayload })
        .expect(201);

      expect(postRes.body.message).toBe("Project Created Successfully");

      const getRes = await request(app).get(BASE_URL).expect(200);
      const data = getCorrectedTypeData(getRes);

      expect(data[3]).toEqual({
        ...mainPayload,
        last_updated: new Date(mainPayload.last_updated),
      });
    });

    describe("required properties", () => {
      requiredProps.forEach((prop) => {
        it(`create project without ${prop.title}`, async () => {
          const payload: any = { ...mainPayload };

          delete payload[prop.title as keyof ProjectAttributes];

          const res = await request(app)
            .post(BASE_URL)
            .send(payload)
            .expect(400);

          expect(res.body.message).toContain(`${prop.title} cannot be null`);
          expect(res.body.data).toBeNull();
        });

        it(`create project with null ${prop.title}`, async () => {
          const payload: any = { ...mainPayload, [prop.title]: null };

          const res = await request(app)
            .post(BASE_URL)
            .send(payload)
            .expect(400);

          expect(res.body.message).toContain(`${prop.title} cannot be null`);
          expect(res.body.data).toBeNull();
        });

        it(`create project with empty ${prop.title}`, async () => {
          const payload: any = { ...mainPayload };

          payload[prop.title as keyof ProjectAttributes] = "";

          const res = await request(app)
            .post(BASE_URL)
            .send(payload)
            .expect(400);

          expect(res.body.message).toContain(`${prop.title} cannot be empty`);
          expect(res.body.data).toBeNull();
        });

        it(`create project with wrong data type of ${prop.title}`, async () => {
          const payload: any = { ...mainPayload, [prop.title]: 123 };

          const res = await request(app)
            .post(BASE_URL)
            .send(payload)
            .expect(400);

          expect(res.body.message).toContain(
            `${prop.title} must be ${stringWithArticle(prop.dataType)}`
          );
          expect(res.body.data).toBeNull();
        });
      });

      it("create project with non-unique project_id", async () => {
        const payload = {
          ...mainPayload,
          project_id: "new_project_id_3",
        };

        const res = await request(app).post(BASE_URL).send(payload).expect(400);

        expect(res.body.message).toBe("project_id should be unique");
        expect(res.body.data).toBeNull();
      });
    });

    describe("non-required properties", () => {
      nonRequiredProps.forEach((prop) => {
        it(`create project without ${prop.title}`, async () => {
          const payload: any = { ...mainPayload };

          delete payload[prop.title as keyof ProjectAttributes];

          const res = await request(app)
            .post(BASE_URL)
            .send(payload)
            .expect(201);

          expect(res.body.message).toBe("Project Created Successfully");
        });

        it(`create project with null ${prop.title}`, async () => {
          const payload: any =
            prop.dataType == "array"
              ? { ...mainPayload, [prop.title]: [] }
              : { ...mainPayload, [prop.title]: null };

          const res = await request(app)
            .post(BASE_URL)
            .send(payload)
            .expect(201);

          expect(res.body.message).toBe("Project Created Successfully");
        });

        it(`create project with empty ${prop.title}`, async () => {
          const payload: any = { ...mainPayload };

          payload[prop.title as keyof ProjectAttributes] =
            prop.dataType == "array" ? [] : "";

          const res = await request(app)
            .post(BASE_URL)
            .send(payload)
            .expect(201);

          expect(res.body.message).toBe("Project Created Successfully");
        });

        it(`create project with wrong data type of ${prop.title}`, async () => {
          const payload: any = { ...mainPayload, [prop.title]: 123 };

          const res = await request(app)
            .post(BASE_URL)
            .send(payload)
            .expect(400);

          expect(res.body.message).toContain(
            `${prop.title} must be ${stringWithArticle(prop.dataType)}`
          );
        });
      });
    });
  });

  describe("PATCH /api/projects", () => {
    const id = "d30145a0-1f9b-4026-bcf3-27c177780b6d";

    it("update all properties", async () => {
      const res = await request(app)
        .patch(`${BASE_URL}/${id}`)
        .send({ ...mainPayload, id });

      expect(res.body.message).toBe("Project Updated Successfully");
      expect(res.body.data).toEqual({ ...mainPayload, id });
    });

    it("update a project with non-existed ID", async () => {
      const res = await request(app)
        .patch(`${BASE_URL}/d30145a0-1f9b-4026-bcf3-27c177780b6x`)
        .expect(404);

      expect(res.body.message).toBe("Project Not Found");
      expect(res.body.data).toBeNull();
    });

    describe("required properties", () => {
      requiredProps.forEach((prop) => {
        it(`update project without ${prop.title}`, async () => {
          const payload = { ...mainPayload, id };

          delete payload[prop.title as keyof ProjectAttributes];

          const res = await request(app)
            .patch(`${BASE_URL}/${id}`)
            .send(payload)
            .expect(200);

          expect(res.body.message).toBe("Project Updated Successfully");
          expect(res.body.data).toEqual({
            ...mainPayload,
            [prop.title]: PROJECTS[2][prop.title as keyof ProjectAttributes],
            id,
          });
        });

        it(`update ${prop.title} with null value`, async () => {
          const payload = { ...mainPayload, [prop.title]: null };
          const res = await request(app)
            .patch(`${BASE_URL}/${id}`)
            .send(payload)
            .expect(400);

          expect(res.body.message).toContain(`${prop.title} cannot be null`);
          expect(res.body.data).toBeNull();
        });

        it(`update ${prop.title} with empty value`, async () => {
          const payload = { ...mainPayload, [prop.title]: "" };

          const res = await request(app)
            .patch(`${BASE_URL}/${id}`)
            .send(payload)
            .expect(400);

          expect(res.body.message).toContain(`${prop.title} cannot be empty`);
          expect(res.body.data).toBeNull();
        });

        it(`update ${prop.title} with wrong data type`, async () => {
          const payload = { ...mainPayload, [prop.title]: 123 };

          const res = await request(app)
            .patch(`${BASE_URL}/${id}`)
            .send(payload)
            .expect(400);

          expect(res.body.message).toContain(
            `${prop.title} must be ${stringWithArticle(prop.dataType)}`
          );
          expect(res.body.data).toBeNull();
        });
      });
    });

    describe("non-required properties", () => {
      nonRequiredProps.forEach((prop) => {
        it(`update project without ${prop.title}`, async () => {
          const payload = {
            ...mainPayload,
            id,
          };

          delete payload[prop.title as keyof ProjectAttributes];

          const res = await request(app)
            .patch(`${BASE_URL}/${id}`)
            .send(payload)
            .expect(200);

          expect(res.body.message).toBe("Project Updated Successfully");
          expect(res.body.data).toEqual({
            ...mainPayload,
            [prop.title]: PROJECTS[2][prop.title as keyof ProjectAttributes],
            id,
          });
        });

        it(`update ${prop.title} with null value`, async () => {
          const payload =
            prop.dataType == "array"
              ? {
                  ...mainPayload,
                  id,
                  [prop.title]: [],
                }
              : {
                  ...mainPayload,
                  id,
                  [prop.title]: null,
                };

          const res = await request(app)
            .patch(`${BASE_URL}/${id}`)
            .send(payload)
            .expect(200);

          expect(res.body.message).toBe("Project Updated Successfully");
          expect(res.body.data).toEqual({ ...payload });
        });

        it(`update ${prop.title} with empty value`, async () => {
          const payload =
            prop.dataType == "array"
              ? {
                  ...mainPayload,
                  id,
                  [prop.title]: [],
                }
              : {
                  ...mainPayload,
                  id,
                  [prop.title]: "",
                };

          const res = await request(app)
            .patch(`${BASE_URL}/${id}`)
            .send(payload)
            .expect(200);

          expect(res.body.message).toBe("Project Updated Successfully");
          expect(res.body.data).toEqual({ ...payload });
        });

        it(`update ${prop.title} with wrong data type`, async () => {
          const payload = { ...mainPayload, [prop.title]: 123 };

          const res = await request(app)
            .patch(`${BASE_URL}/${id}`)
            .send(payload)
            .expect(400);

          expect(res.body.message).toContain(
            `${prop.title} must be ${stringWithArticle(prop.dataType)}`
          );
          expect(res.body.data).toBeNull();
        });
      });
    });
  });

  describe("DELETE /api/projects", () => {
    it("delete project", async () => {
      const deleteRes = await request(app)
        .delete("/api/projects/d30145a0-1f9b-4026-bcf3-27c177780b6d")
        .expect(200);

      expect(deleteRes.body.message).toBe("Project Deleted Successfully");

      const getRes = await request(app).get(BASE_URL).expect(200);
      const data = getCorrectedTypeData(getRes);

      expect(data).toHaveLength(2);
      expect(data).toEqual([PROJECTS[0], PROJECTS[1]]);
    });

    it("delete project with non-existed ID", async () => {
      const res = await request(app)
        .delete("/api/projects/d30145a0-1f9b-4026-bcf3-27c177780b6b")
        .expect(400);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Project Not Found");
    });
  });
});
