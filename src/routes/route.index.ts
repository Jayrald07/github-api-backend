import express from "express";
import { handleError } from "../controllers/controller.index";

const router = express.Router();


router.use(handleError)

export default router;