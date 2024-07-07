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
    
    static async createCategory({category_name, category_type, user_id}) {
        const query = {
            text: `INSERT INTO ${this.TABLE_NAME}(category_name, category_type, user_id, created_at, updated_at) VALUES($1, $2, $3, NOW(), NOW()) RETURNING *`,
            values: [category_name, category_type, user_id]
        }
        
        return DbUtils.createAndUpdate(query);
    }

    static async updateCategory({category_name, category_type, id}) {
        const category = await DbUtils.getOne(this.TABLE_NAME, this.ID_NAME, id);
        
        console.log(category);
        
        if (!category_name) {
            category_name = category.category_name;
        }

        if (!category_type) {
            category_type = category.category_type;
        }
        
        const query = {
            text: `UPDATE ${this.TABLE_NAME} SET category_name = $1, category_type = $2, created_at =  $3, updated_at = NOW() WHERE ${this.ID_NAME} = $4 RETURNING *`,
            values: [category_name, category_type, category.created_at, id]
        }
        
        return DbUtils.createAndUpdate(query);        
    }

    static async deleteCategory(id) {
        return DbUtils.delete(this.TABLE_NAME, this.ID_NAME, id);        
    }
}

export default CategoryModel