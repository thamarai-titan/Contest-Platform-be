import z from "zod";

export const CreateContestsSchema = z.object({
    title: z.string().min(1, "give the title"),
    description: z.string().min(3, "Give the description"),
    startTime: z.string().min(5, "giver the datetime string"),
    endTime: z.string().min(5, "give the DateTime string")
})

export type CreateContestsSchemaType = z.infer<typeof CreateContestsSchema>



