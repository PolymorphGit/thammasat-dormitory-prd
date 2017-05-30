var db = require('./pghelper');

exports.getInfo = function(req, res, next) {
	var head = req.headers['authorization'];
	var https = require('https');

	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  //host: 'thammasat-university.herokuapp.com',
	  //path: '/',
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
			    //res.send(obj.identities[0].user_id);
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					console.log(results);	
					res.json(results);
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
};

exports.deleteuser = function(req, res, next) {
	var id = req.params.id;
	var https = require('https');

	// Build the post string from an object
	var postBody = JSON.stringify({      
		'client_id':'eXK3gp22Vo0qFEXVgOAnWuSdkYpAdEl3',
		'client_secret':'GjV6PSghfaM2ctf8miKFmO1uHZrPpz51ohFkZlAormf6_ZjF_pB5f17mAcjvKWcO',
		'audience':'https://app64319644.auth0.com/api/v2/',
		'grant_type':'client_credentials'
	});
	
	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/oauth/token',
	  //host: 'thammasat-university.herokuapp.com',
	  //path: '/',
	  port: '443',
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json',
		  		 'Content-Length': Buffer.byteLength(postBody)
	  }
	};
	
	callback = function(results) {
		var str = '';
		results.on('data', function(chunk) {
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
				//console.log('return:' + str);
				var obj = JSON.parse(str);
				//obj.access_token
				console.log('Id:' + id + ', Token:' + obj.access_token);
				
				var https2 = require('https');
				var options2 = {
				  host: 'app64319644.auth0.com',
				  path: '/api/v2/users/auth0|' + id,
				  port: '443',
				  method: 'DELETE',
				  headers: { 'Authorization': 'Bearer ' + obj.access_token }
				};
				console.log(options2);
				
				callback2 = function(results2) {
					var str2 = '';
					results2.on('data', function(chunk2) {
						str2 += chunk2;
					});
					results2.on('end', function() {
						try
						{
							console.log(str2);				
							if(str2 == '')
							{
								console.log('Delete Success');
								res.send('Delete Success');
							}
							else
							{
								var obj2 = JSON.parse(str2);
								res.json(obj2);
							}
						}
						catch(ex) {	res.status(887).send("{ status: \"Invalid access token\" }");	}
					});
				}
				
				var httprequest2 = https.request(options2, callback2);
				httprequest2.on('error', (e2) => {
					//console.log(`problem with request: ${e.message}`);
					res.send('problem with request: ${e2.message}');
				});
				httprequest2.end();
			}
			catch(ex) {	res.status(887).send("{ status: \"Invalid access token\" }");	}
		});
	}
	
	var httprequest = https.request(options, callback);
	httprequest.on('error', (e) => {
		//console.log(`problem with request: ${e.message}`);
		res.send('problem with request: ${e.message}');
	});
	httprequest.write(postBody);
	httprequest.end();
};

exports.UserInfobyId = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.Account WHERE SFID='" + id + "'")
	.then(function(results) {
		//console.log(results);	
		res.json(results);
	})
    .catch(next);
};

exports.UserInfobyMobileId = function(req, res, next) {
	var id = req.params.mobileid;
	db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + id + "'")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})	
    .catch(next);
};

