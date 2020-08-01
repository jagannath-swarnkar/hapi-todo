const Joi = require('@hapi/joi');
const todos = require('../controllers/todos');

exports.register = (server) => {

    /**
     * @author Jagannath
     * @description POST api to add new todo
     * @type route
     */
    server.route({
        method: 'POST',
        path: '/todos/',
        options: {
            handler: todos.addTodo,
            tags: ['api','todos'],
            notes: 'post a new todo!',
            description: 'add todo',
            plugins: {
                'hapi-swagger':{
                    payloadType: 'form',
                    responses: {
                        201: {
                            description: 'success!'
                        },
                        404: {description:'Page not found!'},
                        401: {description: 'Unauthorized!'},
                        500: {description:'Server error!'}
                    }
                }
            },
            validate: {
                payload: Joi.object({
                    // userId: Joi.string().required(),
                    title: Joi.string().required().description('todo'),
                    description: Joi.string().optional(),
                    status: Joi.number().required().default(0).description('todo status: 0-pending, 1-active, 2-completed, 3-suspended, 4-deleted')
                }),
                headers: Joi.object({
                    lan: Joi.string().required().default('en'),
                    'authorization': Joi.string().required()
                }).unknown()
            }
        }
    });

    /**
     * @author Jagannath
     * @description GET api to get all todos of an user
     * @type route
     */
    server.route({
        method: 'GET',
        path: '/todos/',
        options: {
            handler: todos.getAllTodos,
            tags: ['api','todos'],
            notes: 'get all todos of an user!',
            description: 'get todos',
            plugins: {
                'hapi-swagger':{
                    payloadType: 'form',
                    responses: {
                        201: {
                            description: 'result',
                            schema: Joi.object({
                                data: Joi.array(),
                                totalCount: Joi.number(),
                                message: Joi.string().description('success')
                            })
                        },
                        404: {description:'Page not found!'},
                        401: {description: 'Unauthorized!'},
                        500: {description:'Server error!'}
                    }
                }
            },
            validate: {
                query: Joi.object({
                    skip: Joi.number().default(0),
                    limit: Joi.number().default(20),
                    searchText: Joi.string().optional().description('Search By- title'),
                    status: Joi.number().required().default(0).description('todo status: 0-pending, 1-active, 2-completed, 3-suspended, 4-deleted')
                }),
                headers: Joi.object({
                    lan: Joi.string().required().default('en'),
                    'authorization': Joi.string().required()
                }).unknown()
            }
        }
    });


    /**
     * @author Jagannath
     * @description GET api to get a todo of an user by todoId
     * @type route
     */
    server.route({
        method: 'GET',
        path: '/todos/{todoId}/',
        options: {
            handler: todos.getTodoById,
            tags: ['api','todos'],
            notes: 'get a todo of an user by todoId!',
            description: 'get todo by todoId',
            plugins: {
                'hapi-swagger':{
                    payloadType: 'form',
                    responses: {
                        201: {
                            description: 'result',
                            schema: Joi.object({
                                data: Joi.array(),
                                totalCount: Joi.number(),
                                message: Joi.string().description('success')
                            })
                        },
                        404: {description:'Page not found!'},
                        401: {description: 'Unauthorized!'},
                        500: {description:'Server error!'}
                    }
                }
            },
            validate: {
                params: Joi.object({
                    todoId: Joi.string().required().description('5f16c7af9c90180d25adc34c')
                }),
                headers: Joi.object({
                    lan: Joi.string().required().default('en'),
                    'authorization': Joi.string().required()
                }).unknown()
            }
        }
    });

    /**
     * @author Jagannath
     * @description Patch api to change status of a todo (active, pending, delete, suspend)
     * @type route
     */
    server.route({
        method: 'PATCH',
        path: '/todos/',
        options: {
            handler: todos.changeTodoStatus,
            tags: ['api','todos'],
            notes: 'change status of a todo',
            description: 'change status',
            plugins: {
                'hapi-swagger':{
                    payloadType: 'form',
                    responses: {
                        201: {
                            description: 'result',
                            schema: Joi.object({
                                data: Joi.array(),
                                totalCount: Joi.number(),
                                message: Joi.string().description('success')
                            })
                        },
                        404: {description:'Page not found!'},
                        401: {description: 'Unauthorized!'},
                        500: {description:'Server error!'}
                    }
                }
            },
            validate: {
                payload: Joi.object({
                    todoId: Joi.string().required().description('5f16c7af9c90180d25adc34c'),
                    status: Joi.number().required().description('status: 0-pending, 1-active, 2-done, 3-suspend, 4-delete')
                }),
                headers: Joi.object({
                    lan: Joi.string().required().default('en'),
                    'authorization': Joi.string().required()
                }).unknown()
            }
        }
    });

}

exports.pkg = {
    name: 'todos'
}