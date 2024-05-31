import Joi from "joi";


const problemIdSchema = Joi.object({
    problemId: Joi.string().required(),
    adminId: Joi.string()
})

export default problemIdSchema