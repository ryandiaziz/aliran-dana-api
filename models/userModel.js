import DbUtils from "../helpers/DbHelper.js";

class UserModel {
    static TABLE_NAME = "users";
    static ID_NAME = "user_id";

    static async index(pageSize = 0, page = 1) {
        return DbUtils.index({
            tableName: this.TABLE_NAME,
            order: `ORDER BY ${this.ID_NAME}`
        });
    }

    static async getOneUserById(id) {
        return DbUtils.getOneById(this.TABLE_NAME, this.ID_NAME, id);
    }

    static async countUser(){
        return DbUtils.countRows(this.TABLE_NAME);
    }

    static async getOneUserByEmail(value) {
        return DbUtils.getOneCustom({
            table_name: this.TABLE_NAME,
            column_name: 'email',
            value
        });
    }

    static async createUser({ username, email, password }) {
        const query = {
            text: `INSERT INTO ${this.TABLE_NAME}(username, email, password, created_at, updated_at) VALUES($1, $2, $3, NOW(), NOW()) RETURNING *`,
            values: [username, email, password]
        }

        return DbUtils.createAndUpdate(query);
    }

    static async updateUser({ username, email, password, id }) {
        const user = await DbUtils.getOneById(this.TABLE_NAME, this.ID_NAME, id);
        if (!username) username = user.username;
        if (!email) email = user.email;
        if (!password) password = user.password;

        const query = {
            text: `
                UPDATE ${this.TABLE_NAME}
                SET username = $1, email = $2, password = $3, updated_at = NOW()
                WHERE ${this.ID_NAME} = $4 RETURNING *
                `,

            values: [username, email, password, id]
        };

        return DbUtils.createAndUpdate(query);
    }

    static async deleteUser(id) {
        return DbUtils.delete(this.TABLE_NAME, this.ID_NAME, id);
    }
}

export default UserModel