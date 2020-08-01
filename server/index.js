'use strict';

const Glue = require('@hapi/glue');
const manifest = require('./manifest');

const options = {
    relativeTo: __dirname
};

module.exports.compose = () => {
    return Glue.compose(manifest, options);
};

const startServer = async function () {
    try {
        const server = await module.exports.compose();
        await server.start();
        console.log(['success'], {
            message: `server started on port ${manifest.server.port} using NODE_ENV ${process.env.NODE_ENV}`
          })
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }
}

startServer();