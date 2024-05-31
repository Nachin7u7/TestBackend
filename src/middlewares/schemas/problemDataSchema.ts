import Joi from "joi";

export const problemDataSchema = Joi.object({
    _id: Joi.string().required(),
    problemName: Joi.string().required(),
    problem: Joi.object({
        problemId: Joi.any().forbidden(),
        author: Joi.any().forbidden(),
    }).required().unknown()
})