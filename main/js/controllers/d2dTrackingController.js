'use strict';

MetronicApp.controller('d2dTrackingController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        Metronic.initAjax();
        $scope.drawSparkline = 0;

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

        $('#datetimeFrom').datetimepicker({ format: 'DD/MM/YYYY', defaultDate: '"' + tmonth + '"/"' + tDate + '"/"' + tyear + '"' });
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



        var startDt, endDt, triggerOpt, triggerOptRow, branchQry, ubranch, mainFacet, offsetVal, triggerBt, groupBy, gap, count, sortValue, $widget; // Global variable
        var immigrationSolr = "hismove";
        localStorage.removeItem('branchName'); // each time removing the branch and Emp name
        localStorage.removeItem('empName');
        localStorage.removeItem('ctryName');
        localStorage.removeItem('countyName');

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

            if ($scope.ele2 == "Branch") {

                $scope.column2 = "No. of Exit / Visitor(s)";
                $scope.column3 = "Exit Trend";
                $scope.column4 = "No. of Entry / Visitor(s)";
                $scope.column5 = " Entry Trend";
            }

            if ($scope.ele2 == "Officer") {
                $scope.BranchName = $scope.getBranchVal.two;
                $scope.column2 = "No. of Exit / Visitor(s)";
                $scope.column3 = "Exit Trend";
                $scope.column4 = "No. of Entry / Visitor(s)";
                $scope.column5 = " Entry Trend";
            }
            if ($scope.ele2 == "Country") {
                $scope.EmpName = $scope.getEmpName.two;
                $scope.column2 = "No. of Exit / Visitor(s)";
                $scope.column3 = "Exit Trend";
                $scope.column4 = "No. of Entry / Visitor(s)";
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
                    { "name": "in", "title": "Entry", "color": "#B7D8F5" },
                    { "name": "out", "title": "Exit", "color": "#F5B7BC" }
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

                if ($scope.ele1 == "Inital") {
                    triggerOpt = "*:*";
                    mainFacet = "branches";
                    branchQry = 'branch';
                    groupBy = "";
                    gap = "%2B1DAY";
                } else if ($scope.ele2 == "Officer") {
                    triggerOpt = "branch:" + $scope.getBranchVal.one;
                    mainFacet = "branches";
                    branchQry = "dy_create_id";
                    groupBy = "";
                    gap = "%2B1DAY";
                } else if ($scope.ele2 == "Country") {
                    triggerOpt = "branch:" + $scope.getBranchVal.one + " AND  dy_create_id:" + $scope.getEmpName.one;
                    mainFacet = "country";
                    branchQry = "country";
                    groupBy = "";
                    gap = "%2B1DAY";
                } else if ($scope.ele2 == "Visitor") {
                    triggerOpt = "branch:" + $scope.getBranchVal.one + " AND  dy_create_id:" + $scope.getEmpName.one + " AND country:" + $scope.getCtryName.one;
                    mainFacet = "country";
                    branchQry = "country";
                    groupBy = "&&group=true&group.field=doc_no";
                    gap = "%2B1DAY";
                } else {
                    triggerOpt = "branch:" + $scope.ele1;
                    //branchQry = ',facet:{branch:{type : terms,limit : 5,field: dy_create_id,facet : {exits:{ type : range,field : xit_date,start :"'+startDt+'",end: "'+endDt+'",gap:"%2B1DAY"}}}}';
                    mainFacet = "branches";
                    branchQry = 'dy_create_id';
                    groupBy = "";
                    gap = "%2B1DAY";
                }

                var query_c = '{query: "' + triggerOpt + '",filter : "xit_date : [' + startDt + ' TO ' + dateFormat(Math.round(e.max)) + ']",limit: 15,' +
                    'facet: {in_outs: {type: terms,limit: 15,field: dy_action_ind,' +
                    'facet: {exits: {type: range,field: xit_date,start: "' + startDt + '",end: "' + dateFormat(Math.round(e.max)) + '",gap: "' + gap + '"},passport: "unique(doc_no)"}},' +
                    mainFacet + ': {type: terms,limit: 15,field:' + branchQry + ',facet: {in_out: {type: terms,limit: 15,field: dy_action_ind,  sort:{index:asc},' +
                    'facet: {exits: {type: range,field: xit_date,start: "' + startDt + '",end: "' + dateFormat(Math.round(e.max)) + '",gap: "' + gap + '"},passport: "unique(doc_no)"}}' +
                    '}}}}}' + groupBy;



                var sq_b = "http://" + solrHost + ":8983/solr/" + immigrationSolr + "/query?json="; //jsonQ;
                $http.get(sq_b + query_c).success(function(data) {
                        //alert('call-1');

                        var storeBranchData = [];
                        //debugger;
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
                            //debugger;
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
                                    var bName = data.facets.branches.buckets[i].val;
                                    brName.name = bName;
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
                        }
                    })
                    .catch(function(err) {

                    })
                    .finally(function() {
                        $scope.loading = false;
                    });



                $.each($scope.seriesDet, function(j, valu) {

                    $.each(valu, function(m, k) {
                        //On load

                        if ($scope.ele2 == "Branch") {
                            triggerOptRow = "rows=2&";
                            gap = "%2B1DAY";
                        } else if ($scope.ele2 == "Officer") {
                            triggerOptRow = "rows=2&fq=branch:" + $scope.getBranchVal.one + "&";
                            gap = "%2B1DAY";
                        } else if ($scope.ele2 == "Country") {
                            triggerOptRow = "rows=2&fq=branch:" + $scope.getBranchVal.one + "&fq=dy_create_id:" + $scope.getEmpName.one + "&";
                            gap = "%2B1DAY";
                        } else if ($scope.ele2 == "Visitor") {
                            triggerOptRow = "rows=2&fq=branch:" + $scope.getBranchVal.one + "&fq=dy_create_id:" + $scope.getEmpName.one + "&fq=country:" + $scope.getCtryName.one + "&";
                            gap = "%2B1DAY";
                        } else {
                            triggerOptRow = "rows=2&fq=branch:" + $scope.getBranchVal.one + "&";
                            gap = "%2B1DAY";
                        }

                        var query = 'q=dy_action_ind:' + k.name + '&' + triggerOptRow + 'json.facet={in_outs:{type : range,field : xit_date,start :"' + startDt + '",end :"' + dateFormat(Math.round(e.max)) + '",gap:"' + gap + '"},passport: "unique(doc_no)"}'
                        var sq = "http://" + solrHost + ":8983/solr/" + immigrationSolr + "/query?"
                        $http.get(sq + query).
                        success(function(data) {
                                console.log(data);
                                var storeData = [];

                                if (data.facets.count == 0) {
                                    //console.log(data.facets.count.length);
                                } else {
                                    for (var i = 0, l = data.facets.in_outs.buckets.length; i < l; i++) {
                                        var obj = data.facets.in_outs.buckets[i];
                                        var element = [];
                                        element.push(new Date(obj.val).getTime());
                                        element.push(obj.count);
                                        storeData.push(element);
                                    }
                                }

                                chart.hideLoading();
                                // As we're loading the data asynchronously, we don't know what order it will arrive. So
                                // we keep a counter and create the chart when all the data is loaded.
                                $scope.seriesCounter += 1;

                                if ($scope.seriesCounter === $scope.seriesDet.series.length) {
                                    $scope.createChart();
                                }

                            })
                            .catch(function(err) {

                            })
                            .finally(function() {
                                //$scope.loading = false;
                            });
                    });
                });

            };

            /**
             * Create the chart when all data is loaded
             * @returns {undefined}
             */
            $scope.createChart = function() {

                $('#container').highcharts('StockChart', {

                    rangeSelector: {
                        selected: 5,
                        inputEnabled: false
                            //inputDateFormat: '%d-%m-%Y',
                            //inputEditDateFormat: '%d-%m-%Y'
                            //inputDateFormat: '%Y-%m-%d'
                    },

                    chart: {
                        events: {
                            load: function(event) {
                                console.log(event.target);

                                /*if (event.target) {
                                  alert(event);
                                    var range = "[ "+ Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].min) +" TO "+ Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].max)+" ]";
                                    var display = "[ "+ Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].min) +" TO "+ Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].max)+" ]";
                                    $scope.time_filtered_max = Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].max);
                                    $scope.time_filtered_min = Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].min);
                                        $scope.addFilter("tim","Time :"+display,"created:"+range);
                                        $scope.querySolr();
                                } else {
                                    alert('Selection reset');
                                    $scope.time_filtered_max = "";
                                    $scope.time_filtered_min = "";
                                    $scope.updateFilter("tim",true);
                                }*/
                            }
                        }

                    },

                    navigator: {
                        enabled: true
                    },

                    xAxis: {
                        events: {
                            afterSetExtremes: afterSetExtremes
                        },
                        minRange: 3600 * 1000 // one hour
                    },


                    plotOptions: {

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
        $scope.branchOffset = 0;
        $scope.pageCount = 1;
        if ($scope.branchOffset == 0 || $scope.pageCount == 1) {
            $("#bPreviousBtn").prop('disabled', true);
        } else {
            $("#bPreviousBtn").prop('disabled', false);
        }


        sortValue = "desc";

        $(".sortBtn1").toggle(function() {
            sortValue = "asc";
            $scope.populateChart();

        }, function() {
            sortValue = "desc";
            $scope.populateChart();
        });
        $(".sortBtn2").toggle(function() {
            sortValue = "asc";
            $scope.populateChart();

        }, function() {
            sortValue = "desc";
            $scope.populateChart();
        });
        $(".sortBtn3").toggle(function() {
            sortValue = "asc";
            $scope.populateChart();

        }, function() {
            sortValue = "desc";
            $scope.populateChart();
        });

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


            $scope.loading = true;
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

            //alert(count + " first");
            $.each($scope.seriesDet, function(j, valu) {

                $.each(valu, function(m, k) {
                    //On load
                    //alert(count+ " sec");
                    //alert($scope.ele2);

                    if ($scope.ele1 == "Inital") {
                        count = 0;
                        triggerOpt = "*:*";
                        mainFacet = "branches";
                        triggerOptRow = "rows=2&";
                        groupBy, offsetVal = "";
                        $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
                        branchQry = 'branch';
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
                        $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
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
                        $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
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
                        $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
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
                        $scope.subtitle = $('#datetimeFrom').data('date') + " - " + $('#datetimeTo').data('date');
                        branchQry = 'dy_create_id';
                        ubranch = 'ubranch: "unique(' + branchQry + ')"';


                    }

                    var query = 'q=dy_action_ind:' + k.name + '&' + triggerOptRow + 'json.facet={in_outs:{type : range,field : xit_date,start : "' + startDt + '",end :"' + endDt + '",gap:"' + gap + '"},passport: "unique(doc_no)"}' // "q=-mad_crt_dt%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(mad_crt_dt)\",\"max_date\":\"max(mad_crt_dt)\"}}"

                    var query_spark = '{query: "' + triggerOpt + '",filter : "xit_date : [' + startDt + ' TO ' + endDt + ']", limit: ' + limitValue + ',' + offsetVal +
                        'facet: {' + ubranch + ',  in_outs: {type: terms,limit: ' + limitValue + ',field: dy_action_ind,' +
                        'facet: {exits: {type: range,field: xit_date,start: "' + startDt + '",end: "' + endDt + '",gap: "' + gap + '"},passport: "unique(doc_no)"}},' +
                        mainFacet + ': {type: terms,limit: ' + limitValue + ',  offset:' + $scope.branchOffset + ', field: ' + branchQry + ', sort:{count:' + sortValue + '},facet: {in_out: {type: terms,limit: 15,field: dy_action_ind,' +
                        'facet: {exits: {type: range,field: xit_date,start: "' + startDt + '",end: "' + endDt + '",gap: "' + gap + '"},passport: "unique(doc_no)"}}' +
                        '}}}}}' + groupBy;


                    var sq_spark = "http://" + solrHost + ":8983/solr/" + immigrationSolr + "/query?json="; //jsonQ;

                    var sq = "http://" + solrHost + ":8983/solr/" + immigrationSolr + "/query?"
                    $http.get(sq + query).
                    success(function(data) {
                            console.log(data);
                            //alert('call-2');
                            //alert(startDt);
                            var storeData = [];
                            if (data.facets.count == 0) {
                                //console.log(data.facets.count.length);
                            } else {
                                for (var i = 0, l = data.facets.in_outs.buckets.length; i < l; i++) {
                                    var obj = data.facets.in_outs.buckets[i];
                                    var element = [];
                                    element.push(new Date(obj.val).getTime());
                                    element.push(obj.count);
                                    storeData.push(element);
                                }
                            }
                            /*for (var i = 0, l = data.facets.in_outs.buckets.length; i < l; i++) {
                    var obj = data.facets.in_outs.buckets[i];
                    var element = [];
                    element.push(new Date(obj.val).getTime());
                    element.push(obj.count);
                    storeData.push(element);
                  }  
               */



                            //console.log(storeData);


                            $scope.seriesOptions[m] = {
                                name: k.title,
                                color: k.color,
                                data: storeData,
                                type: 'areaspline',
                                threshold: null
                            };



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

                    //$scope.loading = true;
                    $http.get(sq_spark + query_spark)
                        .success(function(data) {
                            // debugger;

                            if (($scope.totalCount - $scope.branchOffset) < 15) {
                                $("#bNextBtn").prop('disabled', true);
                            } else {
                                $("#bNextBtn").prop('disabled', false);
                            }


                            $scope.totalCount = data.facets.ubranch;
                            $scope.numofpage = Math.ceil($scope.totalCount / limitValue);
                            /*if(limitValue > $scope.totalCount){
                              $("#bNextBtn").prop('disabled', true);
                            }
                            */
                            console.log(data);
                            //$scope.branchData = data.facets.branches.buckets;
                            //$scope.branchId = data.facets.branches.buckets;
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
                                        var bName = data.facets.branches.buckets[i].val;
                                        brName.name = bName;
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
                                console.log(storeBranchData);
                            }



                        })
                        .catch(function(err) {

                        })
                        .finally(function() {
                            $scope.loading = false;
                        });
                });
            });
        };


        localStorage.stage = "Branch";

        $scope.timelineChart("Inital", localStorage.stage);

        $scope.cleanQuery = function(data) {
            data = data.replace(/\(/g, "\\\(");
            data = data.replace(/\)/g, "\\\)");
            data = data.replace(/ /g, "*");
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
                $scope.EmpName = false;
                $scope.CtryName = false;

            }

            if (branchN == "Visitor") {
                $scope.timelineChart($scope.getCtryName.one, "Country");
                localStorage.stage = "Country";
                $scope.CtryName = false;
            }
        };



        $scope.submitDate = function(e) {


            $scope.timelineChart(this.$parent.ele1, this.$parent.ele2);

            $scope.populateChart();
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

            if (getStage == "Branch") {
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

            if (getStage == "Visitor") {
                //location.href="/travelertracker/travelertracker.html?doc_no="+passportNo+"&country="+countryName;
                location.href = "index.html#/travelertracker/travelertracker.html?doc_no=" + this.$parent.value.vName.doc + "&country=" + $scope.CtryQueryName;
                return false;
            }

            $scope.timelineChart(branchN, localStorage.stage);
            //debugger;
            //alert(getStage);
        };


        $scope.detBtn = function(e) {

            var currentSelectDate = this.$parent.$parent.subtitle;
            var currBranchName = this.$parent.$parent.getBranchVal.one;
            var currEmpName = this.$parent.value.brhName.name;
           location.href = "index.html#/employeeHourlyDetails/employeeHourlyDetails.html?branch_name="+currBranchName+"&emp_name="+currEmpName+"&currDate="+currentSelectDate;
        };
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("tracking");
});
