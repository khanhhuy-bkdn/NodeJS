import Class from '../models/class';

const ClassController = {};

ClassController.getAll = async (req, res) => {
    try {
        await Class.find().sort('-dateAdded').exec((err, classes) => {
            if (err) {
                res.status(500).send(err);
            }
            return res.json({
                classes,
            });
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

export default ClassController;
