'use strict';
var selected_countries = [];
var filter_query = "";

var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/immigration2/query?json='

MetronicApp.controller('VAAController', function($rootScope, $scope, $http) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        $(".page-sidebar-menu > li").removeClass('active');
        $("#dashboardLink").addClass('active');
        //alert("HI");
        var getUser = localStorage.getItem("username");

        $scope.reset();
        $scope.drawHeatMap();
    //    $scope.getDateLimits();
    //    $scope.formStates();

      //  $scope.loading = true;


    });

    $scope.drawHeatMap = function() {
      var map = L.map("map").setView([4, 100], 7);
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; NSL | Mimos'
      }).addTo(map);
      new L.SolrHeatmapLayer('http://'+solrHost+':8983/solr/immigration2', {
         field: 'loc',
         query: {q:"job_en:Maid"},
         colors: ['A34800','234800', 'ff0000']
      }).addTo(map);
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

         //$scope.analysiType = 'overall';
        $scope.querySolr();
    }

    $scope.loadMap = function(){
     if($scope.analysiType != 'overall')
      return;
        var dataset = {};
    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    var onlyValues = $scope.countries.map(function(obj){ return obj["count"]; });
    var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);
    // create color palette function
    // color can be whatever you wish
    var paletteScale = d3.scale.linear()
            .domain([minValue,maxValue])
          //  .range(["#AFEFFF","#C2386F"]); // blue color
          .range(["#E0F8E0","green"]); // blue color
    // fill dataset in appropriate format
    //$scope.countries.forEach(function(item){ //
    //  alert("before");
     // alert("from map" +$scope.countries.length);
      var index;
      for (index = $scope.countries.length - 1; index >= 0; --index) {
         var iso = $scope.countries[index]["val"],
                value = $scope.countries[index]["count"];
               // alert(iso);
        dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
        //console.log(dataset[iso]);
      };

        $scope.mapObject = {
        scope: 'world',
        responsive: true,
       // projection : 'mercator',
        height: null,
        width: null,
        options : {legend : true},
        fills: {
            defaultFill: "#FBFAEA" //any hex, color name or rgb/rgba value
        },
        geographyConfig: {
          highlighBorderColor: '#EAA9A8',
          highlighBorderWidth: 2,
          popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ; }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Count: <strong>', data.numberOfThings, '</strong>',
                    '</div>'].join('');
            }
        },
        data: dataset,
        highlightFillColor: function(geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#C7C7B7'
            // show desired information in tooltip



        }
        $scope.mapPlugins = {
  bubbles: null,
  customLegend: function(layer, data, options) {
    var html = ['<ul class="list-inline">'],
        label = '';
    for (var fillKey in this.options.fills) {
      html.push('<li class="key" ',
                  'style="border-top: 10px solid ' + this.options.fills[fillKey] + '">',
                  fillKey,
                  '</li>');
    }
    html.push('</ul>');
    d3.select(this.options.element).append('div')
      .attr('class', 'datamaps-legend')
      .html(html.join(''));
  }
};

       }

        $scope.decopule2List = function(data,index) {
          if(index == 0)
            index = data.length;
          var keys = ["field","count"];
          var decopuledObj= {};
          var field = [];
          var count = [];
          for (var j = 0; j < index/2; j++) {

                 var i = j*2;
                 if(data[i+1] == 0) break;
                 if(data[i].length == 0)
                    field.push("NA");
                 else
                  field.push(data[i]);
                 if(data[i+1] == 0) continue;

                 count.push(data[i+1]);


               }
               decopuledObj[keys[0]] = field;
               decopuledObj[keys[1]] = count;
               return decopuledObj;
       }

       $scope.decopule = function(data,index,keys) {
          if(index == 0)
            index = data.length;

          var objList= [];
          for (var j = 0; j < index/2; j++) {
                 var country= {};
                 var i = j*2;
                 if(data[i+1] == 0) break;
                 if(data[i].length == 0)
                   country[keys[0]]="NA";
                 else
                  country[keys[0]]=data[i];
                 if(data[i+1] == 0) continue;

                 country[keys[1]]=data[i+1];
                 objList.push(country);

               }
               return (objList);
       }

       $scope.cleanQuery = function(data) {
        data = data.replace(/\(/g,"\\\(");
        data = data.replace(/\)/g,"\\\)");
          data = data.replace(/ /g,"*");
          return(data);
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
            json.facet.skill = {};
            json.facet.skill.type   = "terms";
            json.facet.skill.field  =  "skill";
            json.facet.uJob  =  "unique(job_en)";
            json.facet.uEmp  =  "unique(employer)";
            json.facet.uVis  =  "unique(pass_type)";


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
                   $scope.state = data.facets.job.buckets
                   $scope.uJob = data.facets.uJob;
                   $scope.uEmp = data.facets.uEmp;
                   $scope.uVis = data.facets.uVis;
                   //alert(data.facet_counts.facet_fields.sex.length);
                   console.log($scope.sex1);
                   $scope.pie();
                //   $scope.column();
                //   $scope.date_query();
                   //$scope.chartjs();

                   $scope.timelineChart(data.facets.date_range.buckets)
                   $scope.loading = false;
                 }
                 $scope.timelineChart(data.facets.date_range.buckets)

               }).
               error(function(data, status, headers, config) {
                 console.log('error');
                 console.log('status : ' + status); //Being logged as 0
                 console.log('headers : ' + headers);
                 console.log('config : ' + JSON.stringify(config));
                 console.log('data : ' + data); //Being logged as null
               });

    };

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


       var _state = $scope.state;
       console.log($scope.stateObject);
       console.log(_state);
    //  for (var i =0,l=_state.length; i < l; i++) {
    //        _state[i].name = $scope.stateObject[_state[i].name];
    //        alert(_state[i].name);


    //    }
    //    console.log(_state);

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
        exporting: { enabled: false },
            title: {
              text: 'negeri',
              x: -20 //center
            },
            series: [{
            name: 'negeri',
            colorByPoint: true,
            data: _state,
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
