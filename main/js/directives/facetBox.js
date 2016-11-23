'use strict';

var FBController = function ($scope,$http) {

  function init() {

  } 

  $scope.check = function(data) {
  
    if($scope.selected ==null) return false

    if($scope.selected.indexOf(data)  == -1) return false
    return true;
  }


  $scope.getDate = function (data) {
    return moment(data, "YYYYMMDD").format('DD-MM-YYYY');
  }


};

MetronicApp.directive('facetbox', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: FBController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@',
            show : '=',
            facet: '=' ,
            selected: "=" ,
            click:  "&"      },
        templateUrl: 'views/fastsearch/facetbox.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});