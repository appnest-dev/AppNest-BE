import dotenv from "dotenv";
dotenv.config();
import { Dialect, Sequelize } from "sequelize";

const DATABASE = {
  name: process.env.DATABASE_NAME as string,
  username: process.env.DATABASE_USERNAME as string,
  password: process.env.DATABASE_PASSWORD as string,
  host: process.env.DATABASE_HOST as string,
  dialect: (process.env.NODE_ENV == "test" ? "sqlite" : "postgres") as Dialect,
  storage: process.env.NODE_ENV == "test" ? ":memory:" : undefined,
};

const sequelize = new Sequelize(
  DATABASE.name,
  DATABASE.username,
  DATABASE.password,
  {
    host: DATABASE.host,
    dialect: DATABASE.dialect,
    storage: DATABASE.storage,
  }
);

export default sequelize;
