var db = require('./pghelper');

exports.getFeed = function(req, res, next) {
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
				console.log(str);
				var obj = JSON.parse(str);
				 db.select("SELECT * FROM salesforce.Account WHERE Mobile_Id__c='" + obj.identities[0].user_id + "'")
				.then(function(results) {
						var query = "SELECT sfid as id, subject||' ('||casenumber||')' as name, 'case' as type, description as detail, status, to_char(createddate + interval '7 hour', 'DD/MM/YYYY') as created_date, to_char(createddate + interval '7 hour', 'HH24:MI') as created_time, createddate FROM salesforce.Case WHERE accountid='" + results[0].sfid + "' and type!='Care and Clean' and createddate is not null";
						query += " UNION ALL ";
						query += "SELECT sfid as id, name, 'announcement' as type, image_path__c as detail, '' as status, to_char(createddate + interval '7 hour', 'DD/MM/YYYY') as created_date, to_char(createddate + interval '7 hour', 'HH24:MI') as created_time, createddate FROM salesforce.Announcement__c";
						query += " UNION ALL ";
						query += "SELECT sfid as id, name, 'mailing' as type, 'พัสดุ:'||mailing_type__c||' มาถึงวันที่:'||to_char(createddate + interval '7 hour', 'DD/MM/YYYY') as detail, '' as status, to_char(createddate + interval '7 hour', 'DD/MM/YYYY') as created_date, to_char(createddate + interval '7 hour', 'HH24:MI') as created_time, createddate FROM salesforce.Mailing__c WHERE Student_Name__c='" + results[0].sfid + "'";
						query += " UNION ALL ";
						query += "SELECT sfid as id, 'ค่าใช้จ่าย '||name, 'billing' as type, 'สิ้นสุดชำระวันที่:'||to_char(due_date__c + interval '7 hour', 'DD/MM/YYYY')||',<br/> จำนวนเงิน:'||coalesce(total_amount__c, 0)||'บาท' as detail, '' as status, to_char(createddate + interval '7 hour', 'DD/MM/YYYY') as created_date, to_char(createddate + interval '7 hour', 'HH24:MI') as created_time, createddate FROM salesforce.Invoice__c WHERE Student_Name__c='" + results[0].sfid + "'";
						query += " UNION ALL ";
					        query += "SELECT sfid as id, subject||' ('||workordernumber||')' as name, 'clean' as type, 'วันที่: '||to_char(working_date__c + interval '7 hour', 'DD/MM/YYYY')||' ช่วงเวลา: '||cleaning_period__c as detail, status, to_char(createddate + interval '7 hour', 'DD/MM/YYYY') as created_date, to_char(createddate + interval '7 hour', 'HH24:MI') as created_time, createddate FROM salesforce.WorkOrder WHERE accountid='" + results[0].sfid + "' and subject='Care and Clean' and createddate is not null";
						query += " Order by createddate desc";
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
							for(var i = 0 ; i < results2.length ; i++)
							{
								if(results2[i].type == "case" && (results2[i].status == 'Approved' || results2[i].status == 'Confirm' || results2[i].status == 'Accepted'))
								{
									results2[i].status = 'Completed';
								}
								//results2[i].detail = results2[i].detail.replace(/Morning/g, 'เช้า');
								//results2[i].detail = results2[i].detail.replace(/Afternoon/g, 'บ่าย');
								/*if(results2[i].detail.substring(results2[i].detail.lenght - 7, results2[i].detail.lenght) == 'Morning')
								{
									results2[i].detail = results2[i].detail.substring(0, results2[i].detail.lenght - 7) + 'เช้า';
								}
								else
								{
									results2[i].detail = results2[i].detail.substring(0, results2[i].detail.lenght - 9) + 'บ่าย';	
								}*/
								console.log(results2[i].detail + ', length : ' + results2[i].detail.lenght);
							}
							res.json(results2)
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
