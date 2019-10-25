const sqlite3 = require('sqlite3').verbose();

// open the database
const db = new sqlite3.Database('./testdata.db');

const sql = `SELECT * FROM testdata`;

db.serialize(() => {
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    console.log(rows);
    console.log(rows[0]);
    console.log(rows[0].test_name);
  });
});

// close the database connection
db.close();
