var db = require('./pghelper');

exports.getDetail = function(req, res, next){
	var head = req.headers['authorization'];
	var type = req.headers['type'];
	var output = '[{"URL":[';
	db.select("SELECT * FROM salesforce.FYI__c where type__c='" + type + "'")
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
