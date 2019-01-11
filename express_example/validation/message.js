var Joi = require('joi');

exports.createMessage = {
    body: {
        message: Joi.string().max(255).required().options({
            language: {
                any: {
                    empty: 'is required!'
                },
                string: {
                    max: 'message is too long!'
                },
            },
        }),
        // author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().options({
        //     language: {
        //         any: {
        //             empty: 'is required!'
        //         },
        //         string: {
        //             regex: {
        //                 base: 'is not Object!'
        //             }
        //         },
        //     },
        // }),
        group: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().options({
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
exports.getAllMessage = {
    query: {
        page: Joi.number().required().min(1).options({
            language: {
                any: {
                    empty: 'is required!'
                },
                number: {
                    min: 'must be at least 1!'
                },
            },
        }),
        limit: Joi.number().required().max(1000).min(1).options({
            language: {
                any: {
                    empty: 'is required!'
                },
                number: {
                    min: 'must be at least 1!',
                    max: 'is too long!'
                },
            },
        })
    }
};
exports.getMessageById = {
    params: {
        id: Joi.string().required().error(() => 'id is require!')
    }
};
exports.updateMessage = {
    params: {
        id: Joi.string().error(() => 'id is require!').required()
    },
    body: {
        message: Joi.string().max(255).required().options({
            language: {
                any: {
                    empty: 'is required!'
                },
                string: {
                    max: 'message is too long!'
                },
            },
        }),
        // author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().options({
        //     language: {
        //         any: {
        //             empty: 'is required!'
        //         },
        //         string: {
        //             regex: {
        //                 base: 'is not Object!'
        //             }
        //         },
        //     },
        // }),
        group: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().options({
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
exports.deleteMessage = {
    params: {
        id: Joi.string().required().error(() => 'id is require!')
    }
};