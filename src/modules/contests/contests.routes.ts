import { Router } from "express";
import { requireConteste, requireCreator, verifyUser } from "../../middleware/middleware";
import { addDsqController, addMcqToContestController, CreateContestController, getContestDetailsController, getDsaProblemsController, submitMcqController } from "./contests.controller";

const router = Router()

router.post("/contests", verifyUser, requireCreator, CreateContestController)
router.get("/contests/:contestId", verifyUser, getContestDetailsController)
router.post("/contests/:contestId/mcq", verifyUser, requireCreator, addMcqToContestController)
router.post("/contests/:contestId/mcq/:questionId/submit", verifyUser, requireConteste, submitMcqController)
router.post("/contests/:contestId/dsa", verifyUser, requireCreator, addDsqController)
router.get("/problems/:problemId", verifyUser, getDsaProblemsController)

export default router