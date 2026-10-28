const http = require('http');

// Mảng in-memory lưu trữ sản phẩm và biến đếm autoId (đảm bảo không trùng và không cấp lại ID đã xóa)
let products = [];
let autoId = 1;

// Hàm tiện ích để đọc và parse JSON từ body của request
const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });
    });
};

const server = http.createServer(async (req, res) => {
    // Set Header mặc định trả về JSON
    res.setHeader('Content-Type', 'application/json');

    // Tách URL và query params
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Tách đường dẫn để lấy ID (nếu có). Ví dụ: /products/3 -> ['', 'products', '3']
    const pathParts = pathname.split('/');
    
    try {
        // 1 & 3. Xử lý Routes cho /products (GET, POST)
        if (pathname === '/products' || pathname === '/products/') {
            
            // GET /products và GET /products?limit=N
            if (method === 'GET') {
                const limitParam = parsedUrl.searchParams.get('limit');
                let result = products;

                if (limitParam !== null) {
                    const limit = Number(limitParam);
                    result = products.slice(0, limit);
                }

                res.writeHead(200);
                return res.end(JSON.stringify(result));
            }

            // POST /products
            if (method === 'POST') {
                const body = await parseBody(req);
                
                // Bẫy ID: Bỏ qua ID client gửi lên (nếu có), sử dụng autoId và tăng dần
                const newProduct = {
                    ...body,
                    id: autoId++
                };
                
                products.push(newProduct);
                res.writeHead(201);
                return res.end(JSON.stringify(newProduct));
            }
        }

        // 2, 4 & 5. Xử lý Routes cho /products/:id (GET, PUT, PATCH, DELETE)
        if (pathParts.length === 3 && pathParts[1] === 'products') {
            const id = Number(pathParts[2]); // Bẫy ID: Ép kiểu chuỗi sang số
            const index = products.findIndex(p => p.id === id);

            // Xử lý chung: Nếu không tìm thấy index thì trả về 404 cho mọi method
            if (index === -1) {
                res.writeHead(404);
                return res.end(JSON.stringify({ message: 'Product not found' }));
            }

            // GET /products/:id
            if (method === 'GET') {
                res.writeHead(200);
                return res.end(JSON.stringify(products[index]));
            }

            // PUT /products/:id (Thay thế toàn bộ, giữ lại ID)
            if (method === 'PUT') {
                const body = await parseBody(req);
                
                // Bẫy PUT: Mất hết các trường cũ, chỉ giữ dữ liệu mới và ID cứng
                products[index] = { ...body, id: id };
                
                res.writeHead(200);
                return res.end(JSON.stringify(products[index]));
            }

            // PATCH /products/:id (Chỉ cập nhật trường truyền lên, giữ nguyên trường cũ)
            if (method === 'PATCH') {
                const body = await parseBody(req);
                
                // Bẫy PATCH: Trộn dữ liệu cũ và mới, ghim cứng ID
                products[index] = { ...products[index], ...body, id: id };
                
                res.writeHead(200);
                return res.end(JSON.stringify(products[index]));
            }

            // DELETE /products/:id
            if (method === 'DELETE') {
                // Bẫy xóa mảng: Đã kiểm tra index !== -1 ở trên nên an toàn sử dụng splice
                products.splice(index, 1);
                
                // Bẫy 204: Tuyệt đối không gửi body kèm theo
                res.writeHead(204);
                return res.end();
            }
        }

        // 6. Các Route khác không khớp -> 404
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Route not found' }));

    } catch (error) {
        // Bắt lỗi cú pháp JSON (Try-Catch từ hàm parseBody)
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