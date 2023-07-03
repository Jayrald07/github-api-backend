import dotenv from "dotenv"
dotenv.config({})

const environment = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    DB_DIALECT: process.env.DB_DIALECT,
    JWT_KEY: process.env.JWT_KEY as string,
    REDIS_URI: process.env.REDIS_URI,
}

export default environment