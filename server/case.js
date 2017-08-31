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
		date = results[0].createddate;
		date.setHours(date.getHours() + 7);
		time = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();	
		output = '{"id":"' + results[0].sfid;
		output += '", "name":"' + results[0].subject + ' (' + results[0].casenumber + ')';
		detail = results[0].description == null ? '' : results[0].description;
		detail = detail.replace(/(\r\n|\n|\r)/gm, " ");
		//detail = detail.trim();
		output += '", "detail":"' + detail;
		output += '", "type":"' + results[0].type;
		output += '", "category":"' + results[0].problem_type__c;
		output += '", "sub_category":"' + results[0].problem_sub_type__c;
		output += '", "subject":"' + results[0].subject;
		output += '", "checkout_date":"' + results[0].checkout_date__c;
		output += '", "agree_to_pay":"' + results[0].agree_to_pay__c;
		output += '", "allow_to_access":"' + results[0].allow_to_access_room__c;
		output += '", "amount":"' + results[0].amount__c;
		output += '", "payment_detail":"' + results[0].payment_detail__c;
		output += '", "status":"' + results[0].status;
		
		output += '", "reason_on_hold":"' + results[0].reason_on_hold__c;
		output += '", "checkout_date":"' + results[0].checkout_date__c;
		output += '", "reason_to_checkout":"' + results[0].reason_to_check_out__c;
		output += '", "early_late_access_date":"' + results[0].early_late_access_date__c;
		output += '", "friend_id":"' + results[0].citizen_id_passport_no__c;
		output += '", "stay_start_date":"' + results[0].stay_start_date__c;
		output += '", "request_zone":"' + results[0].request_zone
		output += '", "reason_to_move_room":"' + results[0].reason_to_move_room__c;
		
		output += '", "created_date":"' + date;
		output += '", "created_time":"' + time + '"}';
		console.log(output);
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
					var query = "SELECT * FROM salesforce.Case where accountid='" + results[0].sfid + "' and type<>'Care and Clean'  Order by createddate desc";
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
						console.log(results2);
						var output = '[';
						var date;
						var time;
						var detail;
						for(var i = 0 ; i < results2.length ; i++)
						{
							date = results2[i].createddate;
							if(date != null)
							{
								date.setHours(date.getHours() + 7);
								time = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
								date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();		
								output += '{"id":"' + results2[i].sfid;
								output += '", "name":"' + results2[i].subject + ' (' + results2[i].casenumber + ')';
								output += '", "type":"case';
								detail = results2[i].description == null ? '' : results2[i].description;
								detail = detail.replace(/(\r\n|\n|\r)/gm, " ");
								//detail = detail.trim();
								output += '", "detail":"' + detail;
								if(results2[i].status == 'Approved' || results2[i].status == 'Confirm' || results2[i].status == 'Accepted')
								{
									results2[i].status = 'Completed';	
								}
								output += '", "status":"' + results2[i].status;
								output += '", "created_date":"' + date;
								output += '", "created_time":"' + time + '"},';
							}
						}
						if(output.length > 1)
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
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openCaseService = function(req, res, next) {
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
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Services'")
					.then(function(results2) {
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, type, problem_type__c, problem_sub_type__c";
						query += ", Description, allow_to_access_room__c, agree_to_pay__c, priority, subject) ";
						query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', 'Mobile Application', '" + req.body.type + "', '";
						query += req.body.problem_type + "', '" + req.body.problem_sub_type + "', '" + req.body.comment + "', '" + req.body.access + "', '";
						query += req.body.payment + "', 'Medium', '" + req.body.type + "-" + req.body.problem_type + "-" + req.body.problem_sub_type + "')";
						//console.log(query);
						db.select(query)
						.then(function(results3) {
							
							res.send('{ \"status\": "success" }');
						})
					    .catch(next);
					})
				    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openCaseComplain = function(req, res, next) {
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
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Complain'")
					.then(function(results2) {
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, type, problem_type__c";
						query += ", Description, priority, subject) ";
						query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', 'Mobile Application', '" + req.body.type + "', '";
						query += req.body.problem_type + "', '" + req.body.comment + "', '";
						query += "Medium', '" + req.body.type + "-" + req.body.problem_type + "')";
						//console.log(query);
						db.select(query)
						.then(function(results3) {
							
							res.send('{ \"status\": "success" }');
						})
					    .catch(next);
					})
				    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openCaseRequest = function(req, res, next) {
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
					var type = "Check Mailing";
					if (req.body.problem_type == "ขอทะเบียนบ้าน")
					{
						type = "Request Household";
					}
					db.select("SELECT * FROM salesforce.RecordType WHERE name='" + type + "'")
					.then(function(results2) {
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, type, problem_type__c, description, priority, subject) ";
						query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', 'Mobile Application', 'Request', '" + req.body.problem_type + "', '";
						query += req.body.comment + "', 'Medium', '" + req.body.problem_type + "')";
						//console.log(query);
						db.select(query)
						.then(function(results3) {
							
							res.send('{ \"status\": "success" }');
						})
					    .catch(next);
					})
				    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
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
				var obj = JSON.parse(str);
				db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Other'")
					.then(function(results2) {
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, type, problem_type__c, description, priority, subject) ";
						query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', 'Mobile Application', 'Other', 'อื่นๆ', '";
						query += req.body.comment + "', 'Medium', 'อื่นๆ')";
						//console.log(query);
						db.select(query)
						.then(function(results3) {
							
							res.send('{ \"status\": "success" }');
						})
					    .catch(next);
					})
				    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openCaseAccess = function(req, res, next) {
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
				console.log(results);
				var obj = JSON.parse(str);
				db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					console.log(results);
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Early and Late Access'")
					.then(function(results2) {
						console.log(results2);
						var date = req.body.date;
						date = date.substring(3, 5) + "/" + date.substring(0, 2) + "/" + date.substring(6, 10);
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, type, problem_type__c, description, priority, subject, Early_Late_Access_Date__c) ";
						query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', 'Mobile Application', 'Request', '"; 
						query += req.body.type + "', '" + req.body.comment + "', 'Medium', '" + req.body.type + "', '" + date + "')";
						//console.log(query);
						db.select(query)
						.then(function(results3) {
							console.log(results3);
							res.send('{ \"status\": "success" }');
						})
					    .catch(next);
					})
				    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openCaseGuest = function(req, res, next) {
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
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Request to Stay'")
					.then(function(results2) {
						var date = req.body.date;
						date = date.substring(3, 5) + "/" + date.substring(0, 2) + "/" + date.substring(6, 10);
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, type, problem_type__c, description, priority, subject, citizen_id_passport_no__c, stay_start_date__c) ";
						query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', 'Mobile Application', 'Request', '"; 
						query += "ขออนุญาตค้างคืน', '" + req.body.comment + "', 'Medium', 'ขออนุญาตค้างคืน', '" + req.body.identity_number + "', '" + date + "')";
						//console.log(query);
						db.select(query)
						.then(function(results3) {
							
							res.send('{ \"status\": "success" }');
						})
					    .catch(next);
					})
				    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}

exports.openCaseChange = function(req, res, next) {
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
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Move Room'")
					.then(function(results2) {
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, origin, type, problem_type__c, description, priority, subject, Request_Zone__c, reason_to_move_room__c) ";
						query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', 'Mobile Application', 'Request', '"; 
						query += "ย้ายห้อง', '" + req.body.comment + "', 'Medium', 'ย้ายห้อง', '" + req.body.zone + "', '" + req.body.reason + "')";
						//console.log(query);
						db.select(query)
						.then(function(results3) {
							
							res.send('{ \"status\": "success" }');
						})
					    .catch(next);
					})
				    .catch(next);
				})
			    .catch(next);
			}
			catch(ex) {	res.status(887).send("{ \"status\": \"Invalid access token\" }");	}
		});
	}
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		res.send('problem with request: ${e.message}');
	});
	httprequest.end();
}
