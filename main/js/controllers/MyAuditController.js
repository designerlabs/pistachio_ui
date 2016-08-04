'use strict';

MetronicApp.controller('MyAuditController', function($rootScope, $scope, $http, sortable) {

    $scope.$on('$viewContentLoaded', function() {
       $scope.showOfficer = false;
       $scope.showHeatMap = false;
       $scope.showPie = false;
       $scope.branchList = function(start, end){
           this.start = start;
           this.end = end;
           $http.get(globalURL+"api/secured/pistachio/myaudit/branch?from="+start+"&to="+end)
         .success(function(response) {
            console.log(response);
            $scope.branches = response;
            sortable($scope, response, 8, 'updated_at');
         });
       };

       //$scope.branchList();
        $scope.getBranchDetails = function(total, hour, day){
            $('.selectedBox').html("On <b>"+day+"</b> @ "+hour+", total activity: <b>"+total+"</b>");
        };
         $scope.orderByMe = function(x) {
            $scope.myOrderBy = x;
        }

        var start = moment().subtract(6, 'days');
        var end = moment();
        
        function cb(start, end) {
            $scope.branchList(start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD'));
            $scope.showOfficer = false;
            $('#branches').collapse('show');
            $scope.showHeatMap = false;
            $('rect').removeAttr('class','activeBox');
            $('rect').attr('class','hour bordered');
            $scope.activeBranch = false;
            $scope.startDt = start.format('YYYY-MM-DD');
            $scope.endDt = end.format('YYYY-MM-DD');
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            $scope.startdt = start.format('MMMM D, YYYY');
            $scope.enddt = end.format('MMMM D, YYYY');
        }
        
        $("#branchHeader").click(function(){
            if($(this).hasClass('collapsed')){
                $("#branchHeader span").html('<i class="fa fa-chevron-circle-down" aria-hidden="true"></i>');
            }else{
               $("#branchHeader span").html('<i class="fa fa-chevron-circle-up" aria-hidden="true"></i>');
            }
        });

        $("#officerHeader").click(function(){
            if($(this).hasClass('collapsed')){
                $("#officerHeader span").html('<i class="fa fa-chevron-circle-down" aria-hidden="true"></i>');
            }else{
               $("#officerHeader span").html('<i class="fa fa-chevron-circle-up" aria-hidden="true"></i>');
            }
        });

        

        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            "alwaysShowCalendars": false,
             opens:'left',
            ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);
        
        // $scope.pie();
    });

  
    //branch on select
    $scope.branch_selected = function(name){
        $scope.activeBranch = name;
        $scope.activeUser = false;
        $('.selectedBox').hide('200');
        $('rect').removeAttr('class','activeBox');
        $('rect').attr('class','hour bordered');
        $http.get(globalURL+"api/secured/pistachio/myaudit/officer?branch="+name+"&from="+$scope.startDt+"&to="+$scope.endDt,
        {headers: { 'Content-Type': 'application/json' }})
         .success(function(response) {
            $scope.showOfficer = true;
            $scope.officers = response;
             $('#branches').collapse('hide');
             $("#branchHeader span").html('<i class="fa fa-chevron-circle-up" aria-hidden="true"></i>');
         });
      console.log("Getting branch heatmap");
      $http.get(globalURL+"api/secured/pistachio/myaudit/branch/heatmap?branch="+name+"&from="+$scope.startDt+"&to="+$scope.endDt,
      {headers: { 'Content-Type': 'application/json' }}

        )
        .success(function(response) {
         console.log(response);
         heatmapChart(response.heatmap);
         $scope.showHeatMap = true;
         var data = response.transaction;
        
        var log = [];
angular.forEach(data, function(value, key) {
  this.push([value.field, value.count]);
}, log);
   

//    function sortFunction(b, a) {
//     if (a[1] === b[1]) {
//         return 0;
//     }
//     else {
//         return (a[1] < b[1]) ? -1 : 1;
//     }
// }

// log.sort(sortFunction);
    $('#summaryContainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Activities'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'No of Activity is <b>{point.y}</b>'
        },
        series: [{
            name: 'Activities',
            data: log,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
          });
    }
/*
    $scope.branch_change = function(id) {
        console.log(id);
      console.log("Selected branch"+$scope.selectedBranch.branch);
      console.log("getting officers")
      $http.get(globalURL+"api/secured/pistachio/myaudit/officer?branch="+$scope.selectedBranch.branch+"&from="+start+"&to="+end,
      {headers: { 'Content-Type': 'application/json' }})
         .success(function(response) {
             $scope.showOfficer = true;
            $scope.officers = response;
           
         });
      console.log("Getting branch heatmap");
      $http.get(globalURL+"api/secured/pistachio/myaudit/branch/heatmap?branch="+$scope.selectedBranch.branch+"&from="+start+"&to="+end,
      {headers: { 'Content-Type': 'application/json' }}

        )
        .success(function(response) {
         console.log(response);
         heatmapChart(response.heatmap);
         $scope.showHeatMap = true;
          });
        
     };
*/
    $scope.officer_change = function(name) {
        $scope.activeUser = name;
        $('rect').removeAttr('class','activeBox');
        $('rect').attr('class','hour bordered');
        $('.selectedBox').hide('200');
      console.log($scope.activeBranch);
      $http.get(globalURL+"api/secured/pistachio/myaudit?officer="+name+"&from="+$scope.startDt+"&to="+$scope.endDt)
        .success(function(response) {
         console.log(response);
         heatmapChart(response.heatmap);
         $scope.showHeatMap = true;
          });
    };
    
   
    var margin = { top: 50, right: 0, bottom: 50, left: 80 };
    var wWidth = window.innerWidth;
    var auditChartWidth = '300';
    var auditBarHeight = 10.5;
    if(wWidth > 1040){
      auditChartWidth = wWidth - 1300;
      if(auditChartWidth> 300)
        auditChartWidth = 300;
      auditBarHeight = 13;
    }else{
      auditChartWidth = '50';
      auditBarHeight = 13;
    }



    var width = document.getElementById('chart').offsetWidth - margin.left - margin.right-auditChartWidth;

    var gridSize = Math.floor(width / 24);
    var height = (gridSize * 7 ) + margin.top - margin.bottom/1.2;
    var legendElementWidth = gridSize*2,
    buckets = 15,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    times = ["12AM","1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12AM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
          var svg = d3.select("#chart").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var dayLabels = svg.selectAll(".dayLabel")
              .data(days)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

          var timeLabels = svg.selectAll(".timeLabel")
              .data(times)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

          

        var heatmapChart = function(data) {
          debugger;
              var colorScale = d3.scale.quantile()
                  .domain([d3.min(data, function (d) { return d.total; }), d3.max(data, function (d) { return d.total; })])
                  .range(colors);

              var cards = svg.selectAll(".hour")
                  .data(data, function(d) {return d.day+':'+d.hour;});
            
              cards.append("title");
              
              cards.enter().append("rect")
                  .attr("x", function(d) { return (d.hour ) * gridSize; })
                  .attr("y", function(d) { return (d.day -1) * gridSize; })
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("class", "hour bordered")
                  .attr("width", gridSize)
                  .attr("height", gridSize)
                  .on("click", function(d) {
                        if(!$scope.activeUser){
                            console.log('undefined');
                        }
                        $('rect').removeAttr('class','activeBox');
                        $('rect').attr('class','hour bordered');
                        $('#officerContainer').collapse('show');
                        $("#officerHeader span").html('<i class="fa fa-chevron-circle-down" aria-hidden="true"></i>');
                        $(this).attr('class','hour bordered activeBox')
                        $scope.getBranchDetails(d.total, times[d.hour], days[d.day-1]);
                        $('.selectedBox').show('200');
                        
                   })
                  .style({"fill": colors[0], "cursor":"pointer"});

              cards.transition().duration(1000)
                  .style("fill", function(d) { 
                    if(d.total == 0){
                      return "#d3d3d3"
                    }
                    return colorScale(d.total); });

              cards.select("title").text(function(d) { return d.total; });

              cards.exit().remove();
              svg.selectAll(".legend").remove()
              var legend = svg.selectAll(".legend")
                  .data([0].concat(colorScale.quantiles()), function(d) { return d; });

              legend.enter().append("g")
                  .attr("class", "legend");

              legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; });

              legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize);

              legend.exit().remove();

          };

    $rootScope.query = '';
    
    $scope.gridToggle = false;

    $scope.onQueryChange = function(val){
       $rootScope.query = val;
       $scope.search();
    };

            $rootScope.settings.layout.pageSidebarClosed = true;
            $rootScope.skipTitle = false;
            $rootScope.settings.layout.setTitle("auditanalysis");

})
