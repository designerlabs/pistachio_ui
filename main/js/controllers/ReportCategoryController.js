'use strict';
var categoryId = undefined;
MetronicApp.controller('ReportCategoryController',  ['$rootScope', '$scope', '$http', 'settings', function($rootScope, $scope, $http, settings) {
    $scope.$on('$viewContentLoaded', function() {   

        // initialize core components
        Metronic.initAjax();
        var getUser = localStorage.getItem("username");
    	$http.get("http://10.1.17.25:8080/role/report?user="+getUser)
    	.success(function(response) {
    		$scope.names = response;
       });

    	$scope.go = function(data){
            
            console.log(data);
    		location.href="#/reports/e-reporting.html";
    		categoryId = this.x.queryCategory;
            $scope.category = categoryId;
            //$scope.message = sharedService.categoryId;
          	//$scope.myservice = categoryId; 
          	$("#reportCategoryID").val(categoryId);
          	//if(!localStorage.setItem("reportCategoryID"){
          		localStorage.setItem("reportCategoryID", categoryId);
          	//}	
          	
    	};
        //console.log($scope);

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
}]);