'use strict';

var stats = ["LOGIN", "LOGOUT", "ERROR"];
var selected_filter = [];

MetronicApp.controller('StatsChartController', function($rootScope, $scope, $http) {
    $scope.$on('$viewContentLoaded', function() {

        // initialize core components
        Metronic.initAjax();
       
        $scope.go();
       });

       $scope.go = function(data){
        
var data = {
    labels : ["SUN","MON","TUE","WED","THU","FRI","SAT"],
    datasets : [
        {
            fillColor : "rgba(255,255,255,0.1)",
            strokeColor : "rgba(0,0,0,0.25)",
            pointColor : "rgba(255,255,255,1)",
            pointStrokeColor : "#fe9d37",
            data : [135,185,225,385,275,215,265]
        }
    ]
}

var options = {
    scaleFontColor : "rgba(0,0,0,1)",
    scaleLineColor : "rgba(0,0,0,0.1)",
    scaleGridLineColor : "rgba(0,0,0,0.1)",
    scaleShowLabels : false,
    scaleShowHorizontalLines : false,
    bezierCurve : false,
    pointDot : true,
    pointDotRadius : 5,
    pointDotStrokeWidth : 2,
    scaleOverride : true,
    scaleSteps : 6,
    scaleStepWidth : 100,
    responsive : true,
    showTooltips: true,
    tooltipTemplate: "<%= value %> " + "Students",
    tooltipFontSize: 16,
    tooltipYPadding: 12,
    tooltipXPadding: 12,
    tooltipCornerRadius: 3,
    tooltipFillColor: "#3797d3",
        
    onAnimationComplete : function() {
        var arrSelector = [];
        this.datasets[0].points.forEach(function(point){
            if(point.label == 'WED'){
                arrSelector.push(point);
            }
        });

        this.showTooltip(arrSelector, true);          
    },
    tooltipEvents: []
}

new Chart(c1.getContext("2d")).Line(data,options);

       }



    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("Stats");
  

});
