import Joi from "joi";


const problemIdSchema = Joi.object({
    problemId: Joi.number().required()
})

export default problemIdSchema