'use strict';

MetronicApp.controller('visitorTrackingController', function($rootScope, $scope, $http, $timeout, stageUpdateVisitor, stageUpdate) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        Metronic.initAjax();
        Layout.setSidebarMenuActiveLink('set', $('#visitorLink')); // set profile link active in sidebar menu 
   
        $scope.drawSparkline = 0;

        $scope.changeDt = function(format) { // for display purpose
            var newDate = format.split('T');
            var newDate2 = newDate[0].split('-').reverse().join('/');
            return newDate2;
        };

        var Qstring = window.location.href;
        var Qparam = Qstring.split('?')[1];
        if(Qparam){
            Qparam = Qparam.split("=");
            console.log(Qparam[1]);
        }

        $scope.getCurrentStage = stageUpdateVisitor.getStage();
        console.log($scope.getCurrentStage);
        stageUpdate.resetStage();
        
        $rootScope.$on('loading:progress', function (){
            console.log("loading");
            $scope.loading = true;
        });

        $rootScope.$on('loading:finish', function (){
            $scope.loading = false;
            console.log("stop");
        });


        var getmydata = function() {
            var query = "q=-created%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(created)\",\"max_date\":\"max(created)\"}}";
            var sq = "http://"+solrHost+":8983/solr/immigration2/query?";
            return $http.get(sq+query)
                .success(function(data) 
                {
                    $scope.mydata = data.facets.max_date;

                });

        };


        getmydata().then(function(data) {
            // stuff is now in our scope, I can alert it
           // alert($scope.mydata);
            $scope.dateNow = new Date($scope.mydata);

        });
        

        // function cb(start, end) {
        //     $('#trackingrange span').html(start.format('MMM DD, YYYY') + ' - ' + end.format('MMM DD, YYYY'));
        //     frmDt = start.format('DD/MM/YYYY');
        //     toDt = end.format('DD/MM/YYYY');
        // }

        
        //console.log(getDateLimits.call().hello);
        
        var resultDtFrom, resultDtTo;
        var dateNow = new Date();
        //alert(dateNow);
        var tDate = dateNow.getDate();
        var tmonth = dateNow.getMonth() + 1
        var tyear = dateNow.getFullYear() - 1;
        if (tmonth < 10) tmonth = '0' + tmonth;
        if (tDate < 10) tDate = '0' + tDate;
        var lastDate = tDate + "/" + tmonth + "/" + tyear;
        console.log(dateNow);
        // $('#datetimeFrom').datetimepicker({ format: 'DD/MM/YYYY', defaultDate: tyear+'-'+tmonth+'-'+tDate+'T00:00:00' });
        // $('#datetimeTo').datetimepicker({
        //     useCurrent: false,
        //     defaultDate: dateNow,
        //     format: 'DD/MM/YYYY' //Important! See issue #1075
        // });
        var frmDt;
        // var frmDt = $('#datetimeFrom').data('date');
        var toDt;
        $scope.DataBlock = true;
        // var toDt = $('#datetimeTo').data('date');
        
        // cb(frmDt, enddt);
        if($rootScope.commonFrm == undefined ||  $rootScope.commonTo == undefined){
            $('#trackingrange').daterangepicker({
                startDate: moment().subtract(1,"year"),
                endDate: moment(),           
                "alwaysShowCalendars": false,
                 ranges: {
                    'Today': [moment(), moment()],
                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }                   
            },
            function(startdt, enddt) {
                $('#trackingrange span').html(startdt.format('MMM DD, YYYY') + ' - ' + enddt.format('MMM DD, YYYY'));
                frmDt = startdt.format('DD/MM/YYYY');
                toDt = enddt.format('DD/MM/YYYY');
                $scope.DataBlock = true;
            });

            $("#trackingrange span").html(moment().subtract(1,"year").format("MMM DD YYYY") + " - " + moment().format("MMM DD YYYY"));
            // $scope.getFromDt = moment().subtract(1,"year").format("YYYY-MM-DD") + "T00:00:00Z";
            // $scope.getToDt = moment().format("YYYY-MM-DD") + "T23:59:59Z";
            $scope.getFromDt = moment().subtract(1,"year").format("YYYY-MM-DD");
            $scope.getToDt = moment().format("YYYY-MM-DD");

        }else{
            $('#trackingrange').daterangepicker({
                startDate: moment($rootScope.commonFrm),
                endDate: moment($rootScope.commonTo),           
                "alwaysShowCalendars": false                     
            },
            function(startdt, enddt) {
                $('#trackingrange span').html(startdt.format('MMM DD, YYYY') + ' - ' + enddt.format('MMM DD, YYYY'));
                frmDt = startdt.format('DD/MM/YYYY');
                toDt = enddt.format('DD/MM/YYYY');
            });

            $("#trackingrange span").html($rootScope.commonFrm + " - " + $rootScope.commonTo);
            // $scope.getFromDt = moment($rootScope.commonFrm).format("YYYY-MM-DD") + "T00:00:00Z";
            // $scope.getToDt = moment($rootScope.commonTo).format("YYYY-MM-DD") + "T23:59:59Z"; 
            $scope.getFromDt = moment($rootScope.commonFrm).format("YYYY-MM-DD");
            $scope.getToDt = moment($rootScope.commonTo).format("YYYY-MM-DD");

        }

        

        $('.daterangecont').on('apply.daterangepicker', function (ev, picker) {
            // $("#trackingrange span").html(picker.startDate.format("MMM DD, YYYY") + " - " + picker.endDate.format("MMM DD, YYYY"))
            // $scope.getFromDt = picker.startDate.format("YYYY-MM-DD") + "T00:00:00Z";
            // $scope.getToDt = picker.endDate.format("YYYY-MM-DD") + "T23:59:59Z";
            $scope.getFromDt = picker.startDate.format("YYYY-MM-DD");
            $scope.getToDt = picker.endDate.format("YYYY-MM-DD");

            $rootScope.commonFrm = picker.startDate.format("MMM DD YYYY");
            $rootScope.commonTo = picker.endDate.format("MMM DD YYYY");

            console.log($scope.ele1, $scope.ele2);
            $scope.timelineChart($scope.ele1, $scope.ele2);
            //$scope.populateChart();
            $scope.createChart();

        });
        


        var startDt, endDt, triggerOpt, triggerOptRow, branchQry, ubranch, mainFacet, offsetVal, triggerBt, groupBy, gap, count, sortValue, $widget; // Global variable
        var immigrationSolr = "hismove";
        if($scope.getCurrentStage.length == 0){
            localStorage.removeItem('branchName'); // each time removing the branch and Emp name
            localStorage.removeItem('empName');
            localStorage.removeItem('ctryName');
            localStorage.removeItem('countyName');
        }
        
 

        $scope.timelineChart = function(ele1, ele2) {
            try {
                $scope.getBranchVal = JSON.parse(localStorage.branchName);
                $scope.getEmpName = JSON.parse(localStorage.empName);
                $scope.getCtryName = JSON.parse(localStorage.ctryName);
                $scope.BranchName = $scope.getBranchVal.two;
                $scope.BranchQueryName = $scope.getBranchVal.one;
                $scope.EmpName = $scope.getEmpName.two;
                $scope.EmpQueryName = $scope.getEmpName.one;
                $scope.CtryName = $scope.getCtryName.two;
                $scope.CtryQueryName = $scope.getCtryName.one;
            } catch (err) {
                console.log(err);
            }
            $scope.ele1 = ele1;
            $scope.ele2 = ele2;
           
        // if($scope.getCurrentStage.length > 0){
        //     $scope.ele2 = $scope.getCurrentStage[0];
        // };
            if ($scope.ele2 == "Branch") {
                
                $scope.column2 = "No. of Exit";
                $scope.column3 = "Exit Trend";
                $scope.column4 = "No. of Entry";
                $scope.column5 = " Entry Trend";
            }

            if ($scope.ele2 == "Officer") {
                $scope.BranchName = $scope.getBranchVal.two;
                $scope.column2 = "No. of Exit";
                $scope.column3 = "Exit Trend";
                $scope.column4 = "No. of Entry";
                $scope.column5 = " Entry Trend";
            }
            if ($scope.ele2 == "Country") {
                $scope.EmpName = $scope.getEmpName.two;
                $scope.column2 = "No. of Exit";
                $scope.column3 = "Exit Trend";
                $scope.column4 = "No. of Entry";
                $scope.column5 = " Entry Trend";
            }
            if ($scope.ele2 == "Visitor") {
                $scope.CtryName = $scope.getCtryName.two;
                $scope.column2 = "Gender";
                $scope.column3 = "Passport No.";
                $scope.column4 = "No. of Exit";
                $scope.column5 = "No. of Entry";
            }
            $scope.seriesOptions = [];

            $scope.seriesCounter = 0;

            $scope.seriesDet = {
                "series": [
                    { "name": "in", "title": "Entry", "color": "rgb(135,206,235)" },
                    { "name": "out", "title": "Exit", "color": "rgb(240,128,128)" }
                ]
            };

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

                var chart = $('#container').highcharts();
                chart.showLoading('Loading data from server...');

                //Formatting Date
                var dateFormatStart = function(ele) {
                    var myDate = new Date(ele);

                    var yyyy = myDate.getFullYear().toString();

                    var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
                    var dd = myDate.getDate().toString();
                    // return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z";
                    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
                };

                var dateFormatEnd = function(ele) {
                    var myDate = new Date(ele);

                    var yyyy = myDate.getFullYear().toString();

                    var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
                    var dd = myDate.getDate().toString();
                    // return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T23:59:59Z";
                    return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
                };




                // $("#datetimeFrom").data('DateTimePicker').date($scope.changeDt(dateFormat(Math.round(e.min))));
                // $("#datetimeTo").data('DateTimePicker').date($scope.changeDt(dateFormat(Math.round(e.max))));

                // $scope.startDate = dateFormatStart(Math.round(e.xAxis[0].min));
                // $scope.endDate = dateFormatEnd(Math.round(e.xAxis[0].max));

                $scope.startDate = moment(Math.round(e.xAxis[0].min)).format('YYYY-MM-DD');
                $scope.endDate = moment(Math.round(e.xAxis[0].max)).format('YYYY-MM-DD');

                /*  $scope.startDate = $scope.getFromDt;
                  $scope.endDate = $scope.getToDt;*/


                // $scope.subtitle = $scope.changeDt(dateFormat(Math.round(e.min))) + " - " + $scope.changeDt(dateFormat(Math.round(e.max)));
                
                $('#trackingrange span').html(moment($scope.startDate).format('MMM DD YYYY') + ' - ' + moment($scope.endDate).format('MMM DD YYYY'));
                $("#trackingrange").data('daterangepicker').setStartDate(moment($scope.startDate).format('DD/MM/YYYY'));
                $("#trackingrange").data('daterangepicker').setEndDate(moment($scope.endDate).format('DD/MM/YYYY'));

                $scope.subtitle = moment($scope.startDate).format('DD/MM/YYYY') + " - " + moment($scope.endDate).format('DD/MM/YYYY');

                // frmDt = moment($scope.startDate).format('DD/MM/YYYY');
                // toDt = moment($scope.endDate).format('DD/MM/YYYY');
                //  $('#trackingrange span').html(startdt.format('MMM DD, YYYY') + ' - ' + enddt.format('MMM DD, YYYY'));
                // frmDt = startdt.format('DD/MM/YYYY');
                // toDt = enddt.format('DD/MM/YYYY');
                
                //for employeeHourlyDetails page
                $rootScope.commonFrm = moment($scope.startDate).format("MMM DD YYYY");
                $rootScope.commonTo = moment($scope.endDate).format("MMM DD YYYY");
                $scope.getFromDt = moment($scope.startDate).format("MMM DD YYYY");
                $scope.getToDt = moment($scope.endDate).format("MMM DD YYYY");                 

                


            $scope.timelineChart($scope.ele1, $scope.ele2);
            //$scope.populateChart();
            $scope.createChart();

            };

            /**
             * Create the chart when all data is loaded
             * @returns {undefined}
             */
            $scope.createChart = function() {

            $('#container').highcharts('StockChart', {

                    scrollbar: {
                        enabled: false
                    },
                    legend: {
                        enabled: true,
                        floating: true,
                        verticalAlign: 'top',
                        align: 'right'
                    }, 
                    rangeSelector: {
                        selected: 5,
                        inputEnabled: false,
                        buttonTheme: {
                            visibility: 'hidden'
                        },
                        labelStyle: {
                            visibility: 'hidden'
                        }
                    },

                    chart: {
                        // zoomType: 'x',
                        events: {
                            load: function(event) {
                                console.log(event.target);
                            },
                            selection: function(event) {
                                afterSetExtremes(event);
                                console.log(event);
                                console.log((new Date(event.xAxis[0].min)).toLocaleString() + ' - ' + (new Date(event.xAxis[0].max)).toLocaleString());
                            }
                        }                        
                    },
                    navigator: {
                        enabled: true
                    },
                    xAxis: {
                        // events: {                           
                        //     // afterSetExtremes: afterSetExtremes
                        //     setExtremes : function(e) {
	    			    //         console.log(e);
	    		        //     }
                        // },
                        minRange: 3600 * 1000 // one hour
                    },


                    plotOptions: {
                        series:{
                            threshold: 100
                        },
                        area:{
                            threshold: 100
                        }
                    },

                    tooltip: {

                        pointFormat: '<span  style="color:{series.color}; font-size:20px;">{series.name}: {point.y}</span><br/>',
                        valueDecimals: 0
                    },

                    series: $scope.seriesOptions
                }, function(chart) {

                    // apply the date pickers
                    setTimeout(function() {

                        $('input.highcharts-range-selector', $('#container'))
                            .datepicker({
                                beforeShow: function(i, obj) {
                                    $widget = obj.dpDiv;
                                    window.$uiDatepickerDiv = $widget;
                                    if ($widget.data("top")) {
                                        setTimeout(function() {
                                            $uiDatepickerDiv.css("top", $uiDatepickerDiv.data("top"));
                                        }, 50);
                                    }
                                },
                                onClose: function(i, obj) {
                                    $widget = obj.dpDiv;
                                    $widget.data("top", $widget.position().top);
                                }
                            })
                    }, 0)
                });
            }
            $scope.populateChart();
            // Set the datepicker's date format

        };

        count = 0;

        var limitValue = 15;
        $("#setLimit").change(function(){
            var curVal = parseInt(this.value);
            limitValue = curVal;
            $scope.populateChart();
        });
        $scope.branchOffset = 0;
        $scope.pageCount = 1;
        if ($scope.branchOffset == 0 || $scope.pageCount == 1) {
            $("#bPreviousBtn").prop('disabled', true);
        } else {
            $("#bPreviousBtn").prop('disabled', false);
        }


        
        var FIRST_VALUE = 'desc';
        var SECOND_VALUE = 'asc';

        sortValue = FIRST_VALUE;
        $(".sortBtn2, .sortBtn1").click(function(){
            if(sortValue == FIRST_VALUE) {
                sortValue = SECOND_VALUE;  
            } else {
                sortValue = FIRST_VALUE; 
            }
            $scope.populateChart();
        });

    
        // $(".sortBtn2").toggle(function() {
        //     sortValue = "asc";
        //     $scope.populateChart();

        // }, function() {
        //     sortValue = "desc";
        //     $scope.populateChart();
        // });
        // $(".sortBtn3").toggle(function() {
        //     sortValue = "asc";
        //     $scope.populateChart();

        // }, function() {
        //     sortValue = "desc";
        //     $scope.populateChart();
        // });

        $("#bNextBtn").click(function() {
            $scope.branchOffset += limitValue;
            $scope.pageCount += 1;
            if ($scope.branchOffset == 0 || $scope.pageCount == 1) {
                $("#bPreviousBtn").prop('disabled', true);
            } else {
                $("#bPreviousBtn").prop('disabled', false);
            }

            if (($scope.totalCount - $scope.branchOffset) <= limitValue) {
                $("#bNextBtn").prop('disabled', true);
            } else {
                $("#bNextBtn").prop('disabled', false);
            }
            $scope.populateChart();
        });

        $("#bPreviousBtn").click(function() {
            $scope.branchOffset -= limitValue;
            $scope.pageCount -= 1;
            $("#bNextBtn").prop('disabled', false);
            if ($scope.branchOffset == 0 || $scope.pageCount == 1) {
                $("#bPreviousBtn").prop('disabled', true);
            } else {
                $("#bPreviousBtn").prop('disabled', false);
            }
            $scope.populateChart();
        });

        $scope.populateChart = function() {

            /*if($scope.startDate){
              startDt = $scope.startDate;
            }else{*/
            startDt = $scope.getFromDt;
            /*};*/


            /* if($scope.endDate){
               endDt = $scope.endDate;
             }else{*/
            endDt = $scope.getToDt;
            /*};*/
            $scope.totalInOut = [];
            //alert(count + " first");
            $.each($scope.seriesDet, function(j, valu) {
                if ($scope.ele1 == "Inital") {
                    count = 0;
                    triggerOpt = "*:*";
                    mainFacet = "branches";
                    triggerOptRow = "rows=2&";
                    groupBy, offsetVal = "";
                    // $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
                    if(moment($scope.getToDt).toDate().getHours() > 0){
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).subtract(1,'days').format('DD/MM/YYYY');                        
                    }else{
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).format('DD/MM/YYYY');                        
                    }

                    // $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).format('DD/MM/YYYY');                        
                    branchQry = 'doc_nos';
                    ubranch = 'ubranch: "unique(' + branchQry + ')"';
                    gap = "%2B1DAY";

                } else if ($scope.ele2 == "Officer") {
                    count += 1;
                    //alert(count);
                    if (count == 2) {
                        $scope.branchOffset = 0;
                        $scope.pageCount = 1;
                        $("#bPreviousBtn").prop('disabled', true);
                        $("#bNextBtn").prop('disabled', false);
                    }
                    triggerOpt = "branch:" + $scope.ele1;
                    triggerOptRow = "rows=2&fq=branch:" + $scope.ele1 + "&";
                    mainFacet = "branches";
                    groupBy, offsetVal = "";
                    gap = "%2B1DAY";
                    // $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
                        if(moment($scope.getToDt).toDate().getHours() > 0){
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).subtract(1,'days').format('DD/MM/YYYY');                        
                    }else{
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).format('DD/MM/YYYY');                        
                    }
                    branchQry = 'dy_create_id';
                    ubranch = 'ubranch: "unique(' + branchQry + ')"';

                } else if ($scope.ele2 == "Country") {
                    count += 1;
                    //alert(count);
                    if (count == 2) {
                        $scope.branchOffset = 0;
                        $scope.pageCount = 1;
                        $("#bPreviousBtn").prop('disabled', true);
                        $("#bNextBtn").prop('disabled', false);
                    }
                    triggerOpt = "branch:" + $scope.getBranchVal.one + " AND  dy_create_id:" + $scope.getEmpName.one;
                    triggerOptRow = "rows=2&fq=branch:" + $scope.getBranchVal.one + "&fq=dy_create_id:" + $scope.getEmpName.one + "&";
                    mainFacet = "country";
                    // $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
                    if(moment($scope.getToDt).toDate().getHours() > 0){
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).subtract(1,'days').format('DD/MM/YYYY');                        
                    }else{
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).format('DD/MM/YYYY');                        
                    }                       
                    
                    branchQry = "country";
                    ubranch = 'ubranch: "unique(' + branchQry + ')"';
                    groupBy, offsetVal = "";

                    gap = "%2B1DAY";

                } else if ($scope.ele2 == "Visitor") {
                    count += 1;
                    //alert(count);
                    if (count == 2) {
                        $scope.branchOffset = 0;
                        $scope.pageCount = 1;
                        $("#bPreviousBtn").prop('disabled', true);
                        $("#bNextBtn").prop('disabled', false);
                    }
                    triggerOpt = "branch:" + $scope.getBranchVal.one + " AND  dy_create_id:" + $scope.getEmpName.one + " AND country:" + $scope.getCtryName.one;
                    triggerOptRow = "rows=2&fq=branch:" + $scope.getBranchVal.one + "&fq=dy_create_id:" + $scope.getEmpName.one + "&fq=country:" + $scope.getCtryName.one + "&";
                    mainFacet = "country";
                    // $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
                    if(moment($scope.getToDt).toDate().getHours() >0){
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).subtract(1,'days').format('DD/MM/YYYY');                        
                    }else{
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).format('DD/MM/YYYY');                        
                    }
                    branchQry = "country";
                    ubranch = 'ubranch: "unique(doc_no)"';
                    offsetVal = 'offset:' + $scope.branchOffset + ',';
                    groupBy = "&&group=true&group.field=doc_no";
                    gap = "%2B1DAY";
                } else {
                    count += 1;
                    //alert(count);
                    if (count == 2) {
                        $scope.branchOffset = 0;
                        $scope.pageCount = 1;
                        $("#bPreviousBtn").prop('disabled', true);
                        $("#bNextBtn").prop('disabled', false);
                    }
                    triggerOpt = "branch:" + $scope.ele1;
                    triggerOptRow = "rows=2&fq=branch:" + $scope.ele1 + "&";
                    groupBy, offsetVal = "";
                    gap = "%2B1DAY";
                    // $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
                    if(moment($scope.getToDt).toDate().getHours() >0){
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).subtract(1,'days').format('DD/MM/YYYY');                        
                    }else{
                        $scope.subtitle = moment($scope.getFromDt).format('DD/MM/YYYY') + " - " + moment($scope.getToDt).format('DD/MM/YYYY');                        
                    }

                    branchQry = 'dy_create_id';
                    ubranch = 'ubranch: "unique(' + branchQry + ')"';
                }

                var query_spark = '{query: "' + triggerOpt + '",filter : "xit_date : [' +  moment(startDt).format('YYYY-MM-DD') + 'T00:00:00Z' + ' TO ' + moment(endDt).format('YYYY-MM-DD') + 'T23:59:59Z' + ']", limit: ' + limitValue + ',' + offsetVal +
                        'facet: {' + ubranch + ',  in_outs: {type: terms,limit: ' + limitValue + ',field: dy_action_ind,' +
                        'facet: {exits: {type: range,field: xit_date,start: "' + moment(startDt).format('YYYY-MM-DD') + 'T00:00:00Z' + '",end: "' + moment(endDt).format('YYYY-MM-DD') + 'T23:59:59Z' + '",gap: "' + gap + '"},passport: "unique(doc_no)"}},' +
                        mainFacet + ': {type: terms,limit: ' + limitValue + ',  offset:' + $scope.branchOffset + ', field: ' + branchQry + ', sort:{count:' + sortValue + '},facet: {in_out: {type: terms,limit: 15,field: dy_action_ind,' +
                        'facet: {exits: {type: range,field: xit_date,start: "' + moment(startDt).format('YYYY-MM-DD') + 'T00:00:00Z' + '",end: "' + moment(endDt).format('YYYY-MM-DD') + 'T23:59:59Z' + '",gap: "' + gap + '"},passport: "unique(doc_no)"}}' +
                        '}}}}}' + groupBy;


                var sq_spark = "http://" + solrHost + ":8983/solr/" + immigrationSolr + "/query?json="; //jsonQ;

                    //$scope.loading = true;
                $http.get(sq_spark + query_spark)
                    .success(function(data) {
                        if (($scope.totalCount - $scope.branchOffset) < 15) {
                            $("#bNextBtn").prop('disabled', true);
                        } else {
                            $("#bNextBtn").prop('disabled', false);
                        }
                        /* NEED TO CHECK AND UNCOMMENT IN PRODUCTION*/
                        
                
                    if(data.facets.count>0){  
                        // $scope.DataBlock = true;
                        var chk1 = data.facets.in_outs.buckets[0].val;
                        console.log(data);
                        
                        if(chk1){

                            if(chk1 == 'in'){
                                $scope.totalEntry = data.facets.in_outs.buckets[0].count;
                            }else{
                                if(data.facets.in_outs.buckets[1]){
                                    $scope.totalEntry = data.facets.in_outs.buckets[1].count;
                                }else{
                                    $scope.totalExit = data.facets.in_outs.buckets[0].count;
                                    $scope.totalEntry = 0;
                                }
                            }
                        }
                        if(data.facets.in_outs.buckets[1]){
                            var chk2 = data.facets.in_outs.buckets[1].val;
                            if(chk2){
                                if(chk2 == 'out'){
                                    $scope.totalExit = data.facets.in_outs.buckets[1].count;
                                }else{
                                
                                    $scope.totalExit = data.facets.in_outs.buckets[0].count;
                                }
                            }
                        }else{
                            if(chk1 == 'in'){
                                $scope.totalExit = 0;
                            }else{
                                $scope.totalEntry = 0;
                            }
                            
                        }
                        
                        // $scope.pageCount = 1;
                        // $scope.totalCount = data.facets.ubranch;
                        // $scope.numofpage = Math.ceil($scope.totalCount / limitValue);
                        // $("#bNextBtn").prop('disabled', false);
                    }else{
                        $scope.DataBlock = false;
                        // $scope.totalCount = 0;
                        // $scope.totalExit = 0;
                        // $scope.totalEntry = 0;
                        // $scope.pageCount = 0;
                        // $scope.numofpage = 0;
                        // $("#bNextBtn").prop('disabled', true);
                        // $("#bPreviousBtn").prop('disabled', true);

                        // $scope.subtitle
                    }
                                                    
                        //end
                
                        $scope.totalCount = data.facets.ubranch;
                        $scope.numofpage = Math.ceil($scope.totalCount / limitValue);

                        console.log(data);
                        //$scope.totalInOut.push(data.facets.in_outs.buckets);

                        var storeBranchData = [];

                        if ($scope.ele2 == "Country") {
                            if (data.facets.count == 0) {
                                //if empty
                            } else {
                                for (var i = 0, l = data.facets.country.buckets.length; i < l; i++) {
                                    var bElement = {};
                                    var brName = {};
                                    var bName = data.facets.country.buckets[i].val;
                                    brName.name = bName;
                                    bElement.brhName = brName;
                                    for (var k = 0, m = data.facets.country.buckets[i].in_out.buckets.length; k < m; k++) {


                                        $scope.bIn_out = data.facets.country.buckets[i].in_out.buckets[k].val;
                                        $scope.uniqueVisitors = data.facets.country.buckets[i].in_out.buckets[k].passport;
                                        var brStatus = {};
                                        var countEle = [];

                                        for (var j = 0, n = data.facets.country.buckets[i].in_out.buckets[k].exits.buckets.length; j < n; j++) {
                                            var bDate = data.facets.country.buckets[i].in_out.buckets[k].exits.buckets[j].val;
                                            var bCount = data.facets.country.buckets[i].in_out.buckets[k].exits.buckets[j].count;
                                            countEle.push(bCount);
                                        }
                                        //bElement.push(brStatus);

                                        if ($scope.bIn_out == "in") {
                                            $scope.bIn_out = "Entry";
                                            var entryTotal = eval(countEle.join("+"));
                                            brStatus.entry = countEle.toString().replace(/,/g, ", ");
                                            brStatus.uniqueVisitor = $scope.uniqueVisitors;
                                            brStatus.entryTotal = entryTotal;
                                            bElement.entry = brStatus;
                                        } else if ($scope.bIn_out == "out") {
                                            $scope.bIn_out = "Exit";
                                            var exitTotal = eval(countEle.join("+"));
                                            brStatus.exit = countEle.toString().replace(/,/g, ", ");
                                            brStatus.uniqueVisitor = $scope.uniqueVisitors;
                                            brStatus.exitTotal = exitTotal;
                                            bElement.exit = brStatus;
                                        }
                                    }


                                    var total = eval(countEle.join("+"));

                                    var getTotal = {};
                                    getTotal.total = total;


                                    countEle = countEle.join(", ");

                                    var getCount = {};
                                    getCount.count = countEle;

                                    //bElement.push(getCount);
                                    //bElement.push(getTotal);

                                    storeBranchData.push(bElement);




                                };
                            }


                            $scope.branchOut = storeBranchData;
                            console.log(storeBranchData);
                        } else if ($scope.ele2 == "Visitor") {

                            for (var im = 0, lm = data.grouped.doc_no.groups.length; im < lm; im++) {
                                var bElement = {};
                                var brName = {};
                                var bNumFound = data.grouped.doc_no.groups[im].doclist.numFound;
                                var bName = data.grouped.doc_no.groups[im].doclist.docs[0].name;
                                var bAction = data.grouped.doc_no.groups[im].doclist.docs[0].dy_action_ind;
                                var bDoc = data.grouped.doc_no.groups[im].doclist.docs[0].doc_no;
                                var bSex = data.grouped.doc_no.groups[im].doclist.docs[0].sex;
                                var bDob = data.grouped.doc_no.groups[im].doclist.docs[0].dy_birth_date;

                                brName.name = bName;
                                brName.doc = bDoc;
                                brName.sex = bSex;
                                brName.dob = bDob;
                                brName.numFound = bNumFound;
                                if (bAction == "in") {
                                    brName.entry = bAction;
                                } else {
                                    brName.exit = bAction;
                                }



                                bElement.vName = brName;
                                storeBranchData.push(bElement);


                            };
                            $scope.branchOut = storeBranchData;
                            console.log(storeBranchData);
                        } else {
                            if (data.facets.count == 0) {
                                //if empty
                            } else {
                                for (var i = 0, l = data.facets.branches.buckets.length; i < l; i++) {
                                    var bElement = {};
                                    var brName = {};
                                    //var bName = data.facets.branches.buckets[i].val;
                                    var bName = data.response.docs[i].name;
                                    var docNo = data.response.docs[i].doc_nos;
                                    var countryDet = data.response.docs[i].country;
                                    var sex = data.response.docs[i].sex;
                                    brName.name = bName;
                                    brName.docno = docNo;
                                    brName.country = countryDet;
                                    brName.sex = sex;
                                    bElement.brhName = brName;

                                    for (var k = 0, m = data.facets.branches.buckets[i].in_out.buckets.length; k < m; k++) {


                                        $scope.bIn_out = data.facets.branches.buckets[i].in_out.buckets[k].val;
                                        $scope.uniqueVisitors = data.facets.branches.buckets[i].in_out.buckets[k].passport;
                                        var brStatus = {};

                                        var countEle = [];
                                        for (var j = 0, n = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets.length; j < n; j++) {

                                            var bDate = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets[j].val;
                                            var bCount = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets[j].count;
                                            countEle.push(bCount);

                                        }
                                        //brStatus.status = bIn_out;


                                        if ($scope.bIn_out == "in") {
                                            $scope.bIn_out = "Entry";
                                            var entryTotal = eval(countEle.join("+"));
                                            brStatus.entry = countEle.toString().replace(/,/g, ", ");
                                            brStatus.uniqueVisitor = $scope.uniqueVisitors;
                                            brStatus.entryTotal = entryTotal;
                                            bElement.entry = brStatus;
                                        } else if ($scope.bIn_out == "out") {
                                            $scope.bIn_out = "Exit";
                                            var exitTotal = eval(countEle.join("+"));
                                            brStatus.exit = countEle.toString().replace(/,/g, ", ");
                                            brStatus.uniqueVisitor = $scope.uniqueVisitors;
                                            brStatus.exitTotal = exitTotal;
                                            bElement.exit = brStatus;
                                        }
                                    }

                                    var total = eval(countEle.join("+"));

                                    var getTotal = {};

                                    getTotal.total = total;

                                    countEle = countEle.join(", ");

                                    var getCount = {};
                                    getCount.count = countEle;



                                    //bElement.push(getCount);
                                    //bElement.push(getTotal);

                                    storeBranchData.push(bElement);
                                };
                            }

                            $scope.branchOut = storeBranchData;
                            if(storeBranchData.length > 0){
                                $(".highcharts-container").show();
                            }else{
                                $(".highcharts-container").hide();
                            }
                            console.log(storeBranchData);
                        }
                    })
                    .catch(function(err) {
                        return false;
                    })
                    .finally(function() {
                    });
                $.each(valu, function(m, k) {
                    //On load
                    //alert(count+ " sec");
                    //alert($scope.ele2);

                    
                    console.log(startDt+" "+ endDt);
                    //debugger;

                    var query = 'q=dy_action_ind:' + k.name + '&fq=xit_date:['+moment(startDt).format('YYYY-MM-DD') + 'T00:00:00Z'+' TO '+ moment(endDt).format('YYYY-MM-DD') + 'T23:59:59Z' +']&' +
                     triggerOptRow + 'json.facet={in_outs:{type : range,field : xit_date,start : "' + moment(startDt).format('YYYY-MM-DD') + 'T00:00:00Z' +
                      '",end :"' + moment(endDt).format('YYYY-MM-DD') + 'T23:59:59Z' + '",gap:"' + gap + '"},passport: "unique(doc_no)"}' // "q=-mad_crt_dt%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(mad_crt_dt)\",\"max_date\":\"max(mad_crt_dt)\"}}"

                    

                    var sq = "http://" + solrHost + ":8983/solr/" + immigrationSolr + "/query?";
                    $http.get(sq + query).
                    success(function(data) {
                            console.log(data);
                            //alert('call-2');
                            //alert(startDt);
                            var storeData = [];
                            if (data.facets.count == 0) {
                                //console.log(data.facets.count.length);
                            } else {
                                $scope.branchCode = data.response.docs[0].branch_code;    
                                for (var i = 0, l = data.facets.in_outs.buckets.length; i < l; i++) {
                                    var obj = data.facets.in_outs.buckets[i];
                                    var element = [];
                                    element.push(new Date(obj.val).getTime());
                                    element.push(obj.count);
                                    storeData.push(element);
                                }                                
                            }

                            $scope.seriesOptions[m] = {
                                name: k.title,
                                color: k.color,
                                data: storeData,
                                type: 'areaspline',
                                threshold: null
                            };
                            
                            $scope.totalInOut.push(data.response.numFound);

                            // As we're loading the data asynchronously, we don't know what order it will arrive. So
                            // we keep a counter and create the chart when all the data is loaded.
                            $scope.seriesCounter += 1;

                            if ($scope.seriesCounter === $scope.seriesDet.series.length) {
                                $scope.createChart();
                            }
                        })
                        .catch(function(err) {
                        }).finally(function() {
                            //$scope.loading = false;
                        });

                    
                });
            });
        };


        localStorage.stage = "Branch";
        console.log($scope.getCurrentStage.length);
        if($scope.getCurrentStage.length == 0){
            //localStorage.removeItem('branchName'); // each time removing the branch and Emp name
            $scope.timelineChart("Inital", localStorage.stage);
        }else if($scope.getCurrentStage[0] == "Officer"){
            $scope.timelineChart($.parseJSON(localStorage.getItem('branchName')).one, "Officer");
            localStorage.stage = "Officer";
           
        }else if($scope.getCurrentStage[0] == "Visitor"){
            $scope.timelineChart($.parseJSON(localStorage.getItem('ctryName')).one, "Visitor");
            localStorage.stage = "Visitor";
        }else if($scope.getCurrentStage[0] == "Branch"){
            //localStorage.removeItem('branchName'); // each time removing the branch and Emp name
            $scope.timelineChart("Inital", localStorage.stage);
             localStorage.stage = "Branch";
        }
        
       

        $scope.cleanQuery = function(data) {
            data = data.replace(/\(/g, "\\\(");
            data = data.replace(/\)/g, "\\\)");
            data = data.replace(/ /g, "?");
            return (data);
        };



        $scope.backBtn = function(e) {
            count = 0;
            /*
                    alert($scope.totalCount - $scope.branchOffset);
                    
                    if(($scope.totalCount - $scope.branchOffset) < 15){
                      $("#bNextBtn").prop('disabled', true);
                    }else{
                      $("#bNextBtn").prop('disabled', false);
                    }*/

            var branchN = this.$parent.ele2;
            if (branchN == "Officer") {
                $scope.timelineChart("Inital", "Branch");
                localStorage.stage = "Branch";
                localStorage.removeItem('branchName');
                $scope.BranchName = false;
                $scope.EmpName = false;
                $scope.CtryName = false;
            }

            if (branchN == "Country") {
                $scope.timelineChart($scope.getBranchVal.one, "Officer");
                //$scope.timelineChart($scope.getBranchVal.one, "Officer");
                localStorage.stage = "Officer";
                localStorage.removeItem('empName');
                $scope.EmpName = false;
                $scope.CtryName = false;

            }

            if (branchN == "Visitor") {
                $scope.timelineChart($scope.getCtryName.one, "Country");
                localStorage.stage = "Country";
                localStorage.removeItem('ctryName');
                $scope.CtryName = false;
            }
        };



        $scope.submitDate = function(e) {

            console.log(this.$parent.ele1, this.$parent.ele2);

            $scope.timelineChart(this.$parent.ele1, this.$parent.ele2);

            //$scope.populateChart();
            $scope.createChart();
        }

        $scope.viewBtn = function(e) {

            var getStage = localStorage.stage;
            var branchN = this.$parent.$$watchers[0].last;
            var EmpN = this.$parent.$$watchers[0].last;
            var countryN = this.$parent.$$watchers[0].last;
            var visitorN = this.$parent.$$watchers[0].last;

            branchN = $scope.cleanQuery(branchN);
            EmpN = $scope.cleanQuery(EmpN);
            countryN = $scope.cleanQuery(countryN);
            visitorN = $scope.cleanQuery(visitorN);
            count = 0;
            var setBranch = { 'one': branchN, 'two': this.$parent.$$watchers[0].last };
            var setEmp = { 'one': EmpN, 'two': this.$parent.$$watchers[0].last };
            var setCountry = { 'one': countryN, 'two': this.$parent.$$watchers[0].last };
            var setVisitor = { 'one': visitorN, 'two': this.$parent.$$watchers[0].last };
            if (getStage == "Branch1") {
                localStorage.setItem('branchName', JSON.stringify(setBranch));
                localStorage.stage = "Officer";
            }

            if (getStage == "Officer") {
                localStorage.setItem('empName', JSON.stringify(setEmp));
                localStorage.stage = "Country";
            }

            if (getStage == "Country") {
                localStorage.setItem('ctryName', JSON.stringify(setCountry));
                localStorage.stage = "Visitor";
            }

            if (getStage == "Branch") {
                //location.href="/travelertracker/travelertracker.html?doc_no="+passportNo+"&country="+countryName;
         
                window.location = "#/travelertracker/travelertracker.html?session=true&page=visitor";    
                sessionStorage.setItem('Qparam','doc_nos:'+ this.$parent.value.brhName.docno +' AND country:'+ this.$parent.value.brhName.country);
                
                // sessionStorage.setItem('hourlyDocNo', this.$parent.value.vName.doc);
                // sessionStorage.setItem('hourlyCountry', $scope.CtryQueryName);
                // location.href = "index.html#/travelertracker/travelertracker.html?doc_no=" + this.$parent.value.vName.doc + "&country=" + $scope.CtryQueryName;
                return false;
            }

            $scope.timelineChart(branchN, localStorage.stage);
            //debugger;
            //alert(getStage);
        };

