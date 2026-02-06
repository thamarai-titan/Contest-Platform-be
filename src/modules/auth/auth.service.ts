import { email } from "zod";
import { prisma } from "../../db/prisma";
import type { SignupSchemaType } from "./auth.validateSchema";

export const checkEmail = async (email: string) => {
    try {
        const isEmail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        return (isEmail) ? true : false
    } catch (error) {
        throw error
    }
}


export const SignupService = async (data: SignupSchemaType) => {
    try {

        const {
            name,
            email,
            password,
            role
        } = data
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role
            }
        })

        return user
    } catch (error) {
        throw error
    }
}