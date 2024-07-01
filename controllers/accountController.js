import AccountModel from '../models/accountModel.js'
// import { tokenGenerator } from "../helper/jsonWebToken.js";
// import { decryptPwd } from "../helper/encrypt.js";
// import { validateUserInput } from '../helper/validate.js';

class accountController {
    static async index(req, res) {
        try {
            // const { pageSize, page } = req.query
            const data = await AccountModel.index();

            res.json({
                status: true,
                data
            })
        } catch (err) {
            res.json({
                status: false,
                message: err.message
            })
        }
    }

    // static async createUser(req, res) {
    //     try {
    //         const { nama, email, password } = req.body
    //         validateUserInput({ nama, email, password })

    //         const message = await UserModel.createuser(nama, email, password)

    //         res.json({
    //             status: true,
    //             message
    //         })
    //     } catch (err) {
    //         res.json({
    //             status: false,
    //             message: err.message
    //         })
    //     }
    // }

    // static async login(req, res) {
    //     try {
    //         const { email, password } = req.body
    //         const userData = await UserModel.getOneUser(email)

    //         if (userData.length) {
    //             if (decryptPwd(password, userData[0].password)) {
    //                 let access_token = tokenGenerator(...userData)
    //                 res.status(200).json({
    //                     status: "ok",
    //                     access_token: access_token,
    //                 });
    //             } else {
    //                 res.status(403).json({
    //                     status: "error",
    //                     message: "invalid password"
    //                 })
    //             }
    //         } else {
    //             res.status(404).json({
    //                 status: "error",
    //                 message: "User not found"
    //             })
    //         }
    //     } catch (err) {
    //         res.json({
    //             status: false,
    //             message: err.message
    //         })
    //     }
    // }

    // static async getAccount(req, res) {
    //     try {

    //     } catch (err) {

    //     }
    // }

}

export default accountController