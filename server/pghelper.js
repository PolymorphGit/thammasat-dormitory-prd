"use strict";

var pg = require('pg'),
    //databaseURL = process.env.DATABASE_URL || 'postgres://ehuotalmpdqjvs:da48536ca63cdb9f209d7e00695d5e261441f7313b611d670bf104bbb1d24a5a@ec2-54-243-214-198.compute-1.amazonaws.com:5432/df3pgi81qfmoc7';
    //databaseURL = process.env.DATABASE_URL || 'postgres://localhost:5432/df3pgi81qfmoc7';
    //console.log(process.env.DATABASE_URL);
    databaseURL = process.env.DATABASE_URL || 'postgres://u8imgdodm3jkq2:pccc07f14d7068e19ddbf5fd48ccdc226070cff71d26055390fa199c454a79c2d@ec2-52-86-233-50.compute-1.amazonaws.com:5432/d89pl2t2eqpara';
    console.log(databaseURL);

const Pool = require('pg-pool');

const config = {
  user: 'u8imgdodm3jkq2',
  password: 'pccc07f14d7068e19ddbf5fd48ccdc226070cff71d26055390fa199c454a79c2d',
  host: 'ec2-52-86-233-50.compute-1.amazonaws.com',
  port: 5432,
  database: 'df3pgi81qfmoc7',
  ssl: true,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
};

/*
if (process.env.DATABASE_URL !== undefined) 
{
	pg.defaults.ssl = true;	
}
*/
module.exports = (text, cb) => {
   var pool = new pg.Pool(config)
   pool.connect((err, client, done) => {
     if (err) return cb(err);
     client.query(text, (err, result) => {
       done();
       if (err) return cb(err);
       return cb(null, result.rows, result);
       ////cb(err, result);
     });
   });
};
exports.select = function (sql) {
	
	return new Promise((resolve, reject) => {
		
		var pool = new pg.Pool(config)
		//const pool = new Pool(config)
		//const pool = new Pool()
		//console.log('====Start Pool====');
		//pg.connect(databaseURL, function (err, conn, done) {
		
		pool.connect(function(err, conn, done) {
			console.log('====Connected====');
			if (err) reject(err);
			try{
				conn.query(sql, function (err, result) {
					done();
					console.log(sql);
					if(err) reject(err);
					else resolve(result.rows);
				});
			}
			catch (e) {
                		done();
                		reject(e);
            		}
		});
	});
};
