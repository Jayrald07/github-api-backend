import dotenv from "dotenv"

const initalizeEnvironment = () => {
    if (process.env.NODE_DEV != 'production') {
        dotenv.config({})
    }
}

export default initalizeEnvironment;
