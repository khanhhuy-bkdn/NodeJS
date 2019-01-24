export default class ResponseHandle {
    static returnSuccess(res, message, data) {
        return res.status(200).json({
            isSuccess: true,
            message,
            data
        });
    }

    static returnError(res, err) {
        return res.status(400).json({
            isSuccess: false,
            message: err.message || 'Have error'
        });
    }
}