import bcrypt from "bcrypt"
import { prisma } from "../../db/prisma";
import type { SignInSchemaType, SignupSchemaType } from "./auth.validateSchema";

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

        const hashedPassword = await bcrypt.hash(password, 10)
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        })

        return user
    } catch (error) {
        throw error
    }
}


export const SignInService = async (data: SignInSchemaType) => {
    try {
        const {
            email,
            password
        } = data
        
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        
        if(!user){
            throw new Error("NO_USER_FOUND")
        }

        const decodedPassword = bcrypt.compare(password, user.password)

        if(!decodedPassword){
            throw new Error("INVALID_CREDENTIALS")
        }

        return user
    } catch (error) {
        throw error
    }
}