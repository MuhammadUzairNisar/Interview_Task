const { z } = require('zod');
const { TASK_STATUSES, TASK_PRIORITIES } = require('../models/task.model');

const taskFields = {
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().max(5000).nullable().optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  dueDate: z.iso.date().nullable().optional(),
  position: z.number().int().min(0).optional(),
};

const createTaskSchema = z.object(taskFields);

const updateTaskSchema = z
  .object(taskFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

const taskIdParamSchema = z.object({ id: z.uuid('Invalid task id') });

const listTasksQuerySchema = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  search: z.string().trim().max(200).optional(),
});

module.exports = { createTaskSchema, updateTaskSchema, taskIdParamSchema, listTasksQuerySchema };
