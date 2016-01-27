'use strict';
var selected_countries = [];
var filter_query = "";
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

           $scope.start=0;


    });
    $scope.text = '';

    $scope.updateFilterQuery = function () {
      filter_query = "&fq=";
      var arrayLength = selected_countries.length;
      for (var i = 0; i < arrayLength; i++) {
        if(i==0)
          filter_query = filter_query + "mad_nat_cd:"+selected_countries[i];
        else {
          filter_query = filter_query + " OR mad_nat_cd:"+selected_countries[i];
        }

      }
    }

    $scope.checkboxselected = function(id) {
      var index = selected_countries.indexOf(id);    // <-- Not supported in <IE9
      if (index !== -1) {
        selected_countries.splice(index, 1);
      }
      else {
        selected_countries.push(id);
      }
      console.log(selected_countries);
      $scope.start = 0;
    //  alert($scope.text);

      var search_text = $scope.text;
      if (search_text == '')
        search_text = "*"
        $scope.updateFilterQuery();
        $scope.showApplications();

    }

    $scope.refresh = function() {



    }

    $scope.search = function(text) {

      if (/\s/.test(text)) {
         text = text.replace(/\s+/g,",");
      }
      selected_countries = [];
      filter_query = "";
      $scope.text = text;
      $scope.start = 0;

      selected_countries = [];
      if($scope.applicationsFound < 10){
        $scope.newCount = $scope.applicationsFound;
      }else{
        $scope.newCount = 10;
      }
      if($scope.showApplication != undefined && $scope.applicationsFound)
      {
        $scope.showApplications();
      }
      else {
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
      }
        $scope.reset = function() {
          selected_countries = [];
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




        var clicks = 10;
        $scope.newCount = clicks;

        $scope.next = function() {
          $(".previousBtn").prop( "disabled", false);
           clicks += 10;
          $scope.start = $scope.start + 10;
          $scope.showApplications();
          $scope.newCount = clicks;
          var listCount = 10;

        }

        $scope.previous = function() {

          clicks -= 10;

          $scope.start = $scope.start - 10;

          if(clicks == 10){
            $(".previousBtn").prop( "disabled", true);
          }else{
             $(".previousBtn").prop( "disabled", false);
          }

          if($scope.start < 0)
            $scope.start = 0;
            $scope.newCount = clicks;
            $scope.showApplications();
        }



    // set sidebar closed and body solid layout mode


    $scope.showApplications = function() {

      var keys = ["country","count"];
      var query = "";

      if($scope.text.length > 0) {
        query = 'http://10.1.17.57:8983/solr/immigration1/select?sort=mad_crt_dt desc&q=mad_applcnt_addr1:'+$scope.text+'&wt=json&start='+$scope.start+'&rows=10&facet=true&facet.field=mad_nat_cd&facet.limit=10'+filter_query;
      }
      else {
        query = 'http://10.1.17.57:8983/solr/immigration1/select?sort=mad_crt_dt desc&q=*:*&wt=json&start='+$scope.start+'&rows=10&facet=true&facet.field=mad_nat_cd&facet.limit=10'+filter_query;
      }
      $http.get(query).
       success(function(data) {
           $scope.items = data.response.docs;
           $scope.applicationsFound = data.response.numFound;
           if(selected_countries == 0) {
             var countries = data.facet_counts.facet_fields.mad_nat_cd;
             $scope.showApplication = true;
             var countryObjList= [];
             var obj = {};
             for (var j = 0; j < countries.length/2; j++) {
                 var country= {};
                 var i = j*2;
                 if(countries[i+1] == 0) break;
                 country[keys[0]]=countries[i];
                 country[keys[1]]=countries[i+1];
                 countryObjList.push(country);

               }

             $scope.countries = countryObjList;
           }




        if($scope.applicationsFound < 10){
          $scope.newCount = $scope.applicationsFound;
          $(".nextBtn").prop("disabled", true);
        }else{
          $scope.newCount = clicks;
          $(".nextBtn").prop("disabled", false);
        }


           console.log($scope.countries);
           console.log(countryObjList);

         }).
         error(function(data, status, headers, config) {
           console.log('error');
           console.log('status : ' + status); //Being logged as 0
           console.log('headers : ' + headers);
           console.log('config : ' + JSON.stringify(config));
           console.log('data : ' + data); //Being logged as null
         });

    };

    $scope.$on('$locationChangeStart', function( event ) {
      selected_countries = [];
      filter_query = "";
      $scope.showApplication =false;
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});
