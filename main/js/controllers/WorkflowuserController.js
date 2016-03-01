'use strict';

MetronicApp.controller('WorkflowuserController', function($rootScope, $scope, $http, settings, authorities) {

$scope.started = false;
$scope.opt = 'submit';
$scope.Showcomments = false;
$scope.required = true;
$scope.NewForm = false;
$scope.Showreset = true;
$("#messageView div").hide();

	$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
	});

	// $scope.data = {
 //    repeatSelect: null,
 //    availableOptions: [
 //      {id: '1', name: 'Normal'},
 //      {id: '2', name: 'Urgent'},
 //      {id: '3', name: 'Important'}
 //    ],
 //   };

	 var getUser = localStorage.getItem("username");
	 var getToken = localStorage.getItem("token");
	 var getDispName = localStorage.getItem("firstName");

	 fn_LoadAllRequest();


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
		$scope.started = true;
		$scope.NewForm = true;
		$scope.opt = 'update';
 		fn_ViewRequest(data)
 		$scope.reqid = data;
 		console.log($scope.reqid);
 		fn_PostComments(data);
 		$scope.Showcomments = true;			
	}


	 $scope.showApplications = function() {

	 };

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
              console.log("successfully send comment form");
              fn_PostComments($scope.reqid);
          }); 	 	
	}



	$scope.onReset = function(){
		// alert('hello');
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

	function fn_LoadAllRequest(){
		$http.get(globalURL+"workflow/request?token=" + getToken)
		.success(function(response) {
			console.log(response);
			$scope.names = response.content;
			$scope.newReq = response.numberOfElements;
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
				console.log(response);
				$scope.commentsDet = response;
				$('#messageVal').val("");
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