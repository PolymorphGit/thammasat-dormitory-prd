"use strict";

var pg = require('pg'),
    //databaseURL = process.env.DATABASE_URL || 'postgres://ehuotalmpdqjvs:da48536ca63cdb9f209d7e00695d5e261441f7313b611d670bf104bbb1d24a5a@ec2-54-243-214-198.compute-1.amazonaws.com:5432/df3pgi81qfmoc7';
	databaseURL = process.env.DATABASE_URL || 'postgres://localhost:5432/df3pgi81qfmoc7';
/*
if (process.env.DATABASE_URL !== undefined) 
{
	pg.defaults.ssl = true;	
}
*/
var client = new pg.Client(databaseURL);
client.connect();

exports.select = function (sql) {
	return new Promise((resolve, reject) => {
		client.query(sql, function (err, result) {
			done();
			if (err) throw err;
			console.log(sql);
			//console.log(result.rows);
			resolve(result.rows);
		});
	});
};

exports.upsert = function (sql) {
	client.query(sql);
};