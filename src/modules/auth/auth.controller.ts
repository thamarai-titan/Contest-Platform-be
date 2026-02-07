import type {Request, Response} from "express"
import { SignInSchema, SignupSchema, type SignInSchemaType, type SignupSchemaType } from "./auth.validateSchema"
import { checkEmail, SignInService, SignupService } from "./auth.service"
import { responses } from "../../utils/responses.ts"
import { SignJWT } from "../../utils/jwt.ts"



export const SignupController = async (req: Request, res: Response) => {

    try {
        const data: SignupSchemaType = SignupSchema.parse(req.body)

        const isEmailAlreadyExists = await checkEmail(data.email)

        if(isEmailAlreadyExists){
            return res.status(400).json(responses.error("EMAIL_ALREADY_EXISTS"))
        }

        const user = await SignupService(data)

        res.status(201).json(responses.success({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }))

    } catch (error: any) {
        if(error.name === "ZodError")
        {
            return res.status(400).json(responses.error("INVALID_REQUEST"))
        }

        return res.status(400).json(responses.error("ERROR IN THE SERVER"))
    }

}


export const SigninController = async (req: Request, res: Response) => {
    try {
        const data: SignInSchemaType = SignInSchema.parse(req.body)

        const user = await SignInService(data)

        const token = await SignJWT({
            userId: user.id,
            role: user.role
        })

        res.status(200).json(responses.success({
            token: token
        }))
    } catch (error: any) {
        if(error?.name === "ZodError"){
            res.status(400).json(responses.error("INVALID_REQUEST"))
        }

        if(error.message === "INVALID_CREDENTIALS"){
            res.status(401).json(responses.error("INVALID_CREDENTIALS"))
        }

        if(error.message === "NO_USER_FOUND"){
            res.status(401).json(responses.error("NO_USER_FOUND"))
        }

        return res.status(400).json(responses.error("INTERNAL SERVER ERROR"))
    }
}