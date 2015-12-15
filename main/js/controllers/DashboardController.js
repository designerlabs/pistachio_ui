'use strict';

MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   

        // initialize core components
        Metronic.initAjax();
        var getUser = localStorage.getItem("username");
    	$http.get(globalURL+"role/report?user="+getUser)
    	.success(function(response) {
    		$scope.names = response;
       });

    	$scope.go = function(data){
            
    		location.href=data;
            var categoryId = this.$$watchers[2].last;
            //$scope.message = sharedService.categoryId;
          
    	};
        //console.log($scope);

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});
