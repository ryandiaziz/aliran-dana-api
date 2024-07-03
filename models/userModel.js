import DbUtils from "../helpers/DbUtils.js";

class UserModel {    
    static TABLE_NAME = "users";
    static ID_NAME = "user_id";

    static async index(pageSize = 0, page = 1) {
        return DbUtils.index(this.TABLE_NAME);
    }

    static async getOneUser(id){
        return DbUtils.getOne(this.TABLE_NAME, this.ID_NAME, id);        
    }
    
    static async createUser(name, balance) {
        const query = {
            text: `INSERT INTO ${this.TABLE_NAME}(account_name, account_balance, created_at, updated_at) VALUES($1,$2, NOW(), NOW()) RETURNING *`,
            values: [name, balance]
        }
        
        return DbUtils.createAndUpdate(query);
    }

    static async updateUser(id, name) {
        const query = {
            text: `UPDATE ${this.TABLE_NAME} SET account_name = $1, updated_at = NOW() WHERE ${this.ID_NAME} = $2 RETURNING *`,
            values: [name, id]
        }

        return DbUtils.createAndUpdate(query);        
    }

    static async deleteUser(id) {
        return DbUtils.delete(this.TABLE_NAME, this.ID_NAME, id);        
    }
}

export default UserModel