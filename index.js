const debug = require('debug')('database-js-forward');

class ForwardSQL {
    constructor(connection) {
        this.__connection = connection;
        if (connection.pool) {
            debug('Adding pool function');
            this.pool = function(pooledConnection) {
                return this.__connection.pool(pooledConnection);
            }
        }
    }

    query(sql) {
        debug('QUERY: %s', sql);
        return this.__connection.query(sql);
    }

    execute(sql) {
        debug('EXECUTE: %s', sql);
        return this.__connection.execute(sql);
    }

    close() {
        debug('CLOSE');
        return this.__connection.close();
    }

    static chain(driver) {
        return {
            open: function(connection) {
                debug('OPEN: %o', connection);
                let __connection = driver.open(connection);
                return new ForwardSQL(__connection);
            }
        }
    }
}

module.exports = {
    open: function(connection) {
        return connection.Driver(connection);
    },
    chain: ForwardSQL.chain
}