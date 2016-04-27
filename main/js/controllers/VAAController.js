'use strict';
var selected_countries = [];
var filter_query = "";
MetronicApp.controller('VAAController', function($rootScope, $scope, $http, $timeout, $sce) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
        //alert("HI");
        var getUser = localStorage.getItem("username");

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

        $scope.querySolr();
        $scope.getDateLimits();
        $scope.formStates();

        $scope.loading = true;


    });

    $scope.queryType = 'active';
    $scope.changeQueryType = function () {
       // $scope.querySolr();
    };


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
        $scope.time_filtered_max = "";
        $scope.time_filtered_min = "";
        $scope.needRefresh = false;
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
            .range(["#AFEFFF","#C2386F"]); // blue color
    // fill dataset in appropriate format
    //$scope.countries.forEach(function(item){ //
    //  alert("before");
     // alert("from map" +$scope.countries.length);
      var index;
      for (index = $scope.countries.length - 1; index >= 0; --index) {
         var iso = $scope.countries[index]["field"],
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

       $scope.clickState = function(data) {
        $scope.addFilter("sta","Negeri :"+data,"mad_job_state_cd:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickJobs = function(data) {
        $scope.addFilter("job","Job : "+data,"job_en:"+$scope.cleanQuery(data));
        $scope.querySolr();
       };

       $scope.clickVisa = function(data) {
        $scope.addFilter("vis","Visa Type : "+data,"mad_pas_typ_cd:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.updateActiveGeography = function(geography) {
          $scope.addFilter("cnt","country: "+geography.id,"mad_nat_cd:"+geography.id);
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
        query = "fq="+$scope.filterButtons[0]["query"];
        if($scope.filterButtons.length > 1)
          for (var i = 1; i < $scope.filterButtons.length; i++) {
              query = query+"&fq="+$scope.filterButtons[i]["query"];
          }

        return query;
       }

       $scope.analysisSolr = function() {
          if($scope.analysiType == 'overall')
              $scope.querySolr();
            else if ($scope.analysiType == 'timeline')  {
              query = 'http://'+solrHost+':8983/solr/immigration1/select?q='+$scope.formQuery()+'&wt=json&rows=0&facet=true&facet.field=mad_nat_cd&facet.limit=100&facet.field=job_en&facet.field=sex&facet.field=employer&facet.field=mad_job_state_cd&facet.field=mad_pas_typ_cd&facet.limit=150&'+$scope.filterQuery();
            }

          else if ($scope.analysiType == 'age')
            query = 'http://'+solrHost+':8983/solr/immigration1/select?q='+$scope.formQuery()+'&wt=json&rows=0&facet=true&facet.field=mad_nat_cd&facet.limit=100&facet.field=job_en&facet.field=sex&facet.field=employer&facet.field=mad_job_state_cd&facet.field=mad_pas_typ_cd&facet.limit=150&'+$scope.filterQuery();

       }

       $scope.querySolr = function() {

          var keys = ["field","count"];
          var keys1 = ["name","y"];
          var query = "";
          $scope.filters = false;
          if($scope.analysiType == 'overall')
              query = 'http://'+solrHost+':8983/solr/immigration1/select?q='+$scope.formQuery()+
            '&wt=json&rows=0&facet=true&facet.field=mad_nat_cd&facet.limit=100&facet.field=job_en&facet.field=sex&facet.field=employer&facet.field=mad_job_state_cd&facet.field=mad_pas_typ_cd&facet.limit=150&'+$scope.filterQuery();
            else if ($scope.analysiType == 'timeline')
            query = 'http://'+solrHost+':8983/solr/immigration1/select?q='+$scope.formQuery()+'&wt=json&rows=0&facet=true&facet.field=mad_nat_cd&facet.limit=100&facet.field=job_en&facet.field=sex&facet.field=employer&facet.field=mad_job_state_cd&facet.field=mad_pas_typ_cd&facet.limit=150&'+$scope.filterQuery();
          else if ($scope.analysiType == 'age')
            query = 'http://'+solrHost+':8983/solr/immigration1/select?q='+$scope.formQuery()+'&wt=json&rows=0&facet=true&facet.field=mad_nat_cd&facet.limit=100&facet.field=job_en&facet.field=sex&facet.field=employer&facet.field=mad_job_state_cd&facet.field=mad_pas_typ_cd&facet.limit=150&'+$scope.filterQuery();




      $http.get(query).
       success(function(data) {
           if(selected_countries == 0) {
             $scope.countries = $scope.decopule(data.facet_counts.facet_fields.mad_nat_cd,0,keys);
             $scope.jobs = $scope.decopule(data.facet_counts.facet_fields.job_en,20,keys);
             $scope.employers = $scope.decopule(data.facet_counts.facet_fields.employer,20,keys);
             $scope.visas = $scope.decopule(data.facet_counts.facet_fields.mad_pas_typ_cd,20,keys);
             $scope.sex = $scope.decopule(data.facet_counts.facet_fields.sex,data.facet_counts.facet_fields.sex.length,keys1);
             $scope.state = $scope.decopule(data.facet_counts.facet_fields.mad_job_state_cd,data.facet_counts.facet_fields.mad_job_state_cd.length,keys1);
             //alert(data.facet_counts.facet_fields.sex.length);
             console.log($scope.sex1);
             $scope.loadMap();
             $scope.pie();
             $scope.column();
             $scope.date_query();
             //$scope.chartjs();
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



      $scope.labels = $scope.sex;
      $scope.data = $scope.sex.count;
    };

    $scope.formStates = function() {
      var obj = {};
      obj["001"]   ="Johor";
      obj["01"]   ="Johor";
      obj["002"]   ="Kedah";
      obj["003"]   ="Kelantan";
      obj["004"]   ="Melaka";
      obj["005"]   ="Negeri Sembilan";
      obj["006 "]  ="Pahang";
      obj["008"]   ="Perak";
      obj["009"]   ="Perlis";
      obj["007"]   ="Pulau Pinang";
      obj["012"]   ="Sabah";
      obj["013"]   ="Sarawak";
      obj["010"]  ="Selangor";
      obj["10"]  ="Selangor";
      obj["011"]  ="Terengganu";
      obj["14"]  ="Kuala Lumpur";
      obj["099"]  ="Kuala Lumpur";
      obj["15"]  ="Labuan";

      $scope.stateObject = obj;
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
      var query = "q=-mad_crt_dt%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(mad_crt_dt)\",\"max_date\":\"max(mad_crt_dt)\"}}"
      var sq = "http://"+solrHost+":8983/solr/immigration1_shard1_replica1/query?"
      $http.get(sq+query).
       success(function(data) {
         var y = {};
         y.min = $scope.yyyymmdd(new Date(data.facets.min_date));
         y.max = $scope.yyyymmdd(new Date(data.facets.max_date));
         console.log(y);
         $scope.dateRange = y;
       })
    }

    $scope.date_query = function () {

      if($scope.analysiType != 'timeline')
       return;

      var query = ""
      var sq = "http://"+solrHost+":8983/solr/immigration1_shard1_replica1/query?json=";

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
      json.facet.date_range.field  =  "mad_crt_dt";
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

      $scope.loadTimeline =false;
    //  var data_range = $scope.getDate();
      console.log(data_range);
      //alert(data_range.facets.date_range.buckets[0]);
      //alert(data_range[1][0]);
      console.log(data_range.facets.date_range.buckets);
      var data = [];
       for( var i=0,l = data_range.facets.date_range.buckets.length;i<l; i++){
         var obj = data_range.facets.date_range.buckets[i];
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
                            $scope.addFilter("tim","Time :"+display,"mad_crt_dt:"+range);
                            $scope.querySolr();
                    } else {
                        alert('Selection reset');
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
});
