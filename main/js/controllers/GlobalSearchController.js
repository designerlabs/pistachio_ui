'use strict';

MetronicApp.controller('GlobalSearchController', function($rootScope, $scope, $http, $timeout, $sce) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        var getUser = localStorage.getItem("username");
        $http.get('http://10.1.17.57:8983/solr/immigration1/select?q=*:*&wt=json&start=0&rows=0').
         success(function(data) {
             console.log(data);
             $scope.items = data.response.docs;
             $scope.applicationsFound = data.response.numFound;
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




    });
    $scope.text = '';
    $scope.search = function(text) {
      $scope.text = text;
      $http.get('http://10.1.17.57:8983/solr/immigration1/select?q=mad_applcnt_addr1:'+text+'&wt=json&start=0&rows=0').
       success(function(data) {
           $scope.applicationsFound = data.response.numFound;
           $scope.qtime = data.responseHeader.QTime;
         }).
         error(function(data, status, headers, config) {
           console.log('error');
           console.log('status : ' + status); //Being logged as 0
           console.log('headers : ' + headers);
           console.log('config : ' + JSON.stringify(config));
           console.log('data : ' + data); //Being logged as null
         });

      };
      $scope.reset = function() {
        $http.get('http://10.1.17.57:8983/solr/immigration1/select?q=*:*&wt=json&start=0&rows=0').
         success(function(data) {
             $scope.applicationsFound = data.response.numFound;
             $scope.qtime = data.responseHeader.QTime;
           }).
           error(function(data, status, headers, config) {
             console.log('error');
             console.log('status : ' + status); //Being logged as 0
             console.log('headers : ' + headers);
             console.log('config : ' + JSON.stringify(config));
             console.log('data : ' + data); //Being logged as null
           });
      };

    // set sidebar closed and body solid layout mode


    $scope.showApplications = function() {
      var countryObjList= {};
      var keys = ["country","count"];
        if($scope.text.length > 0) {
          $http.get('http://10.1.17.57:8983/solr/immigration1/select?q=mad_applcnt_addr1:'+text+'&wt=json&start=0&rows=0&facet=true&facet.field=mad_nat_cd&facet.limit=10').
           success(function(data) {
               $scope.applicationsFound = data.response.numFound;
               countries = data.facet_counts.facet_fields.mad_nat_cd;
               $scope.qtime = data.responseHeader.QTime;
               var country= {};
               for (var i = 0; i < countries.length; i+2) {
                   country["country"][i]=countries[i];
                   country["count"][i]=countries[i+1];

                 }
               $scope.countries = country;
             }).
             error(function(data, status, headers, config) {
               console.log('error');
               console.log('status : ' + status); //Being logged as 0
               console.log('headers : ' + headers);
               console.log('config : ' + JSON.stringify(config));
               console.log('data : ' + data); //Being logged as null
             });
        }
        else {

          $http.get('http://10.1.17.57:8983/solr/immigration1/select?q=*:*&wt=json&start=0&rows=10&facet=true&facet.field=mad_nat_cd&facet.limit=10').
           success(function(data) {
               $scope.items = data.response.docs;
               $scope.qtime = data.responseHeader.QTime;
               var countries = data.facet_counts.facet_fields.mad_nat_cd;
               $scope.showApplication = true;

               var obj = {};
               for (var j = 0; i < countries.length; j++) {
                   var country= {};
                   var i = j*2;
                   country[keys[0]]=countries[i];
                   country[keys[1]]=countries[i+1];
                   countryObjList.push(country);
                   j++;
                 }
               $scope.countries = countryObjList;
             }).
             error(function(data, status, headers, config) {
               console.log('error');
               console.log('status : ' + status); //Being logged as 0
               console.log('headers : ' + headers);
               console.log('config : ' + JSON.stringify(config));
               console.log('data : ' + data); //Being logged as null
             });
        }


    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});
