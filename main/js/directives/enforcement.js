'use strict';

var EnforcementController = function ($scope,$http) {
    var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/offender/query?q='
    init();

  function init() {
    var query = "expact_id:\""+$scope.expact +"\""
    //var query = "doc_no:A4010734"
    $http.get(thisSolrAppUrl+query).
      success(function(data) {
      $scope.docs = data.response.docs;
  });
  }

  $scope.getDate = function (data) {
    return moment(data, "YYYYMMDD").format('DD-MM-YYYY');
  }

};

MetronicApp.directive('enforcement', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: EnforcementController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            expact: '=expact'        },
        templateUrl: 'views/travelertracker/enforcement.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});