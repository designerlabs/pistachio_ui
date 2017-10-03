'use strict';



var AnalyticContorller = function ($scope,$rootScope,$http,$sce) {
  var analyticURL ="api/secured/pistachio/analytics/"


    $scope.save = function(row) {
         $http.post(globalURL+analyticURL+"analytic/",row)
            .success(function(response) {
                $scope.records = response;
                 $("#analticAddForm").modal('hide');
                 $scope.load()
            });
        
    }

    $scope.updt = function(row) {
         $http.put(globalURL+analyticURL+"analytic",row)
            .success(function(response) {
                $scope.records = response;
                $("#analticAddForm").modal('hide');
                $scope.load()
            });
        
    }

    $scope.delete = function(row) {
         $http.delete(globalURL+analyticURL+"analytic/"+row.id)
            .success(function(response) {
                $scope.load()
            });
        
    }
   
};

MetronicApp.directive('analytic', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: AnalyticContorller, 
        scope: {
            record: '=',
            load:'&'
        },
        templateUrl: 'views/analytic/addReport.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});