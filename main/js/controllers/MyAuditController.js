'use strict';

MetronicApp.controller('MyAuditController', function($rootScope, $scope, $http) {

    $scope.$on('$viewContentLoaded', function() {
       $scope.showOfficer = false;
       $scope.showHeatMap = false;
       $http.get(globalURL+"api/secured/pistachio/myaudit/branch")
         .success(function(response) {
            console.log("branches "+response);
            $scope.branches = response;

         });
    });

    $scope.branch_change = function(id) {
      console.log($scope.selectedBranch);
      
      $http.get(globalURL+"api/secured/pistachio/myaudit/officer?branch="+$scope.selectedBranch)
         .success(function(response) {
             $scope.showOfficer = true;
            $scope.officers = response;
           
         });
    };

    $scope.officer_change = function(id) {
      console.log($scope.selectedOfficer);
      $http.get(globalURL+"api/secured/pistachio/myaudit?officer="+$scope.selectedOfficer)
        .success(function(response) {
         console.log(response);
         heatmapChart(response.heatmap);
         $scope.showHeatMap = true;
          });
    };
    

    var margin = { top: 50, right: 0, bottom: 100, left: 70 };
    var wWidth = window.innerWidth;
    var auditChartWidth = '300';
    var auditBarHeight = 10.5;
    if(wWidth > 1040){
      auditChartWidth = wWidth - 1040;
      if(auditChartWidth> 300)
        auditChartWidth = 300;
      auditBarHeight = 13;
    }else{
      auditChartWidth = '50';
      auditBarHeight = 13;
    }



    var width = document.getElementById('chart').offsetWidth - margin.left - margin.right-auditChartWidth;

    var gridSize = Math.floor(width / 24);
    var height = (gridSize * 7 ) + margin.top - margin.bottom/2.4;
    var legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    times = ["1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12AM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12PM"];
    ;
    

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
              var colorScale = d3.scale.quantile()
                  .domain([0, buckets - 1, d3.max(data, function (d) { return d.total; })])
                  .range(colors);

              var cards = svg.selectAll(".hour")
                  .data(data, function(d) {return d.day+':'+d.hour;});

              cards.append("title");

              cards.enter().append("rect")
                  .attr("x", function(d) { return (d.hour - 1) * gridSize; })
                  .attr("y", function(d) { return (d.day - 1) * gridSize; })
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("class", "hour bordered")
                  .attr("width", gridSize)
                  .attr("height", gridSize)
                  .style("fill", colors[0]);

              cards.transition().duration(1000)
                  .style("fill", function(d) { 
                    if(d.total == 0){
                      return "#d3d3d3"
                    }
                    return colorScale(d.total); });

              cards.select("title").text(function(d) { return d.total; });

              cards.exit().remove();

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


         

            $rootScope.settings.layout.pageSidebarClosed = true;
            $rootScope.skipTitle = false;
            $rootScope.settings.layout.setTitle("auditanalysis");

})
