'use strict';

var EnforcementController = function ($scope,$http) {
    var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/tef_detainee/query?collection=tef_detainee,tef_compound&sort=created desc&q='
    init();

  function init() {
    var query = "expact_id:\""+$scope.expact +"\""
    //var query = "doc_no:A4010734"
    $http.get(thisSolrAppUrl+query).
      success(function(data) {

      $scope.docs = data.response.docs;
      $scope.doc = data.response.docs[0];
      $scope.total = data.response.numFound
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
            expact: '=expact' ,
            total: "=" 
                   },
        templateUrl: 'views/travelertracker/enforcement.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});