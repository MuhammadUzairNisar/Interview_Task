const { Router } = require('express');
const controller = require('../controllers/task.controller');
const validate = require('../middlewares/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksQuerySchema,
} = require('../validators/task.validator');

const router = Router();

router.get('/', validate(listTasksQuerySchema, 'query'), controller.list);
router.post('/', validate(createTaskSchema), controller.create);
router.get('/:id', validate(taskIdParamSchema, 'params'), controller.getById);
router.post('/:id', validate(taskIdParamSchema, 'params'), validate(updateTaskSchema), controller.update);
router.delete('/:id', validate(taskIdParamSchema, 'params'), controller.remove);

module.exports = router;
