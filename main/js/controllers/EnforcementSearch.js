'use strict';
var selected_countries = [];
var selected_jobs = [];
var selected_states = [];
var selected_branch = [];
var clickCircle, clickMarker;
var filter_query = "";
// var solrHost = "localhost";
//var solrHost = "pistachio_server";
MetronicApp.controller('EnforcementSearchController', function ($rootScope, $scope, $http, $timeout, chkIframe, $sce,$uibModal) {
  $scope.$on('$viewContentLoaded', function () {

    // initialize core components
    Metronic.initAjax();
    $scope.reset()
    Layout.setSidebarMenuActiveLink('set', $('#fastsearchLink'));
    $scope.tblContent = false;
    $scope.noData = false;
    var getUser = localStorage.getItem("username");
    $scope.getSearchFromDt1 = "";
    $scope.getSearchToDt = "";
    $scope.text = "";
    $scope.latVal = "";
    $scope.lngVal ="";
    $scope.kilom = "";

    $('#searchDaterange').daterangepicker({
      startDate: moment().subtract(1, "year"),
      endDate: moment(),
      "alwaysShowCalendars": false,
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    },
      function (startdt, enddt) {
        $('#searchDaterange span').html(startdt.format('MMM DD, YYYY') + ' - ' + enddt.format('MMM DD, YYYY'));
      });

    // $("#searchDaterange span").html(moment().subtract(1,"year").format("MMM DD YYYY") + " - " + moment().format("MMM DD YYYY"));
    $("#searchDaterange span").html("Search by Date here");
    // 





    $('.searchcont').on('apply.daterangepicker', function (ev, picker) {
      $scope.getSearchFromDt1 = picker.startDate.format("DDMMYYYY");
      $scope.getSearchToDt = picker.endDate.format("DDMMYYYY");
      // alert($scope.getSearchFromDt1 + " , " + $scope.getSearchToDt);
      // $scope.$apply();
      $scope.show();
    });

    if (!$rootScope.fastsearch.load) {
      $scope.showApplication = false;
      $scope.showVisitor = false;
      $scope.showCitizen = false;
      $scope.showBlacklist = false;
      $scope.option = false;
      $scope.start = 0;
      $scope.users = 0;
      $scope.text = "";
      $scope.fullscreen = false;
      $scope.go();
    }
    else {
      $scope.showApplication = $rootScope.fastsearch.showApplication;
      $scope.showVisitor = $rootScope.fastsearch.showVisitor;
      $scope.start = 0;
      $scope.users = 0;
      $scope.text = $rootScope.fastsearch.text;
      $scope.show();
      $rootScope.fastsearch.load = false;

    }
    

  });







  $scope.getQuery = function () {
    var query;
    if ($scope.text.length > 0) {
      var stext = $scope.text.split(" ");
      var j = stext.length;
      console.log("length :" + j);
      query = "combinedSearch:*" + stext[0] + "*"
      for (var i = 1; i < j; i++) {
        query = query + " AND combinedSearch:*" + stext[i] + "*";
      }
    }
    else {
      query = "*:*"
    }
    console.log(query);
    return (query);
  }

  $scope.show = function () {
    $rootScope.box_update();
    $scope.showData("offender");
  }


  $scope.go = function () {
    $rootScope.box_update();
  }

   $scope.open = function (data) {

      $scope.expact_id = data;
      var options = {
        templateUrl: 'myModalContent.html',
        controller: profileModal,
        size: 'lg',
        resolve: {
          expact: function () {
            return data;
          }
        }
      };
      var modalInstance = $uibModal.open(options);
      modalInstance.result.then(function () {
        $scope.show_profile = false;
      }, function () {
       $scope.show_profile = false;
      });
    };

  $scope.updateFilterQuery_Country = function () {
    var filter_query = "";
    var arrayLength = selected_countries.length;
    if (arrayLength > 0) {
      filter_query = "{!tag=COUNTRY}country:( "
      for (var i = 0; i < arrayLength; i++) {
        filter_query = filter_query + selected_countries[i];

        if (i != arrayLength - 1)
          filter_query = filter_query + " "

      }
      filter_query = filter_query + ')'
    }

    arrayLength = selected_jobs.length;
    if (arrayLength > 0) {
      if (filter_query.length > 1)
        filter_query = filter_query + " AND "
      filter_query = filter_query + "job_bm:("
      for (var i = 0; i < arrayLength; i++) {
        filter_query = filter_query + "\"" + selected_jobs[i] + "\"";

        if (i != arrayLength - 1)
          filter_query = filter_query + " "
      }
      filter_query = filter_query + ")"
    }

    //#geosearch
    if ($scope.clicked) {
      if (filter_query.length > 1)
        filter_query = filter_query + " AND "
      filter_query = filter_query + "{!geofilt sfield=loc}";
      console.log(filter_query);
    }


    return filter_query
  }

  $scope.spatialSearch = function () {
    if ($scope.clicked)
      return "&pt=" + $scope.latVal + "," + $scope.lngVal + "&d=+" + $scope.kilom
    else
      return ""
  }

  $scope.jobBox = function (id) {
 
    var index = selected_jobs.indexOf(id);    // <-- Not supported in <IE9
    if (index !== -1) {
      selected_jobs.splice(index, 1);
    }
    else {
      selected_jobs.push(id);
    }
    console.log(selected_jobs);
    $scope.selected_jobs = selected_jobs
    $scope.start = 0;
    $scope.show();

  }

  $scope.checkboxselectedCountry = function (id) {
    var index = selected_countries.indexOf(id);    // <-- Not supported in <IE9
    if (index !== -1) {
      selected_countries.splice(index, 1);
    }
    else {
      selected_countries.push(id);
    }
    $scope.selected_countries = selected_countries;
    console.log(selected_countries);
    $scope.start = 0;
    $scope.show();
  }

  $scope.statesBox = function (id) {
    var index = selected_states.indexOf(id);    // <-- Not supported in <IE9
    if (index !== -1) {
      selected_states.splice(index, 1);
    }
    else {
      selected_states.push(id);
    }
    console.log(selected_states);
    $scope.selected_states = selected_states
    $scope.start = 0;
    $scope.show();
  }

// selected_branch
$scope.branchsBox = function (id) {
    var index = selected_branch.indexOf(id);    // <-- Not supported in <IE9
    if (index !== -1) {
      selected_branch.splice(index, 1);
    }
    else {
      selected_branch.push(id);
    }
    console.log(selected_branch);
    $scope.selected_branch = selected_branch
    $scope.start = 0;
    $scope.show();
  }

  $scope.formatDate = function (date) {
    if (typeof (date) != "undefined")
      return date.replace('T', ' ').replace('Z', '')
    else {
      return ""
    }
  }

  $rootScope.box_update = function () {
    $scope.showData("offender",10,false)
  }


  $scope.options = function () {
    if (!$scope.option) {
      $scope.option = true;

    }
    else {
      $scope.option = false;
    }

  }
  $('#searchbox').keypress(function (e) {
    if (e.which == 13) {
      $scope.search($(this).val().trim());
    }
  });

  $scope.search = function (text) {

    filter_query = "";
    $scope.text = text;
    $scope.start = 0;
    init_page()
    // selected_countries = [];
    $scope.show();
  };

  $scope.reset = function () {
    selected_countries = [];
    $scope.text = "";
    $scope.offendertotal = 0;
    $scope.fullscreen = false;
    $scope.ChkCntry = true
    $scope.option = false;
    selected_countries = [];
    selected_jobs = [];
    selected_states = [];
    selected_branch = [];
    $scope.latVal = "";
    $scope.lngVal ="";
    $scope.kilom = "";
    $scope.getSearchFromDt1 = "";
    $scope.getSearchToDt = "";
    $scope.records =""
    $scope.clicked = false;
    if($scope.map != undefined) {
          $scope.map.removeLayer($scope.clickCircle);
    $scope.map.removeLayer($scope.clickMarker);
    debugger;
    }

    
    init_page()

    $scope.selected_countries = selected_countries;
    $("#searchDaterange span").html("Search by Date here");
     $scope.go();
    //location.reload();
  };

  $scope.showData = function (collection,rows=10,click=true) {
    console.log(collection)
      var offenderUrl = 'http://'+solrHost+':8983/solr/immigration2/query?collection='+collection+'&json='
      $http.get(offenderUrl).
      success(function(data) {
        if(data.response.numFound == 0) {
         return
        }
        $scope.offendertotal =data.response.numFound
        if(rows!=0)
          $scope.records = data.response.docs;
       });  

       var json = {};
      json.limit  = rows;
      json.offset = $scope.page.start
      json.query = $scope.getQuery();
      json.filter = $scope.updateFilterQuery_Country();
      json.facet = {};
      json.facet.country = {};
      json.facet.country.type   = "terms";
      json.facet.country.field  =  "country";
      json.facet.country.limit  =  10;
      json.facet.country.domain = {};
      json.facet.country.domain.excludeTags ="COUNTRY"

      $http.get(offenderUrl+JSON.stringify(json)).
           success(function(data) {

              
              var sex = data.facets.country.buckets;
                   var i;
                   for(i = 0; i < sex.length; i++){
                      sex[i].field = sex[i]['val'];
                      delete sex[i].val;
                    }
                    $scope.country = sex
               if(data.response.numFound == 0) {
                 return
                }
                $scope.offendertotal =data.response.numFound
                if(rows!=0)
                  $scope.records = data.response.docs;
            })
  }


  /*
   Functions related to page change
  */
  function init_page() {
         var page_options = {};
         page_options.start = 0;
         page_options.limit = 10;
         page_options.page = 1;
         page_options.first = true;
         page_options.last = false;
         page_options.total = 0;
         $scope.page = page_options;
       }
  $scope.next_page = function() {
         var page_options = {};
         page_options.start = $scope.page.start + $scope.page.limit;
         page_options.limit = $scope.page.limit;
         page_options.page = $scope.page.page+1;
         page_options.first = false;
         if((page_options.start + page_options.limit) > $scope.page.total) {

           page_options.last = false; 
         }
         
         $scope.page = page_options;

         $scope.showApplications($scope.currentStatus, 'prenext');
       }

  $scope.previous_page = function () {
         var page_options = {};
         page_options.start = $scope.page.start - $scope.page.limit;
         if(page_options.start <= 0)
         {
          page_options.start =0
          page_options.first = true;
         }
         page_options.limit = $scope.page.limit;
         page_options.page = $scope.page.page - 1;
         page_options.last = false;
         $scope.page = page_options;

         $scope.showApplications($scope.currentStatus, 'prenext');
       }
 


  $rootScope.settings.layout.pageSidebarClosed = true;
  $rootScope.skipTitle = false;
  $rootScope.settings.layout.setTitle("efastsearch");
});
