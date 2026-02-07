import { Router } from "express";
import { requireCreator, verifyUser } from "../../middleware/middleware";
import { CreateContestController, getContestDetailsController } from "./contests.controller";

const router = Router()

router.post("/contests", verifyUser, requireCreator, CreateContestController)
router.get("/contests/:contestId", verifyUser, requireCreator, getContestDetailsController)

export default router