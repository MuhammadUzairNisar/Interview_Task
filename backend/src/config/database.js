// Shared by the app and sequelize-cli (see .sequelizerc).
require('dotenv').config();

const base = {
  dialect: 'postgres',
  define: { underscored: true }, // snake_case columns in Postgres, camelCase in JS
};

const fromEnv = {
  ...base,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

module.exports = {
  development: { ...fromEnv, logging: false },
  test: { ...fromEnv, database: `${fromEnv.database}_test`, logging: false },
  production: {
    ...base,
    use_env_variable: 'DATABASE_URL',
    logging: false,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  },
};
