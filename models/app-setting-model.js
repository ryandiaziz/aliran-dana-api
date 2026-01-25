import DbUtils from "../helpers/db-helper.js";

class AppSettingModel {
    static TABLE_NAME = "app_settings";

    // Returns object: { app_name: 'Aliran Dana', currency: 'Rp' }
    static async getAllSettings() {
        const rows = await DbUtils.index({ tableName: this.TABLE_NAME });
        const settings = {};
        rows.forEach(row => {
            // Simple type casting
            let value = row.setting_value;
            if (row.setting_type === 'boolean') value = (value === 'true');
            if (row.setting_type === 'number') value = Number(value);
            
            settings[row.setting_key] = value;
        });
        return settings;
    }

    // Upsert (Insert or Update if key exists)
    static async saveSetting(key, value, type = 'string') {
        const query = {
            text: `
                INSERT INTO ${this.TABLE_NAME} (setting_key, setting_value, setting_type, created_at, updated_at)
                VALUES ($1, $2, $3, NOW(), NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = $2, setting_type = $3, updated_at = NOW()
                RETURNING *
            `,
            values: [key, String(value), type]
        };
        return DbUtils.createAndUpdate(query);
    }
}

export default AppSettingModel;