$('#myModal').on('shown.bs.modal',function(){      //correct here use 'shown.bs.modal' event which comes in bootstrap3
  $(this).find('iframe').attr('src','http://www.google.com')
});
$('#OpenModal').click(function(){
    var frameSrc = 'index.html#/employeeHourlyDetails/employeeHourlyDetails.html?session=true';
    $('#myModal').on('show', function () {

        $('iframe').attr("src",frameSrc);
      
	});
    $('#myModal').modal({show:true})
});

        $scope.hourlyLoader = function(){
            var currentSelectDate = this.$parent.$parent.subtitle;
            var currBranchName = this.$parent.$parent.getBranchVal.one;
            var currEmpName = this.$parent.value.brhName.name;
            localStorage.setItem('hourlyBranchName', currBranchName);
            localStorage.setItem('hourlyEmplyName', currEmpName);
            localStorage.setItem('hourlycurrDate', currentSelectDate);
            localStorage.setItem('hourlybranchCode', $scope.branchCode);
            // location.href = "index.html#/employeeHourlyDetails/employeeHourlyDetails.html?session=true";
            $("#hourlyLoader").load('index.html#/employeeHourlyDetails/employeeHourlyDetails.html?session=true');
            $('#myModal').modal("show");
        };

        $scope.detBtn = function(e) {

            var currentSelectDate = this.$parent.$parent.subtitle;
            var currBranchName = this.$parent.$parent.getBranchVal.one;
            var currEmpName = this.$parent.value.brhName.name;
            sessionStorage.setItem('hourlyBranchName', currBranchName);
            sessionStorage.setItem('hourlyEmplyName', currEmpName);
            sessionStorage.setItem('hourlycurrDate', currentSelectDate);
            sessionStorage.setItem('hourlybranchCode', $scope.branchCode);
            location.href = "index.html#/employeeHourlyDetails/employeeHourlyDetails.html?session=true";
        };

 });
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageSidebarClosed = true;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("visitorTracking");

});
