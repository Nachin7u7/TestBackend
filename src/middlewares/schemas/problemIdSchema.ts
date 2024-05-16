import Joi from "joi";


const problemIdSchema = Joi.object({
    problemId: Joi.number().required(),
    adminId: Joi.string()
})

export default problemIdSchema