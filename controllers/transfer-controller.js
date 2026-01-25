import TransferModel from '../models/transfer-model.js';
import Response from '../helpers/response-helper.js';

class TransferController {
    static async index(req, res) {
        try {
            const data = await TransferModel.index(req.user.user_id);
            res.json(Response.success({ data, message: "Berhasil mendapatkan data transfer" }));
        } catch (err) {
            res.status(500).json(Response.failed(err.message));
        }
    }

    static async createTransfer(req, res) {
        try {
            req.body.user_id = req.user.user_id;
            const data = await TransferModel.createTransfer(req.body);
            res.json(Response.success({ data, message: "Berhasil melakukan transfer" }));
        } catch (err) {
            res.status(err.statusCode || 500).json(Response.failed(err.message));
        }
    }
}

export default TransferController;
