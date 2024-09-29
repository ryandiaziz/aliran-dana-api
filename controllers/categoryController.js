import CategoryModel from '../models/categoryModel.js';
import Response from '../helpers/response.js';

class CategoryController {
    static async index(req, res) {
        try {
            // const { pageSize, page } = req.query
            const data = await CategoryModel.index();

            res.json(Response.success(data, "Berhasil mendapatkan data category"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async getOneCategory(req, res) {
        try {
            const { id } = req.params
            const data = await CategoryModel.getOneCategory(id);

            const check = await CategoryModel.getOneCategory(id);

            if (!check) {
                throw new Error('item not found')
            }

            res.json(Response.success(data, "Berhasil mendapatkan category"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async createCategory(req, res) {
        try {
            const response = await CategoryModel.createCategory({...req.body});

            res.json(Response.success(response, "Berhasil menambahkan data category"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async updateCategory(req, res) {
        try {
            const { category_id, category_name, category_type } = req.body

            const check = await CategoryModel.getOneCategory(category_id);
            if (!check) {
                throw new Error('item not found')
            }
            const data = await CategoryModel.updateCategory({category_id, category_name, category_type})

            res.json(Response.success(data, "Berhasil memperbarui data category"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async deleteCategory(req, res) {
        try {
            const { id } = req.params;            
            const check = await CategoryModel.getOneCategory(id);

            if (!check) {
                throw new Error('item not found');
            }

            const response = await CategoryModel.deleteCategory(id);
            res.json(Response.success(response, "Berhasil menghapus data category"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

}

export default CategoryController;