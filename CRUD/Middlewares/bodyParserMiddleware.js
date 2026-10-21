const bodyParserMiddleware = async (req, res) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (!body) {
                req.body = {};
                return resolve();
            }
            try {
                req.body = JSON.parse(body);
                resolve();
            } catch (error) {
                reject({ status: 400, message: 'Bad Request: Invalid JSON body' });
            }
        });
    });
};

module.exports = bodyParserMiddleware;