const http = require('http');
const handleProductRoutes = require('./src/routes/productRoutes');

const server = http.createServer(async (req, res) => {
    // Set Header mặc định trả về JSON
    res.setHeader('Content-Type', 'application/json');

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    try {
        const handled = await handleProductRoutes(req, res, parsedUrl);

        if (!handled) {
            // 404 nếu không khớp route
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Route not found' }));
        }
    } catch (error) {
        // Lỗi kiểm tra sự tồn tại (404 từ Service)
        if (error.status === 404) {
            res.writeHead(404);
            return res.end(JSON.stringify({ message: error.message }));
        }

        // Bắt lỗi cú pháp JSON từ parseBody
        if (error.message === 'Invalid JSON') {
            res.writeHead(400);
            return res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON body' }));
        }

        // Bắt lỗi Server nội bộ
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Internal Server Error' }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});