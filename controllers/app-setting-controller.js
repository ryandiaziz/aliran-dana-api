import AppSettingModel from '../models/app-setting-model.js';
import Response from '../helpers/response-helper.js';

class AppSettingController{
    static async index(req, res) {
        try {
            const data = await AppSettingModel.getAllSettings();
            res.json(Response.success({ data, message: "Berhasil mendapatkan pengaturan aplikasi" }));
        } catch (err) {
            res.status(500).json(Response.failed(err.message));
        }
    }

    static async updateSettings(req, res) {
        try {
            const settings = req.body; // Expect object { app_name: 'New Name', maintenance_mode: true }
            const keys = Object.keys(settings);
            
            const updatedData = {};

            for (const key of keys) {
                let value = settings[key];
                let type = 'string';
                
                if (typeof value === 'boolean') type = 'boolean';
                else if (typeof value === 'number') type = 'number';

                await AppSettingModel.saveSetting(key, value, type);
                updatedData[key] = value;
            }

            res.json(Response.success({ data: updatedData, message: "Berhasil memperbarui pengaturan" }));
        } catch (err) {
            res.status(500).json(Response.failed(err.message));
        }
    }
}

export default AppSettingController;