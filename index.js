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

    /**
     * Indicates whether the underlying driver can support transactions;
     * 
     * @returns {boolean}
     * @memberof Connection
     */
    isTransactionSupported() {
        debug('ISTRANSACTIONSUPPORTED: %s', this.__connection.isTransactionSupported());
        return this.__connection.isTransactionSupported();
    }

    /**
     * Returns true if the underlying driver is in a transaction, false
     * if it does not support transactions or is not in a transaction.
     * 
     * @returns {boolean}
     * @memberof Connection
     */
    inTransaction() {
        debug('INTRANSACTION: %s', this.__connection.inTransaction());
        return this.__connection.inTransaction();
    }

    /**
     * Returns a boolean promise: true if a transaction was started and
     * false if it was not started. Transactions can fail to start if
     * another transaction is already running or if the driver does 
     * not support transactions.
     * 
     * @returns {Promise<boolean>}
     * @memberof Connection
     */
    beginTransaction() {
        debug('BEGINTRANSACTION');
        return this.__connection.beginTransaction();
    }

    /**
     * Returns a boolean promise: true if a transaction was committed and
     * false if one was not committed. Transactions can fail to commit if
     * no transaction was started, or if the driver does not support
     * transactions.
     * 
     * @returns {Promise<boolean>}
     * @memberof Connection
     */
    commit() {
        debug('COMMIT');
        return this.__connection.commit();
    }


    /**
     * Returns a boolean promise: true if a transaction was rolled back and
     * false if one was not rolled back. Transactions can fail to roll back if
     * no transaction was started, or if the driver does not support
     * transactions.
     * 
     * @returns {Promise<boolean>}
     * @memberof Connection
     */
    rollback() {
        debug('ROLLBACK');
        return this.__connection.rollback();
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