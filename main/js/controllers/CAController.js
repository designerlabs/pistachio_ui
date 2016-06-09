


MetronicApp.controller('CAController', function($rootScope, $scope, $http) {


  $rootScope.settings.layout.pageSidebarClosed = true;
  $rootScope.skipTitle = false;
  $rootScope.settings.layout.setTitle("");
angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        }
    });
 
});
