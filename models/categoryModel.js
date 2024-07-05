import DbUtils from "../helpers/DbUtils.js";

class CategoryModel {    
    static TABLE_NAME = "categories";
    static ID_NAME = "category_id";

    static async index(pageSize = 0, page = 1) {
        return DbUtils.index(this.TABLE_NAME);
    }

    static async getOneCategory(id){
        return DbUtils.getOne(this.TABLE_NAME, this.ID_NAME, id);
    }
    
    static async createCategory(name, balance, user_id) {
        const query = {
            text: `INSERT INTO ${this.TABLE_NAME}(account_name, account_balance, user_id, created_at, updated_at) VALUES($1, $2, $3, NOW(), NOW()) RETURNING *`,
            values: [name, balance, user_id]
        }
        
        return DbUtils.createAndUpdate(query);
    }

    static async updateCategory(id, account_name, account_balance) {
        const account = await DbUtils.getOne(this.TABLE_NAME, this.ID_NAME, id);
        
        console.log(account);
        
        if (!account_name) {
            account_name = account.account_name;
        }

        if (!account_balance) {
            account_balance = account.account_balance;
        }
        
        const query = {
            text: `UPDATE ${this.TABLE_NAME} SET account_name = $1, account_balance = $2, updated_at = NOW() WHERE ${this.ID_NAME} = $3 RETURNING *`,
            values: [account_name, account_balance, id]
        }
        
        return DbUtils.createAndUpdate(query);        
    }

    static async deleteCategory(id) {
        return DbUtils.delete(this.TABLE_NAME, this.ID_NAME, id);        
    }
}

export default CategoryModel