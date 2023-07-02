import { Sequelize } from "sequelize";
import environment from "./environment";

const sequelize = new Sequelize(environment.DB_URI as string, { dialect: "sqlite", logging: false });

export default sequelize