import { DataTypes } from "sequelize";
import { sequelize } from "../utilities/database";
import { createSession } from "../utilities/session";
import { IUserModel } from "../typedefs/typedef.index";

export const User = sequelize.define<IUserModel>("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    validate: {
      min: 8,
    },
  },
  password: DataTypes.STRING,
});

User.prototype.generateToken = function () {
  return createSession(this.username);
};
