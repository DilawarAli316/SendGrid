  const express = require('express');
  const mongoose = require('mongoose');
  const config = require('config');
  const cors = require('cors');

  const bodyParser = require('body-parser');

  const app = express();
  const Api = require('./api')
  const MONGODB_URL = config.get('datasource.databaseUrl');

  const corsOpt = {
    origin: "*",
    credentials: true,
    exposedHeaders: 'authorization',
    maxAge: 10 * 60,
  }

  app.use(cors(corsOpt));
  app.use(express.json());
  // app.use(
  //   fileUpload({
  //     debug: true
  //   })
  // );
  require('./seeder/plan-seed.js');
  require('./seeder/warranty-type-seed');
  require('./seeder/country-seed');
  require('./seeder/state-seed');
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('Database Connected to Vonza App');
      rootLogger.info('Database Connected to Vonza App');
    })
    .catch((err) => console.log('connection error occurred:', err));

  app.use(responseTime(async (req, res, time) => {
    const timeTaken = await calculateApiTimeUtil.calculateApiTime(time);
    timeLogger.info(`${req.originalUrl}: ${timeTaken}`);
  }));


  app.use('/api', Api);

  app.use(
    '/graphql',
    bodyParser.json(),
    expressGraphQL({
      schema,
      graphiql: true,
      endpointURL: '/graphql',
    })
  );

  const server = http.createServer(app).listen(8080, function () {
    console.log('Http server listening on port ' + 8080);
    rootLogger.info('Http server listening on port ' + 8080);
    new SubscriptionServer({
      execute,
      subscribe,
      schema: schema,
      onConnect: connectionParams => {
        if (connectionParams.authToken) {
          const decoded = jwt.verify(connectionParams.authToken, constant.JWT_SECRET_LOGIN);
          return { user: decoded };
        }
        throw new Error('Missing authorization token!');
      },
    }, {
      server: server,
      path: '/graphql/subscriptions',
    });
  });
  app.use('/status', async (req, res) => {
    try {
      return res.status(200).json({
        message: 'Ok Working'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error. Please try again later.',
        error: error
      });
    }
  });