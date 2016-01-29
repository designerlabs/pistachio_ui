'use strict';

var stats = ["LOGIN", "LOGOUT", "ERROR"];

MetronicApp.controller('AuditController', function($rootScope, $scope, $http, $timeout, $sce) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        $scope.start = 0;
        $scope.rows = 20;
        $scope.status = stats;
        $scope.go();
       });

       $scope.go = function(data){
         $http.get(globalURL+"api/pistachio/audit?start="+$scope.start+"&rows="+$scope.rows)
         .success(function(response) {
           $scope.contents = response.content;
           $scope.totalPages = response.totalPages;
           $scope.first = response.first;
           $scope.last = response.last;
           $scope.currentPage = response.number+1;
           $scope.totalRecs = response.numberOfElements;
           $(".previousBtn").prop( "disabled", $scope.first);
           $(".nextBtn").prop("disabled", response.last);
          });

       }

       $scope.next = function(){
         $scope.start++;
       }

       $scope.previous = function(){
         $scope.start--;
         if(scope.start<0)
           $scope.start =0;
       }

       $scope.filter = function(){

       }



    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});
