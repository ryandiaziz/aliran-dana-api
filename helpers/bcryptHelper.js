import bcrypt from 'bcrypt';
import { config } from '../configs/dotenvConfig.js';

const encryptPass = plainPass => {
    console.log('plainPass : ', plainPass);
    console.log(typeof config.saltRound)
    
    return bcrypt.hashSync(plainPass, config.saltRound);
}

const decryptPass = ({plainPass, hashPass}) => {
    return bcrypt.compareSync(plainPass, hashPass);
}

export {
    encryptPass,
    decryptPass
}