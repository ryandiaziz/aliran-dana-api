import TransactionModel from '../models/transactionModel.js';
import Response from '../helpers/response.js';

class TransactionController {
    static async index(req, res) {
        try {
            // const { pageSize, page } = req.query
            const data = await TransactionModel.index();

            res.json(Response.success(data, "Berhasil mendapatkan data transaksi"));
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
            const response = await TransactionModel.createTransaction({...req.body});

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
            const data = await TransactionModel.updateTransaction({...req.body, id})

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

}

export default TransactionController;