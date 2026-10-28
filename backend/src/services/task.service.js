const { Op } = require('sequelize');
const { Task } = require('../models');
const ApiError = require('../utils/ApiError');

const list = ({ status, priority, search } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (search) where.title = { [Op.iLike]: `%${search}%` };

  return Task.findAll({ where, order: [['status', 'ASC'], ['position', 'ASC'], ['createdAt', 'ASC']] });
};

const getById = async (id) => {
  const task = await Task.findByPk(id);
  if (!task) throw ApiError.notFound('Task not found');
  return task;
};

const create = async (data) => {
  // New tasks go to the bottom of their column unless a position is given.
  if (data.position === undefined) {
    const max = await Task.max('position', { where: { status: data.status || 'todo' } });
    data.position = Number.isFinite(max) ? max + 1 : 0;
  }
  return Task.create(data);
};

const update = async (id, data) => {
  const task = await getById(id);
  return task.update(data);
};

const remove = async (id) => {
  const task = await getById(id);
  await task.destroy();
};

module.exports = { list, getById, create, update, remove };
