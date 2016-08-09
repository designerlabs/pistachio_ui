'use strict';
var selected_countries = [];
var filter_query = "";

var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/immigration2/query?json='

MetronicApp.controller('VAAController', function($rootScope, $scope, $http) {
    $scope.$on('$viewContentLoaded', function() {
        scope.firstTime = true;
        // initialize core components
        Metronic.initAjax();
        $(".page-sidebar-menu > li").removeClass('active');
        $("#dashboardLink").addClass('active');
        //alert("HI");
        var getUser = localStorage.getItem("username");

        $scope.reset();
        $scope.date_range();


    });
    function cb(start, end) {
      $('#vaa-range span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $scope.date_range = function() {

      cb(moment("20100101", "YYYYMMDD"), moment());

      $('#vaa-range').daterangepicker({
          ranges: {
             'Last 30 Days': [moment().subtract(29, 'days'), moment()],
             '2016': [moment("20160101", "YYYYMMDD"), moment()],
             '2015': [moment("20150101", "YYYYMMDD"), moment("20151231", "YYYYMMDD")],
             '2014': [moment("20140101", "YYYYMMDD"), moment("20141231", "YYYYMMDD")],
             '2013': [moment("20130101", "YYYYMMDD"), moment("20131231", "YYYYMMDD")],
             '2012': [moment("20120101", "YYYYMMDD"), moment("20121231", "YYYYMMDD")],
             '2011': [moment("20110101", "YYYYMMDD"), moment("20111231", "YYYYMMDD")],
             '2010': [moment("20100101", "YYYYMMDD"), moment("20101231", "YYYYMMDD")]

          },
          opens : "right",
          "alwaysShowCalendars": true,
          showDropdowns: true,
          minDate : moment("20100101", "YYYYMMDD")

      }, cb);

      $('#vaa-range').on('apply.daterangepicker', function(ev, picker) {
          $('#daterange').val('');
          console.log($scope.filterButtons)
          var range = '[ '+ moment(picker.startDate).format('YYYY-MM-DDT00:00:00')+'Z TO '+moment(picker.endDate).format('YYYY-MM-DDT00:00:00')+'Z ]'

          var display = "[ "+ moment(picker.startDate).format('DD-MM-YYYY') +" TO "+ moment(picker.endDate).format('DD-MM-YYYY')+" ]";
          $scope.time_filtered_max = moment(picker.endDate).format('YYYY-MM-DDT00:00:00')+'Z';
          $scope.time_filtered_min = moment(picker.startDate).format('YYYY-MM-DDT00:00:00')+'Z'
              $scope.addFilter("tim","Time :"+display,"created:"+range);

              $scope.querySolr();
      });

    }

    $scope.drawHeatMap = function() {
      var fq = $scope.filterQuery();
      if(fq.length < 3) {
        fq = "*:*"
      }
      $scope.map = L.map("map",{fullscreenControl: true}).setView([4, 100], 7);
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; NSL | Mimos'
      }).addTo($scope.map);
      new L.SolrHeatmapLayer('http://'+solrHost+':8983/solr/immigration2', {
         field: 'loc',
         query: {q:fq},
         blur : 15,
         opacity : .8,
         colors: ['feb24c','de2d26', 'ff0000']
      }).addTo($scope.map);

    
    }

    $scope.reDrawHeatMap = function () {
      $scope.map.remove();
    }

    $scope.queryType = 'active';
    $scope.changeQueryType = function () {
       // $scope.querySolr();
    };

    $scope.moreJobs = function(){
      $scope.jobCount = $scope.jobCount + 10;

      var json = {};
      json.limit  = 0;
      json.offset = 0
      json.query = $scope.formQuery();
      json.filter = $scope.filterQuery();
      json.facet = {};
      json.facet.job = {};
      json.facet.job.type   = "terms";
      json.facet.job.field  =  "job_en";
      json.facet.job.limit  =  $scope.jobCount;
      $scope.jobCount
      $http.get(thisSolrAppUrl+JSON.stringify(json)).
           success(function(data) {
              $scope.jobs = data.facets.job.buckets;
              //return data;
            })

    }


    $scope.changeAnalysis = function (data) {
        if(data == $scope.analysiType)
          return;
        else
          $scope.analysiType = data;
       if($scope.needRefresh ==  false)
        return;
       if(data == 'overall')
       {
          $scope.querySolr();
       }
       else if(data == 'timeline')
       {
          //$scope.timelineChart();
          $scope.date_query();
       }
      // $scope.querySolr();
      $scope.needRefresh =  false;
    };



    $scope.reset = function(){
      $scope.radioValue = "Overall"
      $scope.cntName = "";
      $scope.cntCode = "";
      $scope.cJobs = "";
       $scope.cEmply = "";
        $scope.cSex = "";
        $scope.cState = "";
        $scope.filters = false;
        $scope.filterButtons = [];
         $scope.analysiType = 'overall';
         $scope.loadTimeline = true;
         $scope.time_filtered_max = "";
         $scope.time_filtered_min = "";

         $scope.jobCount = 10;

         $scope.dateRange = {};
         $scope.dateRange.min = "2010-01-01T00:00:00Z"
         $scope.dateRange.max = "2016-01-01T00:00:00Z"
         cb(moment("20100101", "YYYYMMDD"), moment());
         //$scope.analysiType = 'overall';
        $scope.querySolr();

    }



       $scope.cleanQuery = function(data) {
        data = data.replace(/\(/g,"\\\(");
        data = data.replace(/\)/g,"\\\)");
          data = data.replace(/ /g,"*");
          return(data);
       }

       $scope.clickActive = function () {
         if($scope.radioValue == 'Active')
          $scope.addFilter("act","Active Visa/Pass","vend:[" +moment().format('YYYYMMDD')+" TO *]");
         else {
           $scope.updateFilter("act",false)
         }
         $scope.querySolr();
       }

       $scope.clickEmply = function(data) {
        $scope.addFilter("emp","Employer :"+data,"employer:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickSex = function(data) {
        $scope.addFilter("sex","Sex : "+data,"sex:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickSkill = function(data) {
        $scope.addFilter("skl","Skill : "+data,"skill:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickState = function(data) {
        $scope.addFilter("sta","Negeri :"+data,"state:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickCity = function(data) {
        $scope.addFilter("cit","City :"+data,"city:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickJobs = function(data) {
        $scope.addFilter("job","Job : "+data,"job_en:"+$scope.cleanQuery(data));
        $scope.querySolr();
       };

       $scope.clickVisa = function(data) {
        $scope.addFilter("vis","Visa Type : "+data,"pass_type:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickCountry = function(data) {
        $scope.addFilter("cnt","Country : "+data,"country:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.updateActiveGeography = function(geography) {
          $scope.addFilter("cnt","country: "+geography.id,"cntry_cd:"+geography.id);
          $scope.querySolr();
      }

       $scope.addFilter = function (id,data,query){

          $scope.updateFilter(id,false);
          var obj = {};
          obj['id'] = id;
          obj['value'] = data;
          obj['query'] = query;
          $scope.filterButtons.push(obj);
          $scope.needRefresh = true;
       }

       $scope.updateFilter = function (data,refresh){
          var i = $scope.filterButtons.length
            while (i--) {
                if($scope.filterButtons[i]["id"] == data)
                {
                  $scope.filterButtons.splice(i, 1);
                  if(refresh){
                    $scope.time_filtered_max = "";
                    $scope.time_filtered_min = "";
                  }

                }

            }

          if(refresh)
            $scope.querySolr();
       }

       $scope.formQuery = function() {

        var query = "*:*";
        return query;
       }

       $scope.filterQuery = function () {
        var query = "";
        if($scope.filterButtons.length == 0)
          return query;
        query = $scope.filterButtons[0]["query"];
        if($scope.filterButtons.length > 1)
          for (var i = 1; i < $scope.filterButtons.length; i++) {
              query = query+" AND "+$scope.filterButtons[i]["query"];
          }

        return query;
       }

       $scope.analysisSolr = function() {
          if($scope.analysiType == 'overall')
              $scope.querySolr();
            else if ($scope.analysiType == 'timeline')  {
              query = 'http://'+solrHost+':8983/solr/immigration2/select?q='+$scope.formQuery()+'&wt=json&rows=0&facet=true&facet.field=country&facet.limit=100&facet.field=job_en&facet.field=sex&facet.field=employer&facet.field=pass_type&facet.limit=150&'+$scope.filterQuery();
            }

          else if ($scope.analysiType == 'age')
            query = 'http://'+solrHost+':8983/solr/immigration2/select?q='+$scope.formQuery()+'&wt=json&rows=0&facet=true&facet.field=country&facet.limit=100&facet.field=job_en&facet.field=sex&facet.field=employer&facet.field=pass_type&facet.limit=150&'+$scope.filterQuery();

       }

       $scope.querySolr = function() {

          $scope.filters = false;
          var json = {};
          if($scope.analysiType == 'overall')
          {
            json.limit  = 0;
            json.offset = 0
            json.query = $scope.formQuery();
            json.filter = $scope.filterQuery();
            json.facet = {};
            json.facet.country = {};
            json.facet.country.limit = 150;
            json.facet.country.type   = "terms";
            json.facet.country.field  =  "country";
            json.facet.job = {};
            json.facet.job.type   = "terms";
            json.facet.job.limit = $scope.jobCount;
            json.facet.job.field  =  "job_en";
            json.facet.sex = {};
            json.facet.sex.type   = "terms";
            json.facet.sex.field  =  "sex";
            json.facet.pass = {};
            json.facet.pass.type   = "terms";
            json.facet.pass.field  =  "pass_type";
            json.facet.emp = {};
            json.facet.emp.type   = "terms";
            json.facet.emp.field  =  "employer";
            json.facet.state = {};
            json.facet.state.type   = "terms";
            json.facet.state.field  =  "state";
            json.facet.city = {};
            json.facet.city.type   = "terms";
            json.facet.city.field  =  "city";
            json.facet.skill = {};
            json.facet.skill.type   = "terms";
            json.facet.skill.field  =  "skill";
            json.facet.uJob  =  "unique(job_en)";
            json.facet.uEmp  =  "unique(employer)";
            json.facet.uVis  =  "unique(pass_type)";
            json.facet.uSta  =  "unique(state)";
            json.facet.uCity  =  "unique(city)";


            json.facet.date_range = {};

            json.facet.date_range.type   = "range";
            json.facet.date_range.field  =  "created";
            if($scope.time_filtered_max.length > 0)
            {
              json.facet.date_range.start  = $scope.time_filtered_min;
              json.facet.date_range.end    = $scope.time_filtered_max;
            }
            else {
              json.facet.date_range.start  = $scope.dateRange.min;
              json.facet.date_range.end    = $scope.dateRange.max;
            }

            json.facet.date_range.gap    = "%2B1MONTH";

          }

          $http.get(thisSolrAppUrl+JSON.stringify(json)).
             success(function(data) {
                 if(selected_countries == 0) {
                   $scope.countries = data.facets.country.buckets;
                   $scope.jobs = data.facets.job.buckets
                   $scope.employers = data.facets.emp.buckets
                   $scope.visas = data.facets.pass.buckets
                   $scope.skill = data.facets.skill.buckets
                   $scope.states = data.facets.state.buckets
                   $scope.cities = data.facets.city.buckets
                   var sex = data.facets.sex.buckets;
                   var i;
                   for(i = 0; i < sex.length; i++){
                      sex[i].name = sex[i]['val'];
                      sex[i].y = sex[i]['count'];
                      delete sex[i].val;
                      delete sex[i].count;
                    }
                    console.log(sex);
                   $scope.sex = sex;
                   $scope.state = data.facets.state.buckets

                   $scope.uJob = data.facets.uJob;
                   $scope.uEmp = data.facets.uEmp;
                   $scope.uVis = data.facets.uVis;
                   $scope.uSta = data.facets.uSta;
                   $scope.uCity = data.facets.uCity;

                   //alert(data.facet_counts.facet_fields.sex.length);
                   console.log($scope.sex1);
                  
                   if($scope.firstTime)
                   {
                    $scope.overallTab();
                    $scope.firstTime = false;
                   }
                    
                   $scope.loading = false;
                 }
                 

               }).
               error(function(data, status, headers, config) {
                 console.log('error');
                 console.log('status : ' + status); //Being logged as 0
                 console.log('headers : ' + headers);
                 console.log('config : ' + JSON.stringify(config));
                 console.log('data : ' + data); //Being logged as null
               });

               

    };

        $scope.stateTab = function() {
         $scope.column()
        }


    $scope.overallTab = function() {
      $scope.pie();
      if( typeof $scope.map != 'undefined')
                $scope.reDrawHeatMap();
      $scope.timelineChart(data.facets.date_range.buckets)
      $scope.drawHeatMap();
    }

    $scope.pie = function() {
      Highcharts.chart('highchart_pie',{
        chart : {
            type : 'pie',
            style: {
                fontFamily: 'Open Sans'
            }
        },
         plotOptions: {
        pie: {
            dataLabels: {
                distance: -45
            }
        }
        },
        exporting: { enabled: false },
            title: {
              text: 'mengikut jantina',
              x: -20 //center
            },
            legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
            },
            series: [{
            name: 'jantina',
            colorByPoint: true,
            data: $scope.sex,
          point:{
              events:{
                  click: function (event) {
                      $scope.clickSex(this.name);
                  }
              }
          }
        }]
          });



      $scope.labels = $scope.sex.val;
      $scope.data = $scope.sex.count;
    };

    $scope.omitNa = function (data) {
      if(data.length == 0)
      {
        return "NOT MENTIONED"
      }
      else {
        return data
      }
    }

    $scope.column = function() {

      console.log("state")
       var _state = $scope.state;

       var stateName = [];
       var stateData = [];

      for (var i =0,l=_state.length; i < l; i++) {
           stateName.push(_state[i].val)
           stateData.push(_state[i].count)
        }
        console.log(stateName);
console.log(stateData);
debugger;
    //    console.log("--------")


      Highcharts.chart('highchart_col',{
        chart : {
            type : 'column',
            style: {
                fontFamily: 'Open Sans'
            }
        },
         plotOptions: {
        pie: {
            dataLabels: {
                distance: -45
            }
        }
        },
        xAxis: {
            categories: stateName
        },

        exporting: { enabled: false },
            title: {
              text: 'negeri',
              x: -20 //center
            },
            series: [{
            name: 'negeri',
            colorByPoint: true,
            data: stateData,
          point:{
              events:{
                  click: function (event) {
                      $scope.clickState(this.name);
                  }
              }
          }
        }]
          });
    };


    

    $scope.yyyymmdd = function(date) {
      var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();
    return yyyy +"-" + (mm[1]?mm:"0"+mm[0]) +"-" + (dd[1]?dd:"0"+dd[0]) +"T00:00:00Z"; // padding
    };

    $scope.jsonFilterQuery = function () {
     var query = [];
     if($scope.filterButtons.length == 0)
       return query;
     for (var i =0,l=$scope.filterButtons.length; i < l; i++) {
           query.push($scope.filterButtons[i]["query"]);
       }
       //alert(query.length);
     return query;
    }



    $scope.getDateLimits = function () {
      //var query = "q=-created%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(created)\",\"max_date\":\"max(created)\"}}"
      //var sq = "http://"+solrHost+":8983/solr/immigration2/query?"
      //$http.get(sq+query).
      // success(function(data) {
         var y = {};


    }

    $scope.date_query = function () {

      if($scope.analysiType != 'timeline')
       return;

      var query = ""
      var sq = "http://"+solrHost+":8983/solr/immigration2/query?json=";

      var json = {};
      json.query = "*:*"
      json.limit = 0;

      var filter = $scope.jsonFilterQuery();
      console.log(filter);
      //alert(filter.length);
      if(filter.length>0)
      {
        json.filter = filter;
      }

      json.facet = {};
      json.facet.date_range = {};

      json.facet.date_range.type   = "range";
      json.facet.date_range.field  =  "created";
      if($scope.time_filtered_max.length > 0)
      {
        json.facet.date_range.start  = $scope.time_filtered_min;
        json.facet.date_range.end    = $scope.time_filtered_max;
      }
      else {
        json.facet.date_range.start  = $scope.dateRange.min;
        json.facet.date_range.end    = $scope.dateRange.max;
      }

      json.facet.date_range.gap    = "%2B1MONTH";



      $http.get(sq+JSON.stringify(json)).
       success(function(data) {
         console.log(data);
         $scope.timelineChart(data);
         //return data;
       })
    }




    $scope.timelineChart = function(data_range) {


      console.log(data_range);
      //alert(data_range.facets.date_range.buckets[0]);
      //alert(data_range[1][0]);
      //console.log(data_range.facets.date_range.buckets);
      var data = [];
       for( var i=0,l = data_range.length;i<l; i++){
         var obj = data_range[i];
         var element =[];
         element.push(new Date(obj.val).getTime());
         element.push(obj.count);
         data.push(element);
       }

        console.log(data);

      Highcharts.chart('highchart_timeline',{
            chart: {
                zoomType: 'x',
                events: {
                selection: function (event) {
                    if (event.xAxis) {
                        var range = "[ "+ Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].min) +" TO "+ Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].max)+" ]";
                        var display = "[ "+ Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].min) +" TO "+ Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].max)+" ]";
                        $scope.time_filtered_max = Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].max);
                        $scope.time_filtered_min = Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].min);
                            $scope.addFilter("tim","Time :"+display,"created:"+range);
                            $scope.querySolr();
                    } else {
                      //  alert('Selection reset');
                        $scope.time_filtered_max = "";
                        $scope.time_filtered_min = "";
                        $scope.updateFilter("tim",true);
                    }
                  }
                }
            },
            title: {
                text: 'Visa Application over time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
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
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'Total',
                data: data
            }]
        });
    };






    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("");
});
