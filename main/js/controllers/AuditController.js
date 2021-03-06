'use strict';

var stats = ["LOGIN", "LOGOUT", "ERROR"];
var selected_filter = [];

MetronicApp.controller('AuditController', function($rootScope, $scope, $http, sortable, NgTableParams, $filter, $q) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        $scope.start = 0;
        $scope.rows = 100;
        $scope.status = stats;
        $scope.go();
       });
        $scope.getStatus = [];
        
       $scope.go = function(data){
         if (typeof data == 'undefined') {
            data = "";
          }
         $http.get(globalURL+"api/pistachio/audit?start="+$scope.start+"&rows="+$scope.rows+"&filter="+data)
         .success(function(response) {
            var workStatus = [];
            $scope.getStatus.length = 0;
            $.each(response.content, function(i, item){
                      if ($.inArray(item.status,workStatus) === -1){
                          workStatus.push(item.status);
                      }
                  });
                  filterOpt($scope.getStatus, workStatus);
            $scope.tableAuditParams = new NgTableParams({page: 1, count: 10}, { dataset: response.content});
          //  $scope.contents = response.content;
          //  $scope.totalPages = response.totalPages;
          //  $scope.first = response.first;
          //  $scope.last = response.last;
          //  $scope.currentPage = response.number+1;
          //  $scope.totalRecs = response.numberOfElements;
          //  $(".previousBtn").prop( "disabled", $scope.first);
          //  $(".nextBtn").prop("disabled", response.last);
          });

       }

       $scope.next = function(){
         $scope.start++;
         $scope.go()
       }

       $scope.previous = function(){
         $scope.start--;
         $scope.go();
       }

       $scope.filter = function(text){
         var index = selected_filter.indexOf(text);    // <-- Not supported in <IE9
         if (index !== -1) {
           selected_filter.splice(index, 1);
         }
         else {
           selected_filter.push(text);
         }
         console.log(selected_filter);
         $scope.go(text);


       }



    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("audit");
  

});
