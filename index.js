/**
 * @author realzzz <realzzz1874@gmail.com>
 */

const client = require('ssh2').Client;
const mysql = require('mysql2');

var tunnel = module.exports = {
  _client: null,
  _sql: null,
  _addDefaultConfig(db_config) {
    // add port
    if (!('port' in db_config)) {
      db_config.port = 3306;
    }
    // add host
    if (!('host' in db_config)) {
      db_config.host = 'localhost';
    }
    return db_config;
  },
  connect: function(ssh_config, db_config) {
    db_config = tunnel._addDefaultConfig(db_config);
    return new Promise(function(resolve, renject) {
      tunnel._client = new client();
      tunnel._client.on('ready', function() {
        tunnel._client.forwardOut(
          '127.0.0.1',
          12345,
          db_config.host,
          db_config.port,
          function (err, stream) {
            if (err) {
              tunnel.close();
              return renject('Connection failed.');
            }

            db_config.host = 'localhost';
            db_config.stream = stream;

            tunnel._sql = mysql.createConnection(db_config);
            resolve(tunnel._sql);
          }
        )
      }).connect(ssh_config);
    });
  },

  close: function() {
    if ('end' in tunnel._sql) {
      tunnel._sql.end(function(err) {
        console.log(err);
      });
    }

    if ('end' in tunnel._client) {
      tunnel._client.end();
    }
  }
}
