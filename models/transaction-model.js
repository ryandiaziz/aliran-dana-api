import DbUtils from "../helpers/db-helper.js";
import AccountModel from "./account-model.js";

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
        account_id,
        destination_account_id
    }) {
        await DbUtils.executeTransaction(async () => {
             if (transaction_type === 'transfer') {
                if (!destination_account_id) throw new CustomError("Destination account is required for transfer", 400);
                if (account_id === destination_account_id) throw new CustomError("Cannot transfer to the same account", 400);

                // 1. Debit Source
                await AccountModel.transactionAccount(account_id, transaction_amount, 'outgoing_transfer');
                // 2. Credit Destination
                await AccountModel.transactionAccount(destination_account_id, transaction_amount, 'incoming_transfer');
            } else {
                // Normal income/expense
                await AccountModel.transactionAccount(account_id, transaction_amount, transaction_type);
            }
        });

        // Insert Record
        const query = {
            text: `INSERT INTO ${this.TABLE_NAME}(transaction_note, transaction_amount, transaction_type, transaction_date, user_id, category_id, account_id, destination_account_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *`,
            values: [transaction_note, transaction_amount, transaction_type, transaction_date, user_id, category_id, account_id, destination_account_id || null]
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

    static async getCategorySummary(userId, startDate, endDate, type = 'expense') {
        const query = {
            text: `
                SELECT 
                    c.category_name, 
                    SUM(t.transaction_amount) as total
                FROM transactions t
                JOIN categories c ON t.category_id = c.category_id
                WHERE t.user_id = $1 
                AND t.transaction_type = $2
                AND t.transaction_date BETWEEN $3 AND $4
                GROUP BY c.category_name
                ORDER BY total DESC
            `,
            values: [userId, type, startDate, endDate]
        };
        return DbUtils.indexQuery(query);
    }

    static async getMonthlyTrend(userId, year) {
        const query = {
            text: `
                SELECT 
                    EXTRACT(MONTH FROM t.transaction_date) as month,
                    SUM(CASE WHEN t.transaction_type = 'income' THEN t.transaction_amount ELSE 0 END) as total_income,
                    SUM(CASE WHEN t.transaction_type = 'expense' THEN t.transaction_amount ELSE 0 END) as total_expense
                FROM transactions t
                WHERE t.user_id = $1 
                AND EXTRACT(YEAR FROM t.transaction_date) = $2
                GROUP BY month
                ORDER BY month ASC
            `,
            values: [userId, year]
        };
        return DbUtils.indexQuery(query);
    }
}

export default TransactionModel