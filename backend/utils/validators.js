const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('viewer', 'analyst', 'admin').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const recordSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().max(100).required(),
  date: Joi.date().iso().required(),
  notes: Joi.string().allow('', null).optional()
});

const updateUserSchema = Joi.object({
  role: Joi.string().valid('viewer', 'analyst', 'admin').optional(),
  status: Joi.string().valid('active', 'inactive').optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  recordSchema,
  updateUserSchema
};
