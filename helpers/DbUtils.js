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


}

export default DbUtils;