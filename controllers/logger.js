const log4js = require('log4js');

log4js.configure(
  {
    appenders: {
      file: {
        type: 'file',
        filename: 'logs/main.log',
        maxLogSize: 10 * 1024 * 1024, // = 10Mb
        numBackups: 5, // keep five backup files
        compress: true, // compress the backups
        encoding: 'utf-8',
        mode: 0o0640,
        flags: 'w+'
      },
      dateFile: {
        type: 'dateFile',
        filename: 'logs/important.log',
        pattern: 'yyyy-MM-dd-hh',
        compress: true
      },
      out: {
        type: 'stdout'
      }
    },
    categories: {
      default: { appenders: ['file', 'dateFile', 'out'], level: 'trace' }
    }
  }
);
let logger_name="监控";
logger_name = process.argv[2] ? process.argv[2].replace('../accounts/', ''):logger_name;

const logger = log4js.getLogger(logger_name);
module.exports = logger;
