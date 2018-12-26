var Joi = require('joi');

exports.createGroup = {
  body: {
    name: Joi.string().required()
  }
};
exports.getGroupById = {
  params: {
    id: Joi.string().required()
  }
};
exports.updateGroup = {
  params: {
    id: Joi.string().required()
  },
  body: {
    name: Joi.string().required()
  }
};
exports.deleteGroup = {
  params: {
    id: Joi.string().required()
  }
};