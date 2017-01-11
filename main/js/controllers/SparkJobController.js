'use strict';

MetronicApp.controller('SparkJobController', function($rootScope, $scope, $http,$interval) {
    $scope.$on('$viewContentLoaded', function() {
      $scope.activeJob = false;
      $scope.recentJobs = [];
      $scope.selectedMode = "";
      $scope.go();
     });


    $scope.go = function(){

       $http.get(globalURL + "list")
                .success(function (response) {
                  $scope.jobs = response
                 })
                .error(function (response) {
                    //debugger;
        });

       getRunningJobs()

    };

    function getRunningJobs() {
       $http.get(globalURL + "getJobResults")
                .success(function (response) {
                  $scope.recentJobs = response

                  var index;
                  var sts = true;
                  for (index = 0; index < $scope.recentJobs.length; ++index) {
                      if($scope.recentJobs[index].jobStatus != "FINISHED") {
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

    $scope.getDate = function (date,format) {
      if(date == "") return ""
      return moment(date).format(format)
    }

    $scope.runJob = function(job) {
      console.log($scope.result)
      if(job.selMode == "") return
      $http.get(globalURL + "run?app="+job.app+"&mode="+job.selMode)
                .success(function (response) {
                   getRunningJobs()
                 })
                .error(function (response) {
                    //debugger;
        });
      $scope.startPoll()
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

    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("audit");
  

});
