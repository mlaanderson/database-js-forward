# database-js-forward
Forwards database-js calls onto a base driver with debug output of SQL commands

# About
Database-js-forward takes advantage of the ability to pass a separate driver to the database-js connection.
The base driver is chained through database-js-forward, after the SQL is sent to the debug module.

Database-js-forward is compatible with pools from database-js.

# Connection Constructor
Use the second parameter of the connection constructor and chain the desired driver.
~~~~
    const Database = require('database-js2');
    const Forward = require('database-js-forward').Connection;

    var connection = new Database(<URL>, Forward.chain(require(<driver>)));
~~~~

# Enable Debug Output
~~~~
export DEBUG=database-js-forward
~~~~

# Usage
~~~~
const Database = require('database-js2').Connection;
const Forward = require('database-js-forward');

(async function() {
    let conn = new Database('database-js-postgres://localhost/tests', Forward.chain(require('database-js-postgres')));
    let stmt = conn.prepareStatement('SELECT * FROM data ORDER BY date DESC LIMIT 1');
    let results;
    try {
        results = await stmt.query();
        console.log(results);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await conn.close();
        process.exit(0);
    }
})();
~~~~