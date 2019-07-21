const server = require('./app/external/app.js');
const config = require('nconf');
const winston = require('winston');
const initKeys = require('./config/initializers/keys.init');

// Load Environment variables from .env file
require('dotenv').config();

// Set up configs
config.use('memory');
config.argv();
config.env();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'internal-api-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' })
    new winston.transports.Console()
  ]
});
winston.add(logger);

// Load config file for the environment
// require('./config/environments/' + config.get('NODE_ENV'));

logger.info('[APP] Starting server initialization');

// Initialize Service:
initKeys().then(() => server())
