import Class from '../models/class';

const ClassController = {};

ClassController.getAll = async (req, res) => {
    try {
        const classes = await Class.find().sort('-dateAdded');
        if (!classes) {
            return res.status(200).json({
                isSuccess: true,
                message: "Class is empty!"
            });
        }
        return res.json({
            isSuccess: true,
            classes: classes
        });
    } catch (err) {
        return res.status(400).json({
            isSuccess: false,
            message: err.message,
            error: err
        });
    }
};

ClassController.addClass = async (req, res) => {
    try {
        const { name, quality } = req.body;
        if (!name) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Name is require!'
            });
        }
        const classes = new Class({
            name,
            quality,
        });
        await classes.save();
        return res.status(201).json({
            isSuccess: true,
            classes: classes
        });
    } catch (err) {
        return res.status(400).json({
            isSuccess: false,
            error: err
        });
    }
}

ClassController.getClassById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                isSuccess: false,
                message: 'id is required!'
            });
        }
        const classes = await Class.findById(id);
        if (!classes) {
            return res.status(200).json({
                isSuccess: true,
                message: "Class is not exist!"
            });
        }
        return res.status(200).json({
            isSuccess: true,
            classes: classes
        });
    } catch (err) {
        return res.status(400).json({
            isSuccess: false,
            error: err
        });
    }
};

ClassController.updateClass = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                isSuccess: false,
                message: 'id is required!'
            });
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                isSuccess: false,
                message: 'Name is require!'
            });
        }
        const classes = new Class({
            ...req.body
        });
        const classes_res = await Class.findByIdAndUpdate(id, classes, { new: true });
        return res.status(200).json({
            isSuccess: true,
            message: 'Update success!',
            Class: classes_res
        });
    } catch (err) {
        return res.status(400).json({
            isSuccess: false,
            error: err
        });
    }
};

ClassController.deleteClass = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                isSuccess: false,
                message: 'id is required!'
            });
        }
        await Class.findByIdAndRemove(id);
        return res.status(200).json({
            isSuccess: true,
            message: 'Delete success!'
        });
    } catch (err) {
        return res.status(400).json({
            isSuccess: false,
            error: err
        });
    }
};

export default ClassController;
