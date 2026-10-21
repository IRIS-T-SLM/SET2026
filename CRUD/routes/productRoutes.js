const productController = require('../controllers/productController');

const handleProductRoutes = async (req, res, parsedUrl) => {
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const pathParts = pathname.split('/');

    if (pathname === '/products' || pathname === '/products/') {
        if (method === 'GET') {
            await productController.getProducts(req, res, parsedUrl);
            return true; // Báo cho server biết route đã được xử lý xong
        }
        if (method === 'POST') {
            await productController.createProduct(req, res);
            return true;
        }
    }

    if (pathParts.length === 3 && pathParts[1] === 'products') {
        const id = Number(pathParts[2]);

        if (method === 'GET') {
            await productController.getProductById(req, res, id);
            return true;
        }
        if (method === 'PUT') {
            await productController.updateProductPut(req, res, id);
            return true;
        }
        if (method === 'PATCH') {
            await productController.updateProductPatch(req, res, id);
            return true;
        }
        if (method === 'DELETE') {
            await productController.deleteProduct(req, res, id);
            return true;
        }
    }

    return false; // Route không khớp
};

module.exports = handleProductRoutes;