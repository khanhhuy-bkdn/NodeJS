var Joi = require('joi');

exports.createGroup = {
    body: {
        name: Joi.string().max(50).min(3).required().options({
            language: {
                any: {
                    empty: 'is required!'
                },
                string: {
                    min: 'must be at least 3 Characters!',
                    max: 'name is too long!'
                },
            },
        }),
        author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().options({
            language: {
                any: {
                    empty: 'is required!'
                },
                string: {
                    regex: {
                        base: 'is not Object!'
                    }
                },
            },
        }),
        members: Joi.array().items(Joi.string().error(() => 'members is not Object!').regex(/^[0-9a-fA-F]{24}$/)).required(),
        lastMessage: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().options({
            language: {
                any: {
                    empty: 'is required!'
                },
                string: {
                    regex: {
                        base: 'is not Object!'
                    }
                },
            },
        }),
    }
};
exports.getGroupById = {
    params: {
        id: Joi.string().required().error(() => 'id is require!')
    }
};
exports.updateGroup = {
    params: {
        id: Joi.string().error(() => 'id is require!').required()
    },
    body: {
        name: Joi.string().max(50).min(3).required().options({
            language: {
                any: {
                    empty: 'is required!'
                },
                string: {
                    min: 'must be at least 3 Characters!',
                    max: 'name is too long!'
                },
            },
        }),
        author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().options({
            language: {
                any: {
                    empty: 'is required!'
                },
                string: {
                    regex: {
                        base: 'is not Object!'
                    }
                },
            },
        }),
        members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required().options({
            language: {
                any: {
                    empty: 'members is required!'
                },
                string: {
                    regex: {
                        base: 'members is not Object!'
                    }
                },
            },
        }),
        lastMessage: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().options({
            language: {
                any: {
                    empty: 'is required!'
                },
                string: {
                    regex: {
                        base: 'is not Object!'
                    }
                },
            },
        }),
    }
};
exports.deleteGroup = {
    params: {
        id: Joi.string().required().error(() => 'id is require!')
    }
};
exports.addMemberGroup = {
    params: {
        id: Joi.string().required().error(() => 'id is require!')
    },
    body: {
        members: Joi.array().items(Joi.string().error(() => 'members is not Object!').regex(/^[0-9a-fA-F]{24}$/)).required(),
    }
};
exports.deleteMemberGroup = {
    params: {
        id: Joi.string().required().error(() => 'id is require!'),
        idmember: Joi.string().required().error(() => 'id member is require!')
    }
};