import Joi from 'joi';

const problemIdSchema = Joi.object({
  problemId: Joi.string().required(),
});

export default problemIdSchema;
