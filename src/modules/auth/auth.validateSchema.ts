import z from "zod"

export const SignupSchema = z.object({
    name: z.string().min(2, "Give your full name"),
    email: z.email(),
    password: z.string().min(6),
    role: z.enum(["creator", "contestee"], {
        error: "Role must be a creator or contestee"
    })
})

export type SignupSchemaType = z.infer<typeof SignupSchema>


export const SignInSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})

export type SignInSchemaType = z.infer<typeof SignInSchema>


