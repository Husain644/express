import Joi from 'joi';

// ✅ Joi Validation Schemas
// Registration Schema
export const validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
   city: Joi.string().required().messages({ "string.empty": "City is required enter city name"}),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(), // 10-digit phone
    age: Joi.number().min(18).max(100).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data, { abortEarly: false });
};
// Login Schema
export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
};
