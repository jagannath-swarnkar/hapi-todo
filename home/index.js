const Joi = require('@hapi/joi');
var ObjectId = require("mongodb").ObjectId;
const createToken = require("../config/auth/jwt");

exports.register = (server) => {
    
    server.route({
        method: 'GET',
        path: '/',
        config: {
            tags: ['api']
        },
        handler: async (request, h) => {
            const db = request.mongo.db;
            const data  = await db.collection('Users').find({_id: ObjectId("5f15989a4368cb7b9e0fed54")}).project({password:0, _id:0}).toArray();
            const token =  await createToken(data[0])
            return h.response(token);
        }
    });

    /**
     * @author Jagannath
     * @description Get api to get todos of a particular user by userId
     */
    server.route(
        {
            method: 'GET',
            path: '/todo/{userId}/',
            options: {
                handler: (request, h) => {
                    return 'working-' + request.params.userId
                },
                description: 'Get todos of an user',
                notes: 'Returns todo items by the userId passed in the path',
                tags: ['api', 'todo'], // ADD THIS TAG
                plugins: {
                    'hapi-swagger': {
                        payloadType: 'form'
                    }
                },
                validate: {
                    params: Joi.object({
                        id : Joi.number().required().description('userId for the todo items'),
                    }),
                    query: Joi.object({
                        searchText : Joi.string().optional().description('Search by - todo title'),
                        limit: Joi.number().default(10).positive(),
                        offset: Joi.number().default(0)
                    }),
                    headers: Joi.object({
                        lan: Joi.string().required().default('en'),
                        authorization: Joi.string().required().description('token')
                    })
                }
            },
        },
    ),
    
    /**
     * @author Jagannath
     * @description post method to post a todo
     * @returns success message, status code, added todo review
     */
    server.route({
        method: 'POST',
        path: '/todo',
        options: {
            handler: (request, h) => { return {status: 201, message: 'success',data:[request.payload]}; },
            tags: ['api', 'todo'],
            description: 'post a new todo',
            notes:'api to post a new todo',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().description('Enter your todo here...'),
                }),
                headers: Joi.object({
                    'authorization': Joi.string().required(),
                    lan: Joi.string().required().default('en')
                }).unknown()
            }
        }
    })

    /**
     * @author Jagannath
     * @description get api to get all todos
     * @return list of all todos with status code
     */
    server.route({
        method: 'GET',
        path:'/todo/',
        options: {
            handler: (request, h) => { return {status: 200, message: 'success', data: ['total collections'], totalCount:12}},
            tags: ['api', 'todo'],
            description: 'get all todos',
            notes: 'api to get all todos for all users',
            plugins: {
                'hapi-swagger': {
                    payloadType:'form',
                    responses: {
                        200: {
                            description: 'Result',
                            schema: Joi.object({
                                message: Joi.string,
                                data: Joi.array(),
                                totalCount: Joi.number()
                            }).label('Result')
                        },
                        404: {description: 'Data not found!'}, 
                        400: {
                            description: 'Something wrong happened!'
                        },
                    }
                }
            },
            validate: {
                query: Joi.object({
                    searchText : Joi.string().optional().description('Search by - todo title'),
                    limit: Joi.number().default(10).positive(),
                    offset: Joi.number().default(0),
                }),
                headers: Joi.object({
                    'authorization': Joi.string().required(),
                    lan: Joi.string().required().default('en')
                }).unknown()
            }
        }
    })

}

exports.pkg = {
    name: "home"
}