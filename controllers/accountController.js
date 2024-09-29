import AccountModel from '../models/accountModel.js';
import Response from '../helpers/response.js';

class AccountController {
    static async index(req, res) {
        try {
            // const { pageSize, page } = req.query
            const data = await AccountModel.index();

            res.json(Response.success(data, "Berhasil mendapatkan data account"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async getOneAccount(req, res) {
        try {
            const { id } = req.params
            const data = await AccountModel.getOneAccount(id);

            const check = await AccountModel.getOneAccount(id);

            if (!check) {
                throw new Error('item not found')
            }

            res.json(Response.success(data, "Berhasil mendapatkan account"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async createAccount(req, res) {
        try {
            const { name, balance, user_id } = req.body;
            const response = await AccountModel.createAccount(name, balance, user_id);

            res.json(Response.success(response, "Berhasil menambahkan data account"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async updateAccount(req, res) {
        try {
            const { account_id, account_name, account_balance } = req.body
            const check = await AccountModel.getOneAccount(account_id);

            if (!check) {
                throw new Error('item not found')
            }
            const data = await AccountModel.updateAccount(account_id, account_name, account_balance)

            res.json(Response.success(data, "Berhasil memperbarui data account"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async deleteAccount(req, res) {
        try {
            const { id } = req.params;            
            const check = await AccountModel.getOneAccount(id);

            if (!check) {
                throw new Error('item not found');
            }

            const response = await AccountModel.deleteAccount(id);
            res.json(Response.success(response, "Berhasil menghapus data account"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

}

export default AccountController