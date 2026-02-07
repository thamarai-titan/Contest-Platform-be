import { Router } from "express";
import { requireCreator, verifyUser } from "../../middleware/middleware";
import { CreateContestController } from "./contests.controller";

const router = Router()

router.post("/contests", verifyUser, requireCreator, CreateContestController)


export default router