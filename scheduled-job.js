var db = require('./server/pghelper');
var Pusher = require('pusher');

function sayHello() {
    console.log('Notification');
}
sayHello();

var pusher = new Pusher({
  appId: '345082',
  key: '3b671a9d40df043e9366',
  secret: '83c0c30e8dfc1df9ad67',
  encrypted: true
});

function sendAnnouncement()
{
	
}
sendAnnouncement();

function sendBilling()
{
	var listId = '(';
	var invoiceNo;
	var amount;
	var duedate;
	var to;
	db.select("SELECT * FROM salesforce.Invoice__c WHERE send_notification__c is null or send_notification__c = false limit 5")
	.then(function(results) {
		console.log('Invoice count: ' + results.length);
		for(var i = 0 ; i < results.length ; i++)
		{
			to = results[i].student_name__c;
			invoiceNo = results[i].name;
			amount = results[i].total_amount__c;
			duedate = results[i].due_date__c.toDateString();
			
			console.log('To:' + to + ', No:' + invoiceNo + ', Amount:' + amount + ', message:คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate );
			pusher.trigger(to, 'Billing', {
				no: invoiceNo,
				amount: amount,
				message: 'คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate 
			});
			
			listId += '\'' + results[i].sfid + '\', ';
		}
		
		if(results.length > 0)
		{
			listId = listId.substr(0, listId.length - 2) + ')';
			//TODO Mark Send Notification to true
			db.select("UPDATE salesforce.Invoice__c SET send_notification__c=true WHERE SFID IN " + listId)
			.then(function(results) {
				console.log('Invoice complete');
			})
			.catch(function(e){console.log(e);});
		}
	})
	.catch(function(e){console.log(e);});
}
sendBilling();

function sendMailing()
{
	var listId = '(';
	var to;
	db.select("SELECT * FROM salesforce.Mailing__c WHERE send_notification__c is null or send_notification__c = false limit 5")
	.then(function(results) {
		console.log('Mailing count: ' + results.length);
		for(var i = 0 ; i < results.length ; i++)
		{
			to = results[i].student_name__c
			console.log('To:' + to + ', No:' + results[i].name + ', type:' + results[i].mailing_type__c + ', date:' + results[i].createddate.toDateString());
			pusher.trigger(to, 'Mailing', {
				no: results[i].name,
				message: 'มีพัศดุ ' + results[i].mailing_type__c + ' ส่งถึงคุณ วันที่ ' + results[i].createddate.toDateString()
			});
			
			listId += '\'' + results[i].sfid + '\', ';
		}
		
		if(results.length > 0)
		{
			//TODO Mark Send Notification to true
			listId = listId.substr(0, listId.length - 2) + ')';
			//TODO Mark Send Notification to true
			db.select("UPDATE salesforce.Mailing__c SET send_notification__c=true WHERE SFID IN " + listId)
			.then(function(results) {
				console.log('Mailing complete');
			})
			.catch(function(e){console.log(e);});
		}
	})
	.catch(function(e){console.log(e);});
}
sendMailing();

function sendContractExpire()
{
	var listId = '(';
	var to;
	db.select("SELECT * FROM salesforce.Asset WHERE active__c=true and send_notification__c=false and contract_end__c > NOW() - interval '1 months' limit 5")
	.then(function(results) {
		console.log(results);
		for(var i = 0 ; i < results.length ; i++)
		{
			to = results[i].accountid;
			console.log('To:' + to + ', สัญญาจะหมดอายุในวันที่:' + results[i].contract_end__c.toDateString());
			pusher.trigger(to, 'Contract Expire', {
				message: 'สัญญาจะหมดอายุในวันที่:' + results[i].contract_end__c.toDateString()
			});
			
			listId += '\'' + results[i].sfid + '\', ';
		}
		
		if(results.length > 0)
		{
			//TODO Mark Send Notification to true
			listId = listId.substr(0, listId.length - 2) + ')';
			//TODO Mark Send Notification to true
			db.select("UPDATE salesforce.Asset SET send_notification__c=true WHERE SFID IN " + listId)
			.then(function(results) {
				console.log('Contract complete');
			})
			.catch(function(e){console.log(e);});
		}
	})
	.catch(function(e){console.log(e);});
}
sendContractExpire();
