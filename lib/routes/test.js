
const Joi = require('@hapi/joi');

const test = require('../controllers/test');

exports.register = (server) => {

    server.route({
        method: 'POST',
        path: '/friends/',
        options: {
            handler: test.addFriends,
            tags: ['api', 'test'],
            notes: 'add friends!',
            description: 'add friends!',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                payload: Joi.object({
                    sentBy: Joi.string().required(),
                    sentTo: Joi.string().required(),
                    sentOn: Joi.number().required().default(Date.now()),
                    status: Joi.string().required().default('pending'),
                    respondedOn: Joi.number().optional()
                })
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/friends/',
        
        options: {
            
            handler: test.getFriends,
            tags: ['api', 'test'],
            notes: 'get friends!',
            description: 'get friends!',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            }
        }
    });
}

exports.pkg = {
    name: 'test'
}