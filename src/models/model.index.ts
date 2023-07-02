import { DataTypes } from "sequelize"
import sequelize from "../utilities/database"

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        validate: {
            min: 8
        }
    },
    password: DataTypes.STRING
})