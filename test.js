const Connection = require('database-js').Connection;


var conn = new Connection('postgres://postgres@localhost/test');
var stmt_drop = conn.prepareStatement("DROP TABLE IF EXISTS test1");
var stmt_create = conn.prepareStatement("CREATE TABLE test1 (key character varying(255), value character varying(1024))");
var stmt_insert = conn.prepareStatement("INSERT INTO test1 VALUES(?, ?)");
var stmt_select = conn.prepareStatement("SELECT * FROM test1 WHERE key = ?")

function handleError(error) {
    console.log("ERROR:", error);
    process.exit(1);
}

stmt_drop.execute().then(() => {
    stmt_create.execute().then(() => {
        stmt_insert.execute('name', 'Michael Anderson').then(() => {
            stmt_select.query('name').then(data => {
                if (data.length != 1) {
                    return handleError(new Error("Invalid data returned"));
                }
                stmt_drop.execute().then(() => {
                    conn.close().then(() => {
                        process.exit(0);
                    }).catch(handleError);
                }).catch(handleError);
            }).catch(handleError);
        }).catch(handleError);
    }).catch(handleError);
}).catch(handleError);

