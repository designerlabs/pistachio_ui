


MetronicApp.controller('CAController', function($rootScope, $scope, $http) {

	 $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        $(".page-sidebar-menu > li").removeClass('active');
        $("#dashboardLink").addClass('active');
         $rootScope.settings.layout.pageSidebarClosed = true;
  $rootScope.skipTitle = false;
  $rootScope.settings.layout.setTitle("");
angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        }
    });
 
    });
 
});
