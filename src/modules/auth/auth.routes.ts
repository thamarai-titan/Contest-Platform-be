import { Router } from "express";
import { SignupController } from "./auth.controller";

const router = Router()


router.post("/signup", SignupController)


export default router