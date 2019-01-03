var Joi = require('joi');
//var objectID = require('mongodb').ObjectID

exports.createGroup = {
  body: {
    name: Joi.string().max(255).required(),
    author: Joi.string().error(() => 'Không phải là một Object').required().regex(/^[0-9a-fA-F]{24}$/),
    //author: objectID.isValid(Joi.string()),
    members: Joi.array().items(Joi.string().error(() => 'Không phải là một Object').regex(/^[0-9a-fA-F]{24}$/)).required(),
    lastMessage: Joi.string().error(() => 'Không phải là một Object').required().regex(/^[0-9a-fA-F]{24}$/)
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
    name: Joi.string().error(() => 'Vui lòng nhập name').required(),
    author: Joi.string().required().error(() => 'Không phải là một Object').regex(/^[0-9a-fA-F]{24}$/),
    members: Joi.array().items(Joi.string().error(() => 'Không phải là một Object').regex(/^[0-9a-fA-F]{24}$/)).required(),
    lastMessage: Joi.string().error(() => 'Không phải là một Object').required().regex(/^[0-9a-fA-F]{24}$/)
  }
};
exports.deleteGroup = {
  params: {
    id: Joi.string().required()
  }
};
exports.addMemberGroup = {
  params: {
    id: Joi.string().required()
  },
  body: {
    members: Joi.array().items(Joi.string().error(() => 'Không phải là một Object').regex(/^[0-9a-fA-F]{24}$/)).required(),
  }
};
exports.deleteMemberGroup = {
  params: {
    id: Joi.string().required(),
    idmember: Joi.string().required()
  }
};