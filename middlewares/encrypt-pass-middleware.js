import { encryptPass } from "../helpers/bcrypt-helper.js";

const encryptPassMiddleWare = (req, res, next) => {
    try {
        const body = req.body;
        const password = body.password;

        const hash = encryptPass(password);

        req.body = {
            ...body,
            password: hash
        }

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

export default encryptPassMiddleWare;