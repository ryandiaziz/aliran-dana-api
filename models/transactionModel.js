import DbUtils from "../helpers/DbHelper.js";
import AccountModel from "./accountModel.js";

class TransactionModel {
    static TABLE_NAME = "transactions";
    static ID_NAME = "transaction_id";

    static async index(pageSize = 0, page = 1) {
        const query = `
            SELECT
                t.transaction_id,
                t.transaction_note,
                t.transaction_amount,
                t.transaction_type,
                t.transaction_date,
                a.account_id,
                a.account_name,
                c.category_id,
                c.category_name
            FROM 
                transactions t
            JOIN 
                accounts a ON t.account_id = a.account_id
            JOIN 
                categories c ON t.category_id = c.category_id
            ORDER BY t.transaction_id DESC;
        `

        return DbUtils.indexQuery(query);
    }

    static async getOneTransaction(id) {
        return DbUtils.getOneById(this.TABLE_NAME, this.ID_NAME, id);
    }

    static async createTransaction({
        transaction_note,
        transaction_amount,
        transaction_type,
        transaction_date,
        user_id,
        category_id,
        account_id
    }) {
        await AccountModel.transactionAccount(account_id, transaction_amount, transaction_type);

        const query = {
            text: `INSERT INTO ${this.TABLE_NAME}(transaction_note, transaction_amount, transaction_type, transaction_date, user_id, category_id, account_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
            values: [transaction_note, transaction_amount, transaction_type, transaction_date, user_id, category_id, account_id]
        }

        return DbUtils.createAndUpdate(query);
    }

    static async updateTransaction({
        transaction_note,
        transaction_amount,
        transaction_type,
        transaction_date,
        category_id,
        account_id,
        id
    }) {
        const transaction = await DbUtils.getOneById(this.TABLE_NAME, this.ID_NAME, id);

        if (!transaction_note) transaction_note = transaction.transaction_note;
        if (!transaction_amount) transaction_amount = transaction.transaction_amount;
        if (!transaction_type) transaction_type = transaction.transaction_type;
        if (!transaction_date) transaction_date = transaction.transaction_date;
        if (!category_id) category_id = transaction.category_id;
        if (!account_id) account_id = transaction.account_id;

        const query = {
            text: `UPDATE ${this.TABLE_NAME} SET transaction_note = $1, transaction_amount = $2, transaction_type = $3, transaction_date = $4, category_id = $5, account_id = $6, created_at =  $7, updated_at = NOW() WHERE ${this.ID_NAME} = $8 RETURNING *`,
            values: [transaction_note, transaction_amount, transaction_type, transaction_date, category_id, account_id, transaction.created_at, id]
        }

        return DbUtils.createAndUpdate(query);
    }

    static async deleteTransaction(id) {
        return DbUtils.delete(this.TABLE_NAME, this.ID_NAME, id);
    }

    static async searchTransaction(filters) {
        return DbUtils.searchByFilters(filters);
    }

    static async countTransactionIncomeAndExpense(filters) {
        return DbUtils.countIncomeAndExpense(filters);
    }
}

export default TransactionModel