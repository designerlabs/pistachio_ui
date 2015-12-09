'use strict';
var categoryId = undefined;
MetronicApp.controller('ReportCategoryController',  ['$rootScope', '$scope', '$http', 'settings', function($rootScope, $scope, $http, settings) {
    $scope.$on('$viewContentLoaded', function() {   

        // initialize core components
        Metronic.initAjax();
        var getUser = localStorage.getItem("token");
        var getSideMenu = localStorage.getItem("sideMenuValue");
    	//$http.get("http://10.1.17.25:8080/auth/token?token="+getUser)
      $http.get(globalURL+'query/report/'+getSideMenu)
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


    	

        $scope.goes = function(data){
            location.href="#/report2.html";
            $http.get("http://10.1.17.25:8080/query/report/"+data)
                .success(function(response) {
                $scope.namesB = response;
                console.log(response);
            });
            
            
        };
        //console.log($scope);

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
}]);