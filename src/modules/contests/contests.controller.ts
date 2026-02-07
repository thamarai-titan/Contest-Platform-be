import type { Request, Response } from "express";
import {
  CreateContestsSchema,
  McqCreationSchema,
  type CreateContestsSchemaType,
  type McqCreationsSchemaType,
} from "./contests.validateSchema";
import {
    addMcqToContestService,
  CreateContestService,
  getContestDetailsService,
  submitMcq,
} from "./contests.service";
import { responses } from "../../utils/responses";

type Params = {
  contestId: string;
};

type SubmitParams = {
    contestId: string,
    questionId: string
}
export const CreateContestController = async (req: Request, res: Response) => {
  try {
    const data: CreateContestsSchemaType = CreateContestsSchema.parse(req.body);
    const userId = req.userId;

    const contest = await CreateContestService(data, userId);

    if (!contest) {
      return res.status(400).json(responses.error("NOT_CREATED"));
    }

    res.status(201).json(
      responses.success({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        creatorId: contest.creator_id,
        startTime: contest.start_time,
        endTime: contest.end_time,
      }),
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json(responses.error("INVALID_REQUEST"));
    }

    return res.status(500).json(responses.error("INTERNAL_SERVER_ERROR"));
  }
};

export const getContestDetailsController = async (
  req: Request<Params>,
  res: Response,
) => {
  try {
    const { contestId } = req.params;

    const contest = await getContestDetailsService(contestId);


    const mcqsmap = contest.mcq_questions.map((data) => ({
      id: data.id,
      questionText: data.question_text,
      options: data.options,
      points: data.points,
    }));

    const dsamap = contest.dsa_problems.map((data) => ({
      id: data.id,
      title: data.title,
      description: data.description,
      tags: data.tags,
      points: data.points,
      timeLimit: data.time_limit,
      memoryLimit: data.memory_limit,
    }));

    res.status(200).json(
      responses.success({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        startTime: contest.start_time,
        endTime: contest.end_time,
        creatorId: contest.creator_id,
        mcqs: mcqsmap,
        dsaProblems: dsamap,
      }),
    );
  } catch (error: any) {
    if (error.message === "CONTEST_NOT_FOUND") {
      return res.status(404).json(responses.error("CONTEST_NOT_FOUND"));
    }

    return res.status(500).json(responses.error("INTERNAL_SERVER_ERROR"));
  }
};


export const addMcqToContestController = async (req: Request<Params>, res: Response)=>{
    try {
        const data: McqCreationsSchemaType = McqCreationSchema.parse(req.body)
        
        const { contestId } = req.params

        const mcq = await addMcqToContestService(contestId, data)

        res.status(201).json(responses.success({
            id: mcq.id,
            contestId: mcq.contest_id
        }))
    } 
    catch (error: any) {
        if(error.name === "ZodError"){
            return res.status(400).json(responses.error("INVALID_REQUEST"))
        }

        if(error.message === "CONTEST_NOT_FOUND"){
            return res.status(404).json(responses.error("CONTEST_NOT_FOUND"))
        }
        return res.status(500).json(responses.error("INTERNEL_SERVER_ERROR"))
    }
}


export const submitMcqController = async (req: Request<SubmitParams>, res: Response) => {
    try {
        const {
            questionId
        } = req.params

        const selectedIndex: number = req.body
        const userId = req.userId

        const submission = await submitMcq(userId, questionId, selectedIndex)

        res.status(201).json(responses.success({
            isCorrect: submission.is_correct,
            pointsEarned: submission.points_earned
        }))

    } catch (error: any) {
        if(error.message === "ALREADY_SUBMITTED"){
            return res.status(400).json(responses.error("ALREADY_SUBMITTED"))
        }
        if(error.message === "CONTEST_NOT_ACTIVE"){
            return res.status(400).json(responses.error("CONTEST_NOT_ACTIVE"))
        }
        if(error.message === "QUESTION_NOT_FOUND"){
            return res.status(404).json(responses.error("QUESTION_NOT_FOUND"))
        }

        return res.status(500).json(responses.error("INTERNEL_SERVER_ERROR"))
    }
}