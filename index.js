var express = require('express')
var	account = require('./server/account')
var room = require('./server/Room')
var announcement = require('./server/announcement')
var feed = require('./server/task')
var mail = require('./server/mailing')
var pay = require('./server/payment')
var case2 = require('./server/case')
var	clean = require('./server/careandclean')
var noti = require('./notification')
var roommate = require('./server/roommate')
var fyi = require('./server/fyi')
var lead = require('./server/lead')
var bodyParser = require('body-parser')
var app = express()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

var path = require("path");

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
//app.set('view engine', 'ejs');
//app.use(express.bodyParser());

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/Test', urlencodedParser, function(req, res) {
	if (!req.body) return res.sendStatus(400);
	console.log(req.body);
	res.send('welcome, ' + req.body);
});

app.get('/room/:id', room.getInfo);

app.get('/studentinfo/:id', lead.getInfobyId);
app.post('/createstudent', jsonParser, lead.createLead);
app.get('/deletestudent/:id', lead.deleteLead);
app.post('/updatestudent/:id', jsonParser, lead.updateLead);

app.get('/challengecode', account.challengecode);
app.get('/verifycode', account.verifycode);
app.get('/getlistzone', account.getZone);
app.get('/deleteuser/:id', account.deleteuser);
app.get('/getuser/:id', account.getmobileid);
app.get('/userinfo', account.getInfo);
app.get('/userinfo2', account.getInfo2);
app.get('/checkstatus', account.checkStatus);
app.post('/updateaccount/:id', jsonParser, account.update);
app.get('/userinfo/:id', account.UserInfobyId);
app.get('/getprimary/:id', account.getprimary);
app.get('/getroommate2/:id', account.getroommate);
//app.get('/userinfobymobileid/:mobileid', account.UserInfobyMobileId);
app.get('/getroomate', account.getRoommate);
app.get('/logout', account.logout);
app.post('/renew', urlencodedParser, account.renew);

app.get('/getroommate/:id', roommate.getAccountRoommate);
app.get('/createroommate', roommate.createRoommate);
app.get('/deleteroommate/:id', roommate.deleteRoommate);
app.get('/updateroommate/:id', roommate.updateRoommate);

app.get('/announcement', announcement.getDetail);
app.get('/feed', feed.getFeed);
app.get('/mailing', mail.getList);
app.get('/mailing/:id', mail.getDetail);
app.get('/billing', pay.getList);
app.get('/billing/:id', pay.getDetail);
app.get('/getfyi', fyi.getDetail);
app.get('/case', case2.getList);
app.get('/case/:id', case2.getDetail);
app.post('/opencaseservice', urlencodedParser, case2.openCaseService);
app.post('/opencasecomplain', urlencodedParser, case2.openCaseComplain);
app.post('/opencaserequest', urlencodedParser, case2.openCaseRequest);
app.post('/opencaseother', urlencodedParser, case2.openCaseOther);
app.post('/opencaseaccess', urlencodedParser, case2.openCaseAccess);
app.post('/opencaseguest', urlencodedParser, case2.openCaseGuest);
app.post('/opencasechange', urlencodedParser, case2.openCaseChange);
app.get('/getcleanrate', clean.getCleanRate);
app.get('/clean', clean.getList);
app.get('/clean/:id', clean.getDetail);
app.post('/openclean', jsonParser, clean.openClean);
app.post('/checkclean', jsonParser, clean.checkCap);

app.get('/checkindetail', account.checkinDetail);
app.post('/checkin', urlencodedParser, account.checkin);
app.post('/requestcheckout', urlencodedParser, account.RequestCheckout);
app.get('/checkout', account.checkout);

app.post('/notification', urlencodedParser, noti.push);

app.get('/view_account/:id', function(request, response){
	console.log(request.params.id);
	response.redirect('/view_account.html?id=' + request.params.id)
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
