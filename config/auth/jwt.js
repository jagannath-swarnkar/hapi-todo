const jwt = require('jsonwebtoken');
require('dotenv').config()


/** 
 * @description creating new jwt token
 * @returns returns a jwt token
 */
module.exports = (data)=> {
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn:"1d"});
    return token
}