const Path = require('path');

module.exports = {
    server: {
        port: 8000,
    },
    register: {
        plugins: [
            {
                plugin: require('hapi-cors'),
                origin: ['*']
            },
            {
                plugin: require('../home')
            },
            {
                plugin: require('hapi-swagger'),
                options: {
                    grouping: 'tags',
                    host:'localhost:8000',
                    // jsonEditor: true,
                    info: {
                        title: 'Test API Documentation',
                        contact: {
                            name: 'jagannath swarnkar',
                            email: 'jagannath18@navgurukul.org'
                        }
                    },
                    // version: "1.0"
                }
            },
            {
                plugin: require('@hapi/inert')
            },
            {
                plugin: require('@hapi/vision')
            },
            {
                plugin: require("hapi-mongodb"),
                options: require("../config/db/dbConfig")
            },
            {
                plugin: require('../lib/routes/signup')
            },
            {
                plugin: require('../lib/routes/signin')
            },
            {
                plugin: require('../lib/routes/users')
            },
            {
                plugin: require('../lib/routes/todos')
            },
            {
                plugin: require('../lib/routes/test')
            }
        ]
    }
}