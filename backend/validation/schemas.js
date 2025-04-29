const Joi = require('joi');

// User schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  career: Joi.string().required(),
  semester: Joi.number().integer().min(1).required(),
  role: Joi.string().valid('TUTOR', 'TUTORADO').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string(),
  avatar_url: Joi.string().allow(null, ''),
  career: Joi.string(),
  semester: Joi.number().integer().min(1)
});

// Mentorship schemas
const createMentorshipSchema = Joi.object({
  tutor_id: Joi.string().uuid().required(),
  tutorado_id: Joi.string().uuid().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')),
  notes: Joi.string().allow('', null),
  focus_areas: Joi.array().items(Joi.string()).min(1).required()
});

// Session schemas
const createSessionSchema = Joi.object({
  mentorship_id: Joi.string().uuid().required(),
  date: Joi.date().required(),
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  title: Joi.string().required(),
  mode: Joi.string().valid('ONLINE', 'IN_PERSON').required(),
  location: Joi.string().when('mode', {
    is: 'IN_PERSON',
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null)
  }),
  notes: Joi.string().allow('', null),
  topics: Joi.array().items(Joi.string()).min(1)
});

// Resource schemas
const createResourceSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid('PDF', 'VIDEO', 'LINK', 'IMAGE', 'OTHER').required(),
  subject: Joi.string().required(),
  url: Joi.string().uri().required(),
  topics: Joi.array().items(Joi.string())
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createMentorshipSchema,
  createSessionSchema,
  createResourceSchema
};