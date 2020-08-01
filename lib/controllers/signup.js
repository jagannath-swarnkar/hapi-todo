var ObjectID = require("mongodb").ObjectID;
const createToken = require("../../config/auth/jwt");

module.exports = {

    createUser: async (request, h) => {
        const db = request.mongo.db;
        request.payload.created_at = Date.now();
        /** checking for duplicate user entry */
        const existingUser = await db
            .collection("Users")
            .findOne({ email: request.payload.email });
        if (existingUser !== null) {
            return h.response("duplicate user, User already exists!").code(409);
        }

        const insertedData = await db.collection("Users").insertOne(request.payload);
        const result = insertedData.ops[0];
        delete result.password;
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