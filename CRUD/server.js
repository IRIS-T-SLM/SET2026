const http = require('http');
// Sửa lại đường dẫn bỏ chữ 'src/' và đúng chữ hoa 'Middlewares'
const handleProductRoutes = require('./routes/productRoutes');
const runMiddlewares = require('./utils/pipeline');
const bodyParserMiddleware = require('./Middlewares/bodyParserMiddleware');
const authMiddleware = require('./Middlewares/authMiddleware');

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
        if (error.status) {
            res.writeHead(error.status);
            return res.end(JSON.stringify({ message: error.message }));
        }

        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});