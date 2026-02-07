import { Router } from "express";
import { requireCreator, verifyUser } from "../../middleware/middleware";
import { addMcqToContestController, CreateContestController, getContestDetailsController } from "./contests.controller";

const router = Router()

router.post("/contests", verifyUser, requireCreator, CreateContestController)
router.get("/contests/:contestId", verifyUser, getContestDetailsController)
router.post("/contests/:contestId/mcq", verifyUser, requireCreator, addMcqToContestController)

export default router