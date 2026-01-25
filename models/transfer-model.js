import DbUtils from "../helpers/db-helper.js";
import AccountModel from "./account-model.js";

class TransferModel {
    static TABLE_NAME = "transfers";
    static ID_NAME = "transfer_id";

    static async createTransfer({
        source_account_id,
        destination_account_id,
        amount,
        admin_fee,
        note,
        user_id,
        transaction_date,
        category_id // For the 'transfer' category expense/income logging
    }) {
        return DbUtils.executeTransaction(async () => {
            // 1. Create Parent Transfer Record
            const transferQuery = {
                text: `INSERT INTO transfers(source_account_id, destination_account_id, amount, admin_fee, note, user_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
                values: [source_account_id, destination_account_id, amount, admin_fee, note, user_id]
            };
            const transferRes = await DbUtils.createAndUpdate(transferQuery);
            const transferId = transferRes.transfer_id;

            // 2. Ledger Entries (Transactions table) & Balance Updates
            
            // A. Source Account: Link to Parent Transfer, Decrease Balance
            await AccountModel.transactionAccount(source_account_id, amount, 'outgoing_transfer');
            
            // B. Destination Account: Link to Parent Transfer, Increase Balance
            await AccountModel.transactionAccount(destination_account_id, amount, 'incoming_transfer');

            // C. Admin Fee (if exists) -> Expense on Source + Record in Transactions
            if (admin_fee > 0) {
                await AccountModel.transactionAccount(source_account_id, admin_fee, 'expense');
                const feeTxQuery = {
                    text: `INSERT INTO transactions(transaction_note, transaction_amount, transaction_type, transaction_date, user_id, category_id, account_id, transfer_id, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
                    values: [`Admin Fee for Transfer #${transferId}`, admin_fee, 'expense', transaction_date, user_id, category_id, source_account_id, transferId]
                };
                await DbUtils.createAndUpdate(feeTxQuery);
            }

            return transferRes;
        });
    }

    static async index(userId) {
        return DbUtils.indexWithUserId({
            tableName: this.TABLE_NAME,
            userId,
            order: `ORDER BY created_at DESC`
        });
    }
}

export default TransferModel;
