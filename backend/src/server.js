const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    const server = app.listen(env.port, () => {
      console.log(`API listening on http://localhost:${env.port}/api/v1`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down`);
      server.close(async () => {
        await sequelize.close();
        process.exit(0);
      });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
