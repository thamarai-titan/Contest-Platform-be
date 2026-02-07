import {prisma} from "../../db/prisma.ts"
import type { CreateContestsSchemaType } from "./contests.validateSchema"

export const CreateContestService = async (data: CreateContestsSchemaType, userId: string)=>{
    try {
        const {
            title,
            description,
            startTime,
            endTime
        } = data

        const contest = await prisma.contests.create({
            data: {
                title,
                description,
                start_time: startTime,
                end_time: endTime,
                creator_id: userId
            }
        })

        return contest
    } catch (error) {
        throw error
    }
}