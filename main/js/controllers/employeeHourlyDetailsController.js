'use strict';



MetronicApp.controller('employeeHourlyDetailsController', function($rootScope, $scope, $http, $timeout, stageUpdate, $q) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        Metronic.initAjax();
        $scope.drawSparkline = 0;
        $scope.employeeArr = [];
        $scope.loading = true;
        // console.log(window.location.href);
        // var Qstring = window.location.href;
        // var Qparam = Qstring.split('?')[1];
        // Qparam = Qparam.split('&');
        // var obj = {};
        // var myArr = [];
        // $.each(Qparam, function(i, k) {
        //     var ki = k.split("=");
        //     myArr.push(ki[1]);
        // });
        // console.log(myArr);
        stageUpdate.addStage("Officer");
        Layout.setSidebarMenuActiveLink('set', $('#trackerLink')); // set profile link active in sidebar menu 
       
        $scope.empName = sessionStorage.getItem('hourlyEmplyName');
        $scope.branchCode = sessionStorage.getItem('hourlybranchCode');

        $scope.employeeArr.push(sessionStorage.getItem('hourlyEmplyName'));

        var CurrentDate = sessionStorage.getItem('hourlycurrDate');
        CurrentDate = CurrentDate.replace(/%2F/g, "\/");
        CurrentDate = CurrentDate.replace(/%20-%20/g, " ");
        CurrentDate = CurrentDate.split(" ");
        var startDtN = CurrentDate[0];
        var endDtN = CurrentDate[2];
        $scope.startDtNSplit = startDtN.split("/");
        $scope.endDtNSplit = endDtN.split("/");
       

        $scope.subTitle = $scope.startDtNSplit[0] + "/" + $scope.startDtNSplit[1] + "/" + $scope.startDtNSplit[2] + " - " + $scope.endDtNSplit[0] + "/" + $scope.endDtNSplit[1] + "/" + $scope.endDtNSplit[2];



        $scope.getFromDtEpoch = $scope.startDtNSplit[2] + "-" + $scope.startDtNSplit[1] + "-" + $scope.startDtNSplit[0] + "T00:00:00Z";
        $scope.getToDtEpoch = $scope.endDtNSplit[2] + "-" + $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0] + "T00:00:00Z";


      

        $scope.changeDt = function(format) { // for display purpose
            var newDate = format.split('T');
            var newDate2 = newDate[0].split('-').reverse().join('/');
            return newDate2;
        };


        var resultDtFrom, resultDtTo, chDtFrom, chDtTo;
        var dateNow = new Date();
        var tDate = dateNow.getDate();
        var tmonth = dateNow.getMonth() + 1
        var tyear = dateNow.getFullYear() - 1;
        if (tmonth < 10) tmonth = '0' + tmonth;
        if (tDate < 10) tDate = '0' + tDate;
        var lastDate = tDate + "/" + tmonth + "/" + tyear;

        // $('#datetimeFrom').datetimepicker({
        //     format: 'DD/MM/YYYY',
        //     defaultDate: '"' + $scope.startDtNSplit[1] + '"/"' + $scope.startDtNSplit[0] + '"/"' + $scope.startDtNSplit[2] + '"'
        // });
        // $('#datetimeTo').datetimepicker({
        //     useCurrent: false,
        //     defaultDate: '"'+$scope.endDtNSplit[1] +'"/"'+$scope.endDtNSplit[0] + '"/"' + $scope.endDtNSplit[2] + '"',
        //     format: 'DD/MM/YYYY' //Important! See issue #1075
        // });

        var frmDt;
        // = $('#datetimeFrom').data('date');

        var toDt;
        // = $('#datetimeTo').data('date');

        $('#Hourlygrange').daterangepicker({
            startDate: moment().subtract(1,"year"),
            endDate: moment(),           
            "alwaysShowCalendars": false                     
        },
        function(startdt, enddt) {
            $('#Hourlygrange span').html(startdt.format('MMM DD, YYYY') + ' - ' + enddt.format('MMM DD, YYYY'));
            frmDt = startdt.format('DD/MM/YYYY');
            toDt = enddt.format('DD/MM/YYYY');
        });

        // cb(frmDt, enddt);

         if($rootScope.commonFrm == undefined ||  $rootScope.commonTo == undefined){
            $("#Hourlygrange span").html(moment().subtract(1,"year").format("MMM DD YYYY") + " - " + moment().format("MMM DD YYYY"));
            $scope.getFromDt = moment().subtract(1,"year").format("YYYY-MM-DD") + "T00:00:00Z";
            $scope.getToDt = moment().format("YYYY-MM-DD") + "T00:00:00Z";            
         }else{
            $("#Hourlygrange span").html($rootScope.commonFrm + " - " + $rootScope.commonTo);
            $scope.getFromDt = moment($rootScope.commonFrm).format("YYYY-MM-DD") + "T00:00:00Z";
            $scope.getToDt = moment($rootScope.commonTo).format("YYYY-MM-DD") + "T00:00:00Z";
         }

        $('.daterangecont').on('apply.daterangepicker', function (ev, picker) {
            $("#trackingrange span").html(picker.startDate.format("MMM DD, YYYY") + " - " + picker.endDate.format("MMM DD, YYYY"))
            $scope.getFromDt = picker.startDate.format("YYYY-MM-DD") + "T00:00:00Z";
            $scope.getToDt = picker.endDate.format("YYYY-MM-DD") + "T00:00:00Z";

            $scope.startDtNEpoch =  moment($scope.getFromDt).format('MM-DD-YYYY'); 
            $scope.startDtNEpoch = moment($scope.startDtNEpoch).unix() * 1000;

            $scope.endDtNEpoch = moment($scope.getToDt).format('MM-DD-YYYY'); 
            $scope.endDtNEpoch = (moment($scope.endDtNEpoch).unix() + 86400 - 60) * 1000;

            $scope.getFromDtN = moment($scope.getFromDt).format('YYYY-MM-DD');      
            $scope.getToDtN = moment($scope.getToDt).format('YYYY-MM-DD');    

            $rootScope.commonFrm = picker.startDate.format("MMM DD YYYY");
            $rootScope.commonTo = picker.endDate.format("MMM DD YYYY");

            $scope.submitDate();
        });


        // frmDt = frmDt.split('/');
        // toDt = toDt.split('/');

        //$scope.utcFromDt = frmDt[2]+"-"+frmDt[1]+"-"+frmDt[0];
        // $scope.utcToDt = toDt[2]+"-"+toDt[1]+"-"+toDt[0];

        // $scope.getFromDt = frmDt[2] + "-" + frmDt[1] + "-" + frmDt[0] + "T00:00:00Z";
        // $scope.getToDt = toDt[2] + "-" + toDt[1] + "-" + toDt[0] + "T00:00:00Z";

        $scope.getFromDtN = moment($scope.getFromDt).format('YYYY-MM-DD');      
        $scope.getToDtN = moment($scope.getToDt).format('YYYY-MM-DD');    


        // $scope.startDtNEpoch = frmDt[1] + "-" + frmDt[0] + "-" + frmDt[2];
        $scope.startDtNEpoch = moment($scope.getFromDt).format('MM-DD-YYYY');      
        $scope.startDtNEpoch = moment($scope.startDtNEpoch).unix() * 1000;

        $scope.endDtNEpoch = moment($scope.getToDt).format('MM-DD-YYYY');  
        $scope.endDtNEpoch = moment($scope.endDtNEpoch).unix() * 1000;

       // $scope.endDtNEpoch = $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0] + "-" + $scope.endDtNSplit[2];
        //$scope.endDtNEpoch = moment($scope.endDtNEpoch).unix() * 1000;

        // var utcFromDt = new Date(frmDt[2] + "-" + frmDt[1] + "-" + frmDt[0] + "T00:00:00Z");
        // var utcToDt = new Date(toDt[2] + "-" + toDt[1] + "-" + toDt[0] + "T00:00:00Z");
        // $scope.utcFromDt = parseInt(utcFromDt.getTime());
        // $scope.utcToDt = parseInt(utcToDt.getTime());
        //alert($scope.utcFromDt);

        // $("#datetimeFrom").on("dp.change", function(e) {
        //     var myDate = new Date(e.date);

        //     var yyyy = myDate.getFullYear().toString();

        //     var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
        //     var dd = myDate.getDate().toString();
        //     resultDtFrom = yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z";
        //     chDtFrom = yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
        //     $scope.fromYr = yyyy;
        //     $scope.fromMo = mm;
        //     $scope.fromDd = dd;

        //     $scope.getFromDt = resultDtFrom;
        //     $scope.getFromDtN = chDtFrom;
        //     $scope.startDtNEpoch =  (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "-" + yyyy;
        //     $scope.startDtNEpoch = moment($scope.startDtNEpoch).unix() * 1000;
        //     //alert($scope.getFromDt);
        //     // return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z";
        //     $('#datetimeTo').data("DateTimePicker").minDate(e.date);
        // });

        // $("#datetimeTo").on("dp.change", function(e) {
        //     var myDate = new Date(e.date);
        //     var yyyy = myDate.getFullYear().toString();
        //     var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
        //     var dd = myDate.getDate().toString();

        //     $scope.toYr = yyyy;
        //     $scope.toMo = mm;
        //     $scope.toDd = dd;

        //     resultDtTo = yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z";
        //     chDtTo = yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
        //     $scope.getToDt = resultDtTo;
        //     $scope.getToDtN = chDtTo;
        //     $scope.endDtNEpoch = (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "-" + yyyy;
        //     $scope.endDtNEpoch = (moment($scope.endDtNEpoch).unix() + 86400 - 60) * 1000;
        //     //alert($scope.getToDt);
        //     $('#datetimeFrom').data("DateTimePicker").maxDate(e.date);
        // });


        var immigrationSolr = "hismove";
        var limitValue = 15;

        var triggerOpt = "branch:" + sessionStorage.getItem('hourlyBranchName');
        var mainFacet = "branches";
        var branchQry = "dy_create_id";
        var groupBy = "";
        var gap = "%2B1DAY";
        $scope.storeData = [];
        
        


        $scope.getOfficersbyDate = function( from, to) {
            $http.get("http://" + solrHost + ":8983/solr/" + immigrationSolr + "/query?json={query: '" + triggerOpt + "',filter : 'xit_date : [" + from + " TO " + to + "]',limit: 0,facet: {officer: {type: terms,limit: 30,field: dy_create_id}}}")
            .success(function(data) {
                if (data.facets.count == 0) {
                    //console.log(data.facets.count.length);
                } else {
                    for (var i = 0, l = data.facets.officer.buckets.length; i < l; i++) {
                        var obj = data.facets.officer.buckets[i];
                        var element = [];
                        element.push(obj.val);
                        element.push(obj.count);
                        $scope.storeData.push(element);
                    }
                }
                $scope.storeData;
                console.log( $scope.storeData);
             
            }).catch(function(err) {

            })
            .finally(function() {
                //$scope.loading = false;
            });
        }

        $scope.getOfficersbyDate($scope.getFromDtEpoch,$scope.getToDtEpoch )
        $scope.timelineChart = function() {
            
            $scope.seriesOptions = [];
            $scope.seriesOptions1 = [];
            $scope.seriesOptions2 = [];
            $scope.seriesCounter = 0;
            $scope.seriesCounter1 = 0;
            $scope.seriesCounter2 = 0;


            /**
             * Create the chart when all data is loaded
             * @returns {undefined}
             */
            $scope.createChart = function() {
                var charts = [],
                options;
                var chartType = "line";
                function syncTooltip(container, p) {
                    var i = 0;
                    for (; i < charts.length; i++) {
                        if (container.id != charts[i].container.id) {
                            if(charts[i].tooltip.shared) {
                                
                                charts[i].tooltip.refresh([charts[i].series[0].data[p]]);
                            }
                            else {
                                charts[i].tooltip.refresh(charts[i].series[0].data[p]);
                            }
                        }
                    }
                }


                options = {
                    plotOptions: {
                        series: {
                            point: {
                                events: {
                                    mouseOver: function () {
                                        
                                    }
                                }
                            }
                        }
                    },
                    xAxis: {
                        type: 'datetime'
                    }
                };

                charts[0] = new Highcharts.Chart($.extend(true, {}, options, {
                    chart: {
                        type: chartType,
                        renderTo: 'container',
                        zoomType: 'x',
                        addSeries:$scope.seriesOptions
                    },

                    title:{
                        text: ''
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        shared: true,
                       
                    },
                    series: $scope.seriesOptions
                }));


                charts[1] = new Highcharts.Chart($.extend(true, {}, options, {
                    chart: {
                        type: chartType,
                        renderTo: 'container1',
                        zoomType: 'x',
                        addSeries:$scope.seriesOptions1
                        
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        shared: true
                    },
                    title:{
                        text: ''
                    },
                    series: $scope.seriesOptions1
                }));
                charts[2] = new Highcharts.Chart($.extend(true, {}, options, {
                    chart: {
                        type: chartType,
                        renderTo: 'container2',
                        zoomType: 'x',
                        addSeries:$scope.seriesOptions2
                    },
                    title:{
                        text: ''
                    },
                    tooltip: {
                        shared: true
                    },
                    series: $scope.seriesOptions2
                }));

                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });
            }
            $scope.createChart2 = function() {

                Highcharts.setOptions({
                    global: {
                        useUTC: false
                    }
                });

                
                charts[0] = new Highcharts.Chart($.extend(true, {}, options, {

                //$('#container').highcharts('StockChart', {
                    xAxis: {
                        type: 'datetime',
                        tickInterval: 3600 * 1000,
                        min: $scope.startDtNEpoch,
                        max: $scope.endDtNEpoch,
                        /*min: Date.UTC(2008, 4, 22, 00, 00),
                        max: Date.UTC(2008, 4, 23, 00, 00),*/
                    },

                    chart: {
                        type: 'spline',
                        renderTo: 'container'
                    },

                   
                    rangeSelector: {
                        selected: 5,
                        inputEnabled: false
                    },

                    scrollbar : {
                        enabled : false
                    },

                    navigator : {
                        enabled : false
                    },

                    yAxis: {
                        labels: {
                            formatter: function() {
                                return (this.value > 0 ? ' + ' : '') + this.value + '%';
                            }
                        },
                        plotLines: [{
                            value: 0,
                            width: 2,
                            color: 'silver'
                        }]
                    },

                    plotOptions: {

                    },
                    loading: true,
                    series: $scope.seriesOptions
                }));

                charts[1] = new Highcharts.Chart($.extend(true, {}, options, {
                //$('#container1').highcharts( {
                     
                    xAxis: {
                        type: 'datetime',
                        tickInterval: 3600 * 1000,
                        min: $scope.startDtNEpoch,
                        max: $scope.endDtNEpoch,
                        /*min: Date.UTC(2008, 4, 22, 00, 00),
                        max: Date.UTC(2008, 4, 23, 00, 00),*/
                    },

                    chart: {
                        type: 'spline',
                        renderTo: 'container1'

                    },

                    scrollbar : {
                        enabled : false
                    },

                    navigator : {
                        enabled : false
                    },

                    rangeSelector: {
                        selected: 5,
                        inputEnabled: false
                    },


                    yAxis: {
                        labels: {
                            formatter: function() {
                                return (this.value > 0 ? ' + ' : '') + this.value + '%';
                            }
                        },
                        plotLines: [{
                            value: 0,
                            width: 2,
                            color: 'silver'
                        }]
                    },

                    plotOptions: {

                    },
                    loading: true,

                    series: $scope.seriesOptions1
                }));

                charts[2] = new Highcharts.Chart($.extend(true, {}, options, {
               // $('#container2').highcharts({

                    xAxis: {
                        type: 'datetime',
                        
                        tickInterval: 3600 * 1000,
                        min: $scope.startDtNEpoch
                        /*min: Date.UTC(2008, 4, 22, 00, 00),
                        max: Date.UTC(2008, 4, 23, 00, 00),*/
                    },

                    chart: {
                        type: 'spline',
                        renderTo: 'container2',
                        zoom: 'x',
                        events: {
                            load: function(event) {
                                console.log(this);

                            },
                            redraw: function() {
                                console.log('redraw');
                            }
                        }

                    },

                    plotOptions: {
                        series: {
                            dataLabels:{
                                formatter:function(){
                                    if(this.y > 0)
                                        return this.y;
                                }
                            }
                        }
                    },
                    tooltip: {
                        shared: true
                    },

                             loading: true,

                    series: $scope.seriesOptions2
                }));


            }
            
            $scope.populateChart($scope.employeeArr);
            
            // Set the datepicker's date format

        };

        //return false;




        $scope.populateChart = function(ele) {

            $scope.loading = true;
            console.log(ele);

             $scope.loading = true;
            $.each(ele, function(i, name) {
                console.log($scope.getFromDtN, $scope.getToDtN);
                //$http.get(globalURL + "api/employee/1001231/" + name + "/" + $scope.startDtNSplit[2] + "-" + $scope.startDtNSplit[1] + "-" + $scope.startDtNSplit[0] + "/" + $scope.endDtNSplit[2] + "-" + $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0] + "/1").success(function(data) {
                $http.get(globalURL + "api/employee/"+$scope.branchCode+"/" + name + "/" + $scope.getFromDtN+"/"+$scope.getToDtN  + "/1")
                .success(function(data) {
                    console.log(name +" ---"+data.data.length+"----"+"Entry");
                    var start = +new Date();
                    if (data) {
                        //$scope.loading = true;
                        $scope.seriesOptions[i] = {
                            name: name,
                            data: data.data,
                            pointStart: $scope.startDtNEpoch,
                            //pointStart: 1211414400000,
                            //pointStart: Date.UTC(2008, 04, 22),
                            pointInterval: 3600 * 1000,
                            tooltip: {
                                valueDecimals: 0
                            }
                        };

                        $scope.seriesCounter += 1;
                        // Create the chart
 
                    } else {
                        return false;
                    }

                }).catch(function(err) {
                    console.log(err);
                    //$scope.loading = false;
                    
                }).finally(function(){
                    //$scope.loading = false;
                    //$http.get(globalURL + "api/employee/1001231/" + name + "/" + $scope.startDtNSplit[2] + "-" + $scope.startDtNSplit[1] + "-" + $scope.startDtNSplit[0] + "/" + $scope.endDtNSplit[2] + "-" + $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0] + "/2").success(function(data) {
                    $http.get(globalURL + "api/employee/"+$scope.branchCode+"/" + name + "/" + $scope.getFromDtN+"/"+$scope.getToDtN  + "/2").success(function(data) {
                        //$.getJSON('jsonp_' + name + '.js', function(data) {
                        // Create a timer
                        console.log(name +" ---"+data.data.length+"----"+"Exit");
                        var start = +new Date();
                        if (data) {
                            $scope.seriesOptions1[i] = {
                                name: name,
                                data: data.data,
                                pointStart: $scope.startDtNEpoch,
                                //pointStart: 1211414400000,
                                //pointStart: Date.UTC(2008, 04, 22),
                                pointInterval: 3600 * 1000,
                                tooltip: {
                                    valueDecimals: 0
                                }
                            };

                            $scope.seriesCounter1 += 1;
                        } else {
                            return false;
                        }

                    }).catch(function(err) {

                    }).finally(function(){
                    //    $scope.loading = false;
                        //$http.get(globalURL + "api/employee/1001231/" + name + "/" + $scope.startDtNSplit[2] + "-" + $scope.startDtNSplit[1] + "-" + $scope.startDtNSplit[0] + "/" + $scope.endDtNSplit[2] + "-" + $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0]).success(function(data) {
                        $http.get(globalURL + "api/employee/"+$scope.branchCode+"/" + name + "/" + $scope.getFromDtN+"/"+$scope.getToDtN).success(function(data) {
                            //$.getJSON('jsonp_' + name + '.js', function(data) {
                            // Create a timer
                            console.log(name +" ---"+data.data.length+"----"+"OverAll");
                            var start = +new Date();
                            if (data) {
                                $scope.seriesOptions2[i] = {
                                    name: name,
                                    data: data.data,
                                    pointStart: $scope.startDtNEpoch,
                                    //pointStart: 1211414400000,
                                    //pointStart: Date.UTC(2008, 04, 22),
                                    pointInterval: 3600 * 1000,
                                    tooltip: {
                                        valueDecimals: 0
                                    }
                                };

                                $scope.seriesCounter2 += 1;
                                // Create the chart
                                console.log($scope.seriesCounter2 === ele.length);
                                if ($scope.seriesCounter2 === ele.length) {
                                    $scope.createChart();
                                }
                                
                            } else {
                                return false;
                            }

                        }).catch(function(err) {

                        }).finally(function(){
                            $scope.loading = false;
                        });
                    });
                });
                    
            });




        
        // returns a promise for an object like:
        // { abo: resultFromAbo, ser: resultFromSer, ... }
        

            /*$.each(ele, function(i, name) {

                
            });*/

        }

        $scope.removeChart = function(){
            var chart1 = $('#container').highcharts();
            var seriesLength = chart1.series.length;
            for(var i = seriesLength -1; i > -1; i--) {
                chart1.series[i].remove();
            }

            var chart2 = $('#container1').highcharts();
            var seriesLength2 = chart2.series.length;
            for(var j = seriesLength2 -1; j > -1; j--) {
                chart2.series[j].remove();
            }

            var chart3 = $('#container2').highcharts();
            var seriesLength3 = chart3.series.length;
            for(var k = seriesLength3 -1; k > -1; k--) {
                chart3.series[k].remove();
            }
        }

        $scope.submitDate = function(e) {

            console.log($scope.employeeArr);
            $scope.storeData= [];          
            $scope.getOfficersbyDate($scope.getFromDtN+"T00:00:00Z", $scope.getToDtN +"T00:00:00Z")
            $scope.empName = [];
            $scope.removeChart();
            $scope.employeeArr = [];
            $scope.timelineChart();
            
            $scope.loading = false;
        }

        $scope.backBtn = function() {
            location.href = "index.html#/d2dTracking/d2dTracking.html";
        }

        $scope.timelineChart();
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageSidebarClosed = true;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("officeractivity");
    });


});