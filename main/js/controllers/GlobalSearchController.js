'use strict';
var selected_countries = [];
var filter_query = "";
// var solrHost = "localhost";
//var solrHost = "pistachio_server";
MetronicApp.controller('GlobalSearchController', function($rootScope, $scope, $http, $timeout, $sce) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        var getUser = localStorage.getItem("username");
        $scope.showApplication = false;
        $scope.showVisitor = false;
        
        $scope.start=0;
        $scope.users = 0;
        $scope.text = "";
        $scope.go();
    });

    $scope.getQuery = function() {
      var query;
      if($scope.text.length > 0) {
        var stext = $scope.text.split(" ");
          query = "combinedSearch:*"+stext[0]+"*"
          for (var i = 1; i < stext; i++) {
             filter_query = query + " OR combinedSearch:*"+stext[i]+"*";
          }
      }
      else {
        query = "*:*"
      }
      return(query);
    }

    $scope.show = function() {
      if($scope.showApplication)
        $scope.showApplications();
      else if ($scope.showVisitor)
        $scope.showVisitors();
      else
        $scope.go();
   }


    $scope.go = function() {
      $http.get('http://'+solrHost+':8983/solr/immigration2/select?q='+$scope.getQuery()+'&wt=json&start=0&rows=0').
       success(function(data) {
           console.log(data);
           $scope.items = data.response.docs;
           $scope.applicationsFound = data.response.numFound;
           $scope.qtime = data.responseHeader.QTime;
           //$scope.users = data.facets.users;

           console.log(data.response.docs);
         }).
         error(function(data, status, headers, config) {
           console.log('error');
           console.log('status : ' + status); //Being logged as 0
           console.log('headers : ' + headers);
           console.log('config : ' + JSON.stringify(config));
           console.log('data : ' + data); //Being logged as null
         });

         $http.get('http://'+solrHost+':8983/solr/hismove/select?q='+$scope.getQuery()+'&wt=json&start=0&rows=0').
          success(function(data) {
              $scope.employers = data.response.numFound;
              $scope.vtime = data.responseHeader.QTime;
            }).
            error(function(data, status, headers, config) {
              console.log('data : ' + data); //Being logged as null
            });
    }



   

    $scope.updateFilterQuery = function () {
      filter_query = "&fq=";
      var arrayLength = selected_countries.length;
      for (var i = 0; i < arrayLength; i++) {
        if(i==0)
          filter_query = filter_query + "ctry_issue:"+selected_countries[i];
        else {
          filter_query = filter_query + " OR ctry_issue:"+selected_countries[i];
        }

      }
    }

    $scope.updateFilterQuery_Country = function () {
      var filter_query = "";
      var arrayLength = selected_countries.length;
      if(arrayLength == 0) return "";

      for (var i = 0; i < arrayLength; i++) {
        filter_query = filter_query + "country:"+selected_countries[i];
        
        if(i !=arrayLength-1)
          filter_query = filter_query + " OR "

      }
      return filter_query;
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
        $scope.updateFilterQuery();
        $scope.showApplications();

    }

    $scope.checkboxselectedCountry = function(id) {

      //alert(id);
      var index = selected_countries.indexOf(id);    // <-- Not supported in <IE9
      if (index !== -1) {
       // alert("first")
        selected_countries.splice(index, 1);
      }
      else {
       // alert("psh")
        selected_countries.push(id);
      }
      console.log(selected_countries);
      $scope.start = 0;
    //  alert($scope.text);
        $scope.show();


    }

   

    $scope.refresh = function() {



    }

    $scope.search = function(text) {

      //if (/\s/.test(text)) {
     //    text = text.replace(/\s+/g,",");
      //}
      selected_countries = [];
      filter_query = "";
      $scope.text = text;
      $scope.start = 0;

      selected_countries = [];
      $scope.show();
      
      
      };
        $scope.reset = function() {
          selected_countries = [];
          $scope.text = "";
          $scope.go();
        };




        $scope.next = function() {
          $scope.start = $scope.start + 10;
                 $scope.show();
 
        }

        $scope.previous = function() {
          $scope.start = $scope.start - 10;
          if($scope.start < 0)
            $scope.start = 0;
            $scope.show();
        }



    $scope.viewReq = function(docno,cntry){
            // window.location.href ="#/travelertracker/travelertracker.html";
      window.location = "#/travelertracker/travelertracker.html?doc_no="+docno+"&country="+cntry+"";
      // window.open("MusicMe.html?variable=value", "_self");

    };

    $scope.showVisitors = function() {
      var query = "";
      $scope.showApplication = false;
      $scope.showVisitor = true;
      var query = ""
      var sq = "http://"+solrHost+":8983/solr/hismove/query?json=";

      var json = {};
      json.limit = 10;
      json.offset = $scope.start
      json.query = $scope.getQuery();
      json.filter = $scope.updateFilterQuery_Country();
      json.sort = "xit_date desc"      
      json.facet = {};
      json.facet.country = {};
      json.facet.country.type   = "terms";
      json.facet.country.field  =  "country";
     // json.facet.country.domain = "{excludeTags:COLOR}"
      $http.get(sq+JSON.stringify(json)).
       success(function(data) {
         $scope.vtime = data.responseHeader.QTime;
         $scope.employers = data.response.numFound;
         $scope.items = data.response.docs;
         if(selected_countries.length == 0)
         $scope.countries = data.facets.country.buckets
       })
       .error(function(data, status, headers, config) {
         console.log('error');
       });

    }

    $scope.showApplications = function() {
      var query = "";
      $scope.showApplication = true;
      $scope.showVisitor = false;
      var query = ""
      var sq = "http://"+solrHost+":8983/solr/immigration2/query?json=";

      var json = {};
      json.limit = 10;
      json.offset = $scope.start
      json.query = $scope.getQuery();
      json.filter = $scope.updateFilterQuery_Country();
      json.sort = "created desc"
      json.facet = {};
      json.facet.country = {};
      json.facet.country.type   = "terms";
      json.facet.country.field  =  "country";
     // json.facet.country.domain = "{excludeTags:COLOR}"
      $http.get(sq+JSON.stringify(json)).
       success(function(data) {
         $scope.vtime = data.responseHeader.QTime;
         $scope.employers = data.response.numFound;
         $scope.items = data.response.docs;
         if(selected_countries.length == 0)
         $scope.countries = data.facets.country.buckets
       })
       .error(function(data, status, headers, config) {
         console.log('error');
       });

    }

 
    $scope.$on('$locationChangeStart', function( event ) {
      selected_countries = [];
      filter_query = "";
      $scope.showApplication =false;
    });

     // $('.searchBtn').click(function (event) {

     //  alert('clicked view');
     // });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});
