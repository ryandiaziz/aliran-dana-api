import pool from "../connection.js";

class DbUtils{
    static async index(table_name, pageSize = 0, page = 1) {
        try {
            const queryDefault = {
                text: `SELECT * FROM ${table_name}`
            };

            const queryPagination = {
                text: `SELECT * FROM ${table_name} LIMIT $1 OFFSET $2`,
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

    static async getOne(table_name, id_name, id){
        try {
            const res = await pool.query(`SELECT * FROM ${table_name} WHERE ${id_name} = $1`, [id]);
            return res.rows[0];
        } catch (error) {
            throw (error)
        }
    }

    static async createAndUpdate(query){
        try {                
            const data = await pool.query(query)
    
            return data.rows
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

    static async searchByDate(date){
        try {
            const query = {
                text : `
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
                        WHERE 
                            DATE(t.transaction_date) = $1
                        ORDER BY 
                            t.transaction_date DESC
                    `,
                values : [date]
            }

            const data = await pool.query(query);
            return data.rows;
        } catch (error) {
            throw (error)
        }
    }
}

export default DbUtils;