import UserModel from '../models/userModel.js';
import Response from '../helpers/response.js';

class UserController {
    static async index(req, res) {
        try {
            // const { pageSize, page } = req.query
            const data = await UserModel.index();

            res.json(Response.success(data, "Berhasil mendapatkan data user"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async getOneUser(req, res) {
        try {
            const { id } = req.params
            const data = await UserModel.getOneUser(id);

            if (!data) {
                throw new Error('User tidak ditemukan')
            }

            res.json(Response.success(data, "Berhasil mendapatkan user"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async createUser(req, res) {
        try {
            const { name, balance } = req.body;
            const response = await UserModel.createUser(name, balance);

            res.json(Response.success(response, "Berhasil menambahkan data user"));
        } catch (error) {
            res.json(Response.failed(err.message));
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params
            const { name } = req.body

            const check = await UserModel.getOneUser(id);

            if (!check) {
                throw new Error('User tidak ditemukan')
            }
            const data = await UserModel.updateUser(id, name)

            res.json(Response.success(data, "Berhasil memperbarui data user"));
        } catch (error) {
            res.json(Response.failed(err.message));
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;            
            const check = await UserModel.getOneAccount(id);

            if (!check) {
                throw new Error('User tidak ditemukan');
            }

            const response = await UserModel.deleteUser(id);
            res.json(Response.success(response, "Berhasil menghapus data user"));
        } catch (error) {
            res.json(Response.failed(err.message));
        }
    }

}

export default UserController