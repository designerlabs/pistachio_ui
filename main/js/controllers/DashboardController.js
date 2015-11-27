'use strict';

MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
        var getUser = localStorage.getItem("username");
   	
    	$http.get("http://10.1.17.25:8080/role/report?user="+getUser)
    	.success(function(response) {
    		$scope.names = response;
    	});

    	$scope.go = function(data){
    		location.href=data;
    	};
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});