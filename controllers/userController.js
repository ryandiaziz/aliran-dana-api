import UserModel from '../models/userModel.js';
import Response from '../helpers/responseHelper.js';
import CustomError from '../helpers/customErrorHelper.js';
import Parser from '../helpers/parserHelper.js';
import { decryptPass } from '../helpers/bcryptHelper.js';
import { generateToken } from '../helpers/jwtHelper.js';

class UserController {
    static async index(req, res) {
        try {
            // const { pageSize, page } = req.query
            const users = await UserModel.index();
            const usersWithoutPassword = Parser.excludeFieldsFromArray(users, ['password']);

            res.json(
                Response.success({
                    data: usersWithoutPassword,
                    message: "Berhasil mendapatkan data user"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async getOneUser(req, res) {
        try {
            const { id } = req.params;
            const userData = await UserModel.getOneUserById(id);

            if (!userData) throw new CustomError('User not found', 404);

            const userDataWithoutPassword = Parser.excludeFields(userData, ['password']);

            res.json(
                Response.success({
                    data: userDataWithoutPassword,
                    message: "Berhasil mendapatkan user"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async createUser(req, res) {
        try {
            const userData = await UserModel.createUser({ ...req.body });
            const userDataWithoutPassword = Parser.excludeFields(userData, ['password']);

            res.json(
                Response.success({
                    data: userDataWithoutPassword,
                    message: "Berhasil menambahkan data user"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params
            const userData = await UserModel.getOneUserById(id);

            if (!userData) throw new CustomError('User not found', 404);

            const resUpdateUser = await UserModel.updateUser({ ...req.body, id });
            const userDataWithoutPassword = Parser.excludeFields(resUpdateUser, ['password']);

            res.status(200).json(
                Response.success({
                    data: userDataWithoutPassword,
                    message: "Berhasil memperbarui data user"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const userData = await UserModel.getOneUserById(id);

            if (!userData) throw new CustomError('User not found', 404);

            const response = await UserModel.deleteUser(id);

            res.status(200).json(
                Response.success({
                    data: response,
                    message: "Berhasil menghapus data user"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const userData = await UserModel.getOneUserByEmail(email);

            if (!userData) throw new CustomError('User not found', 404);

            if (decryptPass({
                plainPass: password,
                hashPass: userData.password
            })) {
                const userDataWithoutPassword = Parser.excludeFields(userData, ['password']);
                const token = generateToken(userDataWithoutPassword);

                res.status(200).json(Response.success({ data: token }));
            } else {
                throw new CustomError('invalid password', 403);
            }
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }
}

export default UserController