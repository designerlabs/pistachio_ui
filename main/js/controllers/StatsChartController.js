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
        $scope.date_range();
        $scope.theme();
        $scope.column ();
       }

      $scope.column = function() {


            Highcharts.chart('highchart_col',{
              chart : {
                  type : 'column',
                  style: {
                      fontFamily: 'Open Sans'
                  }
              },
              xAxis: {
                  categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu','Fri','Sat'],
                  title: {
                      text: null
                  }
              },
              exporting: { enabled: false },
                  title: {
                    text: 'negeri',
                    x: -20 //center
                  },
                  series: [{
                  name: 'negeri',
                  colorByPoint: true,
                  data: [107, 31, 444, 203, 122,145, 344],
                point:{
                    events:{
                        click: function (event) {
                            $scope.clickState(this.name);
                        }
                    }
                }
              }]
                });
          };
     function cb(start, end) {
      $('#vaa-range span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }
     $scope.date_range = function() {

      cb(moment().subtract(7, 'days'), moment().subtract(1, 'days'));

      $('#vaa-range').daterangepicker({
          ranges: {
             'Last 30 Days': [moment().subtract(29, 'days'), moment()],
             'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
             '2016': [moment("20160101", "YYYYMMDD"), moment()],
             '2015': [moment("20150101", "YYYYMMDD"), moment("20151231", "YYYYMMDD")]
             

          },
          opens : "right",
         // "alwaysShowCalendars": true,
          showDropdowns: true,
          minDate : moment("20100101", "YYYYMMDD")

      }, cb);

      $('#vaa-range').on('apply.daterangepicker', function(ev, picker) {
          $('#daterange').val('');
          console.log($scope.filterButtons)
          var range = '[ '+ moment(picker.startDate).format('YYYY-MM-DDT00:00:00')+'Z TO '+moment(picker.endDate).format('YYYY-MM-DDT00:00:00')+'Z ]'

          var display = "[ "+ moment(picker.startDate).format('DD-MM-YYYY') +" TO "+ moment(picker.endDate).format('DD-MM-YYYY')+" ]";
          $scope.time_filtered_max = moment(picker.endDate).format('YYYY-MM-DDT00:00:00')+'Z';
          $scope.time_filtered_min = moment(picker.startDate).format('YYYY-MM-DDT00:00:00')+'Z'
              $scope.addFilter("tim","Time :"+display,"created:"+range);

              $scope.querySolr();
      });

    }

    $scope.theme = function () {
      /**
       * Dark theme for Highcharts JS
       * @author Torstein Honsi
       */

      // Load the fonts
      Highcharts.createElement('link', {
         href: 'https://fonts.googleapis.com/css?family=Unica+One',
         rel: 'stylesheet',
         type: 'text/css'
      }, null, document.getElementsByTagName('head')[0]);

      Highcharts.theme = {
         colors: ["#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
            "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
         chart: {
            backgroundColor: {
               linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
               stops: [
                  [0, '#2a2a2b'],
                  [1, '#3e3e40']
               ]
            },
            style: {
               fontFamily: "'Unica One', sans-serif"
            },
            plotBorderColor: '#606063'
         },
         title: {
            style: {
               color: '#E0E0E3',
               textTransform: 'uppercase',
               fontSize: '20px'
            }
         },
         subtitle: {
            style: {
               color: '#E0E0E3',
               textTransform: 'uppercase'
            }
         },
         xAxis: {
            gridLineColor: '#707073',
            labels: {
               style: {
                  color: '#E0E0E3'
               }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
               style: {
                  color: '#A0A0A3'

               }
            }
         },
         yAxis: {
            gridLineColor: '#707073',
            labels: {
               style: {
                  color: '#E0E0E3'
               }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
            title: {
               style: {
                  color: '#A0A0A3'
               }
            }
         },
         tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
               color: '#F0F0F0'
            }
         },
         plotOptions: {
            series: {
               dataLabels: {
                  color: '#B0B0B3'
               },
               marker: {
                  lineColor: '#333'
               }
            },
            boxplot: {
               fillColor: '#505053'
            },
            candlestick: {
               lineColor: 'white'
            },
            errorbar: {
               color: 'white'
            }
         },
         legend: {
            itemStyle: {
               color: '#E0E0E3'
            },
            itemHoverStyle: {
               color: '#FFF'
            },
            itemHiddenStyle: {
               color: '#606063'
            }
         },
         credits: {
            style: {
               color: '#666'
            }
         },
         labels: {
            style: {
               color: '#707073'
            }
         },

         drilldown: {
            activeAxisLabelStyle: {
               color: '#F0F0F3'
            },
            activeDataLabelStyle: {
               color: '#F0F0F3'
            }
         },

         navigation: {
            buttonOptions: {
               symbolStroke: '#DDDDDD',
               theme: {
                  fill: '#505053'
               }
            }
         },

         // scroll charts
         rangeSelector: {
            buttonTheme: {
               fill: '#505053',
               stroke: '#000000',
               style: {
                  color: '#CCC'
               },
               states: {
                  hover: {
                     fill: '#707073',
                     stroke: '#000000',
                     style: {
                        color: 'white'
                     }
                  },
                  select: {
                     fill: '#000003',
                     stroke: '#000000',
                     style: {
                        color: 'white'
                     }
                  }
               }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
               backgroundColor: '#333',
               color: 'silver'
            },
            labelStyle: {
               color: 'silver'
            }
         },

         navigator: {
            handles: {
               backgroundColor: '#666',
               borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
               color: '#7798BF',
               lineColor: '#A6C7ED'
            },
            xAxis: {
               gridLineColor: '#505053'
            }
         },

         scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
         },

         // special colors for some of the
         legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
         background2: '#505053',
         dataLabelsColor: '#B0B0B3',
         textColor: '#C0C0C0',
         contrastTextColor: '#F0F0F3',
         maskColor: 'rgba(255,255,255,0.3)'
      };

      // Apply the theme
      Highcharts.setOptions(Highcharts.theme);
    }

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("Stats");
  

});
