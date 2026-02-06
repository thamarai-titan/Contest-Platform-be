import type {Request, Response} from "express"
import { SignupSchema, type SignupSchemaType } from "./auth.validateSchema"
import { checkEmail, SignupService } from "./auth.service"
import { responses } from "../../utils/responses.ts"



export const SignupController = async (req: Request, res: Response) => {

    try {
        const data: SignupSchemaType = SignupSchema.parse(req.body)

        const isEmailAlreadyExists = await checkEmail(data.email)

        if(isEmailAlreadyExists){
            res.status(400).json(responses.error("EMAIL_ALREADY_EXISTS"))
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
            res.status(400).json(responses.error("INVALID_REQUEST"))
        }
    }

}
