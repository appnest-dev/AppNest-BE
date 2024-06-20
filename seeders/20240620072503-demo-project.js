"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return await queryInterface.bulkInsert("project", [
      {
        id: "d30145a0-1f9b-4026-bcf3-27c177780b6d",
        project_title: "New Project",
        project_id: "new_project_id",
        project_members: ["member1", "member2"],
        tasks_manager_url: "https://example.com/tasks",
        brand_guideline_url: "https://example.com/brand",
        ui_ux_url: "https://example.com/ui_ux",
        uml_url: "https://example.com/uml",
        fe_repo_url: "https://example.com/fe_repo",
        be_repo_url: "https://example.com/be_repo",
        last_updated: new Date(),
      },
      {
        id: "d30145a0-1f9b-4026-bcf3-27c177780b6c",
        project_title: "New Project 2",
        project_id: "new_project_id_2",
        project_members: ["member1", "member2"],
        tasks_manager_url: "https://example.com/tasks",
        brand_guideline_url: "https://example.com/brand",
        ui_ux_url: "https://example.com/ui_ux",
        uml_url: "https://example.com/uml",
        fe_repo_url: "https://example.com/fe_repo",
        be_repo_url: "https://example.com/be_repo",
        last_updated: new Date(),
      },
      {
        id: "d30145a0-1f9b-4026-bcf3-27c177780b6e",
        project_title: "New Project 3",
        project_id: "new_project_id_3",
        project_members: ["member1", "member2"],
        tasks_manager_url: "https://example.com/tasks",
        brand_guideline_url: "https://example.com/brand",
        ui_ux_url: "https://example.com/ui_ux",
        uml_url: "https://example.com/uml",
        fe_repo_url: "https://example.com/fe_repo",
        be_repo_url: "https://example.com/be_repo",
        last_updated: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    return await queryInterface.bulkDelete("Users", null, {});
  },
};
