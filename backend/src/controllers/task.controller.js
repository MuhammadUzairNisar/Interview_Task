const taskService = require('../services/task.service');

// Express 5 forwards rejected promises to the error handler, so no try/catch needed.
const list = async (req, res) => {
  const tasks = await taskService.list(req.validated.query);
  res.json({ data: tasks });
};

const getById = async (req, res) => {
  const task = await taskService.getById(req.params.id);
  res.json({ data: task });
};

const create = async (req, res) => {
  const task = await taskService.create(req.validated.body);
  res.status(201).json({ data: task });
};

const update = async (req, res) => {
  const task = await taskService.update(req.params.id, req.validated.body);
  res.json({ data: task });
};

const remove = async (req, res) => {
  await taskService.remove(req.params.id);
  res.status(204).end();
};

module.exports = { list, getById, create, update, remove };
