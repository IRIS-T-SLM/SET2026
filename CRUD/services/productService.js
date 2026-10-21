const productRepository = require('../repositories/productRepository');

const productService = {
    getAllProducts: (limitParam) => {
        let result = productRepository.findAll();

        if (limitParam !== null && limitParam !== undefined) {
            const limit = Number(limitParam);
            
            // Validate query param: limit phải là số nguyên dương >= 0
            if (isNaN(limit) || !Number.isInteger(limit) || limit < 0) {
                throw { status: 400, message: 'Bad Request: Limit must be a non-negative integer' };
            }
            
            result = result.slice(0, limit);
        }
        return result;
    },

    getProductById: (id) => {
        const product = productRepository.findById(id);
        if (!product) {
            throw { status: 404, message: 'Product not found' };
        }
        return product;
    },

    createProduct: (data) => {
        return productRepository.create(data);
    },

    replaceProduct: (id, data) => {
        const index = productRepository.findIndexById(id);
        if (index === -1) {
            throw { status: 404, message: 'Product not found' };
        }
        return productRepository.updatePut(index, id, data);
    },

    updateProductPartial: (id, data) => {
        const index = productRepository.findIndexById(id);
        if (index === -1) {
            throw { status: 404, message: 'Product not found' };
        }
        return productRepository.updatePatch(index, id, data);
    },

    deleteProduct: (id) => {
        const index = productRepository.findIndexById(id);
        if (index === -1) {
            throw { status: 404, message: 'Product not found' };
        }
        productRepository.deleteByIndex(index);
    }
};

module.exports = productService;