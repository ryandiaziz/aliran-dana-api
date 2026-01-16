import AppSettingModel from '../models/app-setting-model.js';
import Response from '../helpers/response-helper.js';

class AppSettingController{
    static async index(req, res){
        try {
            const setting = await AppSettingModel.index();

            res.json(
                Response.success({
                    data: setting,
                    message: "Berhasil mendapatkan data settings"
                })
            );
        } catch (error) {
            res
                .status(err.statusCode || 500)
                .json(Response.failed(err.message || 'Something went wrong.'));
        }
    }
}

export default AppSettingController;