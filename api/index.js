'use strict';

const hapi = require('@hapi/hapi');

const init = async () => {
  const server = hapi.server({
    host: "0.0.0.0",
    port: 3000,
  });
  server.route(
    {
      method: 'GET',
      path: '/ingredients',
      handler: (request, h) => {
    },
    },
    {
      method: 'GET',
      path: '/pairings',
      handler: (request, h) => {}
    } 
  );
  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();