import bcrypt from 'bcrypt';
import { config } from '../configs/dotenvConfig.js';

const encryptPass = (plainPass) => bcrypt.hashSync(plainPass, config.saltRound);

const decryptPass = ({ plainPass, hashPass }) => bcrypt.compareSync(plainPass, hashPass);

export {
    encryptPass,
    decryptPass
}