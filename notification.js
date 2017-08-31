var db = require('./server/pghelper');
var Pusher = require('pusher');
//var Pusher = require('cloud/modules/node_modules/pusher/parse');

var pusher = new Pusher({
  appId: '345082',
  key: '3b671a9d40df043e9366',
  secret: '83c0c30e8dfc1df9ad67',
  encrypted: true,
  cluster: "mt1"
});

exports.push = function(req, res, next) 
{
	var id = req.headers['sfid'];
	var type = req.headers['type'];
	var message = req.body.message;
	console.log('---message : ' + message);
	//console.log('---Body : ' + req.body);
	var result = true;
	switch(type)
	{
		case 'billing' : result = getBilling(id, next);	break;
		case 'mailing' : result = getMailing(id, next);	break;
		case 'problem working' : result = problemWorking(id, next);	break;
		case 'problem on hold' : result = problemHold(id, message, next);	break;
		case 'problem closed' : result = problemClosed(id, message, next);	break;
		case 'complain accept' : result = complainAccept(id, message, next);	break;
		case 'clean closed' : result = cleanClosed(id, next);	break;
		case 'checkout confirm' : result = checkoutConfirm(id, next);	break;
		case 'checkout payment' : result = checkoutPayment(id, message, next);	break;
		case 'access approve' : result = accessApprove(id, next);	break;
		case 'access reject' : result = accessReject(id, message, next);	break;
		case 'leave approve' : result = leaveApprove(id, next);	break;
		case 'leave reject' : result = leaveReject(id, message, next);	break;
		case 'stay approve' : result = stayApprove(id, next);	break;
		case 'stay reject' : result = stayReject(id, message, next);	break;
		case 'room accept' : result = roomAccept(id, next);	break;
		case 'room reject' : result = roomReject(id, message, next);	break;
		case 'mail found' : result = mailFound(id, next);	break;
		case 'mail not found' : result = mailNotFound(id, next);	break;
		case 'household in progress' : result = houseProgress(id, next);	break;
		case 'household wait doc' : result = houseDoc(id, next);	break;
		case 'household completed' : result = houseCompleted(id, next);	break;
		case 'other in progress' : result = otherProgress(id, next);	break;
		case 'other completed' : result = otherCompleted(id, message, next);	break;
		default: testSend();
	}
	if(result == false)
	{
		res.send("Fail");
	}
	res.send("Success");
}

function getBilling(id, next)
{
	//TODO: get Bill detail
	var invoiceNo;
	var amount;
	var duedate;
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Invoice__c WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].student_name__c;
		invoiceNo = results[0].name;
		amount = results[0].total_amount__c;
		duedate = results[0].due_date__c;
		duedate = duedate.setHours(duedate.getHours() + 7);
		
		console.log('To:' + to + ', No:' + invoiceNo + ', Amount:' + amount + ', message:คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate );
		noti = { title : 'คุณมียอดค่าใช้จ่าย จำนวน ' + amount + 'บาท', 
				 body : 'คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate,
				 click_action: 'MAIN_ACTIVITY'};
		payload = {	ID: results[0].sfid,
				    type: 'Billing',
				    message: 'คุณมียอดค่าใช้ ' + amount + ' บาท กำหนดชำระวันที่ ' + duedate };
		//pusher.trigger(to, 'Billing', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function getMailing(id, next)
{
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Mailing__c WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].student_name__c;
		console.log('To:' + to + ', No:' + results[0].name + ', type:' + results[0].mailing_type__c + ', date:' + results[0].received_date__c);
		noti = { title : 'มีพัศดุส่งมาถึง วันที่ ' + results[0].createddate.toDateString(), 
				 body : 'มีพัศดุ ' + results[0].mailing_type__c + ' ส่งถึงคุณ วันที่ ' + results[0].createddate.toDateString(),
				 click_action: 'MAIN_ACTIVITY'};
		payload = {	ID: results[0].sfid,
				type: 'Mailing',
				message: 'มีพัศดุ ' + results[0].mailing_type__c + ' ส่งถึงคุณ วันที่ ' + results[0].createddate.toDateString() };
		//pusher.trigger(to, 'Mailing', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function problemWorking(id, next)
{
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'กำลังดำเนินการแก้ไข Case ' + results[0].casenumber, 
				 body : results[0].subject + ' กำลังดำเนินการ',
				 click_action: 'MAIN_ACTIVITY'};
		payload = { ID: results[0].sfid,
					type: 'Case',
					message: results[0].subject + ' กำลังดำเนินการ' };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function problemHold(id, message, next)
{
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'Case ' + results[0].casenumber + ' ได้ถูกพักช่ั่วคราว', 
				 body : 'Case ' + results[0].subject + ' ได้ถูกพักเนื่องจาก '+ message,
				 click_action: 'MAIN_ACTIVITY'};
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'Case ' + results[0].subject + ' ได้ถูกพักเนื่องจาก '+ message };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function problemClosed(id, message, next)
{
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'Case ' + results[0].casenumber + ' ได้ดำเนินการแก้ไข', 
				 body : 'Case ' + results[0].subject + ' ได้ได้ทำการแก้ไขแล้ว ' + message,
				 click_action: 'MAIN_ACTIVITY'};
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'Case ' + results[0].subject + ' ได้ได้ทำการแก้ไขแล้ว '+ message };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function complainAccept(id, message, next)
{
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'รับทราบ ' + results[0].casenumber, 
				 body : 'ได้รับทราบเรื่อง ' + results[0].subject + ' แล้ว '+ message,
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'ได้รับทราบเรื่อง ' + results[0].subject + ' แล้ว '+ message };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function cleanClosed(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.WorkOrder WHERE SFID='" + id + "'")
	.then(function(results) {
		console.log(results);
		db.select("SELECT * FROM salesforce.Case WHERE SFID='" + results[0].caseid + "'")
		.then(function(results2) {
			to = results2[0].accountid;
			date = new Date(results[0].working_date__c);
			date.setHours(date.getHours() + 7);
			date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();
			console.log('To:' + to + ', No:' + results2[0].casenumber + ', Subject:' + results2[0].subject + ', Working Date:' + results[0].working_date__c + ', Period:' + results[0].cleaning_period__c);
			noti = { title : 'ได้ทำความสะอาด วันที่ ' + date + ' แล้ว', 
					 body : 'Subject:' + results2[0].subject + ', Working Date:' + date + ', Period:' + results[0].cleaning_period__c,
					 click_action: 'MAIN_ACTIVITY' };
			payload = {	ID: results[0].sfid,
						type: 'Clean',
						message: 'Subject:' + results2[0].subject + ', Working Date:' + date + ', Period:' + results[0].cleaning_period__c };
			//pusher.trigger(to, 'Clean', payload);
			pusher.notify([to], {
				apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
				fcm: { notification : noti, badge : 1, sound : "default", data : payload }
			});
			return true;
		})
		.catch(next);
	})
	.catch(next);
}

