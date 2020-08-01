var ObjectId = require("mongodb").ObjectId;
const verifyToken = require("../../config/auth/verifyToken");


module.exports = {

    /**
     * @author Jagannath
     * @type handler
     * @method POST
     * @description token validating and db query to post a new todo
     * @returns returns all user details list.
     */
    addTodo: async (request, h) => {
        const db = request.mongo.db;

        const tokenData = await verifyToken(request.headers.authorization);
        if(!tokenData){
            return h.response("Unauthorized user").code(401);
        }

        const isExists = await db.collection("Todos")
            .findOne({
                userId: tokenData._id,
                status: request.payload.status, 
                title: request.payload.title
            });
        if(isExists){
            return h.response({message: 'Duplicate entry!'}).code(409);
        }
        request.payload.userId = tokenData._id;
        const insertedData = await db.collection("Todos").insertOne(request.payload);
        const result = insertedData.ops[0];
        console.log(result)
        
        if(insertedData.insertedCount){
            return h.response({message: 'Todo added successfully!', todoId: result._id}).code(201);
        }
        return h.response({message: 'server error!'}).code(500)
    },

    
    /**
     * @author Jagannath
     * @type handler
     * @method GET
     * @description token validating and db query to get all todos list of a student
     * @returns returns list of all todos.
     */
    getAllTodos: async (request, h) => {
        const db = request.mongo.db;

        const tokenData = await verifyToken(request.headers.authorization);
        if(!tokenData){
            return h.response("Unauthorized user").code(401);
        }
        console.log('tokendata:',tokenData)
        const st = request.query.searchText;
        let result;
        let totalCount;
        if(st){
            result = await db.collection("Todos")
            .find({
                    title: {$regex: st},
                    userId: tokenData._id,
                    status: request.query.status
                })
            .skip(request.query.skip)
            .limit(request.query.limit)
            .sort({_id:-1})
            .toArray()
        totalCount = await db.collection("Todos").find({userId: tokenData._id,status: request.query.status, title: {$regex: st}}).count();
        }else{
            result = await db.collection("Todos")
            .find({
                    userId: tokenData._id,
                    status: request.query.status
                })
            .skip(request.query.skip)
            .limit(request.query.limit)
            .sort({_id:-1})
            .toArray()
            totalCount = await db.collection("Todos").find({userId: tokenData._id,status: request.query.status}).count();
        }
                
        if(result.length > 0){
            return h.response(
                {
                    message: 'success',
                    data: result,
                    totalCount
                }
                ).code(200);
        }
        if(result.length === 0){
            return h.response({message: 'no data found', totalCount, data: result}).code(404)
        }
        return h.response({message:'server error'}).code(500)
    },


    /**
     * @author Jagannath
     * @type handler
     * @method GET
     * @description token validating and db query to get a todo details of a student
     * @returns returns details of a todo.
     */
    getTodoById: async (request, h) => {
        const db = request.mongo.db;

        const tokenData = await verifyToken(request.headers.authorization);
        if(!tokenData){
            return h.response("Unauthorized user").code(401);
        }
        const result = await db.collection("Todos")
            .findOne({
                    userId: tokenData._id,
                    _id: ObjectId(request.params.todoId)
                })      
        console.log(result)          
        if(result){
            return h.response(
                {
                    message: 'success',
                    data: result,
                }
                ).code(200);
        }
        if(!result){
            return h.response({message: 'no data found', totalCount, data: result}).code(404)
        }
        return h.response({message:'server error'}).code(500)
    },


     /**
     * @author Jagannath
     * @type handler
     * @method PATCH
     * @description token validating and db query to change the status of a todo
     * @returns returns message and status code.
     */
    changeTodoStatus: async (request, h) => {
        const db = request.mongo.db;

        const tokenData = await verifyToken(request.headers.authorization);
        if(!tokenData){
            return h.response("Unauthorized user").code(401);
        }
        const isTodo = await db.collection("Todos")
            .findOne({
                    userId: tokenData._id,
                    _id: ObjectId(request.payload.todoId)
                })      
        console.log(isTodo)          
        if(!isTodo){
            return h.response({message: 'no data found', totalCount, data: isTodo}).code(404)
        }

        const result = await db.collection("Todos")
            .findAndModify({_id: request.payload.todoId}, update)

        if(result){
            return h.response(
                {
                    message: 'success',
                    data: result,
                }
                ).code(200);
        }
        return h.response({message:'server error'}).code(500)
    }


}