'use strict';

MetronicApp.controller('SolrController', function($rootScope, $scope, $http, NgTableParams) {
    $scope.$on('$viewContentLoaded', function() {
      $scope.go();
     });


    $scope.go = function(){
       $http.get(globalURL + "/api/secured/pistachio/solr/status")
                .success(function (response) {
                  $scope.records = new NgTableParams({ }, {counts: [], dataset: response});
                 })
                .error(function (response) {
                    //debugger;
        });
    };

    $scope.getDate = function(epoch){
      var d = new Date(epoch); // The 0 there is the key, which sets the date to the epoch
      return d;
    }

    $scope.del = function(row) {
      console.log(row);

      $http.delete(globalURL + "/api/secured/pistachio/solr/collection/"+row.collectionName)
                .success(function (response) {
                    console.log("Collection Deleted")
                 })
                .error(function (response) {
                   console.log("Collection delete failed")
                    //debugger;
        });
    }

    $scope.clear = function(row) {
      console.log(row);

      $http.get(globalURL + "/api/secured/pistachio/solr/collection/"+row.collectionName+"/clear")
                .success(function (response) {
                    console.log("Collection Deleted")
                 })
                .error(function (response) {
                   console.log("Collection delete failed")
                    //debugger;
        });
    }

 

    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("solr");
  

});
