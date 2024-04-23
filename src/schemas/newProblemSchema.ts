import Joi from "joi";

export const newProblemSchema = Joi.object({
    problemName: Joi.string().required(),
    sampleProblemData: Joi.object({
        statement: Joi.string().required(),
        inputFormat: Joi.string().required(),
        outputFormat: Joi.string().required(),
        constraints: Joi.string().required(),
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
        ).required(),
        checkerCode: Joi.string().allow("").required(),
        explanation: Joi.string().allow("").required(),
        config: Joi.object({
                timelimit: Joi.number().required(),
                memorylimit: Joi.number().required(),
                difficulty: Joi.object({
                    value: Joi.number().max(3).required(),
                    label: Joi.string().required()
                }).required(),
                tags: Joi.array().items(Joi.string())
            })
    }).required()
})