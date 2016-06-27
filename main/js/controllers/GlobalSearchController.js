'use strict';
var selected_countries = [];
var selected_jobs = [];

var filter_query = "";
// var solrHost = "localhost";
//var solrHost = "pistachio_server";
MetronicApp.controller('GlobalSearchController', function($rootScope, $scope, $http, $timeout, $sce) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        Layout.setSidebarMenuActiveLink('set', $('#fastsearchLink')); 


        var getUser = localStorage.getItem("username");
        if(!$rootScope.fastsearch.load)
        {
          $scope.showApplication = false;
          $scope.showVisitor = false;
          $scope.showCitizen = false;
          $scope.option = false;
          $scope.start=0;
          $scope.users = 0;
          $scope.text = "";
          $scope.go();
        }
        else {
          $scope.showApplication = $rootScope.fastsearch.showApplication;
          $scope.showVisitor = $rootScope.fastsearch.showVisitor;
          $scope.start=0;
          $scope.users = 0;
          $scope.text = $rootScope.fastsearch.text;
          $scope.show();
          $rootScope.fastsearch.load=false;
        }

    });

    $scope.getQuery = function() {
      var query;
      if($scope.text.length > 0) {
        var stext = $scope.text.split(" ");
          var j = stext.length;
          console.log("length :"+j);
          query = "combinedSearch:*"+stext[0]+"*"
          for (var i = 1; i < j; i++) {
             query = query + " AND combinedSearch:*"+stext[i]+"*";
          }
      }
      else {
        query = "*:*"
      }
      console.log(query);
      return(query);
    }

    $scope.show = function() {
      $scope.box_update();
      if($scope.showApplication){
        $scope.showApplications();
        $scope.visitor_box();
        $scope.citizen_box();
      }
      else if ($scope.showVisitor)
      {
        $scope.showVisitors();
        $scope.application_box();
        $scope.citizen_box();
      }

      else if ($scope.showCitizen){
        $scope.showCitizens();
        $scope.application_box();
        $scope.visitor_box();
      }

      else
        $scope.go();
   }


    $scope.go = function() {
      $scope.application_box();
      $scope.visitor_box();
      $scope.citizen_box();
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
      arrayLength = selected_jobs.length;
      job_filter = "&fq=";
      for (var i = 0; i < arrayLength; i++) {
        if(i==0)
        filter_query = filter_query + "job_bm:'"+selected_jobs[i]+"'";
        else {
          filter_query = filter_query + " OR job_bm:'"+selected_jobs[i]+"'";
        }

      }
      return filter_query + job_filter
    }

    $scope.updateFilterQuery_Country = function () {
      var filter_query = "";
      var arrayLength = selected_countries.length;
      if(arrayLength == 0) return "";
      filter_query = "country:("
      for (var i = 0; i < arrayLength; i++) {
        filter_query = filter_query + "country:"+selected_countries[i];

        if(i !=arrayLength-1)
          filter_query = filter_query + " OR "

      }
      arrayLength = selected_jobs.length;
      if(arrayLength>0 && filter_query.length > 1)
        filter_query = filter_query + "&fq="
      for (var i = 0; i < arrayLength; i++) {
        filter_query = filter_query + "job_bm:"+selected_countries[i];

        if(i !=arrayLength-1)
          filter_query = filter_query + " OR "
      }
      return filter_query
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


    $scope.jobBox = function(id) {
      var index = selected_jobs.indexOf(id);    // <-- Not supported in <IE9
      if (index !== -1) {
        selected_jobs.splice(index, 1);
      }
      else {
        selected_jobs.push(id);
      }
      console.log(selected_jobs);
      $scope.start = 0;
      $scope.show();

    }

    $scope.checkboxselectedCountry = function(id) {
      id = id.replace(/ /g,"*");
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

    $scope.application_box = function () {
      $http.get('http://'+solrHost+':8983/solr/immigration2/select?q='+$scope.getQuery()+'&wt=json&start=0&rows=0').
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
    }

    $scope.visitor_box = function() {
      $http.get('http://'+solrHost+':8983/solr/hismove/select?q='+$scope.getQuery()+'&wt=json&start=0&rows=0').
          success(function(data) {
              $('#searchbox').val($scope.text);
              $scope.employers = data.response.numFound;
              $scope.vtime = data.responseHeader.QTime;
            }).
            error(function(data, status, headers, config) {
              console.log('data : ' + data); //Being logged as null
            });
    }

    $scope.citizen_box = function() {
      $http.get('http://'+solrHost+':8983/solr/cit/select?q='+$scope.getQuery()+'&wt=json&start=0&rows=0').
          success(function(data) {
              $('#searchbox').val($scope.text);
              $scope.users = data.response.numFound;
              $scope.vtime = data.responseHeader.QTime;
            }).
            error(function(data, status, headers, config) {
              console.log('data : ' + data); //Being logged as null
            });
    }

    $scope.formatDate = function (date) {
     //var d = new Date(date);
     //return d.toString();
     return date.replace('T',' ').replace('Z','')
    }
    $scope.box_update = function () {
      if($scope.showApplication)
      {
        $scope.visitor_box();
        $scope.citizen_box();
      }
      else if ($scope.showVisitor){
        $scope.application_box();
        $scope.citizen_box();
      }
      else if ($scope.showCitizen){
        $scope.application_box();
        $scope.visitor_box();
      }
    }


    $scope.options = function() {
      if(!$scope.option) {
        $scope.option = true;
      }
      else {
        $scope.option = false;
      }

    }

    $scope.search = function(text) {

      filter_query = "";
      $scope.text = text;
      $scope.start = 0;

      selected_countries = [];
      $scope.show();


      };
        $scope.reset = function() {
          selected_countries = [];
          $scope.text = "";
          $scope.showApplication = false;
          $scope.showVisitor = false;
          $scope.showCitizen = false;
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
     cntry = cntry.replace(/ /g,"*");
     window.location = "#/travelertracker/travelertracker.html?doc_no="+docno+"&country="+cntry+"";
   };

   $scope.viewCitizen = function(docno){

    window.location = "#/travelertracker/travelertracker.html?doc_no="+docno+"&citizen=true";
  };


    $scope.showVisitors = function() {
      var query = "";
      $scope.showApplication = false;
      $scope.showCitizen = false;
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
         if(data.response.numFound == 0)
          {
            $scope.showVisitor =false;
          }
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

    $scope.showCitizens = function() {
      var query = "";

      $scope.showCitizen = true;
      $scope.showApplication = false;
      $scope.showVisitor = false;
      var query = ""
      var sq = "http://"+solrHost+":8983/solr/cit/query?json=";

      var json = {};
      json.limit = 10;
      json.offset = $scope.start
      json.query = $scope.getQuery();
      json.sort = "xit_date desc"
      $http.get(sq+JSON.stringify(json)).
       success(function(data) {
         if(data.response.numFound == 0)
          {
            $scope.showCitizen =false;
          }
         $scope.vtime = data.responseHeader.QTime;
         $scope.users = data.response.numFound;
         console.log(data.response.docs);
         $scope.items = data.response.docs;

       })
       .error(function(data, status, headers, config) {
         console.log('error');
       });

    }



    $scope.showApplications = function() {
      var query = "";
      $scope.showVisitor = false;
      $scope.showCitizen = false;
      $scope.showApplication = true;

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
      json.facet.job = {};
      json.facet.job.type   = "terms";
      json.facet.job.field  =  "job_bm";
     // json.facet.country.domain = "{excludeTags:COLOR}"
      $http.get(sq+JSON.stringify(json)).
       success(function(data) {
         if(data.response.numFound == 0)
          {
            $scope.showApplication =false;
          }
         $scope.vtime = data.responseHeader.QTime;
         $scope.applicationsFound = data.response.numFound;
         //$scope.employers = data.response.numFound;
         $scope.items = data.response.docs;
         if(selected_countries.length == 0)
         $scope.countries = data.facets.country.buckets

         if(selected_jobs.length == 0)
          $scope.jobs = data.facets.job.buckets
         console.log($scope.jobs);
       })
       .error(function(data, status, headers, config) {
         console.log('error');
       });

    }


    $scope.$on('$locationChangeStart', function( event ) {
      $rootScope.fastsearch.text = $scope.text;
      $rootScope.fastsearch.showApplication = $scope.showApplication;
      $rootScope.fastsearch.showVisitor = $scope.showVisitor;
    });

     // $('.searchBtn').click(function (event) {

     //  alert('clicked view');
     // });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("fastsearch");
});
