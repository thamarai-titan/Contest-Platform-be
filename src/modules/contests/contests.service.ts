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


export const getContestDetailsService = async (contestId: string)=>{
    try {
            const contest = await prisma.contests.findUnique({
                where: {
                    id: contestId
                },
                include: {
                    mcq_questions: {
                        select: {
                            id: true,
                            question_text: true,
                            options: true,
                            points: true
                        }
                    },
                    dsa_problems: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            tags: true,
                            points: true,
                            time_limit: true,
                            memory_limit: true
                        }
                    }
                }
            })

            if(!contest){
                throw new Error("CONTEST_NOT_FOUND")
            }

            return contest
    } catch (error) {
        throw error
    }
}