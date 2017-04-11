var db = require('./pghelper');

exports.getCleanRate = function(req, res, next) {
	var head = req.headers['authorization'];
	var https = require('https');
	
	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			try
			{
				//console.log(JSON.parse(chunk));	
			    str += chunk;
			}
			catch(ex)
			{
				res.send("Invalid access token");
			}
		});
		results.on('end', function() {
		    var obj = JSON.parse(str);
		    //res.send(obj.identities[0].user_id);
		    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
			.then(function(results) {
				db.select("SELECT * FROM salesforce.Product2 WHERE SFID='" + results[0].room__c + "'")
				.then(function(results2) {
					db.select("SELECT * FROM salesforce.Master_Clean_Rate__c where type__c='" + results2[0].room_type__c + "'")
					.then(function(results2) {
						console.log(results2);	
						res.json(results2);
					})
				    .catch(next);
				})
			    .catch(next);
			})
		    .catch(next);
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
	
}

exports.getDetail = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	db.select("SELECT * FROM salesforce.case WHERE SFID='" + id + "' and type='Care and Clean'")
	.then(function(results) {
		//console.log(results);	
		//output = JSON.stringify(results);
		output = '{"Order Id":"' + results[0].sfid;
		output += '", "Allow Access":"' + results[0].allow_to_access_room__c;
		output += '", "Agrre to Payment":"' + results[0].agree_to_pay__c;
		output += '", "Total Amount":"' + results[0].amount__c;
		output += '", "Create Date":"' + results[0].createdate + '"}]';
		
		db.select("SELECT * FROM salesforce.WorkOrder WHERE caseid='" + results[0].sfid + "'")
		.then(function(results2) {	
			//console.log(results2);
			if(results2.length > 0)
			{
				output = output.substr(0, output.length - 2) + ', "Clean":';
				//output += JSON.stringify(results2);
				for(var i = 0 ; i <results2.length ; i++)
				{
					output = '{"Clean Id":"' + results2[i].sfid;
					output += '", "Working Date":"' + results[i].working_date__c;
					output += '", "Period":"' + results2[i].cleaning_period__c;
					output += '", "Status":"' + results2[i].status + '"}]';
				}
			}
			output += '}]';
			output = JSON.parse(output);
			console.log(output);
			res.json(output);
		})
	    .catch(next);
	})
    .catch(next);
}

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var https = require('https');
	
	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			try
			{
				//console.log(JSON.parse(chunk));	
			    str += chunk;
			}
			catch(ex)
			{
				res.send("Invalid access token");
			}
		});
		results.on('end', function() {
		    var obj = JSON.parse(str);
		    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
			.then(function(results) {
				var query = "SELECT * FROM salesforce.WorkOrder where accountid='" + results[0].sfid + "' and status='Completed'";
				if(!isNaN(limit))
				{
					query += " limit " + limit;
				}
				console.log(query);
				db.select(query)
				.then(function(results2) {	
					//Build Output
					var output = '[';
					for(var i = 0 ; i <results2.length ; i++)
					{
						output += '{"Clean Id":"' + results2[i].sfid;
						output += '", "Order Id":"' + results2[i].caseid;
						output += '", "Reporter Name":"' + results[0].name; 
						output += '", "Create Date":"' + results2[i].createdate + '"},';
					}
					if(results2.length)
					{
						output = output.substr(0, output.length - 1);
					}
					output+= ']';
					//console.log(output);
					res.json(JSON.parse(output));
				})
			    .catch(next);
			})
		    .catch(next);
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openClean = function(req, res, next) {
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	var https = require('https');
	
	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
			try
			{
				//console.log(JSON.parse(chunk));	
			    str += chunk;
			}
			catch(ex)
			{
				res.send("Invalid access token");
			}
		});
		results.on('end', function() {
		    var obj = JSON.parse(str);
			db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
			.then(function(results) {
				var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, type, subject, Description";
				query += ", amount__c, allow_to_access_room__c, agree_to_pay__c, priority) ";
				query += "VALUES ('0126F000001e1OIQAY', '" + results[0].sfid + "', 'Care and Clean', 'Care and Clean', '";
				query += req.body[0].comment + "', '" + req.body[0].amount + "', '" + req.body[0].access + "', '";
				query += req.body[0].payment + "', 'Medium') RETURNING *";
				//console.log(query);
				db.select(query)
				.then(function(results2) {
					setTimeout(function () {
						db.select("SELECT * FROM salesforce.Case WHERE id='" + results2[0].id + "'")
						.then(function(results3) {
							//console.log(results3);
							var query2 = "INSERT INTO salesforce.WorkOrder (caseid, working_date__c, cleaning_period__c) VALUES ";
							for(var i = 0 ; i < req.body[0].schedule.length; i++)
							{
								query2 += "('" + results3[0].sfid + "', '" + req.body[0].schedule[i].date + "', '" + req.body[0].schedule[i].time + "'), ";
							}
							if(req.body[0].schedule.length > 0)
							{
								query2 = query2.substr(0, query2.length - 2);
							}
							db.select(query2)
							.then(function(results3) {
								res.send('success');
							})
						    .catch(next);
						})
					    .catch(next);
					}, 5000) 
				})
			    .catch(next);
			})
		    .catch(next);
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}