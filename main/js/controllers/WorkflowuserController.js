'use strict';

MetronicApp.controller('WorkflowuserController', function($rootScope, $scope, $http, settings, authorities) {

$scope.started = false;
$scope.opt = 'submit';

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

		$http.get(globalURL+"workflow/request?token=" + getToken)
		.success(function(response) {
			console.log(response);
			$scope.names = response.content;
			$scope.newReq = response.numberOfElements;
	   });

	 

	 $scope.onClick = function (opt) {

	 	formInputValidation("#frmRequest");

	 	var reportName = $('#userReqTitle').val();
	 	var description = $('#userReqDes').val();
	 	var priority = $('#userPriority option:selected').val();
	 	if(opt == "submit"){
	 	 $.ajax({
              url: globalURL + 'workflow/request/',
              contentType: "application/json",
              type: 'POST',
              dataType: "json",
              data: JSON.stringify({
				"description":description,
				"email":"",
				"status":"NEW",
				"admin":"NA",
				"adminEmail":"NA",
				"createdDate":null,
				"lastModifiedDate":null,
				"user":getUser,
				"reportName":reportName,
                "priority": priority}),
          }).done(function (data) {
              console.log("successfully send request form");
              $('#userReqTitle').val("");
              $('#userReqDes').val("");
              $('#userPriority option:selected').text("Normal");
          }); 
      	}
	 }

	 $scope.viewReq = function(data){
	 		$http.get(globalURL+"workflow/request/" + data)
	 		.success(function(response) {
	 			console.log(response);
	 			$scope.details = response;
	 			// $('#userReqTitle').val(response.reportName);
	 			// $('#userReqDes').val(response.description);
	 			// $('#userPriority option:selected').val(response.priority);
	 	   });
	 		$scope.reqid = data;
	 		console.log($scope.reqid);

 			$http.get(globalURL+"workflow/request/" + data + "/comments")
 			.success(function(response) {
 				console.log(response);
 				$scope.commentsDet = response;
 		   });


	 }
 
	 $scope.submitComment = function(){
	 		 	 $.ajax({
	 	              url: globalURL + "workflow/request/"+ $scope.reqid +"/comments",
	 	              contentType: "application/json",
	 	              type: 'POST',
	 	              dataType: "json",
	 	              data: JSON.stringify({
	 					"username":getUser,
	 					"message":$scope.myMsg,
	 					"requestId":$scope.reqid	 					
	 	                }),
	 	          }).done(function (data) {
	 	          		$http.get(globalURL+"workflow/request/" + $scope.reqid + "/comments")
			 			.success(function(response) {
			 				console.log(response);
			 				$scope.commentsDet = response;
			 		   });
	 	          	  console.log("successfully send request form");
	 	          }); 	 	
	 }

});