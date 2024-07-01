import pool from "../connection.js"

class accountModel {    
    static async index(pageSize = 0, page = 1) {
        try {
            const queryDefault = {
                text: `SELECT * FROM accounts`
            };

            const queryPagination = {
                text: `SELECT * FROM accounts LIMIT $1 OFFSET $2`,
                values: [pageSize, ((page - 1) * pageSize)]
            };

            const query = +pageSize === 0 ? queryDefault : queryPagination;

            const data = await pool.query(query);
            return data.rows;
        } catch (error) {
            throw (error)
        }
    }

    static async getOneAccount(id){
        try {
            const res = await pool.query('SELECT * FROM accounts WHERE account_id = $1', [id]);
            return res.rows[0];
        } catch (error) {
            
        }
    }
    
    static async createAccount(name, balance) {
        try {
            const query = {
                text: 'INSERT INTO accounts(account_name, account_balance, created_at, updated_at) VALUES($1,$2, NOW(), NOW()) RETURNING *',
                values: [name, balance]
            }

            const data = await pool.query(query)

            return data.rows
        } catch (error) {
            throw (error)
        }
    }

    static async updateAccount(id, name) {
        try {
            const query = {
                text: 'UPDATE accounts SET account_name = $1, updated_at = NOW() WHERE account_id = $2 RETURNING *',
                values: [name, id]
            }

            const res = await pool.query(query)

            return res.rows
        } catch (error) {
            throw (error)
        }
    }

    static async deleteAccount(id) {
        try {
            const query = {
                text: 'DELETE FROM accounts WHERE account_id=$1',
                values: [id]
            }

            await pool.query(query)

            return 'successfully deleted'
        } catch (error) {
            throw (error)
        }
    }
    // static async getOneUser(email) {
    //     try {
    //         const query = {
    //             text: 'SELECT * FROM userdata WHERE email = $1',
    //             values: [email]
    //         }

    //         const data = await pool.query(query)
    //         return data.rows
    //     } catch (error) {
    //         throw (error)
    //     }
    // }
}

export default accountModel