'use strict';
var selected_countries = [];
var filter_query = "";
// var solrHost = "localhost";
MetronicApp.controller('GlobalSearchController', function($rootScope, $scope, $http, $timeout, $sce) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        var getUser = localStorage.getItem("username");
        $http.get('http://'+solrHost+':8983/solr/immigration1/select?q=*:*&wt=json&start=0&rows=0&json.facet={users:\'hll(mad_doc_no)\',employers:\'hll(employer)\'}').
         success(function(data) {
             console.log(data);
             $scope.items = data.response.docs;
             $scope.applicationsFound = data.response.numFound;
             $scope.qtime = data.responseHeader.QTime;
             $scope.users = data.facets.users;
             $scope.employers = data.facets.employers;
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
        $http.get('http://'+solrHost+':8983/solr/immigration1/select?q=combinedSearch:'+text+'&wt=json&start=0&rows=0').
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
          $http.get('http://'+solrHost+':8983/solr/immigration1/select?q=*:*&wt=json&start=0&rows=0').
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

    $scope.showApplications = function() {

      var query = "";

      if($scope.text.length > 0) {
        query = 'http://'+solrHost+':8983/solr/immigration1/select?sort=mad_crt_dt desc&q=combinedSearch:'+$scope.text+'&wt=json&start='+$scope.start+'&rows=10&facet=true&facet.field=mad_nat_cd&facet.limit=10&json.facet={users:\'hll(mad_doc_no)\',employers:\'hll(employer)\'}'+filter_query;
      }
      else {
        query = 'http://'+solrHost+':8983/solr/immigration1/select?sort=mad_crt_dt desc&q=*:*&wt=json&start='+$scope.start+'&rows=10&facet=true&facet.offset=1&facet.field=mad_nat_cd&facet.limit=10&json.facet={users:\'hll(mad_doc_no)\',employers:\'hll(employer)\'}'+filter_query;
      }
      $http.get(query).
       success(function(data) {
           $scope.qtime = data.responseHeader.QTime;
           $scope.users = data.facets.users;
           $scope.employers = data.facets.employers;
           $scope.items = data.response.docs;
           $scope.applicationsFound = data.response.numFound;
           if(selected_countries == 0) {
             var countries = data.facet_counts.facet_fields.mad_nat_cd;
             $scope.showApplication = true;
             $scope.countries = $scope.decopule(data.facet_counts.facet_fields.mad_nat_cd,20);
           }
         

          $scope.viewReq = function(docno,cntry){
            $rootScope.docno = docno;
            $rootScope.cntry = cntry;
            // window.location.href ="#/travelertracker/travelertracker.html";
            window.location = "index.html#/travelertracker/travelertracker.html?doc_no="+docno+"&country="+cntry+"";
            // window.open("MusicMe.html?variable=value", "_self");
            
          }




        if($scope.applicationsFound < 10){
          $scope.newCount = $scope.applicationsFound;
          $(".nextBtn").prop("disabled", true);
        }else{
          $scope.newCount = clicks;
          $(".nextBtn").prop("disabled", false);
        }


           console.log($scope.countries);
           // console.log(countryObjList);



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

     // $('.searchBtn').click(function (event) {

     //  alert('clicked view');
     // });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});
