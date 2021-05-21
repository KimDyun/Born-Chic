var mysql = require('mysql');

module.exports = function () {
    return {
        init: function () {
            return mysql.createConnection({
                connectionLimit: 5,
                host: 'localhost',
                user: 'root',
                database: 'tutorial',
                password: 'Wkdtlzm97!'
            })
        },

        test_open: function (con) {
            con.connect(function (err) {
                if (err) {
                    console.error('mysql connection error :' + err);
                } else {
                    console.info('mysql is connected successfully.');
                }
            })
        }
    }
};