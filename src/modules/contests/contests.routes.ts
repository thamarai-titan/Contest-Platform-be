import { Router } from "express";
import { requireConteste, requireCreator, verifyUser } from "../../middleware/middleware";
import { addMcqToContestController, CreateContestController, getContestDetailsController, submitMcqController } from "./contests.controller";

const router = Router()

router.post("/contests", verifyUser, requireCreator, CreateContestController)
router.get("/contests/:contestId", verifyUser, getContestDetailsController)
router.post("/contests/:contestId/mcq", verifyUser, requireCreator, addMcqToContestController)
router.post("/contests/:contestId/mcq/:questionId/submit", verifyUser, requireConteste, submitMcqController)
export default router