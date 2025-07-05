import DbUtils from "../helpers/db-helper.js";

class AccountModel {
    static TABLE_NAME = "accounts";
    static ID_NAME = "account_id";

    static async index(userId, pageSize = 0, page = 1) {
        return DbUtils.indexWithUserId({
            tableName: this.TABLE_NAME,
            userId: userId,
            order: `ORDER BY ${this.ID_NAME}`
        });
    }

    static async getOneAccount(id) {
        return DbUtils.getOneById(this.TABLE_NAME, this.ID_NAME, id);
    }

    static async createAccount(account_name, account_balance, user_id) {
        const query = {
            text: `INSERT INTO ${this.TABLE_NAME}(account_name, account_balance, user_id, created_at, updated_at) VALUES($1, $2, $3, NOW(), NOW()) RETURNING *`,
            values: [account_name, account_balance, user_id]
        }
        return DbUtils.createAndUpdate(query);
    }

    static async updateAccount(account_id, account_name, account_balance) {
        const account = await DbUtils.getOneById(this.TABLE_NAME, this.ID_NAME, account_id);

        if (!account_name) account_name = account.account_name;
        if (!account_balance) account_balance = account.account_balance;

        const query = {
            text: `UPDATE ${this.TABLE_NAME} SET account_name = $1, account_balance = $2, updated_at = NOW() WHERE ${this.ID_NAME} = $3 RETURNING *`,
            values: [account_name, account_balance, account_id]
        }

        return DbUtils.createAndUpdate(query);
    }

    static async transactionAccount(id, transaction_amount, transaction_type) {
        const account = await DbUtils.getOneById(this.TABLE_NAME, this.ID_NAME, id);

        switch (transaction_type) {
            case 'income':
                account.account_balance += transaction_amount;
                break;
            case 'expense':
                account.account_balance -= transaction_amount;
                break;
            case 'incoming_transfer':
                account.account_balance += transaction_amount;
                break;
            case 'outgoing_transfer':
                account.account_balance -= transaction_amount;
                break;
            default:
                break;
        }

        const query = {
            text: `UPDATE ${this.TABLE_NAME} SET account_balance = $1, updated_at = NOW() WHERE ${this.ID_NAME} = $2 RETURNING *`,
            values: [account.account_balance, id]
        }

        return DbUtils.createAndUpdate(query);
    }

    static async deleteAccount(id) {
        return DbUtils.delete(this.TABLE_NAME, this.ID_NAME, id);
    }

    static async countTotalBalance(userId) {
        return DbUtils.totalAccountBalance(userId);
    }
}

export default AccountModel