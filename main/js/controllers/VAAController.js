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
          $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data = [300, 500, 100];
        $scope.querySolr();
        
           

    });

    $scope.reset = function(){
        $scope.cntName = "";
        $scope.cntCode = "";
        $scope.cJobs = "";
        $scope.cEmply = "";
        $scope.cSex = "";
        $scope.cState = "";
        $scope.filters = false;
        $scope.filterButtons = [];
        $scope.querySolr();
    }

    $scope.loadMap = function(){
     
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
       }

       $scope.updateFilter = function (data,refresh){
          var i = $scope.filterButtons.length
            while (i--) {
                if($scope.filterButtons[i]["id"] == data)
                  $scope.filterButtons.splice(i, 1);
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

       

       $scope.querySolr = function() {

          var keys = ["field","count"];
          var keys1 = ["name","y"];
          var query = "";
          $scope.filters = false;
          query = 'http://localhost:8983/solr/immigration1/select?q='+$scope.formQuery()+'&wt=json&rows=0&facet=true&facet.field=mad_nat_cd&facet.limit=100&facet.field=job_en&facet.field=sex&facet.field=employer&facet.field=mad_job_state_cd&facet.limit=150&'+$scope.filterQuery();
     
      $http.get(query).
       success(function(data) {
           if(selected_countries == 0) {
             $scope.countries = $scope.decopule(data.facet_counts.facet_fields.mad_nat_cd,0,keys);
             $scope.jobs = $scope.decopule(data.facet_counts.facet_fields.job_en,10,keys);
             $scope.employers = $scope.decopule(data.facet_counts.facet_fields.employer,10,keys);
             $scope.sex = $scope.decopule(data.facet_counts.facet_fields.sex,data.facet_counts.facet_fields.sex.length,keys1);
             $scope.state = $scope.decopule(data.facet_counts.facet_fields.mad_job_state_cd,data.facet_counts.facet_fields.mad_job_state_cd.length,keys1);
             //alert(data.facet_counts.facet_fields.sex.length);
             console.log($scope.sex1);
             $scope.loadMap();
             $scope.pie();
             $scope.column();
             //$scope.chartjs();
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

    $scope.column = function() {
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
            data: $scope.state,
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

    

   


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});
