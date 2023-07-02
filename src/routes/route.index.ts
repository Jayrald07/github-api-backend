import express from "express";
import { handleError, handleUserLogin, handleUserRegister } from "../controllers/controller.index";
import { body } from "express-validator";
import { handleValidation } from "../middlewares/middleware.index";
import { Message } from "../utilities/message";

const router = express.Router();

router.post("/register", 
    [
        body("username").notEmpty().withMessage(Message.USERNAME_EMPTY).isLength({min: 5}).withMessage("Username length minimum should be 5"),
        body("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/).withMessage("Password should be 8 characters and contain at least 1 uppercase letter, 1 number, and 1 special character"),
        body("passwordConfirmation").notEmpty().withMessage("Password Confirmation is empty"),
        body("password").custom((value, { req }) => value == req.body.passwordConfirmation).withMessage("Password and Password Confirmation are not the same")
    ],
    handleValidation,
    handleUserRegister);

router.post("/login",
    [
        body("username").notEmpty().withMessage(Message.USERNAME_EMPTY),
        body("password").notEmpty().withMessage(Message.PASSWORD_EMPTY),
    ],
    handleValidation,
    handleUserLogin)

router.use(handleError)

export default router;