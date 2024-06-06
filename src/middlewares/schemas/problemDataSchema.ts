import Joi from "joi";

export const problemDataSchema = Joi.object({
    _id: Joi.required(),
    problemName: Joi.string().required(),
    saved: Joi.object()
})