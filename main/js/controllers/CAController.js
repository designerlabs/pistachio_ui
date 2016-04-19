


MetronicApp.controller('CAController', function($rootScope, $scope, $http, $timeout, $sce) {

  Metronic.initAjax();
  $rootScope.settings.layout.pageSidebarClosed = true;

  $scope.countryQuery = function(country) {
    var query = ""
    var sq = "http://"+solrHost+":8983/solr/immigration1_shard1_replica1/query?json=";

    var json = {};
    json.query = "country:"+country
    json.limit = 0;

    json.facet = {};

    json.facet.job = {};
    json.facet.job.type   = "terms";
    json.facet.job.field  = "job_bm";
    json.facet.job.limit  = 7;

    json.facet.age = {};
    json.facet.age.type   = "range";
    json.facet.age.field  = "age";
    json.facet.age.start  = 10;
    json.facet.age.end   = 100;
    json.facet.age.gap    = 10;


    json.facet.avgAge =  "avg(age)"
    json.facet.minAge =  "min(age)"
    json.facet.maxAge =  "max(age)"
    json.facet.uniqDoc =  "hll(mad_doc_no)"

    json.facet.apps = {};
    json.facet.apps.type   = "range";
    json.facet.apps.field  = "mad_crt_dt";
    json.facet.apps.start  = "2011-01-01T00:00:00Z";
    json.facet.apps.end   =  "2016-03-23T00:00:00Z";
    json.facet.apps.gap    = "%2B1MONTH";


    $http.get(sq+JSON.stringify(json)).
     success(function(data) {
       $scope.oJobCount = data.facets.count;
       $scope.topJobs = data.facets.job.buckets;
       $scope.jobAvgAge = data.facets.avgAge;
       $scope.jobMinAge = data.facets.minAge;
       $scope.jobMaxAge = data.facets.maxAge;
       $scope.uniqDoc = data.facets.uniqDoc;
       $scope.ageRange = data.facets.age.buckets;
       $scope.jobTimeline = data.facets.apps.buckets;

       $scope.column($scope.ageRange);
       $scope.timelineChart($scope.jobTimeline);

     })
  }

  $scope.visitMatcher = function(data) {

    for (var i = 0; i < 2; i++) {
      if(data[i].val == "1")
      {
        $scope.oVisitEntry = data[i].count;
        $scope.uVisitEntry = data[i].uniqDoc;
      }
      if(data[i].val == "2")
      {
        $scope.oVisitExit = data[i].count;
        $scope.uVisitExit = data[i].uniqDoc;
      }
    }

  }

  $scope.resetVisit = function() {

        $scope.oVisitEntry =  0;
        $scope.uVisitEntry =  0;
        $scope.oVisitExit  =  0;
        $scope.uVisitExit  =  0;

  }

  $scope.findNA = function(data) {

     if(data)
      return data;
     else {
       return "Not Mentioned"
     }
  }

  $scope.visitorQuery = function(country) {
    var query = ""
    var sq = "http://"+solrHost+":8983/solr/his/query?json=";

    var json = {};
    json.query = "country:"+country
    json.limit = 0;

    json.facet = {};

    json.facet.visit = {};
    json.facet.visit.type   = "terms";
    json.facet.visit.field  = "dy_action_ind";
    json.facet.visit.limit  = 2;

    json.facet.visit.facet = {};
    //json.facet.visit.facet.uniqDoc= {}
    json.facet.visit.facet.uniqDoc = "hll(doc_no)";


    $http.get(sq+JSON.stringify(json)).
     success(function(data) {
       if(data.facets.count > 0)
        $scope.visitMatcher(data.facets.visit.buckets)
       else {
         $scope.resetVisit()
       }
       //return data;
     })
  }




  $scope.$on('$viewContentLoaded', function() {

    $scope.selectedCountry  = {};
    $scope.selectedCountry.val  = "Overall";

    $scope.oJobCount = 0;
    $scope.aJobCount = 0;
    $scope.oVisitCount = 0;
    $scope.aVisitCount = 0;

    var query = ""
    var sq = "http://"+solrHost+":8983/solr/immigration1_shard1_replica1/query?json=";

    var json = {};
    json.query = "*:*"
    json.limit = 0;

    json.facet = {};
    json.facet.country = {};

    json.facet.country.type   = "terms";
    json.facet.country.field  =  "country";
    json.facet.country.limit  =  10;


    $http.get(sq+JSON.stringify(json)).
     success(function(data) {
       $scope.countries = data.facets.country.buckets;
       //return data;
     })
     $scope.countryQuery("*");
     $scope.visitorQuery("*");

     $scope.currentTab = 'overall';
  });

  $scope.update = function (data) {
    console.log("country updated : "+$scope.selectedCountry.val)
    $scope.countryQuery($scope.selectedCountry.val);
    $scope.visitorQuery($scope.selectedCountry.val);

  }

  $scope.column = function(data) {
     var ageData = [];
     for (var i = 0; i < data.length; i++) {
       ageData.push(data[i].count)
     }
     var _state = $scope.state;
     console.log($scope.stateObject);
     console.log(_state);

    Highcharts.chart('highchart_col',{
      chart : {
          type : 'column',

          style: {
              fontFamily: 'Open Sans'
          }
      },
      xAxis: {
            categories: ['0-10', '10-20', '20-30', '30-40', '40-50','50-60','70-80','80-90','90-100'],
            title: {
                text: null
            },
            labels: {
                overflow: 'justify',
                style : {"color":"#6D869F","fontWeight":"bold"}
            }
      },
      plotOptions: {
        bar: {
                  dataLabels: {
                      enabled: true
                  }
        }

      },
      exporting: { enabled: false },
          title: {
            text: 'Umur Range',
            x: -20 //center
          },
          series: [{
          name: 'overall',
          colorByPoint: true,
          data:  ageData,
        point:{
            events:{
                click: function (event) {
                    //$scope.clickState(this.name);
                    console.log(this.name);
                }
            }
        }
      }]
        });
  };

  $scope.changeTab = function(data) {
        if(data == $scope.currentTab)
          return;
        else
          $scope.currentTab = data;
       console.log("Tab Changed : "+data)

  };

  $scope.timelineChart = function(dataRange) {

    var data = [];
     for( var i=0,l = dataRange.length;i<l; i++){
       var obj = dataRange[i];
       var element =[];
       element.push(new Date(obj.val).getTime());
       element.push(obj.count);
       data.push(element);
     }

    Highcharts.chart('highchart_timeline',{
          title: {
              text: 'Jobs'
          },
          xAxis: {
              type: 'datetime'
          },
          yAxis: {
              title: {
                  text: 'No of Applications'
              }
          },
          legend: {
              enabled: false
          },
          exporting: { enabled: false },
          series: [{
              type: 'spline',
              name: 'USD to EUR',
              data: data
          }]
      });
  };



});
