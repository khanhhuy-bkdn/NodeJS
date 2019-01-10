var Joi = require('joi');

exports.loginUser = {
  body: {
    email: Joi.string().email({ minDomainAtoms: 2 }).required().max(150),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required().max(50)
  }
};
exports.createUser = {
  body: {
    fullName: Joi.object().keys({
      first: Joi.string().min(3).max(30),
      last: Joi.string().min(3).max(30)
    }),
    email: Joi.string().email({ minDomainAtoms: 2 }).required().min(3).max(150),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required().min(3).max(30)
  }
};
exports.getUserById = {
  params: {
    id: Joi.string().required()
  }
};
exports.updateUser = {
  params: {
    id: Joi.string().required()
  },
  body: {
    fullName: Joi.object().keys({
      first: Joi.string().min(3).max(30),
      last: Joi.string().min(3).max(30)
    }),
    email: Joi.string().email().required().min(3).max(150),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required().min(3).max(50)
  }
};
exports.deleteUser = {
  params: {
    id: Joi.string().required()
  }
};
exports.updatePassword = {
  params: {
    id: Joi.string().required()
  },
  body: {
    currentPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required().min(3).max(50),
    newPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required().min(3).max(50),
    verifyPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required().min(3).max(50),
  }
};