import Joi from "joi";

export const problemDataSchema = Joi.object({
    _id: Joi.string().required(),
    problem: Joi.object({
        problemName: Joi.string().required(),
        sampleProblemData: Joi.object({
            statement: Joi.string(),
            inputFormat: Joi.string(),
            outputFormat: Joi.string(),
            constraints: Joi.string(),
            testcases: Joi.array().min(1).items(
                Joi.object({
                    input: Joi.object({
                        url: Joi.string().required(),
                        fileName: Joi.string().required()
                    }).required(),
                    output: Joi.object({
                        url: Joi.string().required(),
                        fileName: Joi.string().required()
                    }).required(),
                    isSample: Joi.boolean().required()
                })
            ),
            checkerCode: Joi.string().allow(""),
            explanation: Joi.string().allow(""),
            config: Joi.object({
                    timelimit: Joi.number(),
                    memorylimit: Joi.number(),
                    difficulty: Joi.object({
                        value: Joi.number().max(3),
                        label: Joi.string()
                    }),
                    tags: Joi.array().items(Joi.string())
                })
        })
    }).required()
})