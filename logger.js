const winston = require('winston') ;

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.errors(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({filename: 'C:/suporte_logs/error.log', level: 'error' }),
    new winston.transports.File({filename: 'C:/suporte_logs/info.log' }),
  ],
});

module.exports = logger;