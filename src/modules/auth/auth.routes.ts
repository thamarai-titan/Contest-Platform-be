import { Router } from "express";
import { SigninController, SignupController } from "./auth.controller";

const router = Router()


router.post("/signup", SignupController)
router.post("/login", SigninController)


export default router