


MetronicApp.controller('CAController', function($rootScope, $scope, $http) {

	 $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
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
