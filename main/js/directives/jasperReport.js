'use strict';



var JasperContorller = function ($scope,$rootScope,$http,$sce) {
  function load() {
    $scope.reportHtml=$sce.trustAsHtml("<h2>PROCESSING</H2>");

    if($scope.id !=undefined){
      loadFromSql();
    }
    if($scope.template!=undefined){
      loadFromTemplate()
    }

    }

     function loadFromTemplate() {
      console.log($scope.template)
          $scope.reportTitle = $scope.template.queryName
            console.log("loading from template")
            $scope.show = false;
          $http.get(globalURL + "api/pistachio/secured/sql/template/" + $scope.template.id)
                    .then(function(result) {
                        $scope.reportHtml=$sce.trustAsHtml(result.data);
                        $scope.show = false;
            });

    }

    function loadFromSql() {

            $http.get(globalURL + "api/pistachio/secured/sql/report/" + $scope.id)
                    .then(function(result) {
                        $scope.reportHtml=$sce.trustAsHtml(result.data);
                        $scope.show = false;
            });
    }

    $scope.submitRequest = function() {
       $http.get(globalURL + "api/pistachio/secured/sql/template/" + $scope.template.id)
                    .then(function(result) {
                        $scope.reportHtml=$sce.trustAsHtml(result.data);
                        $scope.show = false;
            });
    }

    $scope.$watch('id', function(newValue, oldValue) {
        console.log("from SQL editor")
        console.log($scope.report)
        if(newValue !=undefined ) {
          // load()
        }
    });

   $scope.$watch('id', function(newValue, oldValue) {
        console.log("from SQL editor")
        console.log($scope.report)
        if(newValue !=undefined ) {
          // load()
        }
    });

    $scope.$watch('show', function(newValue, oldValue) {
        console.log("change in template")
        console.log($scope.template)

        if(newValue !=undefined ) {
          if($scope.show)
            load()
        }
    });

     $scope.export_jxrml = function() {
            window.location.href = globalURL + "api/pistachio/secured/sql/jxrml/" +$scope.id;
        }

        $scope.update_report = function() {
            $scope.reportHtml=$sce.trustAsHtml("<h2>PROCESSING</H2>");
             $http.get(globalURL + "api/pistachio/secured/sql/report/" + $scope.id+"/update?title="+$scope.reportTitle+"&style="+$scope.selectedStyle)
                    .then(function(result) {

                        $scope.reportHtml=$sce.trustAsHtml(result.data);
                    });
        }
    
   
};

MetronicApp.directive('jasperreport', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: JasperContorller, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            id: '=' ,
            show: '=',
            template: '='
        },
        templateUrl: 'views/sqleditor/jasperreport.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});