'use strict';

MetronicApp.controller('WorkflowuserController', function($rootScope, $scope, $http, settings, authorities) {

$scope.started = false; // boolean for submit and update button
$scope.opt = 'submit'; // for submit button
$scope.Showcomments = false; 
$scope.required = true;
$scope.NewForm = false; // boolean for New Request buttom
$scope.Showreset = true;
$scope.AsHeader = false;
$scope.updateForm = false;
$scope.addForm = true;
$scope.resetBtn = true;
$scope.viewForm = false;

$("#messageView div").hide();
$scope.start=0;

	$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
  //       $http.get(globalURL+"workflow/request/?start=0&rows=2")
		// .success(function(response) {
		// 	console.log(response);
		// 	$scope.names = response.content;
		// 	$scope.TotalCounts = response.totalElements;
		// 	console.log($scope.TotalCounts);
	 //   });

		fn_LoadAllRequest();
		
	});

 	$scope.currentTab = 'new.html';
	var getUser = localStorage.getItem("username");
	var getToken = localStorage.getItem("token");
	var getDispName = localStorage.getItem("firstName");

	//Add and update Request Form submission
	$scope.onReqSubmit = function (opt) {
	 	var reportName = $('#userReqTitle').val();
	 	var description = $('#userReqDes').val();
	 	var priority = $('#userPriority option:selected').val();
	 	if(!reportName || !description){
	 		return false;
	 	}else{
		 	if(opt == "submit"){
		 	fn_SendRequest(reportName, description, priority, null, 'POST');
		 	 
	      	}else if(opt=="update"){
	      	fn_SendRequest(reportName, description, priority, $scope.reqid, 'PUT');
	      	}
	 	}
	}

	$scope.getCounts = function(){
		
    	$http.get(globalURL+"workflow/request?token=" + getToken + "&filter=new").success(function(response) {
    		$scope.getCountNew = response.totalElements;
        });

    	$http.get(globalURL+"workflow/request?token=" + getToken + "&filter=prog").success(function(response) {
    		$scope.getCountProg = response.totalElements;
        });

    	$http.get(globalURL+"workflow/request?token=" + getToken + "&filter=failed").success(function(response) {
    		$scope.getCountFailed = response.totalElements;
        });
        $http.get(globalURL+"workflow/request?token=" + getToken + "&filter=completed").success(function(response) {
    		$scope.getCountCompleted = response.totalElements;
        });
	};

	//View Request Form
	$scope.viewReq = function(data){
		$scope.AsHeader = true;
		var currentId = this.data;
		$scope.opt = 'update';
 		fn_ViewRequest(data);
 		$scope.started = true;
		$scope.NewForm = true;
		$scope.updateForm = false;
		$scope.addForm = false;
		$scope.resetBtn = false;
		$scope.viewForm = true;
		if($scope.currentTabName == 'new'){
			$scope.Editor = true;
		}else{
			$scope.Editor = false;
		}
 		$scope.reqid = data;
 		console.log($scope.reqid);
 		fn_PostComments(data);
 		$scope.Showcomments = true;			
	}

    //Delete Request
	$scope.DelReq = function(data){
		fn_DeleteReq(data);	
	}
 	//Send comments or chat session...
	$scope.submitComment = function(){
	 	 $.ajax({
              url: globalURL + "workflow/request/"+ $scope.reqid +"/comments",
              contentType: "application/json",
              type: 'POST',
              dataType: "json",
              data: JSON.stringify({
				"username":getUser,
				"message":$scope.myMsg.text,
				"requestId":$scope.reqid,
				"displayName": getDispName	 					
                }),
          }).success(function (data) {
          	$scope.commentsDetFalse = false;
              console.log("successfully send comment form");
              fn_PostComments($scope.reqid);
          }); 	 	
	}

	$scope.onReset = function(){
		fn_Reset();
	}

	$scope.onNewReq = function(){
		$scope.opt = "submit";
		$scope.started = false;
		$scope.NewForm = false;
		$scope.Editor = false;
		$scope.updateForm = false;
		$scope.addForm = true;
		$scope.resetBtn = true;	
		$scope.viewForm = false;
		$scope.Showcomments = false; 
		 $("#frmRequest input, #frmRequest textarea").val('');
         $('#userPriority option:selected').text("Normal");
		//fn_Reset();
	}

	$scope.onEdit = function(){
		$scope.opt = "update";
		$scope.updateForm = true;
		$scope.addForm = false;
		$scope.resetBtn = true;	
		$scope.viewForm = false;
	
	}

	$scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

	$scope.tabs = [{
	        	title: 'New',
	        	url: 'new.html',
	        	filter : 'new',

	   		},
	   		{
	        	title: 'In Progress',
	            url: 'inprogress.html',
	            filter : 'prog'
	    	},
	    	{
	        	title: 'Completed',
	            url: 'completed.html',
	            filter : 'completed'
	    	},
	    	{
	          	title: 'Failed',
	            url: 'close.html',
	            filter : 'failed'
    	}];

	$scope.currentTab = 'new.html';
	$scope.currentTabName = 'new';
	$scope.onClickTab = function (tab) {

	   $scope.getCounts();

	   $scope.start = 0;
       $scope.currentTabName = tab.filter;
       $scope.started = false;
       $scope.NewForm = false;
       $scope.Editor = false;
       $scope.updateForm = false;
       $scope.addForm = true;
       $scope.resetBtn = true;	
       $scope.viewForm = false;
       $scope.Showcomments = false; 
        $http.get(globalURL+"workflow/request?token=" + getToken + "&start="+$scope.start+"&rows=5&filter="+tab.filter)
		.success(function(response) {
			console.log(response);
			$scope.names = response.content;
			$scope.newReq = response.numberOfElements;
		 	$scope.first = response.first;
		 	$scope.last = response.last;
			console.log(response);
			
	   });
    }

    var clicks = 2;
    $scope.newCount = clicks;

    $scope.next = function() {
      $scope.start = $scope.start + 1;
      $scope.showApplications();
      var listCount = 2;

    }

    $scope.previous = function() {
      $scope.start = $scope.start - 1;
      if($scope.start < 0)
        $scope.start = 0;
        $scope.showApplications();
    }

    $scope.showApplications = function() {
    	var query = "";
	 	query = globalURL+"workflow/request?token=" + getToken + "&start="+ $scope.start +"&rows=5&filter="+$scope.currentTabName;
	 	$http.get(query)
		.success(function(response) {
			//debugger;
			$scope.applicationsFound = response.numberOfElements;
			console.log(response + " showApplications");
			$scope.names = response.content;
			$scope.TotalCounts = response.totalElements;
			$scope.first = response.first; //Show or hide previous 
		 	$scope.last = response.last; //Show or hide next 
	   });
	};    	

	function fn_LoadAllRequest(){
		$http.get(globalURL+"workflow/request?token=" + getToken + "&start="+ $scope.start +"&rows=5&filter="+$scope.currentTabName)
		.success(function(response) {
			console.log(response + "fn_LoadAllRequest");
			$scope.names = response.content;
			$scope.newReq = response.numberOfElements;
		 	$scope.TotalCounts = response.totalElements;
		 	$scope.first = response.first;
		 	$scope.last = response.last; //Show or hide next 
		 	$scope.getCounts();
		 	console.log($scope.TotalCounts);
	   });
	}

	function fn_SendRequest(title,desc,priority,reqid,method){
	 	 $.ajax({
              url: globalURL + 'workflow/request/',
              contentType: "application/json",
              type: method,
              dataType: "json",
              data: JSON.stringify({
              	"id": reqid,
				"description":desc,
				"email":"",
				"status":"NEW",
				"admin":"NA",
				"adminEmail":"NA",
				"createdDate":null,
				"lastModifiedDate":null,
				"user":getUser,
				"displayName": getDispName,
				"reportName":title,
                "priority": priority}),
          }).success(function (data) {
              console.log("successfully send request form");
              $("#messageView div span").html("Successfully Submitted Your Request");            
              $("#messageView div").addClass('alert-success');
              $("#messageView div").show();
              fn_LoadAllRequest();
              $('#userReqTitle').val("");
              $('#userReqDes').val("");
              $scope.started = false;
              $scope.NewForm = false;
              $scope.Editor = false;
              $scope.updateForm = false;
              $scope.addForm = true;
              $scope.resetBtn = true;	
              $scope.viewForm = false;
              $scope.Showcomments = false; 
              $('#userPriority option:selected').text("Normal");
          }); 

	}

	function fn_ViewRequest(Reqid){
		$("#messageView div").hide();
		$http.get(globalURL+"workflow/request/" + Reqid)
		.success(function(response) {
			$scope.viewForm = true;
			$scope.updateForm = false;
			//$scope.addForm = true;
			console.log(response + " fn_ViewRequest");
			$scope.details = response;	 	
			$('.mt-comment').removeClass('activeComment');
			$('.'+Reqid).addClass('activeComment');		
			$('#userPriority option:selected').text(response.priority);
	   });

	}

	function fn_DeleteCommends(Reqid){
		 $.ajax({
              url: globalURL + "workflow/request/"+ Reqid,
              contentType: "application/json",
              type: 'DELETE',
              dataType: "json"              
          }).success(function (data) {
              console.log("successfully deleted request");
              $("#messageView div span").html("Successfully Deleted the Request");            
              $("#messageView div").addClass('alert-success');
              $("#messageView div").show();
              fn_LoadAllRequest();
              fn_Reset();
          }); 

	}

	function fn_DeleteReq(Reqid){
		 $.ajax({
              url: globalURL + "workflow/request/"+ Reqid,
              contentType: "application/json",
              type: 'DELETE',
              dataType: "json"              
          }).success(function (data) {
              console.log("successfully deleted request");
              $("#messageView div span").html("Successfully Deleted the Request");            
              $("#messageView div").addClass('alert-success');
              $("#messageView div").show();
              fn_LoadAllRequest();
              fn_Reset();
          }); 

	}

	function fn_PostComments(Reqid){
		$http.get(globalURL+"workflow/request/" + Reqid + "/comments")
			.success(function(response) {
				if(response.length === 0){
					//$scope.commentsDet;
					$scope.commentsDet = false;	
					$scope.commentsDetFalse = true;
				}else{
					$scope.commentsDet = true;
					$scope.commentsDetFalse = false;
			
					$scope.commentsDet = response;
					$('#messageVal').val("");
				}
				
		   });
	}

	 $('#frmRequest').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                ReqTitle: {
                    required: true
                },
                ReqDes:{
                	required: true
                }
            },        

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
       
            }
        });

	function fn_Reset(){

		 $scope.AsHeader = false;
		 $scope.NewForm = false;
		 $scope.Showcomments = false;
		 $scope.started = false;
		 $scope.opt = 'submit';
		
         $("#frmRequest h4").each(function(e){
         		this.textContent = "";
         });

         $('#userReqTitle').val("");
         $('#userReqDes').val("");
         $('#userPriority option:selected').text("Normal");
        $scope.resetBtn = true;
	 }

});