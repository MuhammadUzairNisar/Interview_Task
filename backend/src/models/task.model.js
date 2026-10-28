const { DataTypes, Model } = require('sequelize');

const TASK_STATUSES = ['todo', 'in_progress', 'done'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

module.exports = (sequelize) => {
  class Task extends Model {}

  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: true, len: [1, 200] },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...TASK_STATUSES),
        allowNull: false,
        defaultValue: 'todo',
      },
      priority: {
        type: DataTypes.ENUM(...TASK_PRIORITIES),
        allowNull: false,
        defaultValue: 'medium',
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      // Ordering of the card inside its status column on the board.
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'tasks',
      underscored: true,
      paranoid: true, // soft delete via deleted_at
      indexes: [{ fields: ['status', 'position'] }],
    },
  );

  return Task;
};

module.exports.TASK_STATUSES = TASK_STATUSES;
module.exports.TASK_PRIORITIES = TASK_PRIORITIES;
