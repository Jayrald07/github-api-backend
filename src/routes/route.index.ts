import express from "express";
import { handleError, handleGithubUserDetails, handleUserLogin, handleUserRegister } from "../controllers/controller.index";
import { body, header } from "express-validator";
import { handleAuthorization, handleValidation } from "../middlewares/middleware.index";
import { Message } from "../utilities/message";

const router = express.Router();

router.post("/register", 
    body("username")
        .notEmpty()
        .withMessage(Message.USERNAME_EMPTY)
        .isLength({min: 5})
        .withMessage("Username length minimum should be 5"),

    body("password")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)
        .withMessage(Message.PASSWORD_CONDITION),

    body("passwordConfirmation")
        .notEmpty()
        .withMessage("Password Confirmation is empty"),

    body("password")
        .custom((value, { req }) => value == req.body.passwordConfirmation)
        .withMessage("Password and Password Confirmation are not the same"),

    handleValidation,
    handleUserRegister);

router.post("/login",
    body("username")
        .notEmpty()
        .withMessage(Message.USERNAME_EMPTY),
    
    body("password")
        .notEmpty()
        .withMessage(Message.PASSWORD_EMPTY),

    handleValidation,
    handleUserLogin)

router.post("/getUsers",
    header("authorization")
        .notEmpty()
        .withMessage(Message.UNAUTHORIZED),
    
    body("usernames")
        .isArray()
        .custom(value => value.length >= 1 && value.length <= 10)
        .withMessage("Usernames length minimum should be 1"),

    handleValidation,
    handleAuthorization,
    handleGithubUserDetails)

router.use(handleError)

export default router;