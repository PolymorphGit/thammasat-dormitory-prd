var db = require('./pghelper');

exports.getDetail = function(req, res, next) {
	var head = req.headers['authorization'];
	var limit = req.headers['limit'];
	var start = req.headers['start'];
	
	var query = "SELECT * FROM salesforce1.Announcement__c Order by createddate desc";
	if(!isNaN(limit))
	{
		query += " limit " + limit;
	}
	if(!isNaN(start) && start != 0)
	{
		query += " OFFSET  " + start;
	}
	db.select(query)
	.then(function(results) {
		var output = '[';
		var createdate;
		var date;
		var time;
		for(var i = 0 ; i <results.length ; i++)
		{
			date = createdate = results[i].createddate;
			date.setHours(date.getHours() + 7);
			time = ("0" + createdate.getHours()).slice(-2) + ':' + ("0" + createdate.getMinutes()).slice(-2);
			date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
			output += '{"id":"' + results[i].sfid;
			output += '", "name":"' + results[i].name;
			output += '", "type":"announcement';
			output += '", "detail":"' + results[i].image_path__c; 
			output += '", "status":"';
			output += '", "created_date":"' + date;
			output += '", "created_time":"' + time + '"},';
		}
		if(results.length)
		{
			output = output.substr(0, output.length - 1);
		}
		output+= ']';
		res.json(JSON.parse(output));
		//res.json(results);
	})
    .catch(next);
	
}
