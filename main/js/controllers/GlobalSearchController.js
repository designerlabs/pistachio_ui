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
        query = "combinedSearch:'"+$scope.text+"'"
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
      filter_query = "&fq=";
      var arrayLength = selected_countries.length;
      for (var i = 0; i < arrayLength; i++) {
        if(i==0)
          filter_query = filter_query + "country:"+selected_countries[i];
        else {
          filter_query = filter_query + " OR country:"+selected_countries[i];
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

    $scope.checkboxselectedCountry = function(id) {
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
        $scope.updateFilterQuery_Country();
      //  $scope.showVisitors();


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



    // set sidebar closed and body solid layout mode
    $scope.decopule = function(data,index) {
          if(index == 0)
            index = data.length;
          var keys = ["field","count"];
          var objList= [];
          for (var j = 0; j < index/2; j++) {
                 var country= {};
                 var i = j*2;
                 if(data[i+1] == 0) break;
                 if(data[i].length == 0) country[keys[0]]="NA";
                 else
                  country[keys[0]]=data[i];
                 if(data[i+1] == 0) continue;

                 country[keys[1]]=data[i+1];
                 objList.push(country);

               }
               return (objList);
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
      
      //var filter = $scope.jsonFilterQuery();
      //console.log(filter);
      //alert(filter.length);
      //if(filter.length>0)
      //{
      //  json.filter = filter;
      //}

      json.facet = {};
      json.facet.country = {};
      json.facet.country.type   = "terms";
      json.facet.country.field  =  "country";

      $http.get(sq+JSON.stringify(json)).
       success(function(data) {
         $scope.vtime = data.responseHeader.QTime;
         $scope.employers = data.response.numFound;
         $scope.items = data.response.docs;
         $scope.countries = data.facets.country.buckets
       })
       .error(function(data, status, headers, config) {
         console.log('error');
       });

    }

    $scope.showApplications = function() {

      var query = "";

      if($scope.text.length > 0) {
        query = 'http://'+solrHost+':8983/solr/immigration2/select?sort=created desc&q=combinedSearch:'+$scope.text+'&wt=json&start='+$scope.start+'&rows=10&facet=true&facet.field=ctry_issue&facet.limit=10&json.facet={users:\'hll(doc_no)\',employers:\'hll(employer)\'}'+filter_query;
      }
      else {
        query = 'http://'+solrHost+':8983/solr/immigration2/select?sort=created desc&q=*:*&wt=json&start='+$scope.start+'&rows=10&facet=true&facet.offset=1&facet.field=ctry_issue&facet.limit=10&json.facet={users:\'hll(doc_no)\',employers:\'hll(employer)\'}'+filter_query;
      }
      $http.get(query)
        .success(function(data) {
           $scope.qtime = data.responseHeader.QTime;
           $scope.users = data.facets.users;
           $scope.employers = data.facets.employers;
           $scope.items = data.response.docs;
           $scope.applicationsFound = data.response.numFound;
           if(selected_countries == 0) {
             var countries = data.facet_counts.facet_fields.ctry_issue;
             $scope.showApplication = true;
             $scope.countries = $scope.decopule(data.facet_counts.facet_fields.ctry_issue,20);
           }
           if($scope.applicationsFound < 10){
              $scope.newCount = $scope.applicationsFound;
              $(".nextBtn").prop("disabled", true);
           }else{
              $scope.newCount = clicks;
              $(".nextBtn").prop("disabled", false);
           }
         })
        .error(function(data, status, headers, config) {
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

     // $('.searchBtn').click(function (event) {

     //  alert('clicked view');
     // });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});
