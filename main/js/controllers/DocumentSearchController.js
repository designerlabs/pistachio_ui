'use strict';

MetronicApp.controller('DocumentSearchController', function($rootScope, $scope, $http, $timeout, $sce) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        var getUser = localStorage.getItem("username");
        $http.get('http://10.1.17.57:8983/solr/immigration1/select?q=*:*&wt=json').
         success(function(data) {
             console.log(data);
             $scope.items = data.response.docs;
             
             $scope.qtime = data.responseHeader.QTime;
             console.log(data.response.docs);
           }).
           error(function(data, status, headers, config) {
             console.log('error');
             console.log('status : ' + status); //Being logged as 0
             console.log('headers : ' + headers);
             console.log('config : ' + JSON.stringify(config));
             console.log('data : ' + data); //Being logged as null
           });



        console.log($scope);
        
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

});