exports.update = function(req, res, next) {
	var id = req.params.id;
	if (!req.body) return res.sendStatus(400);
	//console.log(req.body);
	var query = "UPDATE salesforce.Account SET identification_number__c='" + req.body.identification_number__c + "', "; 
	query += "passport_number__c='" + req.body.passport_number__c + "', ";
	query += "gender__c='" + req.body.gender__c + "', ";
	query += "title_th__c='" + req.body.title_th__c + "', ";
	query += "first_name_th__c='" + req.body.first_name_th__c + "', ";
	query += "last_name_th__c='" + req.body.last_name_th__c + "', ";
	query += "salutation='" + req.body.salutation + "', ";
	query += "firstname='" + req.body.firstname + "', ";
	query += "lastname='" + req.body.lastname + "', ";
	query += "personmobilephone='" + req.body.personmobilephone + "', ";
	query += "personemail='" + req.body.personemail + "', ";
	query += "congenital_disease__c='" + req.body.congenital_disease__c + "', ";
	query += "student_id__c='" + req.body.student_id__c + "', ";
	query += "faculty__c='" + req.body.faculty__c + "', ";
	query += "zone__c='" + req.body.zone__c + "', ";
	query += "billingstreet='" + req.body.billingstreet + "', ";
	query += "billingcity='" + req.body.billingcity + "', ";
	query += "billingstate='" + req.body.billingstate + "', ";
	query += "billingpostalcode='" + req.body.billingpostalcode + "', ";
	query += "billingcountry='" + req.body.billingcountry + "', ";
	query += "parent_name__c='" + req.body.parent_name__c + "', ";
	query += "parent_phone__c='" + req.body.parent_phone__c + "', ";
	query += "parent_name_2__c='" + req.body.parent_name_2__c + "', ";
	query += "parent_phone_2__c='" + req.body.parent_phone_2__c + "', ";
	
	query += "sleeping_time__c='" + req.body.sleeping_time__c + "', ";
	query += "sleeping_behavior__c='" + req.body.sleeping_behavior__c + "', ";
	query += "using_air_conditioner__c='" + req.body.using_air_conditioner__c + "', ";
	
	//New Field
	var Scholarship = (req.body.scholarship__c ? req.body.scholarship__c : 'false');
	console.log(Scholarship);
	console.log(req.body.scholarship__c);
	query += "scholarship__c=" + Scholarship + ", ";
	if(req.body.scholarship_name__c)
	{
		query += "scholarship_name__c='" + req.body.scholarship_name__c + "', ";
	}
	var Disable = (req.body.disabled__c ? req.body.disabled__c : 'false');
	query += "disabled__c=" + Disable + ", ";
	var Birthday = '1990-7-2';
	//query += "birthdate__c='" + req.body.birthdate__c + "', ";
	query += "parent_income__c='" + req.body.parent_income__c + "' ";
	if(req.body.year__c)
	{
		query += ", year__c=" + req.body.year__c + ", ";
	}
	if(req.body.term__c)
	{
		query += "term__c='" + req.body.term__c + "' ";
	}
	query += " WHERE SFID='" + id + "'";
	db.select(query)
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})	
    .catch(next);
};

exports.getRoommate = function(req, res, next) {
	//if (!req.body) return res.sendStatus(400);
	db.select("SELECT * FROM salesforce.Account WHERE room__c is null and secondary__c = false")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})	
    .catch(next);
};

exports.logout = function(req, res, next) {
	var head = req.headers['authorization'];
	res.send("{ status: \"Success\" }");
};

exports.checkinDetail = function(req, res, next){
	var head = req.headers['authorization'];
	var output = '[{"URL":[';
	db.select("SELECT * FROM salesforce.Master_Checklist__c")
	.then(function(results) {
		//console.log(results.length);	
		for(var i = 0 ; i < results.length; i++)
		{
			output += '"' + results[0].image_path__c + '", ';
		}
		output = output.substr(0, output.length - 2);
		output += ']}]';
		console.log(output);
		//res.json(results);
		res.json(JSON.parse(output));
	})	
    .catch(next);
}

exports.checkin = function(req, res, next){
	var head = req.headers['authorization'];
	var https = require('https');

	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  //host: 'thammasat-university.herokuapp.com',
	  //path: '/',
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
			    //res.send(obj.identities[0].user_id);
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results2) {
					console.log(results2);
					//TODO: Update account and Create Asset
					if(results2.length > 0)
					{
						var enddate = '';
						var today = new Date();
						var startDate = new Date(today.getFullYear(), 1, 1);
						var endDate = new Date(today.getFullYear(), 5, 31);
						var startDate2 = new Date(today.getFullYear(), 8, 1);
						var endDate2 = new Date(today.getFullYear(), 12, 31);
						var room = results2[0].room__c;
						if((startDate < today && today < endDate) || (startDate2 < today && today < endDate2))
						{
							enddate = today.getFullYear() + '-5-31';
						}
						else
						{
							enddate = today.getFullYear() + '-7-31';
							room = results2[0].room_summer__c;
						}
						
						if (room != null)
						{
							db.select("UPDATE salesforce.Account SET Status__c='Checkin', allow_check_out__c=false, renew__c=false WHERE SFID='" + results2[0].sfid + "' RETURNING *")
							.then(function(results3) {
								console.log(results3);	
								if(results3.length > 0)
								{
									db.select("SELECT * FROM salesforce.product2 where sfid='" + room + "'")
									.then(function(result4) {
										db.select("INSERT INTO salesforce.Asset (Name, accountId, product2id, UsageEndDate, contract_end__c, active__c) VALUES ('" + result4[0].name + "', '" + results2[0].sfid + "', '" + room + "', '" + enddate + "', '" + enddate + "', true)")
										.then(function(results5) {
											console.log(results5);	
											res.send("{ status: \"Success\"}");
										})
									    .catch(next);
									})
								    .catch(next);
								}
							})
						    .catch(next);
						}
						else
						{
							res.send("{ status: \"fail\", detail: \"No room assign, Please contact staff.\"}");
						}
					}
					else
					{
						res.send("{ status: \"fail\", detail: \"User can't Login. Please contact staff.\"}");
						
					}
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
};

