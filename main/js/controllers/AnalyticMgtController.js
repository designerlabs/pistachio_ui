'use strict';

MetronicApp.controller('AnalyticMgtController', function($rootScope, $scope, $http,$interval) {
    var analyticURL ="api/secured/pistachio/analytics/"
    $scope.$on('$viewContentLoaded', function() {   
       $scope.records = [];
       $scope.title = "List"
       load()
       getRunningJobs();

    });

    function load(){
      console.log("reloading the page")
         $http.get(globalURL+analyticURL)
            .success(function(response) {
                $scope.dashboards = response;
            });
        

    }
    $scope.loadall = function() {
        load()
    }

    $scope.run = function(id) {
      $scope.startPoll()
      $http.get(globalURL+analyticURL+"/analytic/run/"+id)
            .success(function(response) {
            });
      
    }

    $scope.add = function() {
        $scope.record = {};
         $("#analticAddForm").modal('show');
    }


    $scope.save = function(row) {
        debugger;
         $http.post(globalURL+analyticURL+"analytic/",row)
            .success(function(response) {
                $scope.records = response;
                 $("#analticAddForm").modal('hide');
                 load();
            });
        
    }

    $scope.updt = function(row) {
         $http.put(globalURL+analyticURL+"analytic",row)
            .success(function(response) {
                $scope.records = response;
                $("#analticAddForm").modal('hide');
                load()
            });
        
    }

    $scope.delete = function(row) {
         $http.delete(globalURL+analyticURL+"analytic/"+row.id)
            .success(function(response) {
                load()
            });
        
    }

    $scope.edits = function(row) {
        console.log(row)
        $scope.record = row
        $("#analticAddForm").modal('show');
    }


     function getRunningJobs() {
       $http.get(globalURL + "getJobResults")
                .success(function (response) {
                  $scope.recentJobs = response

                  var index;
                  var sts = true;
                  for (index = 0; index < $scope.recentJobs.length; ++index) {
                      if($scope.recentJobs[index].jobStatus != "FINISHED" && $scope.recentJobs[index].jobStatus != "FAILED" && $scope.recentJobs[index].jobStatus != null) {
                        $scope.activeJob = true;
                        sts = false;
                      }
                  }
                  if(sts){
                    console.log("All Jobs Completed")
                    $scope.activeJob = false;
                    $scope.stopPoll()
                  } 
                 })
                .error(function (response) {
                    //debugger;
        });
    }

    var stop;
        $scope.startPoll = function() {
          // Don't start a new fight if we are already fighting
          if ( angular.isDefined(stop) ) return;

          stop = $interval(function() {
            getRunningJobs()
          }, 5000);
        };

        $scope.stopPoll = function() {
          if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
          }
        };

        $scope.$on('$destroy', function() {
          // Make sure that the interval is destroyed too
          $scope.stopPoll();
        });



        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("analytic");


});
