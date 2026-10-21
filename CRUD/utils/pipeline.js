const runMiddlewares = async (req, res, middlewares) => {
    for (const middleware of middlewares) {
        await middleware(req, res);
    }
};

module.exports = runMiddlewares;