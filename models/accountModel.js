import pool from "../connection.js"

class accountModel {

    static async index(pageSize = 0, page = 1) {
        try {
            const queryDefault = {
                text: 'SELECT * FROM accounts'
            }
            const queryPagination = {
                text: 'SELECT * FROM accounts LIMIT $1 OFFSET $2',
                values: [pageSize, ((page - 1) * pageSize)]
            }

            const query = +pageSize === 0 ? queryDefault : queryPagination

            const data = await pool.query(query)
            return data.rows
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