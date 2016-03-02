'use strict';

MetronicApp.controller('WorkflowuserController', function($rootScope, $scope, $http, settings, authorities) {

$scope.started = false;
$scope.opt = 'submit';
$scope.Showcomments = false;
$scope.required = true;
$scope.NewForm = false;
$scope.Showreset = true;
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

	// $scope.data = {
 //    repeatSelect: null,
 //    availableOptions: [
 //      {id: '1', name: 'Normal'},
 //      {id: '2', name: 'Urgent'},
 //      {id: '3', name: 'Important'}
 //    ],
 //   };
 	$scope.currentTab = 'new.html';
	var getUser = localStorage.getItem("username");
	var getToken = localStorage.getItem("token");
	var getDispName = localStorage.getItem("firstName");

	// fn_LoadAllRequest();


	//Create and update Request Form
	$scope.onReqSubmit = function (opt) {
	 	formInputValidation("#frmRequest");
	 	var reportName = $('#userReqTitle').val();
	 	var description = $('#userReqDes').val();
	 	var priority = $('#userPriority option:selected').val();
	 	if(opt == "submit"){
	 	 fn_SendRequest(reportName, description, priority, null, 'POST');
      	}else if(opt=="update"){
      	 fn_SendRequest(reportName, description, priority, $scope.reqid, 'PUT');
      	}
	}

	//View Request Form
	$scope.viewReq = function(data){
		var currentId = this.data;
		$scope.started = true;
		$scope.NewForm = true;
		$scope.opt = 'update';
 		fn_ViewRequest(data)
 		$scope.reqid = data;
 		console.log($scope.reqid);
 		fn_PostComments(data);
 		$scope.Showcomments = true;			
	}


    //Delete Request
	$scope.DelReq = function(data){
		fn_DeleteReq(data);	
	}
 
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
		 $scope.NewForm = false;
		 $scope.Showcomments = false;
		 $scope.started = true;
		 $('#userReqTitle').val("");
         $('#userReqDes').val("");
         $('#userPriority option:selected').text("Normal");
	}

	$scope.onNewReq = function(){
		$scope.started = false;
		$scope.NewForm = false;
		$scope.Showcomments = false;		
		$('#userReqTitle').val("");
        $('#userReqDes').val("");
        $('#userPriority option:selected').text("Normal");
	}

	$scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

		$scope.tabs = [{
		        	title: 'New',
		        	url: 'new.html',
		        	filter : 'new'
		   		},
		   		{
		        	title: 'In Progress',
		            url: 'inprogress.html',
		            filter : 'inprog'
		    	},
		    	{
		          	title: 'Close',
		            url: 'close.html',
		            filter : 'close'
	    	}];

	$scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }

    var clicks = 2;
    $scope.newCount = clicks;

    $scope.next = function() {
      $(".previousBtn").prop( "disabled", false);
       clicks += 2;
      $scope.start = $scope.start + 1;
      $scope.showApplications();
      $scope.newCount = clicks;
      var listCount = 2;

    }

    $scope.previous = function() {
      clicks -= 2;
      $scope.start = $scope.start - 1;
      if(clicks == 2){
        $(".previousBtn").prop( "disabled", true);
      }else{
         $(".previousBtn").prop( "disabled", false);
      }
      if($scope.start < 0)
        $scope.start = 0;
        $scope.newCount = clicks;
        $scope.showApplications();
    }

    $scope.showApplications = function() {
    	var query = "";
	 	query = globalURL+"workflow/request/?token=" + getToken + "&start="+ $scope.start +"&rows=5";
	 	$http.get(query)
		.success(function(response) {
			//debugger;
			$scope.applicationsFound = response.numberOfElements;
			console.log(response);
			$scope.names = response.content;
			$scope.TotalCounts = response.totalElements;
			var start_row = ($scope.start + 1) * 5;
			var remain = $scope.TotalCounts - start_row;
			if(remain <= 0){
				$scope.newCount = $scope.applicationsFound;
		  		$(".nextBtn").prop("disabled", true);
			}else{
		  		$scope.newCount = clicks;
		  		$(".nextBtn").prop("disabled", false);
			}
	   });
	};    	

	function fn_LoadAllRequest(){
		$http.get(globalURL+"workflow/request/?token=" + getToken + "&start="+ $scope.start +"&rows=5")
		.success(function(response) {
			console.log(response);
			$scope.names = response.content;
			$scope.newReq = response.numberOfElements;
		 	$scope.TotalCounts = response.totalElements;
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
              $('#userPriority option:selected').text("Normal");
          }); 

	}

	function fn_ViewRequest(Reqid){
		$("#messageView div").hide();
		$http.get(globalURL+"workflow/request/" + Reqid)
		.success(function(response) {
			console.log(response);
			$scope.details = response;	 	
			$('.mt-comment').removeClass('activeComment');
			$('.'+Reqid).addClass('activeComment');		
			$('#userPriority option:selected').text(response.priority);
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



});