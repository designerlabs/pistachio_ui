'use strict';

MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout, $sce) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        $scope.iframeHeight = window.innerHeight;
        var getUser = localStorage.getItem("username");
    	$http.get(globalURL+"pistachio/dashboard")
    	.success(function(response) {
    		$scope.names = response;
       });


    	$scope.go = function(data){

            $("#iframeContainer").show();
            //$("#iframeContainer iframe").attr('ng-src',data);
            $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.data);
    		//location.href=data;
            $("#iframeContainer iframe").attr('src',data);
            var categoryId = this.$$watchers[2].last;
            //$scope.message = sharedService.categoryId;

    	};

        $("#iframeCloseBtn").click(function(){
            $("#iframeContainer").hide();
            $("#iframeContainer iframe").attr('src','');
        });

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageSidebarClosed = true;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("dashboard");

    });


});
