var ObjectId = require("mongodb").ObjectId;
const verifyToken = require("../../config/auth/verifyToken");

/**
 * @author Jagannath
 * @description Handler method to controle api handlers
 */
module.exports = {

    /**
     * @author Jagannath
     * @type handler
     * @description token validating and db query to get all users details
     * @returns returns all user details list.
     */
    getAllUsers: async (request, h) => {
        const db = request.mongo.db;

        const tokenData = await verifyToken(request.headers.authorization);
        if(!tokenData){
            return h.response("Unauthorized user").code(401);
        }

        const st = request.query.searchText || ""; 
        const result = await db
            .collection("Users")
            .find({$or: [{firstname: {$regex: st}},{lastname: {$regex: st}}]})
            .project({password:0})
            .limit(request.query.limit)
            .skip(request.query.skip)
            .sort({_id:-1})
            .toArray();
        const totalCount = await db.collection("Users").find({$or: [{firstname: {$regex: st}},{lastname: {$regex: st}}]}).count()

        if(result.length === 0){
            return h.response('no data found').code(404)
        }
        return h.response({
            data: result,
            message: 'success!',
            totalCount
        }).code(200)
    },

    /**
     * @author Jagannath
     * @type handler
     * @description token validating and db query to get user details by userId
     * @returns returns user details by userId
     */
    getUserById: async (request, h) => {
        const db = request.mongo.db;

        const tokenData = await verifyToken(request.headers.authorization);

        if(!tokenData){
            return h.response('Unauthorized user').code(401);
        }
        const result = await db
            .collection('Users')
            .find({_id: ObjectId(request.params.userId)})
            .project({password:0})
            .toArray()
 
        if(result.length >0){
            return h.response({
                data: result,
                message: 'success!'
            }).code(200);
        }else{
            return h.response({message:'no data found'}).code(404);
        }
    },

    /**
     * @author Jagannath
     * @type handler
     * @description patch api to update user details
     * @returns message and status code
     */
    updateUserById: async (request, h) => {
        const db = request.mongo.db;

        // verifying token
        const tokenData = await verifyToken(request.headers.authorization);
        if(!tokenData){
            return h.response('Unauthorized user').code(401);
        }
        
        //verifying user
        const result = await db
            .collection('Users')
            .findOne({_id: ObjectId(request.params.userId)});
        if(!result){
            return h.response('User does not exists!').code(404)
        }

        // updating user details by replacing with newer data
        let updateData = request.payload;
        updateData.password = result.password
        const upRes = await db
            .collection('Users')
            .replaceOne({_id: ObjectId(request.params.userId)},updateData)
        if(upRes.modifiedCount){
            return h.response({message:'user updated successfully!'}).code(201)
        }
        return h.response('server error!').code(500)
    },

    /**
     * @author Jagannath
     * @type handler
     * @description delete api to delete an user.
     * @returns message and status code
     */
    deleteUserById: async (request, h) => {
        const db = request.mongo.db;

        // verifying token
        const tokenData = await verifyToken(request.headers.authorization);
        if(!tokenData){
            return h.response('Unauthorized user').code(401);
        }

        // checking for existing user
        const userExists = await db.collection("Users").findOne({_id: ObjectId(request.payload.userId)});
        if(!userExists){
            return h.response({message: 'no data found!'}).code(404)
        }

        const res = await db.collection("Users").findOneAndDelete({_id: ObjectId(request.payload.userId)});
        if(res.ok){
           return h.response({message:'user deleted successfully!'}).code(201)
        }
        return h.response({message:"Server Error!"}).code(500)
    }
}