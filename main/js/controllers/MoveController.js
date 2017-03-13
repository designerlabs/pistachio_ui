'use strict';

var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/hismove/query?json='
MetronicApp.controller('MoveController', function($rootScope, $scope, $http,$uibModal) {
    $scope.$on('$viewContentLoaded', function() {
       $scope.reset();
     // $scope.startHeatMap();
     
    });


    $scope.startHeatMap = function () {
      var cal = new CalHeatMap();
      cal.init({
        itemSelector: "#heatmap",
       domain: "month",
        subDomain: "x_day",
        data: "datas-years.json",
        start: new Date(2017, 0, 1),
        cellSize: 20,
        cellPadding: 5,
        domainGutter: 20,
        range: 2,
        domainDynamicDimension: false,
        previousSelector: "#example-g-PreviousDomain-selector",
        nextSelector: "#example-g-NextDomain-selector",
        domainLabelFormat: function(date) {
          moment.lang("en");
          return moment(date).format("MMMM").toUpperCase();
        },
        subDomainTextFormat: "%d",
        legend: [20, 40, 60, 80]
      });
    }
  
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("");

   function cb(start, end) {
      $('#vaa-range span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $scope.date_range = function() {

      cb(moment("20120101", "YYYYMMDD"), moment());

      $('#vaa-range').daterangepicker({
          ranges: {
             'Last 30 Days': [moment().subtract(29, 'days'), moment()],
             '2016': [moment("20160101", "YYYYMMDD"), moment()],
             '2015': [moment("20150101", "YYYYMMDD"), moment("20151231", "YYYYMMDD")],
             '2014': [moment("20140101", "YYYYMMDD"), moment("20141231", "YYYYMMDD")],
             '2013': [moment("20130101", "YYYYMMDD"), moment("20131231", "YYYYMMDD")],
             '2012': [moment("20120101", "YYYYMMDD"), moment("20121231", "YYYYMMDD")]//,
           //  '2011': [moment("20110101", "YYYYMMDD"), moment("20111231", "YYYYMMDD")],
           //  '2010': [moment("20100101", "YYYYMMDD"), moment("20101231", "YYYYMMDD")]

          },
          opens : "left",
          "alwaysShowCalendars": true,
          showDropdowns: true,
          minDate : moment("20120101", "YYYYMMDD")

      }, cb);

      $('#vaa-range').on('apply.daterangepicker', function(ev, picker) {
          $('#daterange').val('');
          console.log($scope.filterButtons)
          var range = '[ '+ moment(picker.startDate).format('YYYY-MM-DDT00:00:00')+'Z TO '+moment(picker.endDate).format('YYYY-MM-DDT00:00:00')+'Z ]'

          var display = "[ "+ moment(picker.startDate).format('DD-MM-YYYY') +" TO "+ moment(picker.endDate).format('DD-MM-YYYY')+" ]";
          $scope.time_filtered_max = moment(picker.endDate).format('YYYY-MM-DDT00:00:00')+'Z';
          $scope.time_filtered_min = moment(picker.startDate).format('YYYY-MM-DDT00:00:00')+'Z'
              $scope.addFilter("tim","Time :"+display,"created:"+range);
              $scope.pickDayRange(picker.endDate.diff(picker.startDate,'days'))
              $scope.querySolr();
      });

    }

    $scope.pickDayRange = function(days) {
      if(days < 2) {
        $scope.period = "%2B1HOUR"
      }
      else if (days < 14) {
        $scope.period = "%2B1DAY"
      }
      else if (days < 60) {
       $scope.period = "%2B7DAY" 
      }
      else if(days < 500 ) {
        $scope.period = "%2B1MONTH"
      }
      else if(days > 500 ) {
        $scope.period = "%2B1YEAR"
      }
    }
     $scope.formQuery = function() {

          var query = "*:*";
          return query;
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

          if(refresh) {
            if(data == "brn") $scope.selectBranch = false
            if(data == "cnt") $scope.stateSelected = "";
            if(data == "doc") $scope.docSelected = "";
            $scope.querySolr();
          }
            
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

       $scope.fqQuery = function () {
          var query = "";
          if($scope.filterButtons.length == 0)
            return query;
          query = "&fq="+$scope.filterButtons[0]["query"];
          if($scope.filterButtons.length > 1)
            for (var i = 1; i < $scope.filterButtons.length; i++) {
                query = query+"&fq="+$scope.filterButtons[i]["query"];
            }

          return query;
       }

       var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/hismove/query?json='
       $scope.reset = function(){
          $scope.filterButtons = [];
          $scope.dateRange={};
          $scope.dateRange.min = "2016-01-01T00:00:00Z"
          $scope.dateRange.max = "2016-12-01T00:00:00Z"
          $scope.period = "%2B1DAY"
          cb(moment("20100101", "YYYYMMDD"), moment());
          $scope.querySolr();
        }



       $scope.querySolr = function() {

          $scope.filters = false;
          var json = {};

            json.limit  = 1;
            json.offset = 0
            json.query = $scope.formQuery();
            //json.filter = $scope.filterQuery();
            json.facet = {};
            json.facet.date_range = {};
            json.facet.date_range.type   = "range";
            json.facet.date_range.field  =  "xit_date";

              json.facet.date_range.start  = $scope.dateRange.min;
              json.facet.date_range.end    = $scope.dateRange.max;
            json.facet.date_range.gap    = $scope.period;
          
          $http.get(thisSolrAppUrl+JSON.stringify(json)+$scope.fqQuery()).
             success(function(data) {
              $scope.numFound = data.response.numFound;
              
                 var data_range = data.facets.date_range.buckets;
                 var results = {}
                 for( var i=0,l = data_range.length;i<l; i++){
                     var obj = data_range[i];
                     var time = Math.round(new Date(obj.val).getTime()/1000)
                     results[time]=obj.count
                }
                debugger;
                var cal = new CalHeatMap();
                cal.init({
                  itemSelector: "#heatmap",
                 domain: "month",
                  domainDynamicDimension: true,
                  data: results,
                  start: new Date(2016, 0, 1),
                  cellSize: 25
                
                });
         


                 

               }).
               error(function(data, status, headers, config) {
                 console.log('error');
                 console.log('status : ' + status); //Being logged as 0
                 console.log('headers : ' + headers);
                 console.log('config : ' + JSON.stringify(config));
                 console.log('data : ' + data); //Being logged as null
               });

               

    };






});

    
