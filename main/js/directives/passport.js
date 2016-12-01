'use strict';

var PassportController = function ($scope,$http,NgTableParams) {
init()
  function init() {

    $scope.passports = new NgTableParams({ }, {counts: [], dataset: $scope.data});
  } 
 $scope.$watch('data', function() {
        $scope.passports = new NgTableParams({ }, {counts: [], dataset: $scope.data});
    });
  $scope.getDate = function (data) {
    return moment(data, "YYYYMMDD").format('DD-MM-YYYY');
  }

};

MetronicApp.directive('passport', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: PassportController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            data: '=' 
        },
        templateUrl: 'views/travelertracker/passport.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});