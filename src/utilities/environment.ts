import dotenv from "dotenv"
dotenv.config({})

const environment = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    JWT_KEY: process.env.JWT_KEY as string
}

export default environment