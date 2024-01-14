import { Dialect, Sequelize } from "sequelize";
import environment from "./environment";
import logger from "./logger";

export const sequelize = new Sequelize(environment.DB_URI as string, {
  dialect: environment.DB_DIALECT as Dialect,
  logging: false,
});

const initializeDatabase = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  logger.info(`Database client connection has been initialized`);
};

export default initializeDatabase;
