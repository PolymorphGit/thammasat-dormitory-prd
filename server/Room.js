var db = require('./pghelper');

exports.getInfo = function(req, res, next) {
	var id = req.params.id;
	db.select("SELECT * FROM salesforce.Product2 WHERE SFID='" + id + "'")
	.then(function(results) {
		console.log(results);	
		res.json(results);
	})
    .catch(next);
}