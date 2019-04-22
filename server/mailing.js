var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	var date;
	var time;
	db.select("SELECT * FROM salesforce1.Mailing__c WHERE SFID='" + id + "'")
	.then(function(results) {
		//console.log(results);	
		db.select("SELECT * FROM salesforce1.Account WHERE SFID='" + results[0].student_name__c + "'")
		.then(function(results2) {
			//console.log(results2);	
			date = results[0].createddate;
			date.setHours(date.getHours() + 7);
			time = ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
			date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();		
			output = '[{"id":"' + results[0].sfid;
			output += '", "name":"' + results[0].name;
			output += '", "created_date":"' + date;
			output += '", "created_time":"' + time;
			output += '", "owner_name":"' + results2[0].first_name_th__c + ' ' + results2[0].last_name_th__c;
			output += '", "mailing_type__c":"';
			output +=  results[0].mailing_type__c == null ? '' : results[0].mailing_type__c;
			output += '", "received_name__c":"' + (results[0].received_name__c == null ? '' : results[0].received_name__c);			
			date = results[0].received_date__c == null ? '' : results[0].received_date__c;
			/*
			if(date != null)
			{
				date.setHours(date.getHours() + 7);
				date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
			}
			else
			{
				date = '';
			}
			*/
			output += '", "received_date__c":"' + date + '"}]';
			console.log(output);
			res.json(JSON.parse(output));
		})
	    .catch(next);
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
			    db.select("SELECT * FROM salesforce1.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					var query = "SELECT * FROM salesforce1.Mailing__c where Student_Name__c='" + results[0].sfid + "' Order by createddate desc";
					if(!isNaN(limit))
					{
						query += " limit " + limit;
					}
					if(!isNaN(start) && start != 0)
					{
						query += " OFFSET  " + start;
					}
					console.log(query);
					db.select(query)
					.then(function(results2) {	
						//Build Output
						var output = '[';
						var createdate;
						var date;
						var time;
						for(var i = 0 ; i <results2.length ; i++)
						{
							createdate = results2[i].createddate;
							createdate.setHours(createdate.getHours() + 7);
							date = createdate;
							date = ("0" + createdate.getDate()).slice(-2) + '/' + ("0" + (createdate.getMonth() + 1)).slice(-2) + '/' + createdate.getFullYear();
							time = ("0" + createdate.getHours()).slice(-2) + ':' + ("0" + createdate.getMinutes()).slice(-2);
							output += '{"id":"' + results2[i].sfid;
							output += '", "name":"' + results2[i].name;
							output += '", "type":"mailing';
							output += '", "detail":"พัสดุ:' + results2[i].mailing_type__c + ' มาถึงวันที่:' + date;
							output += '", "status":"';
							output += '", "created_date":"' + date;
							output += '", "created_time":"' + time + '"},';
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
