'use strict';
var getToken = localStorage.getItem("token");
MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout, $sce,$stateParams) {
    var getUser;
    $scope.$on('$viewContentLoaded', function() {

        console.log($stateParams)
        // initialize core components
        Metronic.initAjax();
        $scope.iframeHeight = window.innerHeight;
        getUser = localStorage.getItem("username");
    	//$http.get(globalURL+"pistachio/dashboard")
       /* $http.get(globalURL+"pistachio/dashboard/role?user=" + getToken)
    	.success(function(response) {
    		$scope.names = response;
       });*/

       $http.get(globalURL+"pistachio/dashboard/role?type="+$stateParams.type+"&user=" + getToken)
        .success(function(response) {
            $scope.names = response;
       });

        

    	$scope.go = function(data){

            $("#iframeContainer").show();
            //$("#iframeContainer iframe").attr('ng-src',data);
            debugger;
            $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.data +"?user=" + getUser);
    		//location.href=data;
            $scope.iframeTitle = this.$$watchers[0].last;
            $("#iframeContainer iframe").attr('src',data+"?user=" + getUser);
            
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
