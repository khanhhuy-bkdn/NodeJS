var Joi = require('joi');

exports.loginUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};
exports.createUser = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
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
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};
exports.deleteUser = {
  params: {
    id: Joi.string().required()
  }
};