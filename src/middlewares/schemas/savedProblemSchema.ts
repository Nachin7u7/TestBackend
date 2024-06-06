import Joi from 'joi';

export const savedProblemSchema = Joi.object({
  _id: Joi.number().required(),
  problemName: Joi.string().required(),
  published: Joi.object(),
});
