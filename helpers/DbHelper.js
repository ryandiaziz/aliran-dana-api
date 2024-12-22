import pool from "../configs/databaseConfig.js";

class DbUtils {
    static async index({ tableName, pageSize = 0, page = 1, order = '' }) {
        try {
            const queryDefault = {
                text: `SELECT * FROM ${tableName} ${order}`
            };

            const queryPagination = {
                text: `SELECT * FROM ${tableName} LIMIT $1 OFFSET $2 ${order}`,
                values: [pageSize, ((page - 1) * pageSize)]
            };

            const query = +pageSize === 0 ? queryDefault : queryPagination;

            const data = await pool.query(query);
            return data.rows;
        } catch (error) {
            throw (error)
        }
    }

    static async indexQuery(query) {
        try {
            const data = await pool.query(query);
            return data.rows;
        } catch (error) {
            throw (error)
        }
    }

    static async getOneById(table_name, id_name, id) {
        try {
            const res = await pool.query(`SELECT * FROM ${table_name} WHERE ${id_name} = $1`, [id]);
            return res.rows[0];
        } catch (error) {
            throw (error)
        }
    }

    static async getOneCustom({ table_name, column_name, value }) {
        try {
            const res = await pool.query(`SELECT * FROM ${table_name} WHERE ${column_name} = $1`, [value]);
            return res.rows[0];
        } catch (error) {
            throw (error)
        }
    }

    static async createAndUpdate(query) {
        try {
            const data = await pool.query(query);
            return data.rows[0];
        } catch (error) {
            throw (error)
        }
    }

    static async delete(table_name, id_name, id) {
        try {
            const query = {
                text: `DELETE FROM ${table_name} WHERE ${id_name}=$1`,
                values: [id]
            }

            await pool.query(query)

            return 'successfully deleted'
        } catch (error) {
            throw (error)
        }
    }

    static async searchByFilters(filters) {
        try {
            let queryText = `
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
            `;

            // Array untuk menyimpan kondisi WHERE yang akan ditambahkan secara dinamis
            let conditions = [];
            // Array untuk menyimpan nilai-nilai parameter untuk query
            let values = [];

            // Dinamiskan WHERE clause berdasarkan filter yang ada
            if (filters.user_id) {
                conditions.push(`t.user_id = $${conditions.length + 1}`);
                values.push(filters.user_id);
            }

            if (filters.account_id) {
                conditions.push(`t.account_id = $${conditions.length + 1}`);
                values.push(filters.account_id);
            }

            if (filters.category_id) {
                conditions.push(`t.category_id = $${conditions.length + 1}`);
                values.push(filters.category_id);
            }

            if (filters.transaction_note) {
                conditions.push(`t.transaction_note ILIKE $${conditions.length + 1}`);
                values.push(`%${filters.transaction_note}%`);
            }

            if (filters.transaction_type) {
                conditions.push(`t.transaction_type = $${conditions.length + 1}`);
                values.push(filters.transaction_type);
            }

            // Pencarian berdasarkan rentang tanggal
            if (filters.is_relative_date_enabled) {
                if (filters.transaction_date_from && filters.transaction_date_to) {
                    conditions.push(`DATE(t.transaction_date) BETWEEN $${conditions.length + 1} AND $${conditions.length + 2}`);
                    values.push(filters.transaction_date_from, filters.transaction_date_to);
                } else if (filters.transaction_date_from) {
                    conditions.push(`DATE(t.transaction_date) >= $${conditions.length + 1}`);
                    values.push(filters.transaction_date_from);
                } else if (filters.transaction_date_to) {
                    conditions.push(`DATE(t.transaction_date) <= $${conditions.length + 1}`);
                    values.push(filters.transaction_date_to);
                }
            } else if (filters.transaction_date_from) {
                conditions.push(`DATE(t.transaction_date) = $${conditions.length + 1}`);
                values.push(filters.transaction_date_from);
            }

            // Jika ada kondisi, tambahkan WHERE clause
            if (conditions.length > 0) {
                queryText += ` WHERE ` + conditions.join(' AND ');
            }

            queryText += ` ORDER BY t.transaction_date DESC`;

            // Buat query dengan text dan values yang dinamis
            const query = {
                text: queryText,
                values: values
            };
            const data = await pool.query(query);
            return data.rows;
        } catch (error) {
            throw (error)
        }
    }

    static async countIncomeAndExpense(filters) {
        try {
            let queryText = `
                SELECT
                    SUM(CASE WHEN t.transaction_type = 'income' THEN t.transaction_amount ELSE 0 END) AS total_income,
                    SUM(CASE WHEN t.transaction_type = 'expense' THEN t.transaction_amount ELSE 0 END) AS total_expense
                FROM 
                    transactions t
                JOIN 
                    accounts a ON t.account_id = a.account_id
                JOIN 
                    categories c ON t.category_id = c.category_id                
            `;

            let conditions = [];
            let values = [];

            if (filters.user_id) {
                conditions.push(`t.user_id = $${conditions.length + 1}`);
                values.push(filters.user_id);
            }

            if (filters.account_id) {
                conditions.push(`t.account_id = $${conditions.length + 1}`);
                values.push(filters.account_id);
            }

            if (filters.category_id) {
                conditions.push(`t.category_id = $${conditions.length + 1}`);
                values.push(filters.category_id);
            }

            if (filters.transaction_note) {
                conditions.push(`t.transaction_note ILIKE $${conditions.length + 1}`);
                values.push(`%${filters.transaction_note}%`);
            }

            if (filters.transaction_type) {
                conditions.push(`t.transaction_type = $${conditions.length + 1}`);
                values.push(filters.transaction_type);
            }

            // Pencarian berdasarkan rentang tanggal
            if (filters.is_relative_date_enabled) {
                if (filters.transaction_date_from && filters.transaction_date_to) {
                    conditions.push(`DATE(t.transaction_date) BETWEEN $${conditions.length + 1} AND $${conditions.length + 2}`);
                    values.push(filters.transaction_date_from, filters.transaction_date_to);
                } else if (filters.transaction_date_from) {
                    conditions.push(`DATE(t.transaction_date) >= $${conditions.length + 1}`);
                    values.push(filters.transaction_date_from);
                } else if (filters.transaction_date_to) {
                    conditions.push(`DATE(t.transaction_date) <= $${conditions.length + 1}`);
                    values.push(filters.transaction_date_to);
                }
            } else if (filters.transaction_date_from) {
                conditions.push(`DATE(t.transaction_date) = $${conditions.length + 1}`);
                values.push(filters.transaction_date_from);
            }

            if (conditions.length > 0) {
                queryText += ` WHERE ` + conditions.join(' AND ');
            }

            const query = {
                text: queryText,
                values: values
            };
            const data = await pool.query(query);
            return data.rows[0];
        } catch (error) {
            throw (error)
        }
    }

    static async totalAccountBalance() {
        try {
            const query = `
                SELECT 
                    SUM(account_balance) AS total
                FROM 
                    accounts
            `;

            const res = await pool.query(query);
            return res.rows[0];
        } catch (error) {
            throw (error)
        }
    }
}

export default DbUtils;