exports.RequestCheckout = function(req, res, next) {
	var head = req.headers['authorization'];
	if (!req.body) return res.sendStatus(400);
	//console.log(req.body);
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
		    str += chunk;
		});
		results.on('end', function() {
			try
			{
				//TODO: Open Case
				var obj = JSON.parse(str);
				db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					db.select("SELECT * FROM salesforce.RecordType WHERE name='Checkout'")
					.then(function(results2) {
						var query = "INSERT INTO salesforce.Case (recordtypeid, accountid, Checkout_Date__c) ";
							query += "VALUES ('" + results2[0].sfid + "', '" + results[0].sfid + "', '" + req.body.checkout_date + "')";
							//console.log(query);
							db.select(query)
							.then(function(results3) {
								
								res.send('{ status: \"success\" }');
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

exports.checkout = function(req, res, next){
	var head = req.headers['authorization'];
	var https = require('https');

	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  //host: 'thammasat-university.herokuapp.com',
	  //path: '/',
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
				.then(function(results2) {
					if(results2.length > 0)
					{
					    var obj = JSON.parse(str);
					    //res.send(obj.identities[0].user_id);
					    var query = "UPDATE salesforce.Account SET Status__c='Checkout', room__c='' WHERE SFID='" + results2[0].sfid + "' RETURNING *";
					    if(results2[0].renew__c == true)
				    	{
					    	query = "UPDATE salesforce.Account SET Status__c='Checkout' WHERE SFID='" + results2[0].sfid + "' RETURNING *";
				    	}
					    var today = new Date();
						var startDate = new Date(today.getFullYear(), 6, 1);
						var endDate = new Date(today.getFullYear(), 7, 31);
						if((startDate < today && today < endDate))
						{
							enddate = today.getFullYear() + '-5-31';
							query = "UPDATE salesforce.Account SET Status__c='Checkout', room_summer__c='' WHERE SFID='" + results2[0].sfid + "' RETURNING *";
						}
					    db.select(query)
						.then(function(results3) {
							console.log(results3);
							//TODO: Query Active Asset and Update to deactive and Usage end date to TODAY
							db.select("SELECT * FROM salesforce.Asset WHERE accountId='" + results3[0].sfid + "' and active__c=true")
							.then(function(results4) {
								console.log(results4);	
								var today = new Date();
								var todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
								db.select("UPDATE salesforce.Asset SET active__c=false, usageenddate='" + todayDate + "' WHERE SFID='" + results4[0].sfid + "' RETURNING *")
								.then(function(results5) {
									console.log(results5);	
									//res.json(results);
									res.send("{ status: \"Success\" }");
								})
							    .catch(next);
							})
						    .catch(next);
						})
					    .catch(next);
					}
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

exports.renew = function(req, res, next) {
	var head = req.headers['authorization'];
	var https = require('https');

	var options = {
	  host: 'app64319644.auth0.com',
	  path: '/userinfo',
	  //host: 'thammasat-university.herokuapp.com',
	  //path: '/',
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
			    //TODO: Open Case Renew
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
};

exports.getprimary = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.roommate__c WHERE co_roommate__c='" + id + "'")
	.then(function(results) {
		console.log(results);	
		if(results.length > 0)
		{
			db.select("SELECT * FROM salesforce.Account WHERE sfid='" + results[0].primary_roommate__c + "'")
			.then(function(results2) {
				res.json(results2);
			})
		    .catch(next);
		}
		else
		{
			res.send("This student didn't have primary roommate.");
		}
	})
    .catch(next);
}

exports.getroommate = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.roommate__c WHERE co_roommate__c='" + id + "'")
	.then(function(results) {
		console.log(results);	
		if(results.length > 0)
		{
			db.select("SELECT * FROM salesforce.roommate__c WHERE primary_roommate__c='" + results[0].primary_roommate__c + "'")
			.then(function(results2) {
				var listacc = '(\'' + results[0].primary_roommate__c + '\', ';
				for(var i = 0 ; i < results2.length ; i++)
				{
					listacc += '\'' + results2[i].co_roommate__c + '\', ';
				}
				
				if(results2.length > 0)
				{
					listacc = listacc.substr(0, listacc.length - 2) + ')';
					db.select("SELECT * FROM salesforce.Account WHERE SFID IN " + listacc)
					.then(function(results3) {
						res.json(results3);
					})
					.catch(function(e){console.log(e);});
				}
			})
		    .catch(next);
		}
		else
		{
			res.send("This student didn't have primary roommate.");
		}
	})
    .catch(next);
}

