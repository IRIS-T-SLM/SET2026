const productService = require('../services/productService');

// Hàm bổ trợ validate dữ liệu đâù vào
const validateProductData = (data, isPatch = false) => {
    if (!isPatch && Object.keys(data).length === 0) {
        throw { status: 400, message: 'Bad Request: Request body cannot be empty' };
    }
    if (data.price !== undefined) {
        if (typeof data.price !== 'number' || data.price < 0) {
            throw { status: 400, message: 'Bad Request: Price must be a non-negative number' };
        }
    }
};

const productController = {
    getProducts: async (req, res, parsedUrl) => {
        const limitParam = parsedUrl.searchParams.get('limit');
        const result = productService.getAllProducts(limitParam);
        res.writeHead(200);
        res.end(JSON.stringify(result));
    },

    createProduct: async (req, res) => {
        validateProductData(req.body);
        const newProduct = productService.createProduct(req.body);
        res.writeHead(201);
        res.end(JSON.stringify(newProduct));
    },

    getProductById: async (req, res, id) => {
        const product = productService.getProductById(id);
        res.writeHead(200);
        res.end(JSON.stringify(product));
    },

    updateProductPut: async (req, res, id) => {
        validateProductData(req.body);
        const updatedProduct = productService.replaceProduct(id, req.body);
        res.writeHead(200);
        res.end(JSON.stringify(updatedProduct));
    },

    updateProductPatch: async (req, res, id) => {
        validateProductData(req.body, true);
        const updatedProduct = productService.updateProductPartial(id, req.body);
        res.writeHead(200);
        res.end(JSON.stringify(updatedProduct));
    },

    deleteProduct: async (req, res, id) => {
        productService.deleteProduct(id);
        res.writeHead(204);
        res.end();
    }
};

module.exports = productController;