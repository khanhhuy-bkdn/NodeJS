export default class ResponseHandle {
    static returnSuccess(res, message, data) {
        return res.status(200).json({
            isSuccess: true,
            message,
            data
        });
    }
}