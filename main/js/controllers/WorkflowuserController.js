'use strict';

MetronicApp.controller('WorkflowuserController', function($rootScope, $scope, $http, settings, authorities) {

$scope.started = false;
	$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
	});
	 $scope.onClick = function(from){
	 	var reportName = $('#userReqTitle').val();
	 	var description = $('#userReqDes').val();
	 	
	 }

});