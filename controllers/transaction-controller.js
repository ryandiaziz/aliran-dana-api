import TransactionModel from '../models/transaction-model.js';
import Parser from '../helpers/parser-helper.js';
import Response from '../helpers/response-helper.js';
import CustomError from '../helpers/custom-error-helper.js';

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

            res.json(
                Response.success({
                    data: results,
                    message: "Berhasil mendapatkan data transaksi"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async getOneTransaction(req, res) {
        try {
            const { id } = req.params
            const data = await TransactionModel.getOneTransaction(id);
            const check = await TransactionModel.getOneTransaction(id);

            if (!check) throw new CustomError('Transaction not found', 404);

            res.json(
                Response.success({
                    data,
                    message: "Berhasil mendapatkan transaksi"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async createTransaction(req, res) {
        try {
            req.body.user_id = req.user.user_id;
            const response = await TransactionModel.createTransaction({ ...req.body });

            res.json(
                Response.success({
                    data: response,
                    message: "Berhasil menambahkan data transaksi"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async updateTransaction(req, res) {
        try {
            const { id } = req.params;
            const check = await TransactionModel.getOneTransaction(id);

            if (!check) throw new CustomError('Transaction not found', 404);

            const data = await TransactionModel.updateTransaction({ ...req.body, id })

            res.json(
                Response.success({
                    data,
                    message: "Berhasil memperbarui data transaksi"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async deleteTransaction(req, res) {
        try {
            const { id } = req.params;
            const check = await TransactionModel.getOneTransaction(id);

            if (!check) throw new CustomError('Transaction not found', 404);

            const response = await TransactionModel.deleteTransaction(id);

            res.json(
                Response.success({
                    data: response,
                    message: "Berhasil menghapus data transaksi"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }

    static async filterTransaction(req, res) {
        try {
            req.body.user_id = req.user.user_id;
            const filters = Parser.parserTransactionFilters(req.body);
            const response = await TransactionModel.searchTransaction(filters);
            const { total_income, total_expense } = await TransactionModel.countTransactionIncomeAndExpense(filters);

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

            res.json(
                Response.success({
                    data: { count, transactions },
                    message: "Berhasil mendapatkan data transaksi"
                })
            );
        } catch (err) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }
}

export default TransactionController;