function checkoutConfirm(id, next)
{
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'อนุญาติให้ทำการ Check-out ได้', 
				 body : 'อนุญาติให้ทำการ Check-out ได้ ',
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'อนุญาติให้ทำการ Check-out ได้' };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function checkoutPayment(id, message, next)
{
	var to;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : message, 
				 body : message,
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: message };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function accessApprove(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].early_late_access_date__c;
		date.setHours(date.getHours() + 7);
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'อนุญาติเข้าหอดึกได้ในวันที่ ' + date, 
				 body : 'อนุญาติเข้าหอดึกได้ในวันที่ ' + date,
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'อนุญาติเข้าหอดึกได้ในวันที่ ' + date };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function accesReject(id, message, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].early_late_access_date__c;
		date.setHours(date.getHours() + 7);
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'ไม่อนุญาติเข้าหอดึกได้ในวันที่ ' + date + ' เนื่องจาก ' + message, 
				 body : 'ไม่อนุญาติเข้าหอดึกได้ในวันที่ ' + date + ' เนื่องจาก ' + message,
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'ไม่อนุญาติเข้าหอดึกได้ในวันที่ ' + date + ' เนื่องจาก ' + message };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function leaveApprove(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].early_late_access_date__c;
		date.setHours(date.getHours() + 7);
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'อนุญาติออกจากหอพักก่อนเวลาได้ในวันที่ ' + date, 
				 body : 'อนุญาติออกจากหอพักก่อนเวลาได้ในวันที่ ' + date,
				 click_action: 'MAIN_ACTIVITY' };
		payload =  {	ID: results[0].sfid,
						type: 'Case',
						message: 'อนุญาติออกจากหอพักก่อนเวลาได้ในวันที่ ' + date };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function leaveReject(id, message, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].early_late_access_date__c;
		date.setHours(date.getHours() + 7);
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'ไม่อนุญาติออกจากหอพักก่อนเวลาได้ในวันที่ ' + date + ' เนื่องจาก ' + message, 
				 body : 'ไม่อนุญาติออกจากหอพักก่อนเวลาได้ในวันที่ ' + date + ' เนื่องจาก ' + message,
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'ไม่อนุญาติออกจากหอพักก่อนเวลาได้ในวันที่ ' + date + ' เนื่องจาก ' + message };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function stayApprove(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].stay_start_date__c;
		date.setHours(date.getHours() + 7);
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'อนุญาติให้พาเพื่อนเข้าพักได้วันที่ ' + date , 
				 body : 'อนุญาติให้พาเพื่อนเข้าพักได้วันที่ ' + date,
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'อนุญาติให้พาเพื่อนเข้าพักได้วันที่ ' + date };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function stayReject(id, message, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		date = results[0].stay_start_date__c;
		date = date.setHours(date.getHours() + 7);
		date = ("0" + date.getDate()).slice(-2) + '/' + ("0" + date.getMonth()).slice(-2) + '/' + date.getFullYear();	
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'ไม่อนุญาติให้พาเพื่อนเข้าพักได้วันที่ ' + date + ' เนื่องจาก ' + message, 
				 body : 'ไม่อนุญาติให้พาเพื่อนเข้าพักได้วันที่ ' + date + ' เนื่องจาก ' + message,
				 click_action: 'MAIN_ACTIVITY' };
		payload =  {	ID: results[0].sfid,
						type: 'Case',
						message: 'ไม่อนุญาติให้พาเพื่อนเข้าพักได้วันที่ ' + date + ' เนื่องจาก ' + message };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function roomAccept(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'อนุญาติให้ทำการย้ายห้อง', 
				 body : 'อนุญาติให้ทำการย้ายห้อง',
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'อนุญาติให้ทำการย้ายห้อง' };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function roomReject(id, message, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'ไม่อนุญาติให้ทำการย้ายห้อง เนื่องจาก ' + message, 
				 body : 'ไม่อนุญาติให้ทำการย้ายห้อง เนื่องจาก ' + message,
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'ไม่อนุญาติให้ทำการย้ายห้อง เนื่องจาก ' + message };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function mailFound(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'พบพัศดุของท่าน ให้มารับได้', 
				 body : 'พบพัศดุของท่าน ให้มารับได้',
				 click_action: 'MAIN_ACTIVITY' };
		payload =  {	ID: results[0].sfid,
						type: 'Case',
						message: 'พบพัศดุของท่าน ให้มารับได้' };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function mailNotFound(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'ไม่พบพัศดุของท่าน', 
				 body : 'ไม่พบพัศดุของท่าน',
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'ไม่พบพัศดุของท่าน' };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function houseProgress(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'กำลังดำเนินการขอเอกสารทะเบียนบ้านให้', 
				 body : 'กำลังดำเนินการขอเอกสารทะเบียนบ้านให้',
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'กำลังดำเนินการขอเอกสารทะเบียนบ้านให้' };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function houseDoc(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'ไม่ได้รับเอกสารในการขอทะเบียนบ้าานของท่าน กรุณานำส่งที่จุดรับด้วย', 
				 body : 'ไม่ได้รับเอกสารในการขอทะเบียนบ้าานของท่าน กรุณานำส่งที่จุดรับด้วย',
				 click_action: 'MAIN_ACTIVITY' };
		payload =  {	ID: results[0].sfid,
						type: 'Case',
						message: 'ไม่ได้รับเอกสารในการขอทะเบียนบ้าานของท่าน กรุณานำส่งที่จุดรับด้วย' };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function houseCompleted(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'ไม่ได้รับเอกสารในการขอทะเบียนบ้าานของท่าน กรุณานำส่งที่จุดรับด้วย', 
				 body : 'ไม่ได้รับเอกสารในการขอทะเบียนบ้าานของท่าน กรุณานำส่งที่จุดรับด้วย',
				 click_action: 'MAIN_ACTIVITY' };
		payload =  {	ID: results[0].sfid,
						type: 'Case',
						message: 'เอกสสารทะเบียนบ้านของท่านมาถึงแล้ว' };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function otherProgress(id, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : 'ได้รับเรื่อง' + results[0].description + 'กำลังดำเนินการ' ,
				 body : 'ได้รับเรื่อง' + results[0].description + 'กำลังดำเนินการ',
				 click_action: 'MAIN_ACTIVITY' };
		payload = {	ID: results[0].sfid,
					type: 'Case',
					message: 'ได้รับเรื่อง' + results[0].description + 'กำลังดำเนินการ' };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function otherCompleted(id, message, next)
{
	var to;
	var date;
	var noti;
	var payload;
	db.select("SELECT * FROM salesforce.Case WHERE SFID='" + id + "'")
	.then(function(results) {
		to = results[0].accountid;
		console.log('To:' + to + ', No:' + results[0].casenumber + ', Subject:' + results[0].subject);
		noti = { title : message, 
				 body : message,
				 click_action: 'MAIN_ACTIVITY'};
		payload = { ID: results[0].sfid, type: 'Case', message: message };
		//pusher.trigger(to, 'Case', payload);
		pusher.notify([to], {
			apns: { aps: { alert : noti, badge : 1, sound : "default", data : payload } },
			fcm: { notification : noti, badge : 1, sound : "default", data : payload }
		});
		return true;
	})
	.catch(next);
}

function testSend()
{
	/*
	var events = [{
	  channel: "my-channel-1",
	  name: "Billing",
	  data: {message: "hello world"}
	},
	{
	  channel: "my-channel-2",
	  name: "Billing",
	  data: {message: "hello another world"}
	},
	{
	  channel: "my-channel-3",
	  name: "Billing",
	  data: {message: "hello another world"}
	},
	{
	  channel: "my-channel-4",
	  name: "Billing",
	  data: {message: "hello another world"}
	},
	{
	  channel: "my-channel-5",
	  name: "Billing",
	  data: {message: "hello another world"}
	}];
	pusher.triggerBatch(events);
	*/
	return false;
}
