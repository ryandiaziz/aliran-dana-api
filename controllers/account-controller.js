import AccountModel from '../models/account-model.js';
import Response from '../helpers/response-helper.js';

class AccountController {
    static async index(req, res) {
        try {
            const userId = req.user.user_id;
            const accounts = await AccountModel.index(userId);
            const { total } = await AccountModel.countTotalBalance(userId);

            res.json(
                Response.success({
                    data: {
                        total: parseInt(total),
                        accounts
                    },
                    message: "Berhasil mendapatkan data user"
                })
            );
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async getOneAccount(req, res) {
        try {
            const { id } = req.params
            const data = await AccountModel.getOneAccount(id);
            const check = await AccountModel.getOneAccount(id);

            if (!check) throw new Error('item not found');

            res.json(
                Response.success({
                    data,
                    message: "Berhasil mendapatkan account"
                })
            );
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async createAccount(req, res) {
        try {
            const { account_name, account_balance } = req.body;
            const user_id = req.user.user_id;
            const response = await AccountModel.createAccount(account_name, account_balance, user_id);

            res.json(
                Response.success({
                    data: response,
                    message: "Berhasil menambahkan data account"
                })
            );
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async updateAccount(req, res) {
        try {
            const { account_id, account_name, account_balance } = req.body
            const check = await AccountModel.getOneAccount(account_id);

            if (!check) throw new Error('item not found');

            const data = await AccountModel.updateAccount(account_id, account_name, account_balance)

            res.json(
                Response.success({
                    data,
                    message: "Berhasil memperbarui data account"
                })
            );
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async deleteAccount(req, res) {
        try {
            const { id } = req.params;
            const check = await AccountModel.getOneAccount(id);

            if (!check) throw new Error('item not found');

            const response = await AccountModel.deleteAccount(id);

            res.json(
                Response.success({
                    data: response,
                    message: "Berhasil menghapus data account"
                })
            );
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }
}

export default AccountController;