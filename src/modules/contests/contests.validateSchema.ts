import z from "zod";

export const CreateContestsSchema = z.object({
    title: z.string().min(1, "give the title"),
    description: z.string().min(3, "Give the description"),
    startTime: z.string().min(5, "giver the datetime string"),
    endTime: z.string().min(5, "give the DateTime string")
})

export type CreateContestsSchemaType = z.infer<typeof CreateContestsSchema>



export const McqCreationSchema = z.object({
    questionText: z.string().min(3, "must need a question text"),
    options: z.string().array(),
    correctOptionIndex: z.number(),
    points: z.number()
})

export type McqCreationsSchemaType = z.infer<typeof McqCreationSchema>

const testCaseArraySchema = z.object({
        input: z.string(),
        expectedOutput: z.string(),
        isHidden: z.boolean()
    })

export const DsaCreationSchema = z.object({
    title: z.string().min(3, "must give a title"),
    description: z.string().min(5, "must give the description about the problem"),
    tags: z.string().array(),
    points: z.number().min(1),
    timeLimit: z.number().min(1),
    memoryLimit: z.number().min(1),
    testCases: z.array(testCaseArraySchema)
})

export type DsaCreationSchemaType = z.infer<typeof DsaCreationSchema>
export type testCaseArraySchemaType = z.infer<typeof testCaseArraySchema>