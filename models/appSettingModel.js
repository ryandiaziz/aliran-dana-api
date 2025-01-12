import DbUtils from "../helpers/DbHelper.js";

class AppSettingModel {
    static TABLE_NAME = "app_settings";

    static async index(userId, pageSize = 0, page = 1) {
        return DbUtils.index({
            tableName: this.TABLE_NAME,
        });
    }
}

export default AppSettingModel;