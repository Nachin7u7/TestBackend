import Joi from 'joi';

export const postSubmissionSchema = Joi.object({
  code: Joi.string().min(1).required().messages({
    'string.empty': 'Code cannot be empty',
  }),
  language: Joi.string().valid('python3', 'java', 'cpp17',).required().messages({
    'any.only': 'Language must be one of [python3, java, cpp17]',
  }),
  problemId: Joi.number().integer().required().messages({
    'any.required': 'Problem ID is required',
  }),
  isSample: Joi.boolean().required().messages({
    'any.required': 'isSample is required',
  })
});
