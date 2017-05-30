var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	var date;
	var time;
	var detail;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		//console.log(results);
		output = '[{"case_id":"' + results[0].sfid;
		output += '", "casenumber":"' + results[0].name;
		output += '", "type":"' + results[0].type;
		output += '", "problem_type":"' + results[0].problem_type__c;
		output += '", "problem_sub_type":"' + results[0].problem_sub_type__c;
		output += '", "priority":"' + results[0].priority;
		output += '", "subject":"' + results[0].subject;
		output += '", "status":"' + results[0].status;
		output += '", "amount":"' + results[0].amount__c;
		output += '", "agree_to_pay":"' + results[0].agree_to_pay__c;
		output += '", "allow_to_access":"' + results[0].allow_to_access_room__c;
		output += '", "remark":"' + results[0].description;
		output += '", "create_date":"' + results[0].createddate + '"}]';
		output = JSON.parse(output);
		res.json(output);
		//res.json(results);
	})
    .catch(next);
}

exports.getList = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	var https = require('https');
	
	var options = {
	  host: 'app69362200.auth0.com',
	  path: '/userinfo',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
			    var obj = JSON.parse(str);
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					var query = "SELECT * FROM salesforce.Case where accountid='" + results[0].sfid + "' and type<>'Care and Clean'";
					if(!isNaN(limit))
					{
						query += " limit " + limit;
					}
					if(!isNaN(start) && start != 0)
					{
						query += " OFFSET  " + start;
					}
					//console.log(query);
					db.select(query)
					.then(function(results2) {	
						//Build Output
						var output = '[';
						var date;
						var time;
						var detail;
						for(var i = 0 ; i < results2.length ; i++)
						{
							date = results2[0].createddate;
							time = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
							date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + ("0" + date.getFullYear()).slice(-2);		
							output += '{"id":"' + results2[i].sfid;
							output += '", "name":"' + results2[i].subject + ' (' + results2[i].casenumber + ')';
							output += '", "type":"case';
							detail = results2[i].description;
							detail = detail.replace(/(\r\n|\n|\r)/gm, " ");
							//detail = detail.trim();
							output += '", "detail":"' + detail;
							output += '", "status":"' + results2[i].status;
							output += '", "created_date":"' + date;
							output += '", "created_time":"' + time + '"},';
						}
						if(results2.length > 0)
						{
							output = output.substr(0, output.length - 1);
						}
						output += ']';
						console.log(output);
						res.json(JSON.parse(output));
					})
				    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ status: \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openCase = function(req, res, next) {
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	var https = require('https');
	
	var options = {
	  host: 'app69362200.auth0.com',
	  path: '/userinfo',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
			    var obj = JSON.parse(str);
				db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Problem'")
					.then(function(results2) {
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, type, problem_type__c, problem_sub_type__c"
						query += ", Description, allow_to_access_room__c, agree_to_pay__c, priority, subject) ";
						query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', 'Mobile Application', '" + req.body.type + "', '";
						query += req.body.problem_type + "', '" + req.body.problem_sub_type + "', '" + req.body.comment + "', '" + req.body.access + "', '";
						query += req.body.payment + "', 'Medium', '" + req.body.type + "-" + req.body.problem_type + "-" + req.body.problem_sub_type + "')";
						//console.log(query);
						db.select(query)
						.then(function(results3) {
							
							res.send('{ status: "success" }');
						})
					    .catch(next);
					})
				    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ status: \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openCaseOther = function(req, res, next) {
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	var https = require('https');
	
	var options = {
	  host: 'app69362200.auth0.com',
	  path: '/userinfo',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
				
			}
			catch(ex) {	res.status(887).send("{ status: \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openCaseRenew = function(req, res, next) {
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	var https = require('https');
	
	var options = {
	  host: 'app69362200.auth0.com',
	  path: '/userinfo',
	  port: '443',
	  method: 'GET',
	  headers: { 'authorization': head }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
				
			}
			catch(ex) {	res.status(887).send("{ status: \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}
