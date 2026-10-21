const fs = require('fs');
const path = require('path');

// Sửa lại từ '../../data/products.json' thành '../data/products.json' cho đúng cấu trúc thực tế
const filePath = path.join(__dirname, '../data/products.json');

const productRepository = {
    load: () => {
        try {
            if (!fs.existsSync(filePath)) {
                // Đảm bảo thư mục data tồn tại nếu chưa có
                const dir = path.dirname(filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(filePath, JSON.stringify([]));
                return [];
            }
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data || '[]');
        } catch (error) {
            console.error('Lỗi khi đọc file JSON:', error);
            return [];
        }
    },

    save: (products) => {
        try {
            fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
        } catch (error) {
            console.error('Lỗi khi ghi file JSON:', error);
        }
    },

    findAll: function () {
        return this.load();
    },

    findById: function (id) {
        const products = this.load();
        return products.find(p => p.id === id);
    },

    findIndexById: function (id) {
        const products = this.load();
        return products.findIndex(p => p.id === id);
    },

    create: function (data) {
        const products = this.load();
        const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
        const newProduct = {
            ...data,
            id: maxId + 1
        };

        products.push(newProduct);
        this.save(products);
        return newProduct;
    },

    updatePut: function (index, id, data) {
        const products = this.load();
        products[index] = { ...data, id: id };
        this.save(products);
        return products[index];
    },

    updatePatch: function (index, id, data) {
        const products = this.load();
        products[index] = { ...products[index], ...data, id: id };
        this.save(products);
        return products[index];
    },

    deleteByIndex: function (index) {
        const products = this.load();
        products.splice(index, 1);
        this.save(products);
    }
};

module.exports = productRepository;