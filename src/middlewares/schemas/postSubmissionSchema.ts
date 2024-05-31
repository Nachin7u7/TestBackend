import Joi from 'joi';

export const postSubmissionSchema = Joi.object({
  code: Joi.string().min(1).required().messages({
    'string.empty': 'Code cannot be empty',
  }),
  language: Joi.string().valid('python', 'java', 'cpp',).required().messages({
    'any.only': 'Language must be one of [python, java, cpp]',
  }),
  problemId: Joi.number().integer().required().messages({
    'any.required': 'Problem ID is required',
  }),
  isSample: Joi.boolean().required().messages({
    'any.required': 'isSample is required',
  })
});
