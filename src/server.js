const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const init = async () => {
    const server = Hapi.Server({
        port: 5001,
        host: 'localhost',
    });

    server.route(routes);

    await server.start();

    console.log('Server Ok');
};

init();