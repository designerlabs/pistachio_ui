'use strict';



MetronicApp.controller('employeeHourlyDetailsController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        Metronic.initAjax();
        $scope.drawSparkline = 0;
        $scope.employeeArr = [];
        console.log(window.location.href);
        var Qstring = window.location.href;
        var Qparam = Qstring.split('?')[1];
        Qparam = Qparam.split('&');
        var obj = {};
        var myArr = [];
        $.each(Qparam, function(i, k) {
            var ki = k.split("=");
            myArr.push(ki[1]);
        });
        console.log(myArr);

        $scope.empName = myArr[1];

        $scope.employeeArr.push(myArr[1]);

        var CurrentDate = myArr[2];
        CurrentDate = CurrentDate.replace(/%2F/g, "\/");
        CurrentDate = CurrentDate.replace(/%20-%20/g, " ");
        CurrentDate = CurrentDate.split(" ");
        var startDtN = CurrentDate[0];
        var endDtN = CurrentDate[1];
        $scope.startDtNSplit = startDtN.split("/");
        $scope.endDtNSplit = endDtN.split("/");

        $scope.subTitle = $scope.startDtNSplit[0] + "/" + $scope.startDtNSplit[1] + "/" + $scope.startDtNSplit[2] + " - " + $scope.endDtNSplit[0] + "/" + $scope.endDtNSplit[1] + "/" + $scope.endDtNSplit[2];
        $scope.startDtNEpoch = $scope.startDtNSplit[1] + "-" + $scope.startDtNSplit[0] + "-" + $scope.startDtNSplit[2];
        $scope.startDtNEpoch = moment($scope.startDtNEpoch).unix() * 1000;



        $scope.endDtNEpoch = $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0] + "-" + $scope.endDtNSplit[2];
        $scope.endDtNEpoch = moment($scope.endDtNEpoch).unix() * 1000;


        $scope.getFromDtEpoch = $scope.startDtNSplit[2] + "-" + $scope.startDtNSplit[1] + "-" + $scope.startDtNSplit[0] + "T00:00:00Z";
        $scope.getToDtEpoch = $scope.endDtNSplit[2] + "-" + $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0] + "T00:00:00Z";


        /* startDtN = startDtN[0] + "-" + startDtN[1] + "-" + startDtN[2] + " 00:00:00";
         endDtN = endDtN.split("/");
         endDtN = endDtN[0] + "-" + endDtN[1] + "-" + endDtN[2] + " 00:00:00";
         var startDtN1 = startDtN.split(" ")[0].split("-");
         var formattedDays = startDtN.split(" ")[0].split("-");
         var formattedTime = startDtN.split(" ")[1].split(":");
         $scope.epochStart = new Date(formattedDays[2], formattedDays[1] - 1, formattedDays[0], formattedTime[0], formattedTime[1], formattedTime[2], 0).getTime() / 1000;
         console.log($scope.epochStart);*/


        $scope.changeDt = function(format) { // for display purpose
            var newDate = format.split('T');
            var newDate2 = newDate[0].split('-').reverse().join('/');
            return newDate2;
        };


        var resultDtFrom, resultDtTo;
        var dateNow = new Date();
        var tDate = dateNow.getDate();
        var tmonth = dateNow.getMonth() + 1
        var tyear = dateNow.getFullYear() - 1;
        if (tmonth < 10) tmonth = '0' + tmonth;
        if (tDate < 10) tDate = '0' + tDate;
        var lastDate = tDate + "/" + tmonth + "/" + tyear;

        $('#datetimeFrom').datetimepicker({
            format: 'DD/MM/YYYY',
            defaultDate: '"' + tmonth + '"/"' + tDate + '"/"' + tyear + '"'
        });
        $('#datetimeTo').datetimepicker({
            useCurrent: false,
            defaultDate: dateNow,
            format: 'DD/MM/YYYY' //Important! See issue #1075
        });

        var frmDt = $('#datetimeFrom').data('date');

        var toDt = $('#datetimeTo').data('date');

        frmDt = frmDt.split('/');
        toDt = toDt.split('/');

        //$scope.utcFromDt = frmDt[2]+"-"+frmDt[1]+"-"+frmDt[0];
        // $scope.utcToDt = toDt[2]+"-"+toDt[1]+"-"+toDt[0];

        $scope.getFromDt = frmDt[2] + "-" + frmDt[1] + "-" + frmDt[0] + "T00:00:00Z";
        $scope.getToDt = toDt[2] + "-" + toDt[1] + "-" + toDt[0] + "T00:00:00Z";

        $scope.getFromDtN = frmDt[2] + "-" + frmDt[1] + "-" + frmDt[0];
        $scope.getToDtN = toDt[2] + "-" + toDt[1] + "-" + toDt[0];


        var utcFromDt = new Date(frmDt[2] + "-" + frmDt[1] + "-" + frmDt[0] + "T00:00:00Z");
        var utcToDt = new Date(toDt[2] + "-" + toDt[1] + "-" + toDt[0] + "T00:00:00Z");
        $scope.utcFromDt = parseInt(utcFromDt.getTime());
        $scope.utcToDt = parseInt(utcToDt.getTime());
        //alert($scope.utcFromDt);

        $("#datetimeFrom").on("dp.change", function(e) {
            var myDate = new Date(e.date);

            var yyyy = myDate.getFullYear().toString();

            var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = myDate.getDate().toString();
            resultDtFrom = yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z";

            $scope.fromYr = yyyy;
            $scope.fromMo = mm;
            $scope.fromDd = dd;

            $scope.getFromDt = resultDtFrom;
            //alert($scope.getFromDt);
            // return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z";
            $('#datetimeTo').data("DateTimePicker").minDate(e.date);
        });

        $("#datetimeTo").on("dp.change", function(e) {
            var myDate = new Date(e.date);
            var yyyy = myDate.getFullYear().toString();
            var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
            var dd = myDate.getDate().toString();

            $scope.toYr = yyyy;
            $scope.toMo = mm;
            $scope.toDd = dd;

            resultDtTo = yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z";
            $scope.getToDt = resultDtTo;
            //alert($scope.getToDt);
            $('#datetimeFrom').data("DateTimePicker").maxDate(e.date);
        });


        var immigrationSolr = "hismove";
        var limitValue = 15;

        var triggerOpt = "branch:" + myArr[0];
        var mainFacet = "branches";
        var branchQry = "dy_create_id";
        var groupBy = "";
        var gap = "%2B1DAY";
        $scope.storeData = [];

        $http.get("http://" + solrHost + ":8983/solr/" + immigrationSolr + "/query?json={query: '" + triggerOpt + "',filter : 'xit_date : [" + $scope.getFromDtEpoch + " TO " + $scope.getToDtEpoch + "]',limit: 0,facet: {officer: {type: terms,limit: 30,field: dy_create_id}}}")
            .success(function(data) {
                //console.log(data);

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

            }).catch(function(err) {

            })
            .finally(function() {
                $scope.loading = false;
            });





        $scope.timelineChart = function() {


            $scope.seriesOptions = [];
            $scope.seriesOptions1 = [];
            $scope.seriesOptions2 = [];
            $scope.seriesCounter = 0;
            $scope.seriesCounter1 = 0;
            $scope.seriesCounter2 = 0;


            //Set Extreme function for Highchart timeline selection
            (function(H) {
                H.wrap(H.Axis.prototype, 'setExtremes', function(proceed) {
                    var newMin = arguments[1],
                        newMax = arguments[2];
                    arguments[1] = (newMin + newMax) / 2;
                    // Run original proceed method
                    proceed.apply(this, [].slice.call(arguments, 1));
                });
            }(Highcharts));

            function afterSetExtremes(e) {
                $scope.loading = true;
                var chart = $('#container').highcharts();
                chart.showLoading('Loading data from server...');

                //Formatting Date
                var dateFormat = function(ele) {
                    var myDate = new Date(ele);

                    var yyyy = myDate.getFullYear().toString();

                    var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
                    var dd = myDate.getDate().toString();
                    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z";
                };


                //$scope.startDate = dateFormat(Math.round(e.min));
                //$scope.endDate = dateFormat(Math.round(e.max));
                $("#datetimeFrom").data('DateTimePicker').date($scope.changeDt(dateFormat(Math.round(e.min))));
                $("#datetimeTo").data('DateTimePicker').date($scope.changeDt(dateFormat(Math.round(e.max))));

                $scope.startDate = $scope.getFromDt;
                $scope.endDate = $scope.getToDt;


                $scope.subtitle = $scope.changeDt(dateFormat(Math.round(e.min))) + " - " + $scope.changeDt(dateFormat(Math.round(e.max)));



            };

            /**
             * Create the chart when all data is loaded
             * @returns {undefined}
             */
            $scope.createChart = function() {
                $('#container').highcharts('StockChart', {

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
                        events: {
                            load: function(event) {
                                console.log(this);

                            },
                            redraw: function() {
                                console.log('redraw');
                            }
                        }

                    },

                    navigator:{
                        enabled: false
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

                    series: $scope.seriesOptions
                });


                $('#container1').highcharts('StockChart', {

                    xAxis: {
                        type: 'datetime',
                        tickInterval: 3600 * 1000,
                        min: $scope.startDtNEpoch,
                        max: $scope.endDtNEpoch,
                        /*min: Date.UTC(2008, 4, 22, 00, 00),
                        max: Date.UTC(2008, 4, 23, 00, 00),*/
                    },

                    chart: {
                        type: 'column',
                        events: {
                            load: function(event) {
                                console.log(this);

                            },
                            redraw: function() {
                                console.log('redraw');
                            }
                        }

                    },

                    navigator:{
                        enabled: false
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
                });


                $('#container2').highcharts('StockChart', {

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
                        events: {
                            load: function(event) {
                                console.log(this);

                            },
                            redraw: function() {
                                console.log('redraw');
                            }
                        }

                    },

                    rangeSelector: {
                        selected: 5,
                        inputEnabled: false
                    },

                    navigator:{
                        enabled: false
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

                    series: $scope.seriesOptions2
                });


            }

            $scope.createChartExit = function() {

            }

            $scope.populateChart($scope.employeeArr);
            // Set the datepicker's date format

        };

        //return false;




        $scope.populateChart = function(ele) {

            $scope.loading = true;
            console.log(ele);

            $.each(ele, function(i, name) {

                $http.get(globalURL + "api/employee/1001231/" + name + "/" + $scope.startDtNSplit[2] + "-" + $scope.startDtNSplit[1] + "-" + $scope.startDtNSplit[0] + "/" + $scope.endDtNSplit[2] + "-" + $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0] + "/1").success(function(data) {
                        //$.getJSON('jsonp_' + name + '.js', function(data) {
                        // Create a timer
                        console.log(data);
                        var start = +new Date();
                        if (data) {
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
                            console.log($scope.seriesCounter === ele.length);
                            if ($scope.seriesCounter === ele.length) {

                                $scope.createChart();
                            }

                        } else {
                            return false;
                        }

                    }).catch(function(err) {

                    })
                    .finally(function() {
                        $scope.loading = true;
                        //$scope.loading = false;
                        $.each(ele, function(i, name) {

                            $http.get(globalURL + "api/employee/1001231/" + name + "/" + $scope.startDtNSplit[2] + "-" + $scope.startDtNSplit[1] + "-" + $scope.startDtNSplit[0] + "/" + $scope.endDtNSplit[2] + "-" + $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0] + "/2").success(function(data) {
                                    //$.getJSON('jsonp_' + name + '.js', function(data) {
                                    // Create a timer
                                    console.log(data);
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
                                        // Create the chart
                                        console.log($scope.seriesCounter1 === ele.length);
                                        if ($scope.seriesCounter1 === ele.length) {

                                            $scope.createChart();
                                        }
                                    } else {
                                        return false;
                                    }

                                }).catch(function(err) {

                                })
                                .finally(function() {
                                    $scope.loading = true;
                                    //$scope.loading = false;

                                    $.each(ele, function(i, name) {

                                        $http.get(globalURL + "api/employee/1001231/" + name + "/" + $scope.startDtNSplit[2] + "-" + $scope.startDtNSplit[1] + "-" + $scope.startDtNSplit[0] + "/" + $scope.endDtNSplit[2] + "-" + $scope.endDtNSplit[1] + "-" + $scope.endDtNSplit[0]).success(function(data) {
                                                //$.getJSON('jsonp_' + name + '.js', function(data) {
                                                // Create a timer
                                                console.log(data);
                                                var start = +new Date();
                                                if (data) {
                                                    $scope.seriesOptions2[i] = {
                                                        name: name,
                                                        data: data,
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

                                            })
                                            .finally(function() {
                                                $scope.loading = false;

                                            });
                                    });

                                });
                        });
                    });
            });






            /*$.each(ele, function(i, name) {

                
            });*/

        }

        $scope.submitDate = function(e) {

            console.log($scope.employeeArr);

            //$scope.createEmployeeChart($scope.employeeArr);
            //$scope.populateChart($scope.employeeArr);
            $scope.timelineChart();
            //$scope.createChart();

            //$scope.loading = false;
        }

        $scope.backBtn = function() {
            location.href = "index.html#/d2dTracking/d2dTracking.html";
        }

        $scope.timelineChart();

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});