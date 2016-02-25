'use strict';

MetronicApp.controller('WorkflowuserController', function($rootScope, $scope, $http, settings, authorities) {

$scope.started = false;
$scope.opt = 'submit';

	$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
	});
	 var getUser = localStorage.getItem("username");
		$http.get(globalURL+"workflow/request/")
		.success(function(response) {
			console.log(response);
			$scope.names = response;
	   });
	 formInputValidation("#frmRequest");
	 $scope.onClick = function (opt) {
	 	// alert('Clicked');
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
				"user":"gomathi",
				"reportName":reportName,
                "priority": priority}),
          }).done(function (data) {
              console.log("successfully send request form");
              $('#userReqTitle').val("");
              $('#userReqDes').val("");
              $('#userPriority option:selected').text("Please Select");
          }); 
      	}
	 }

});