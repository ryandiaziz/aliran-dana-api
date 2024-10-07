import TransactionModel from '../models/transactionModel.js';
import Response from '../helpers/response.js';

class TransactionController {
    static async index(req, res) {
        try {
            // const { pageSize, page } = req.query
            const data = await TransactionModel.index();

            const results = data.map((v, i) => {
                return {
                    transaction_id: v.transaction_id,
                    transaction_amount: v.transaction_amount,
                    transaction_type: v.transaction_type,
                    transaction_note: v.transaction_note,
                    transaction_date: v.transaction_date,
                    account: {
                        account_id: v.account_id,
                        account_name: v.account_name
                    },
                    category: {
                        category_id: v.category_id,
                        category_name: v.category_name
                    }
                }
            });

            res.json(Response.success(results, "Berhasil mendapatkan data transaksi"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async getOneTransaction(req, res) {
        try {
            const { id } = req.params
            const data = await TransactionModel.getOneTransaction(id);

            const check = await TransactionModel.getOneTransaction(id);

            if (!check) {
                throw new Error('item not found')
            }

            res.json(Response.success(data, "Berhasil mendapatkan transaksi"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async createTransaction(req, res) {
        try {
            const response = await TransactionModel.createTransaction({ ...req.body });

            res.json(Response.success(response, "Berhasil menambahkan data transaksi"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async updateTransaction(req, res) {
        try {
            const { id } = req.params;

            const check = await TransactionModel.getOneTransaction(id);
            if (!check) {
                throw new Error('item not found')
            }
            const data = await TransactionModel.updateTransaction({ ...req.body, id })

            res.json(Response.success(data, "Berhasil memperbarui data transaksi"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async deleteTransaction(req, res) {
        try {
            const { id } = req.params;
            const check = await TransactionModel.getOneTransaction(id);

            if (!check) {
                throw new Error('item not found');
            }

            const response = await TransactionModel.deleteTransaction(id);
            res.json(Response.success(response, "Berhasil menghapus data transaksi"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }

    static async searchTransaction(req, res) {
        try {
            const { date } = req.query;
            const response = await TransactionModel.searchTransaction(date);
            const { total_income, total_expense } = await TransactionModel.countTransactionIncomeAndExpense(date);

            const transactions = response.map((v, i) => {
                return {
                    transaction_id: v.transaction_id,
                    transaction_amount: v.transaction_amount,
                    transaction_type: v.transaction_type,
                    transaction_note: v.transaction_note,
                    transaction_date: v.transaction_date,
                    account: {
                        account_id: v.account_id,
                        account_name: v.account_name
                    },
                    category: {
                        category_id: v.category_id,
                        category_name: v.category_name
                    }
                }
            });

            const count = {
                expense: parseInt(total_expense),
                income: parseInt(total_income),
                total: parseInt(total_income) - parseInt(total_expense)
            }

            res.json(Response.success({ count, transactions }, "Berhasil mendapatkan data transaksi"));
        } catch (err) {
            res.json(Response.failed(err.message));
        }
    }
}

export default TransactionController;