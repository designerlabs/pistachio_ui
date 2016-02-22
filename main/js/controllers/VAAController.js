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
        $scope.querySolr();
           

    });

    $scope.reset = function(){
        $scope.cntName = "";
        $scope.cntCode = "";
        $scope.cJobs = "";
        $scope.cEmply = "";
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
            .range(["#EFEFFF","#02386F"]); // blue color
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
        console.log(dataset[iso]);
      };
      
        $scope.mapObject = {
        scope: 'world',
        responsive: true,
       // projection : 'mercator',
        height: null, 
        width: null,
        options : {legend : true},
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
            highlightBorderColor: '#B7B7B7'
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

       $scope.clickEmply = function(data) {
        //alert(data);
        data = data.replace(/ /g,"*");
        //alert(data);
        $scope.cEmply = "employer:"+data;
        $scope.querySolr();
       }

       $scope.clickJobs = function(data) {

        //alert(data);
        data = data.replace(/ /g,"*");
        //alert(data);
        $scope.cJobs = "job_en:"+data;
        $scope.querySolr();
       }

       $scope.formQuery = function() {

        var query = "";
        if($scope.cntName.length>1)
        {
          query = "mad_nat_cd:"+$scope.cntName;
        }
        if($scope.cJobs.length > 1)
        {
          if(query.length > 2)
            query = query + " AND " + $scope.cJobs;
          else
            query = $scope.cJobs;
        }
        if($scope.cEmply.length > 1)
        {
          if(query.length > 2)
            query = query + " AND " + $scope.cEmply;
          else
            query = $scope.cEmply;
        }
        //alert(query);
        if(query.length < 3)
          return("*:*");
        else
          return(query);

       }

       $scope.updateActiveGeography = function(geography) {
          $scope.cntName = geography.id;
         // alert(geography.id)
          $scope.querySolr();
      }

       $scope.querySolr = function() {

          var keys = ["field","count"];
          var query = "";

          query = 'http://10.1.17.235:8983/solr/immigration1/select?q='+$scope.formQuery()+'&wt=json&rows=0&facet=true&facet.field=mad_nat_cd&facet.limit=100&facet.field=job_en&facet.field=employer';
     
      $http.get(query).
       success(function(data) {
           if(selected_countries == 0) {
             $scope.countries = $scope.decopule(data.facet_counts.facet_fields.mad_nat_cd,0);
             $scope.jobs = $scope.decopule(data.facet_counts.facet_fields.job_en,10);
             $scope.employers = $scope.decopule(data.facet_counts.facet_fields.employer,10);
            // alert("from solr call" +$scope.countries.length);
             console.log($scope.countries);
             $scope.loadMap();
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


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});
