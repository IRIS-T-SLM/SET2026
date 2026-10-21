let products = [];
let autoId = 1;

const productRepository = {
    findAll: () => {
        return products;
    },

    findById: (id) => {
        return products.find(p => p.id === id);
    },

    findIndexById: (id) => {
        return products.findIndex(p => p.id === id);
    },

    create: (data) => {
        const newProduct = {
            ...data,
            id: autoId++ // Bẫy ID: Tự động tăng và không gán lại ID đã xóa
        };
        products.push(newProduct);
        return newProduct;
    },

    updatePut: (index, id, data) => {
        // Bẫy PUT: Mất hết các trường cũ, chỉ giữ dữ liệu mới và ID cứng
        products[index] = { ...data, id: id };
        return products[index];
    },

    updatePatch: (index, id, data) => {
        // Bẫy PATCH: Trộn dữ liệu cũ và mới, ghim cứng ID
        products[index] = { ...products[index], ...data, id: id };
        return products[index];
    },

    deleteByIndex: (index) => {
        products.splice(index, 1);
    }
};

module.exports = productRepository;