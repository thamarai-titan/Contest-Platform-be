import type {Request, Response} from "express"
import { CreateContestsSchema, type CreateContestsSchemaType } from "./contests.validateSchema"
import { CreateContestService } from "./contests.service"
import { responses } from "../../utils/responses"

export const CreateContestController = async (req: Request, res: Response)=>{
    try {
        const data: CreateContestsSchemaType = CreateContestsSchema.parse(req.body)
        const userId = req.userId

        const contest = await CreateContestService(data,userId)

        if(!contest){
            return res.status(400).json(responses.error("NOT_CREATED"))
        }

        res.status(201).json(responses.success({
            id: contest.id,
            title: contest.title,
            description: contest.description,
            creatorId: contest.creator_id,
            startTime: contest.start_time,
            endTime: contest.end_time
        }))
    } catch (error: any) {
        if(error.name === "ZodError"){
            res.status(400).json(responses.error("INVALID_REQUEST"))
        }

        res.status(400).json(responses.error("INTERNAL_SERVER_ERROR"))
    }   
}