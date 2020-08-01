var ObjectID = require("mongodb").ObjectID;
const createToken = require("../../config/auth/jwt");

module.exports = {

    addFriends: async (request, h) => {
        const db = request.mongo.db;
        const insertedData = await db.collection('Friends').insertOne(request.payload);
        const result = insertedData.ops[0];

        return h.response({message: 'success', data:result}).code(201);
    },

    getFriends: async (request, h) => {
        const db = request.mongo.db;
        const result = await db.collection('Friends').find({}).toArray()
        if(result.length>0){
            return h.response({message: 'success!', data:result}).code(200);
        }
        return h.response({message: 'no data found!', data:result}).code(404)
    }
}
