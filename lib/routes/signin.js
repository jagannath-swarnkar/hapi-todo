
const Joi = require('@hapi/joi');

const signin = require('../controllers/signin');

exports.register = (server) => {

    server.route({
        method: 'POST',
        path: '/login',
        options: {
            handler: signin.loginUser,
            tags: ['api', 'users'],
            notes: 'user login!',
            description: 'user login!',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                },
                responses: {
                    200: {
                        description: 'Login successfull',
                        schema: Joi.object({
                            message: Joi.string,
                            data: Joi.array(),
                            token: Joi.string
                        }).label('Loigin successfull')
                    },
                    404: {description: 'Data not found!'}, 
                    400: {
                        description: 'Bad Requests!'
                    },
                }
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string()
                        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'co', 'org'] } })
                        .required().description('example@gmail.com'),
                    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
                }),
                headers: Joi.object({
                    lan: Joi.string().required().default('en')
                }).unknown()
            }
        }
    });
}

exports.pkg = {
    name: 'signin'
}