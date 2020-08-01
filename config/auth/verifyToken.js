const jwt = require('jsonwebtoken');
require('dotenv').config()

/**
 * @description verifying and exporting user token and returning token data by decoding token with security key
 * @returns returns user decoded data (contained in token)
 */
module.exports = async (token) => {
    return await jwt.verify(token, process.env.JWT_SECRET_KEY,(err, tokenData)=>{
        if(tokenData){
            return tokenData
        }
        console.log(err)
        return;
    })
}