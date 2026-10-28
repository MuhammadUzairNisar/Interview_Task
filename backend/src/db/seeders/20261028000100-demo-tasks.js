'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('tasks', [
      { title: 'Set up project skeleton', status: 'done', priority: 'high', position: 0, created_at: now, updated_at: now },
      { title: 'Build task API', description: 'CRUD endpoints for tasks', status: 'in_progress', priority: 'high', position: 0, created_at: now, updated_at: now },
      { title: 'Build board UI', status: 'todo', priority: 'medium', position: 0, created_at: now, updated_at: now },
      { title: 'Write README', status: 'todo', priority: 'low', position: 1, created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', null, {});
  },
};
