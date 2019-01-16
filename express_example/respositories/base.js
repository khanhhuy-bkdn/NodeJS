export default class BaseRespository {
    constructor(model) {
        this.model = model;
    }
    getAll(options = {}) {
        const newOptions = {
            limit: 2,
            page: 1,
            sort: {
                _id: -1
            },
            populate: '',
            where: {},
            lean: false,
            select: '',
            ...options
        }
        if (newOptions.limit > 5) {
            newOptions.limit = 5;
        } else if (!options.limit) {
            newOptions.limit = options.limit;
        }
        return this.model
            .find()
            .sort(newOptions.sort)
            .populate(newOptions.populate)
            .skip((parseInt(newOptions.page) - 1) * parseInt(newOptions.limit))
            .limit(parseInt(newOptions.limit))
            .lean(newOptions.lean)
            .select(newOptions.select);
    }
    getOne(options = {}) {
        const newOptions = {
            populate: '',
            where: {},
            lean: false,
            select: '',
            ...options
        }
        return this.model
            .findOne(newOptions.where)
            .populate(newOptions.populate)
            .lean(newOptions.lean)
            .select(newOptions.select);
    }
    // create(data) {
    //     return this.model.save(data);
    // }
    // update(options = {}, data) {
    //     return this.model.save(data);
    // }
    softDelete(options) {
        console.log(options.where)
        return this.model.updateOne(
            { _id: options.where._id },
            {
                deleteAt: new Date()
            }
        );
    }
}