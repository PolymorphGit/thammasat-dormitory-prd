angular.module('leadApp', [])
.controller('mainController', function ($scope, $http) {
  $scope.id = null;
  $scope.lead = { };
  
  //$scope.salutation = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
  $scope.title = ['นาย', 'นางสาว', 'นาง'];
  $scope.gender = ['Male', 'Female'];
  $scope.salutation2 = ['Mr.', 'Ms.', 'Mrs.'];
  
  $scope.graduated_area=["Bangkok and Metropolitan","Other"];

  $scope.salutation=[{'Gender':'Male','salutations':['Mr.']},{'Gender':'Female' ,'salutations':['Ms.', 'Mrs.']} ];
  
  /*
  $scope.faculty = ['นิติศาสตร์ 99/3', 'พาณิชยศาสตร์และการบัญชี 99/4', 'รัฐศาสตร์ 99/10', 'เศรษฐศาสตร์ 99/8', 'สังคมสงเคราะห์ศาสตร์ 99/9', 'สังคมวิทยามนุษย์วิทยา 99/10', 'ศิลปศาสตร์ 99/5',
	  				'วารสารศาสตร์และสื่อสารมวลชน 99/10', 'วิทยาศาสตร์และเทคโนโลยี 99/2', 'วิศวกรรมศาสตร์ 99/6', 'สถาบันเทคโนโลยีนานาชาติสิรินธร 99/7', 'สถาปัตยกรรมศาสตร์และผังเมือง 99/10',
	  				'ศิลปกรรมศาสตร์ 99/10', 'แพทย์ศาสตร์ 99/10', 'สหเวชศาสตร์ 99/10', 'ทันตแพทยศาสตร์ 99/10', 'พยาบาลศาสตร์ 99/10', 'สาธารณสุขศาสตร์ 99/10', 'เภสัชศาสตร์ 99/10',
	  				'วิทยาการเรียนรู้และศึกษาศาสตร์ 99/10', 'วิทยาลัยพัฒนศาสตร์ ป๋วย อึ๊งภากรณ์ 99/10', 'วิทยาลัยนานาชาติ ปรีดี พนมยงค์ 99/10', 'วิทยาลัยแพทยศาสตร์นานาชาติจุฬาภรณ์ 99/10',
	  				'วิทยาลัยโลกคดีศึกษา 99/10', 'อื่นๆ 99/10', 'สถาบันภาษา 99/10', 'วิทยาลัยนวัตกรรม 99/10', 'วิทยาลัยสหวิทยาการ 99/10'];
	  				*/
  $scope.faculty = ['Faculty of Allied Health Sciences','Faculty of Architecture and Planning'
                    ,'Faculty of Commerce and Accountancy','Chulabhorn International College of Medicine'
                    ,'College of Innovation','College of Interdisciplinary Studies','Faculty of Dentistry'
                    ,'Faculty of Economics','Faculty of Engineering','Faculty of Fine and Applied Arts'
                    ,'Faculty of Journalism and Mass Communication','Language Institute','Faculty of Law'
                    ,'Faculty of Learning Sciences and Education','Faculty of Liberal Arts','Faculty of Medicine'
                    ,'Faculty of Nursing','Faculty of Pharmacy','Faculty of Political Science','Pridi Banomyong International College'
                    ,'Faculty of Public Health','Puey Ungphakorn School of Development Studies','School of Global Studies'
                    ,'Faculty of Science and Technology','Sirindhorn International Institute of Technology'
                    ,'Faculty of Social Administration','Faculty of Sociology and Anthropology','Others'];
  $scope.zone = [{'Gender':'Male', 'Scholar': false, 'zones':['Zone B (4-person room)'
                                            ,'Zone C and E (2-person room)','Zone C Plus (2-person room)'
                                            ,'Zone M (4-person room | air-condition | share WC)','Zone M (4-person room | air-condition | private WC)'
                                            ,'Zone M (4-person room | fan | share WC)','Zone M (4-person room | fan | private WC)']}, 
                 {'Gender':'Male', 'Scholar': true, 'zones':['Zone M (4-person room | air-condition | share WC)','Zone M (4-person room | air-condition | private WC)'
                                            ,'Zone M (4-person room | fan | share WC)','Zone M (4-person room | fan | private WC)']}, 
	  			 {'Gender':'Female', 'Scholar': false, 'zones':['Zone B (4-person room)','Zone B8 (4-person room)'
	  			                              ,'Zone C and E (2-person room)','Zone C Plus (2-person room)'
	  			                              ,'Zone F (4-person room | air-condition | share WC)','Zone F (4-person room | air-condition | private WC)'
	  			                              ,'Zone F (4-person room | fan | share WC)','Zone F (4-person room | fan | private WC)']},
	  			 {'Gender':'Female', 'Scholar': true, 'zones':['Zone F (4-person room | air-condition | share WC)','Zone F (4-person room | air-condition | private WC)'
	  			                              ,'Zone F (4-person room | fan | share WC)','Zone F (4-person room | fan | private WC)']
	  			                              }];
  
  $scope.sleepingtime = ['Before 10:00 PM','After 10:00 PM'];
  $scope.sleepingbehavior = ['Not Snore','Snore'];
  $scope.usingairconditioner = ['Turn On Air Conditioner','Turn Off Air Conditioner'];
  
	  			
  $scope.$watch('lead.gender__c', function(newVal) {
      if (newVal)
      {
    	  //alert($scope.lead.gender__c);
    	  angular.forEach($scope.zone , function(value)
	      {
    		  //alert(value.Gender);
    		  
    		  if(value.Gender == $scope.lead.gender__c && value.Scholar == $scope.lead.scholarship__c)
    		  {
    			//alert(value.zones);
    	  		$scope.zones = value.zones;
    		  }
	      });
    	  
    	  
    	  angular.forEach($scope.salutation , function(value)
	      {
    		  //alert(value.Gender);
    		  if(value.Gender == $scope.lead.gender__c)
    		  {
    			//alert(value.zones);
    			$scope.salutations = value.salutations;
    		  }
	      });
    	  
      }
  });
  
  $scope.country = ['Thailand'];
  $scope.state = ['Amnat Charoen', 'Ang Thong', 'Bangkok', 'Bueng Kan', 'Buriram', 'Chachoengsao', 'Chai Nat', 'Chaiyaphum', 'Chanthaburi', 
		  		  'Chiang Mai', 'Chiang Rai', 'Chonburi', 'Chumphon', 'Kalasin', 'Kamphaeng', 'Kanchanaburi', 'Khon Kaen', 'Krabi', 
		  		  'Lampang', 'Lamphun', 'Loei', 'Lopburi','	Mae Hong Son', 'Maha Sarakham', 'Mukdahan', 'Nakhon Nayok', 'Nakhon Pathom', 
		  		  'Nakhon Phanom', 'Nakhon Ratchasima', 'Nakhon Sawan', 'Nakhon Si Thammarat', 'Nan', 'Narathiwat', 'Nong Bua Lamphu', 
		  		  'Nong Khai', 'Nonthaburi', 'Pathum Thani', 'Pattani', 'Phang Nga', 'Phatthalung', 'Phayao', 'Phetchabun', 'Phetchaburi', 
		  		  'Phichit', 'Phitsanulok', 'Phrae', 'Phra Nakhon Si Ayutthaya', 'Phuket', 'Prachinburi', 'Prachuap Khiri Khan', 
		  		  'Ranong', 'Ratchaburi', 'Rayong', 'Roi Et', 'Sa Kaeo', 'Sakon Nakhon', 'Samut Prakan', 'Samut Sakhon', 'Samut Songkhram', 
		  		  'Saraburi', 'Satun', 'Sing Buri', 'Sisaket', 'Songkhla', 'Sukhothai', 'Suphan Buri', 'Surat Thani', 'Surin', 'Tak', 
		  		  'Trang', 'Trat', 'Ubon Ratchathani','Udon Thani', 'Uthai Thani', 'Uttaradit', 'Yala', 'Yasothon'];
 
  $scope.scholarshipname =[{'Scholarship__c':true, 'scholarshipnames':['Full Scholarship', 'Partial Scholarship', 'Birthday Scholarship',
	  																   'Thammasat University Hospital Scholarship', 'Somdejya Scholarship',
	  																   'SCiUS Scholarship', 'Disability Scholarship']}];

  $scope.$watch('lead.scholarship__c', function(newVal) {
      /*if (newVal)
      {
    	  angular.forEach($scope.scholarshipname , function(value)
	      {
    		  if(value.Scholarship__c == $scope.lead.scholarship__c)
    		  {
    	  		$scope.scholarshipnames = value.scholarshipnames;
    		  }
	      });
      }*/
	  //if (newVal)
      {
    	  //alert($scope.lead.scholarship__c);
    	  angular.forEach($scope.zone , function(value)
	      {
    		  if(value.Gender == $scope.lead.gender__c && value.Scholar == $scope.lead.scholarship__c)
    		  {
    			  //alert(value.zones);
    	  			$scope.zones = value.zones;
    		  }
	      });
      }
  });
  
  $scope.getData = function () {	
	//alert(accountId);
    $http.get('../studentinfo/' + $scope.id)
    .success((data) => {
    	console.log(data);
    	
    	data[0].Name = data[0].Name == null || data[0].Name =='null' ? '' : data[0].Name;
    	data[0].identification_number__c = data[0].identification_number__c == null || data[0].identification_number__c =='null' ? '' : data[0].identification_number__c;
    	data[0].passport_number__c = data[0].passport_number__c == null || data[0].passport_number__c =='null' ? '' : data[0].passport_number__c;
    	data[0].gender__c = data[0].gender__c == null || data[0].gender__c =='null' ? '' : data[0].gender__c;
    	data[0].title_th__c = data[0].title_th__c == null || data[0].title_th__c =='null' ? '' : data[0].title_th__c;
    	data[0].first_name_th__c = data[0].first_name_th__c == null || data[0].first_name_th__c =='null' ? '' : data[0].first_name_th__c;
    	data[0].last_name_th__c = data[0].last_name_th__c == null || data[0].last_name_th__c =='null' ? '' : data[0].last_name_th__c;
    	data[0].salutation = data[0].salutation == null || data[0].salutation =='null' ? '' : data[0].salutation;
    	data[0].firstname = data[0].firstname == null || data[0].firstname =='null' ? '' : data[0].firstname;
    	data[0].lastname = data[0].lastname == null || data[0].lastname =='null' ? '' : data[0].lastname;
    	data[0].birthdate__c = data[0].birthdate__c == null || data[0].birthdate__c =='null' ? '' : data[0].birthdate__c;
    	data[0].personmobilephone = data[0].personmobilephone == null || data[0].personmobilephone =='null' ? '' : data[0].personmobilephone;
    	data[0].personemail = data[0].personemail == null || data[0].personemail =='null' ? '' : data[0].personemail;
    	data[0].graduated_from__c = data[0].graduated_from__c == null || data[0].graduated_from__c =='null' ? '' : data[0].graduated_from__c;
    	data[0].graduated_area__c = data[0].graduated_area__c == null || data[0].graduated_area__c =='null' ? '' : data[0].graduated_area__c;
    	data[0].congenital_disease__c = data[0].congenital_disease__c == null || data[0].congenital_disease__c =='null' ? '' : data[0].congenital_disease__c;
    	data[0].student_id__c = data[0].student_id__c == null || data[0].student_id__c =='null' ? '' : data[0].student_id__c;
    	data[0].faculty__c = data[0].faculty__c == null || data[0].faculty__c =='null' ? '' : data[0].faculty__c;
    	data[0].request_zone__c = data[0].request_zone__c == null || data[0].request_zone__c =='null' ? '' : data[0].request_zone__c;
    	data[0].scholarship__c = data[0].scholarship__c == null || data[0].Scholarship__c =='null' ? '' : data[0].scholarship__c;
    	data[0].scholarship_Name__c = data[0].scholarship_Name__c == null || data[0].scholarship__c =='null' ? '' : data[0].scholarship__c;
    	data[0].billingstreet = data[0].billingstreet == null || data[0].billingstreet =='null' ? '' : data[0].billingstreet;
    	data[0].billingcity = data[0].billingcity == null || data[0].billingcity =='null' ? '' : data[0].billingcity;
    	data[0].billingstate = data[0].billingstate == null || data[0].billingstate =='null' ? '' : data[0].billingstate;
    	data[0].billingpostalcode = data[0].billingpostalcode == null || data[0].billingpostalcode =='null' ? '' : data[0].billingpostalcode;
    	data[0].billingcountry = data[0].billingcountry == null || data[0].billingcountry =='null' ? '' : data[0].billingcountry;
    	data[0].parent_name__c = data[0].parent_name__c == null || data[0].parent_name__c =='null' ? '' : data[0].parent_name__c;
    	data[0].parent_phone__c = data[0].parent_phone__c == null || data[0].parent_phone__c =='null' ? '' : data[0].parent_phone__c;
    	data[0].parent_income__c = data[0].parent_income__c == null || data[0].parent_income__c =='null' ? '' : data[0].parent_income__c;
    	data[0].parent_name_2__c = data[0].parent_name_2__c == null || data[0].parent_name_2__c =='null' ? '' : data[0].parent_name_2__c;
    	data[0].parent_phone_2__c = data[0].parent_phone_2__c == null || data[0].parent_phone_2__c =='null' ? '' : data[0].parent_phone_2__c;
    	data[0].disabled__c = data[0].disabled__c == null || data[0].disabled__c =='null' ? '' : data[0].disabled__c;
    	
    	//data[0].sleeping_time__c = data[0].sleeping_time__c == null || data[0].sleeping_time__c =='null' ? '' : data[0].sleeping_time__c;
    	//data[0].sleeping_behavior__c = data[0].sleeping_behavior__c == null || data[0].sleeping_behavior__c =='null' ? '' : data[0].sleeping_behavior__c;
    	//data[0].using_air_conditioner__c = data[0].using_air_conditioner__c == null || data[0].using_air_conditioner__c =='null' ? '' : data[0].using_air_conditioner__c;
    	
    	data[0].sleep_after_midnight__c = data[0].sleep_after_midnight__c == null || data[0].sleep_after_midnight__c =='null' ? '' : data[0].sleep_after_midnight__c;
    	data[0].sleep_with_light_on__c = data[0].sleep_with_light_on__c == null || data[0].sleep_with_light_on__c =='null' ? '' : data[0].sleep_with_light_on__c;
    	data[0].sleep_with_turn_off_air_condition__c = data[0].sleep_with_turn_off_air_condition__c == null || data[0].sleep_with_turn_off_air_condition__c =='null' ? '' : data[0].sleep_with_turn_off_air_condition__c;
    	data[0].sleep_soundly__c = data[0].sleep_soundly__c == null || data[0].sleep_soundly__c =='null' ? '' : data[0].sleep_soundly__c;
    	data[0].love_cleaning__c = data[0].love_cleaning__c == null || data[0].love_cleaning__c =='null' ? '' : data[0].love_cleaning__c;
    	
    	
    	
    	
    	if (data[0].birthdate__c) {
    		var str = data[0].birthdate__c;
    		var res = str.substring(0, 10);
		    var dd = res.substring(8,10);
		    var mm = res.substring(5,7);
		    var yyyy = res.substring(0,4);
		    
		    res = dd + "/" + mm + "/" + yyyy;
		    data[0].birthdate__c = res;
		    
		    //mm=mm-1;
		    //data[0].birthdate__c = new Date (yyyy,mm,dd);
    	}
    	
    	
    	$scope.lead = data[0];
    })
    .error((data) => {
      console.log('Error: ' + data);
    });
  }
  
  $scope.saveData = function() {
	
	  
	  //var sss =$scope.lead.birthdate__c;
	  var BeforeChange=$scope.lead.birthdate__c;
	  
	  var dd = BeforeChange.substring(0, 2);
	  var mm = BeforeChange.substring(3, 5);
	  var yyyy = BeforeChange.substring(6, 10);
	  $scope.lead.birthdate__c = mm+"/"+dd+"/"+yyyy;	  
	 
	  if($scope.id == null)
		{
			$scope.createLead();
		}
		else
		{
			$scope.updateLead();
		}
	  
	  $scope.lead.birthdate__c=BeforeChange;
  }
  
  $scope.createLead = function () {
	var data = JSON.stringify($scope.lead);
	//alert("Create : " + data);
	$http.post('../createstudent', data)
	.success((data) => {
		$scope.lead = data[0];
		$scope.id = data[0].sfid;
		alert('create success');
		window.location.href = "http://developer-tutestdev.cs5.force.com/login";
	})
	.error((data) => {
		console.log('Error: ' + data);
	});
  }
  
  $scope.updateLead = function () {
		  
	var data = JSON.stringify($scope.lead);
	
	//alert("Update : " + data);
	$http.post('../updatestudent/' + $scope.id, data)
	.success((data) => {
		alert('update success');
		window.location.href = "http://developer-tutestdev.cs5.force.com/login";
	})
	.error((data) => {
		alert('Error: ' + data);
		console.log('Error: ' + data);
	});
	
	
	
  }
  
});