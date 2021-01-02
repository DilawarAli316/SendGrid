'use strict';

/* default.js, node-config default configuration.

   All application configuration variables should be represented herein, even
   if only to have default or empty value.

   If you would like to change any of these values for your dev environment, create
   a local.js file in this directory (which will be gitignored), in which individual
   properties can be specified which overwrite any of the values below.

*/

module.exports = {
  serve: {
    port: process.env.PORT || 3000,
    api: {
      cors: {
        whitelist: fromEnv(
          'CORS_ALLOW_ORIGIN',
          ['http://localhost:3000'].join(','),
        ),
      },
    },
  },

  datasource: {
    databaseUrl: fromEnv(
      'MONGODB_URL',
      'mongodb://developers@pourboir.com:#De6Adiix.H5qb5@cluster0-shard-00-00.ugghn.mongodb.net:27017,cluster0-shard-00-01.ugghn.mongodb.net:27017,cluster0-shard-00-02.ugghn.mongodb.net:27017/?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
    ),
  },
};

// In production environments, read from the environment. Otherwise, use a
// default for development, allowing the value to be overridden.
function identity(x) {
  return x;
}

// Read from the environment, or use a default.
function fromEnv(varName, defValue, transform) {
  transform = transform || identity;
  const envValue = process.env[varName];
  if (envValue !== undefined) {
    return transform(envValue);
  }
  return defValue;
}
