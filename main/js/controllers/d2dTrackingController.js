'use strict';

MetronicApp.controller('d2dTrackingController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            Metronic.initAjax();
            $scope.timelineChart = function() {

                // console.log(data);

                var seriesOptions = [],
                    seriesCounter = 0,
                    names = ['1', '2'];

                var seriesDet = {
                    "series": [
                        { "name": "1", "title": "Exit", "color": "#B7D8F5" },
                        { "name": "2", "title": "Entry", "color": "#F5B7BC" }
                    ]
                };



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
                    //console.log(e);
                    var chart = $('#container').highcharts();
                    chart.showLoading('Loading data from server...');


                    var dateFormat = function(ele) {
                        var myDate = new Date(ele);

                        var yyyy = myDate.getFullYear().toString();

                        var mm = (myDate.getMonth() + 1).toString(); // getMonth() is zero-based
                        var dd = myDate.getDate().toString();
                        // console.log(yyyy+"-" + (mm[1]?mm:"0"+mm[0])+"-" + (dd[1]?dd:"0"+dd[0])+"T00:00:00Z");
                        return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]) + "T00:00:00Z"; // padding

                    };


                    var query_c = '{query: "*:*",limit: 0,'+
                        'facet: {in_outs: {type: terms,limit: 10,field: dy_action_ind,'+
                        'facet: {exits: {type: range,field: xit_date,start: " ' + dateFormat(Math.round(e.min)) + '",end: "' + dateFormat(Math.round(e.max)) + '",gap: "%2B1DAY"}}},'+
                        'branches: {type: terms,limit: 15,field: branch,facet: {in_out: {type: terms,limit: 2,field: dy_action_ind,'+
                        'facet: {exits: {type: range,field: xit_date,start: " ' + dateFormat(Math.round(e.min)) + '",end: "' + dateFormat(Math.round(e.max)) + '",gap: "%2B1DAY"}}}'+
                        '}}}}}';


                var query_b = 'q=dy_action_ind:1&rows=1&json.facet={in_outs:{type : range,field : xit_date,start :"' + dateFormat(Math.round(e.min)) + '",end :"' + dateFormat(Math.round(e.max)) + '",gap:"%2B1DAY"}}' // "q=-mad_crt_dt%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(mad_crt_dt)\",\"max_date\":\"max(mad_crt_dt)\"}}"
                var sq_b = "http://" + solrHost + ":8983/solr/his/query?json="
                $http.get(sq_b + query_c).success(function(data) {
                    console.log(data.facets.branches.buckets);
                    $scope.branchData = data.facets.branches.buckets;
                    //$scope.branchEntry = data.facets.branches.buckets.in_out.buckets[0].exits.buckets[0].count;
                   $scope.branchId = data.facets.branches.buckets;
                    var storeBranchData = [];
                    for (var i = 0, l = data.facets.branches.buckets.length; i < l; i++) {
                            /*var obj = data.facets.in_outs.buckets[i];
                            var element = [];
                            element.push(new Date(obj.val).getTime());
                            element.push(obj.count);
                            storeData.push(element);*/
                          for (var k = 0, m = data.facets.branches.buckets[i].in_out.buckets.length; k < m; k++) {
                  
                            /*var bObj = data.facets.branches.buckets[i].in_out.buckets[k].count;
                            var bElement = [];
                            bElement.push(bObj);
                            storeBranchData.push(bElement);*/
                              var bName = data.facets.branches.buckets[i].val;
                              var bIn_out = data.facets.branches.buckets[i].in_out.buckets[k].val;
                              if(bIn_out == "1"){
                                bIn_out = "Exit";
                              }else{
                                bIn_out = "Entry";
                              }
                               var bElement = [];
                               var brName = {};
                               var brStatus = {};
                               brStatus.status = bIn_out;
                               brName.name = bName;
                                bElement.push(brStatus);
                              bElement.push(brName);
                               var countEle = [];
                            for (var j = 0, n = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets.length; j < n; j++) {
                             
                              //console.log(data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets[j]);  
                              
                              var bDate = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets[j].val;
                              var bCount = data.facets.branches.buckets[i].in_out.buckets[k].exits.buckets[j].count;
                              
                             
                              countEle.push(bCount);

                            }


                            var total = eval(countEle.join("+"));

/*      
                            var total = 0;
                            for (var i = 0; i < countEle.length; i++) {
                                total += countEle[i] << 0;
                            }

*/                          var getTotal = {};
                            getTotal.total = total;

                         countEle = countEle.join(", ");

                            var getCount = {};
                            getCount.count = countEle;

                            bElement.push(getCount);
                             bElement.push(getTotal);

                            
                            
                            storeBranchData.push(bElement);
                          }
                            
                            
                        };
                      $scope.branchOut = storeBranchData;
                     console.log(storeBranchData);

             
                });
                
                $.each(names, function(j, name) {


                    var query = 'q=dy_action_ind:1&rows=' + name + '&json.facet={in_outs:{type : range,field : xit_date,start :"' + dateFormat(Math.round(e.min)) + '",end :"' + dateFormat(Math.round(e.max)) + '",gap:"%2B1DAY"}}' // "q=-mad_crt_dt%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(mad_crt_dt)\",\"max_date\":\"max(mad_crt_dt)\"}}"
                    var sq = "http://" + solrHost + ":8983/solr/his/query?"
                    $http.get(sq + query).
                    success(function(data) {
                        //chart.series[0].setData(data);
                        //chart.hideLoading();

                        var storeData = [];
                        for (var i = 0, l = data.facets.in_outs.buckets.length; i < l; i++) {
                            var obj = data.facets.in_outs.buckets[i];
                            var element = [];
                            element.push(new Date(obj.val).getTime());
                            element.push(obj.count);
                            storeData.push(element);
                        }

                        //console.log(storeData);


                        seriesOptions[j] = {
                            name: name,
                            data: storeData,
                            type: 'areaspline',
                            threshold: null
                        };

                        chart.hideLoading();

                        // As we're loading the data asynchronously, we don't know what order it will arrive. So
                        // we keep a counter and create the chart when all the data is loaded.
                        seriesCounter += 1;

                        if (seriesCounter === names.length) {
                            $scope.createChart();
                        }
                    });
                });

            }


            /**
             * Create the chart when all data is loaded
             * @returns {undefined}
             */
            $scope.createChart = function() {

                $('#container').highcharts('StockChart', {

                    rangeSelector: {
                        selected: 2
                    },

                    /* yAxis: {
                         labels: {
                             formatter: function () {
                                 return (this.value > 0 ? ' + ' : '') + this.value + '%';
                             }
                         },
                         plotLines: [{
                             value: 0,
                             width: 2,
                             color: 'silver'
                         }]
                     },*/


                    chart: {
                        zoomType: 'x'

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

                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                        valueDecimals: 2
                    },

                    series: seriesOptions
                });
            }

            $.each(seriesDet, function(j, valu) {
                $.each(valu, function(m, k) {
                    var query = 'q=dy_action_ind:' + k.name + '&rows=1&fq=xit_date:[NOW-6MONTH%20TO%20NOW]&json.facet={in_outs:{type : range,field : xit_date,start : "2015-01-01T00:00:00Z",end :"2016-01-23T00:00:00Z",gap:"%2B1DAY"}}' // "q=-mad_crt_dt%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(mad_crt_dt)\",\"max_date\":\"max(mad_crt_dt)\"}}"
                    var sq = "http://" + solrHost + ":8983/solr/his/query?"
                    $http.get(sq + query).
                    success(function(data) {
                        //console.log(data);

                        var storeData = [];
                        for (var i = 0, l = data.facets.in_outs.buckets.length; i < l; i++) {
                            var obj = data.facets.in_outs.buckets[i];
                            var element = [];
                            element.push(new Date(obj.val).getTime());
                            element.push(obj.count);
                            storeData.push(element);
                        }

                        //console.log(storeData);




                        seriesOptions[m] = {
                            name: k.title,
                            color: k.color,
                            data: storeData,
                            type: 'areaspline',
                            threshold: null
                        };

                        // As we're loading the data asynchronously, we don't know what order it will arrive. So
                        // we keep a counter and create the chart when all the data is loaded.
                        seriesCounter += 1;

                        if (seriesCounter === names.length) {
                            $scope.createChart();
                        }

                    });
                });
            });

        };

        $scope.timelineChart();



       
    });

// set sidebar closed and body solid layout mode
$rootScope.settings.layout.pageSidebarClosed = false;
});
