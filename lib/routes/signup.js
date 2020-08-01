const Joi = require('@hapi/joi');
const signup = require('../controllers/signup')

exports.register = (server) => {

    server.route({
        method: 'POST',
        path: '/user',
        options: {
            handler: signup.createUser,
            tags: ['api', 'users'],
            description: 'Signup',
            notes:'api to post a new user (signup)',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                },
                responses: {
                    200: {
                        description: 'Signup successfull',
                    },
                    404: {description: 'Data not found!'}, 
                    400: {
                        description: 'Something wrong happened!'
                    },
                }
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'co', 'org'] } }).required().description('example@gmail.com'),
                    firstname: Joi.string().alphanum().min(3).max(20).required(),
                    lastname: Joi.string().alphanum(),
                    phoneNumber: Joi.number().required(),
                    age: Joi.number().min(16).max(120).required(),
                    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
                }),
                headers: Joi.object({
                    lan: Joi.string().required().default('en')
                }).unknown()
            }
        }
        
    })

}

exports.pkg = {
    name: 'signup'
}