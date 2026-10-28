const { Sequelize } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = dbConfig.use_env_variable
  ? new Sequelize(process.env[dbConfig.use_env_variable], dbConfig)
  : new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

const db = {
  Task: require('./task.model')(sequelize),
};

Object.values(db).forEach((model) => model.associate?.(db));

module.exports = { sequelize, Sequelize, ...db };
