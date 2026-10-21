const productService = require('../services/productService');
const parseBody = require('../utils/bodyParser');

const productController = {
    getProducts: async (req, res, parsedUrl) => {
        const limitParam = parsedUrl.searchParams.get('limit');
        const result = productService.getAllProducts(limitParam);
        res.writeHead(200);
        res.end(JSON.stringify(result));
    },

    createProduct: async (req, res) => {
        const body = await parseBody(req);
        const newProduct = productService.createProduct(body);
        res.writeHead(201);
        res.end(JSON.stringify(newProduct));
    },

    getProductById: async (req, res, id) => {
        const product = productService.getProductById(id);
        res.writeHead(200);
        res.end(JSON.stringify(product));
    },

    updateProductPut: async (req, res, id) => {
        const body = await parseBody(req);
        const updatedProduct = productService.replaceProduct(id, body);
        res.writeHead(200);
        res.end(JSON.stringify(updatedProduct));
    },

    updateProductPatch: async (req, res, id) => {
        const body = await parseBody(req);
        const updatedProduct = productService.updateProductPartial(id, body);
        res.writeHead(200);
        res.end(JSON.stringify(updatedProduct));
    },

    deleteProduct: async (req, res, id) => {
        productService.deleteProduct(id);
        // Bẫy 204: Tuyệt đối không gửi body kèm theo
        res.writeHead(204);
        res.end();
    }
};

module.exports = productController;