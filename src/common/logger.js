const Log = require('log4js');

const pattern = '%d{yyyy-MM-dd hh:mm:ss.SSS O} %[%p%] - %m';

Log.configure({
  appenders: {
    console: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern,
      },
    },
  },
  categories: { default: { appenders: ['console'], level: process.env.NODE_ENV === 'development' ? 'debug' : 'info' } },
});

module.exports = Log.getLogger();
