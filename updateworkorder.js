var db = require('./server/pghelper');
var Pusher = require('pusher');

function updateWorkOrder() {
    //console.log('Notification');
    var query = "UPDATE salesforce1.WorkOrder SET caseid = ";
    query += "(SELECT sfid FROM salesforce1.Case WHERE id = salesforce1.WorkOrder.case_heroku_id__c) "
    query += "WHERE salesforce1.WorkOrder.caseid is null or salesforce1.WorkOrder.caseid = 'null' RETURNING *";
    db.select(query)
    .then(function(results) {
      console.log("Record : " + results.length);
      if(results.length > 0)
      {
        for(var i = 0 ; i < results.length ; i++)
        {
          console.log('Update WorkOrder Id:' + results[i].id);
        }
      }
    })
    
}
updateWorkOrder();

function CheckNull(){
	db.select("SELECT * FROM salesforce1.WorkOrder WHERE caseid is null or caseid = ''")	
	.then(function(results) {
		console.log("Record : " + results.length);
		if(results.length > 0)
		{
			for(var i = 0 ; i < results.length ; i++)
			{
		  		console.log('Update WorkOrder Id:' + results[i].id);
			}
		}
	})
}
//CheckNull();
