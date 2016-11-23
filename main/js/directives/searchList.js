'use strict';

var SearchListController = function ($scope,$http,NgTableParams) {
 // init()

  function init() {
    $scope.records = new NgTableParams({}, { dataset: $scope.data});
  }

  $scope.$watch('data', function() {
        $scope.records = new NgTableParams({ }, {counts: [], dataset: $scope.data});
    });
  $scope.getGenderClass = function(data){
    if(data == "LELAKI")
        return "fa fa-male"
    if (data = "PEREMPUAN")
        return "fa fa-female"
    return "fa fa-transgender"
  } 

  $scope.getGenderColor = function(data){
    if(data == "LELAKI")
        return "#0093ff;"
    if (data = "PEREMPUAN")
        return "#ff0097;"
    return "#818990;"
  } 

};

MetronicApp.directive('searchlist', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: SearchListController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            data : '=',
            click: '&'
        },
        templateUrl: 'views/travelertracker/searchlist.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});