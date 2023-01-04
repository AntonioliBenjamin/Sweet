export const clientErrorHandler = (callback) => {
    return async (req, res, next) => {
        try {
            await callback(req, res, next);
            next();
        } catch (err) {
            console.error(err);
            return res.status(400).send("An error occurred");
        }
    };
};