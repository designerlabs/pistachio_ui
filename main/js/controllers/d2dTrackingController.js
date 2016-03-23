'use strict';

MetronicApp.controller('d2dTrackingController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
        var seriesOptions = [],
               seriesCounter = 0,
               names = ['MSFT', 'AAPL', 'GOOG'];

           /**
            * Create the chart when all data is loaded
            * @returns {undefined}
            */
           $scope.createChart =function() {

               $('#container').highcharts('StockChart', {

                   rangeSelector: {
                       selected: 4
                   },

                   yAxis: {
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
                   },

                   plotOptions: {
                       series: {
                           compare: 'percent'
                       }
                   },

                   tooltip: {
                       pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                       valueDecimals: 2
                   },

                   series: seriesOptions
               });
           }

           $.each(names, function (i, name) {

               $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',    function (data) {

                   seriesOptions[i] = {
                       name: name,
                       data: data,
                        type: 'area',
                        gapSize: 5
                   };

                   // As we're loading the data asynchronously, we don't know what order it will arrive. So
                   // we keep a counter and create the chart when all the data is loaded.
                   seriesCounter += 1;

                   if (seriesCounter === names.length) {
                       $scope.createChart();
                   }
               });
           });



           Highcharts.SparkLine = function (a, b, c) {
                 var hasRenderToArg = typeof a === 'string' || a.nodeName,
                     options = arguments[hasRenderToArg ? 1 : 0],
                     defaultOptions = {
                         chart: {
                             renderTo: (options.chart && options.chart.renderTo) || this,
                             backgroundColor: null,
                             borderWidth: 0,
                             type: 'area',
                             margin: [2, 0, 2, 0],
                             width: 120,
                             height: 20,
                             style: {
                                 overflow: 'visible'
                             },
                             skipClone: true
                         },
                         title: {
                             text: ''
                         },
                         credits: {
                             enabled: false
                         },
                         xAxis: {
                             labels: {
                                 enabled: false
                             },
                             title: {
                                 text: null
                             },
                             startOnTick: false,
                             endOnTick: false,
                             tickPositions: []
                         },
                         yAxis: {
                             endOnTick: false,
                             startOnTick: false,
                             labels: {
                                 enabled: false
                             },
                             title: {
                                 text: null
                             },
                             tickPositions: [0]
                         },
                         legend: {
                             enabled: false
                         },
                         tooltip: {
                             backgroundColor: null,
                             borderWidth: 0,
                             shadow: false,
                             useHTML: true,
                             hideDelay: 0,
                             shared: true,
                             padding: 0,
                             positioner: function (w, h, point) {
                                 return { x: point.plotX - w / 2, y: point.plotY - h };
                             }
                         },
                         plotOptions: {
                             series: {
                                 animation: false,
                                 lineWidth: 1,
                                 shadow: false,
                                 states: {
                                     hover: {
                                         lineWidth: 1
                                     }
                                 },
                                 marker: {
                                     radius: 1,
                                     states: {
                                         hover: {
                                             radius: 2
                                         }
                                     }
                                 },
                                 fillOpacity: 0.25
                             },
                             column: {
                                 negativeColor: '#910000',
                                 borderColor: 'silver'
                             }
                         }
                     };

                 options = Highcharts.merge(defaultOptions, options);

                 return hasRenderToArg ?
                     new Highcharts.Chart(a, options, c) :
                     new Highcharts.Chart(options, b);
             };

             var start = +new Date(),
                 $tds = $('td[data-sparkline]'),
                 fullLen = $tds.length,
                 n = 0;

             // Creating 153 sparkline charts is quite fast in modern browsers, but IE8 and mobile
             // can take some seconds, so we split the input into chunks and apply them in timeouts
             // in order avoid locking up the browser process and allow interaction.
             function doChunk() {
                 var time = +new Date(),
                     i,
                     len = $tds.length,
                     $td,
                     stringdata,
                     arr,
                     data,
                     chart;

                 for (i = 0; i < len; i += 1) {
                     $td = $($tds[i]);
                     stringdata = $td.data('sparkline');
                     arr = stringdata.split('; ');
                     data = $.map(arr[0].split(', '), parseFloat);
                     chart = {};

                     if (arr[1]) {
                         chart.type = arr[1];
                     }
                     $td.highcharts('SparkLine', {
                         series: [{
                             data: data,
                             pointStart: 1
                         }],
                         tooltip: {
                             headerFormat: '<span style="font-size: 10px">' + $td.parent().find('th').html() + ', Q{point.x}:</span><br/>',
                             pointFormat: '<b>{point.y}.000</b> USD'
                         },
                         chart: chart
                     });

                     n += 1;

                     // If the process takes too much time, run a timeout to allow interaction with the browser
                     if (new Date() - time > 500) {
                         $tds.splice(0, i + 1);
                         setTimeout(doChunk, 0);
                         break;
                     }

                     // Print a feedback on the performance
                     if (n === fullLen) {
                         $('#result').html('Generated ' + fullLen + ' sparklines in ' + (new Date() - start) + ' ms');
                     }
                 }
             }
             doChunk();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});