const http = require('http');
const handleProductRoutes = require('./src/routes/productRoutes');
const runMiddlewares = require('./src/utils/pipeline');
const bodyParserMiddleware = require('./src/middlewares/bodyParserMiddleware');
const authMiddleware = require('./src/middlewares/authMiddleware');

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    try {
        // Thực thi danh sách Middleware theo cơ chế Pipeline
        await runMiddlewares(req, res, [
            bodyParserMiddleware,
            authMiddleware
        ]);

        const handled = await handleProductRoutes(req, res, parsedUrl);

        if (!handled) {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Route not found' }));
        }
    } catch (error) {
        // Bắt các lỗi validation / auth / business logic có status code cụ thể
        if (error.status) {
            res.writeHead(error.status);
            return res.end(JSON.stringify({ message: error.message }));
        }

        // Catch default server internal errors
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});