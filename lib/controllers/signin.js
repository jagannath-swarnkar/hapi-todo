var ObjectID = require("mongodb").ObjectID;
const createToken = require("../../config/auth/jwt");

module.exports = {

    loginUser: async (request, h) => {
        const db = request.mongo.db;
        console.log(request.payload)
        /** checking for valid user */
        const result = await db
            .collection("Users")
            .findOne({ email: request.payload.email, password: request.payload.password });
        console.log(result)
        if (!result) {
            return h.response("User doesn't exists, please signup first!").code(400);
        }

        delete result.password;
        console.log(result)
        const token = createToken(result);
        console.log(token)
        
        if(token){
            return h
                .response({ status: "ok", body: result , token})
                .state("auth", token)   
                .code(201);
        }
        return h.response('unhandled error').code(500)
    }
}
