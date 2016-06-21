'use strict';

MetronicApp.controller('FastSearchController', function($rootScope, $scope, $http, $timeout, $sce) {
    $scope.$on('$viewContentLoaded', function() {   

        // initialize core components
        Metronic.initAjax();
        Layout.setSidebarMenuActiveLink('set', $('#fastsearchLink')); 
        $scope.go();// set profile link active in sidebar menu 
    });
       


    	$scope.go = function(data){
          var getUser = localStorage.getItem("username");
            $http.get(globalURL+"pistachio/fastsearch")
                .success(function(response) {
             $scope.names = response;
            });
          
    	};

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("fastsearch");

   

    
});
