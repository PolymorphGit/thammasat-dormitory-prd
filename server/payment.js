var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var id = req.params.id;
	var output = '';
	var date;
	db.select("SELECT * FROM salesforce.Invoice__c WHERE SFID='" + id + "'")
	.then(function(results) {
		//console.log(results);	
		//output = JSON.stringify(results);
		date = results[0].due_date__c;
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + ("0" + date.getFullYear()).slice(-2);
		output = '[{"id":"' + results[0].sfid;
		output += '", "invoice_id":"' + results[0].name;
		output += '", "due_date":"' + date;
		output += '", "total_amount":"' + results[0].total_amount__c;
		output += '", "create_date":"' + results[0].createddate + '"}]';
		
		db.select("SELECT * FROM salesforce.Invoice_Line_Item__c WHERE Invoice__c='" + results[0].sfid + "'")
		.then(function(results2) {	
			//console.log(results2);
			if(results2.length > 0)
			{
				output = output.substr(0, output.length - 2) + ', "Item":[';
				//output += JSON.stringify(results2);
				for(var i = 0 ; i <results2.length ; i++)
				{
					date = results2[i].due_date__c;
					date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + ("0" + date.getFullYear()).slice(-2);
					output += '{"line_id":"' + results2[i].sfid;
					output += '", "line_number":"' + results2[i].name;
					output += '", "type":"' + results2[i].invoice_line_item_type__c;
					output += '", "date":"' + date;
					output += '", "amount":"' + results2[i].amount__c + '"},';
				}
				output = output.substr(0, output.length - 1);
				output+= ']}]';
			}
			console.log(output);
			output = JSON.parse(output);
			res.json(output);
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
			    db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
					var query = "SELECT * FROM salesforce.Invoice__c where Student_Name__c='" + results[0].sfid + "'";
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
						var createdate, duedate;
						var date, date2;
						var time, time2;
						for(var i = 0 ; i <results2.length ; i++)
						{
							createdate = results2[i].createddate;
							date = ("0" + createdate.getDate()).slice(-2) + '/' + ("0" + createdate.getMonth()).slice(-2) + '/' + ("0" + createdate.getFullYear()).slice(-2);
							time = ("0" + createdate.getHours()).slice(-2) + ':' + ("0" + createdate.getMinutes()).slice(-2);
							duedate = results2[i].due_date__c;
							date2 = duedate.getDate() + '/' + createdate.getMonth() + '/' + createdate.getFullYear();
							time2 = ("0" + duedate.getHours()).slice(-2) + ':' + ("0" + duedate.getMinutes()).slice(-2);
							output += '{"id":"' + results2[i].sfid;
							output += '", "name":"Invoice No. ' + results2[i].name;
							output += '", "type":"billing';
							output += '", "detail":"สิ้นสุดชำระวันที่: ' + date2 + ' จำนวนเงิน:' + results2[i].total_amount__c;
							output += '", "status":"';
							output += '", "created_date":"' + date;
							output += '", "created_time":"' + time + '"},';
						}
						if(results2.length)
						{
							output = output.substr(0, output.length - 1);
						}
						output+= ']';
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
