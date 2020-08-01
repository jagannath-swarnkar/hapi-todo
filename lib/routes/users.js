const Joi = require('@hapi/joi');
const users = require('../controllers/users');

exports.register = (server) => {

    /**
     * @author Jagannath
     * @description getting all users list
     * @returns all users list
     */
    server.route({
        method: 'GET',
        path:'/users/',
        options: {
            handler: users.getAllUsers,
            tags: ['api','users'],
            notes: 'Api to get all users details',
            description: 'API to get all users details',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: {
                        200: {
                            description: 'Users',
                            schema: Joi.object().keys({
                                data: Joi.array(),
                                totalCount: Joi.number(),
                                message: Joi.string().default('success')
                            })
                        },
                        401: {description: 'Unauthorized'},
                        404: {description: 'Data not found!'}, 
                        400: {description: 'Something wrong happened!'},
                    },
                },
            },
            validate: {
                query: Joi.object({
                    limit: Joi.number().default(20),
                    skip: Joi.number().default(0),
                    searchText: Joi.string()
                }),
                headers: Joi.object({
                    'lan': Joi.string().required().default('en'),
                    'authorization': Joi.string().required()
                }).unknown()
            }
        },
    });

    /**
     * @author Jagannath
     * @description Getting user by userId
     * @returns user's details
     */
    server.route({
        method: 'GET',
        path: '/users/{userId}/',
        options: {
            handler: users.getUserById,
            tags: ['api','users'],
            notes: 'Get user details by userId',
            description: 'get user by userId',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: {
                        200: {
                            description: 'User details',
                            schema: Joi.object().keys({
                                data: Joi.array(),
                                message: Joi.string()
                            })
                        },
                        401: {description: 'Unauthorized'},
                        404: {description: 'Data not found!'}, 
                        400: {description: 'Something wrong happened!'},
                    },
                },
            },
            validate: {
                params: Joi.object({
                    userId: Joi.any().required().description("5f15989a4368cb7b9e0fed54")
                }),
                headers: Joi.object({
                    'lan': Joi.string().required().default('en'),
                    'authorization': Joi.string().required()
                }).unknown()
            }
        }
    });


    /**
     * @author Jagannath
     * @description Updating a user details
     * @return success message and status code
     */
    server.route({
        method: "PATCH",
        path: '/users/{userId}/',
        options: {
            handler: users.updateUserById,
            tags: ['api','users'],
            notes: 'Get user details by userId',
            description: 'get user by userId',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: {
                        200: {
                            description: 'User details',
                            schema: Joi.object().keys({
                                data: Joi.array(),
                                message: Joi.string()
                            })
                        },
                        401: {description: 'Unauthorized'},
                        404: {description: 'Data not found!'}, 
                        400: {description: 'Something wrong happened!'},
                    },
                },
            },
            validate: {
                params: Joi.object({
                    userId: Joi.any().required().description("5f15989a4368cb7b9e0fed54")
                }),
                payload: Joi.object({
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'co', 'org'] } }).required().description('example@gmail.com'),
                    firstname: Joi.string().alphanum().min(3).max(20).required(),
                    lastname: Joi.string().alphanum(),
                    phoneNumber: Joi.number().required(),
                    age: Joi.number().min(16).max(120).required()
                }),
                headers: Joi.object({
                    'lan': Joi.string().required().default('en'),
                    'authorization': Joi.string().required()
                }).unknown()
            }
        }
    })

    /**
     * @author Jagannath
     * @description deleting a user
     * @return success message and status code
     */
    server.route({
        method: 'DELETE',
        path:'/users/',
        options: {
            handler: users.deleteUserById,
            tags: ['api','users'],
            notes: 'delete an user by userId',
            description: 'delete an user',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: {
                        200: {
                            description: 'Success',
                            schema: Joi.string().label('success')
                        },
                        401: {description: 'Unauthorized'},
                        404: {description: 'Data not found!'}, 
                        400: {description: 'Something wrong happened!'},
                    },
                },
            },
            validate: {
                payload: Joi.object({
                    userId: Joi.any().required().description("5f157f458ee842780ecbe7e3")
                }),
                headers: Joi.object({
                    'authorization': Joi.string().required()
                }).unknown()
            }
        }
    })


}

exports.pkg = {
    name: 'users'
}