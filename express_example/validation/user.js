var Joi = require('joi');

exports.loginUser = {
  body: {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};
exports.createUser = {
  body: {
    fullName: Joi.object().keys({
      first: Joi.string().min(3).max(30),
      last: Joi.string().min(3).max(30)
    }),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
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
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
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
    passwordOld: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    passwordNew: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    passwordVerify: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  }
};