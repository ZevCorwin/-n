// controllers/product.controller.js
const ProductModel = require('../models/product.model');

class ProductController {
    async getListProduct() {
        try {
            const products = await ProductModel.find();
            return products;
        } catch (error) {
            console.error('Error fetching product list:', error);
            throw error;
        }
    }

    async getProduct(id) {
        try {
            const product = await ProductModel.findById(id);
            return product;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    async createProduct(req, res) {
        try {
            const product = req.body;
            const newProduct = new ProductModel(product);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    async updateProduct(req, res) {
        try {
            const body = req.body;
            await ProductModel.findByIdAndUpdate(req.params.id, body);
            const product = await ProductModel.findById(req.params.id);
            return product;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(req, res) {
        try {
            const id = req.params.id;
            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            return deleteProduct;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    async getPaginatedProducts(page, productsPerPage) {
        try {
            const totalProducts = await ProductModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / productsPerPage);
            const products = await ProductModel.find()
                .skip((page - 1) * productsPerPage)
                .limit(productsPerPage);
            return { paginatedProducts: products, totalPages: totalPages };
        } catch (error) {
            console.error('Error in getPaginatedProducts:', error);
            throw error;
        }
    }

    async searchProducts(query) {
        try {
            const regex = new RegExp(query, 'i'); // 'i' để không phân biệt hoa thường
            const products = await ProductModel.find({ name: { $regex: regex } });
            return products;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }
}

module.exports = new ProductController();
