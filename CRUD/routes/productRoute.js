const productController = require('../controllers/productController');

const handleProductRoutes = async (req, res, parsedUrl) => {
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const pathParts = pathname.split('/');

    // Routes cho /products
    if (pathname === '/products' || pathname === '/products/') {
        if (method === 'GET') {
            return await productController.getProducts(req, res, parsedUrl);
        }
        if (method === 'POST') {
            return await productController.createProduct(req, res);
        }
    }

    // Routes cho /products/:id
    if (pathParts.length === 3 && pathParts[1] === 'products') {
        const id = Number(pathParts[2]); // Ép kiểu chuỗi sang số

        if (method === 'GET') {
            return await productController.getProductById(req, res, id);
        }
        if (method === 'PUT') {
            return await productController.updateProductPut(req, res, id);
        }
        if (method === 'PATCH') {
            return await productController.updateProductPatch(req, res, id);
        }
        if (method === 'DELETE') {
            return await productController.deleteProduct(req, res, id);
        }
    }

    // Trả về false nếu route không khớp
    return false;
};

module.exports = handleProductRoutes;