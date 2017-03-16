'use strict';



MetronicApp.controller('VisaPassDashboard', function($rootScope, $scope, $http) {
   var backgroundColor = '#f1f3fa'
   var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/visa_pass/query?json='
       var economist;
        $http.get('assets/global/plugins/highcharts/js/economist.js')
         .then(function(res){
              economist= res.data;     
              Highcharts.setOptions(economist);           
          });

    $scope.$on('$viewContentLoaded', function() {
       $scope.reset()

    });

    function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
        $('#sticky').addClass('stick');
        $('#sticky-anchor').height($('#sticky').outerHeight());
    } else {
        $('#sticky').removeClass('stick');
        $('#sticky-anchor').height(0);
    }
}

   $(function() {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
   });
   function cb(start, end) {
      $('#dashboard-report-range span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $scope.date_range = function() {

      cb(moment().startOf('year'), moment());

      var rne = '[ '+ moment().startOf('year').format('YYYY-MM-DDT00:00:00')+'Z TO '+moment().format('YYYY-MM-DDT00:00:00')+'Z ]'
      $scope.addFilter("tim","Time :This Year","created:"+rne);
      $('#dashboard-report-range').daterangepicker({
          ranges: {
             'This Month': [moment().startOf('month'), moment().endOf('month')],
             'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
             '2017': [moment("20170101", "YYYYMMDD"), moment()],
             '2016': [moment("20160101", "YYYYMMDD"), moment("20161231", "YYYYMMDD")],
             '2015': [moment("20150101", "YYYYMMDD"), moment("20151231", "YYYYMMDD")],
             '2014': [moment("20140101", "YYYYMMDD"), moment("20141231", "YYYYMMDD")]
          },
          opens : "left",
          "alwaysShowCalendars": true,
          showDropdowns: true,
          minDate : moment("20120101", "YYYYMMDD")

      }, cb);

      $('#dashboard-report-range').on('apply.daterangepicker', function(ev, picker) {
          $('#daterange').val('');
          console.log($scope.filterButtons)
          var range = '[ '+ moment(picker.startDate).format('YYYY-MM-DDT00:00:00')+'Z TO '+moment(picker.endDate).format('YYYY-MM-DDT00:00:00')+'Z ]'

          var display = "[ "+ moment(picker.startDate).format('DD-MM-YYYY') +" TO "+ moment(picker.endDate).format('DD-MM-YYYY')+" ]";
          $scope.time_filtered_max = moment(picker.endDate).format('YYYY-MM-DDT00:00:00')+'Z';
          $scope.time_filtered_min = moment(picker.startDate).format('YYYY-MM-DDT00:00:00')+'Z'
            $scope.addFilter("tim","Time :"+display,"created:"+range);
            $scope.pickDayRange(picker.endDate.diff(picker.startDate,'days'))
            $scope.querySolr();
      });

    }

     $scope.pickDayRange = function(days) {
      if(days < 2) {
        $scope.period = "%2B1HOUR"
      }
      else if (days > 14) {
        $scope.period = "%2B1DAY"
      }
      else if (days > 400) {
       $scope.period = "%2B1DAY" 
      }
      else if(days >450 ) {
        $scope.period = "%2B1MONTH"
      }
      else if(days > 500 ) {
        $scope.period = "%2B1YEAR"
      }
    }

  function init_page() {
         var page_options = {};
         page_options.start = 0;
         page_options.limit = 10;
         page_options.page = 1;
         page_options.first = true;
         page_options.last = false;
         page_options.total = 0;
         $scope.page = page_options;
       }

 $scope.reset = function(){
         init_page();
         $scope.filterButtons = [];
         $scope.date_range()
         
         $scope.time_filtered_max = "";
         $scope.time_filtered_min = "";
         $scope.period = "%2B1DAY"
         $scope.dateRange = {};
         resetSelection();
         $scope.dateRange.min = moment("20170101", "YYYYMMDD").format('YYYY-MM-DDT00:00:00')+'Z';//moment().startOf('year').format('YYYY-MM-DDT00:00:00')+'Z';
         $scope.dateRange.max = moment().format('YYYY-MM-DDT00:00:00')+'Z';
         $scope.querySolr();

    }

       $scope.clickStep= function(data) {
        $scope.addFilter('stp',"Step : "+ data,"{!tag=STEP}current_step:\""+data+"\"")
        $scope.selectedStep = data;
        $scope.querySolr();
       }

        $scope.clickSektor= function(data) {
          $scope.addFilter('skt',"Sektor : "+ data,"{!tag=SKTR}sector:\""+data+"\"")
          $scope.selectedSector = data;
          $scope.querySolr();
       }

     $scope.clickCountry= function(data) {
          $scope.addFilter('cnt',"Negara : "+ data,"{!tag=CNTRY}country:\""+data+"\"")
          $scope.selectedCountry = data;
          $scope.querySolr();
       }


       $scope.addFilter = function (id,data,query){

          $scope.updateFilter(id,false);
          var obj = {};
          obj['id'] = id;
          obj['value'] = data;
          obj['query'] = query;
          $scope.filterButtons.push(obj);
          $scope.needRefresh = true;
       }

       $scope.updateFilter = function (data,refresh){
          var i = $scope.filterButtons.length
            while (i--) {
                if($scope.filterButtons[i]["id"] == data)
                {
                  $scope.filterButtons.splice(i, 1);
                  if(refresh){
                    $scope.time_filtered_max = "";
                    $scope.time_filtered_min = "";
                  }

                }

            }

          if(refresh) {
            if(data == "skt") $scope.selectedSector = false
            if(data == "cnt") $scope.selectedCountry = "";
            if(data == "stp") $scope.selectedStep = "";
            $scope.querySolr();
          }
            
       }

       function resetSelection () {
         $scope.selectedSector = false
         $scope.selectedCountry = "";
         $scope.selectedStep = "";
       }

       $scope.formQuery = function() {

          var query = "*:*";
          return query;
       }

       $scope.filterQuery = function () {
          var query = "";
          if($scope.filterButtons.length == 0)
            return query;
          query = $scope.filterButtons[0]["query"];
          if($scope.filterButtons.length > 1)
            for (var i = 1; i < $scope.filterButtons.length; i++) {
                query = query+" AND "+$scope.filterButtons[i]["query"];
            }

          return query;
       }

       $scope.fqQuery = function () {
          var query = "";
          if($scope.filterButtons.length == 0)
            return query;
          query = "&fq="+$scope.filterButtons[0]["query"];
          if($scope.filterButtons.length > 1)
            for (var i = 1; i < $scope.filterButtons.length; i++) {
                query = query+"&fq="+$scope.filterButtons[i]["query"];
            }

          return query;
       }

 

      $scope.getNatureClass = function(item) {
        if(item =="CETAKAN VISA") return "fa fa-cc-visa"
        if(item =="KELULUSAN") return "fa fa-check-square"
        if(item =="CETAKAN PAS") return "fa fa-id-card"
        if(item =="BAYARAN PAS") return "fa fa-money"
        if(item =="BAYARAN VISA") return "fa fa-money"
        if(item =="PERMOHONAN") return "icon-imi-laporan_imi"
        if(item =="BATAL PAS") return "fa fa-window-close"
        if(item =="ARAHAN KHAS") return "icon-imi-arahan_imi"
        if(item =="MEDIA MASSA") return "fa fa-commenting"
        if(item =="SMS") return "fa fa-mobile"
        return "fa fa-support"
      } 

      $scope.getNatureColorAscii = function(item) {
        if(item =="TELEFON") return "#3598DC"
        if(item =="SURAT") return "#32c5d2"
        if(item =="HADIR SENDIRI") return "tomato"
        if(item =="LAPORAN") return "#36D7B7"
        if(item =="EMEL") return "#C8D046"
        if(item =="FAKS") return "#67809F"
        if(item =="ARAHAN KHAS") return "#555555"
        if(item =="MEDIA MASSA") return "#8877A9"
        if(item =="SMS") return "#C5BF66"
        return "#FAFAFA"
      } 
      $scope.getNatureColor = function(item) {
        if(item == $scope.selectedStep) return "green-jungle"
        if(item =="CETAKAN VISA") return "blue"
        if(item =="KELULUSAN") return "green"
        if(item =="CETAKAN PAS") return "grey-gallery"
        if(item =="BAYARAN PAS") return "green-turquoise"
        if(item =="BAYARAN VISA") return "green-turquoise"
        if(item =="PERMOHONAN") return "yellow-soft"
        if(item =="BATAL PAS") return "blue-hoki"
        if(item =="FAKS") return "blue-hoki"
        if(item =="ARAHAN KHAS") return "grey-gallery"
        if(item =="MEDIA MASSA") return "purple-soft"
        if(item =="SMS") return "yellow-haze"
        return "grey-cararra"
      } 



       $scope.querySolr = function() {

          $scope.filters = false;
          var json = {};
            json.limit  = 0;
            json.offset = 0
            json.query = $scope.formQuery();
           // json.filter = $scope.filterQuery();
            json.facet = {};
            json.facet.country = {};
            json.facet.country.type   = "terms";
            json.facet.country.field  =  "country";
            json.facet.country.domain = {};
            json.facet.country.domain.excludeTags ="CNTRY"
            json.facet.country.limit  =  10;
            json.facet.country.facet  =  {
              sector : {
                type : "terms",
                field: "sector",
                sort : "index",
                limit : 20
              }
            };
            json.facet.sector = {
              type :"terms",
              field: "sector",
              domain : {
                excludeTags:"SKTR"
              }
            }

            json.facet.step = {};
            json.facet.step.type   = "terms";
            json.facet.step.field  =  "current_step";
            json.facet.step.domain = {};
            json.facet.step.domain.excludeTags ="STEP"
            json.facet.step.limit  =  8;

            json.facet.date_range = {};
            json.facet.date_range.type   = "range";
            json.facet.date_range.field  =  "created";
            if($scope.time_filtered_max.length > 0)
            {
              json.facet.date_range.start  = $scope.time_filtered_min;
              json.facet.date_range.end    = $scope.time_filtered_max;
            }
            else {
              json.facet.date_range.start  = $scope.dateRange.min;
              json.facet.date_range.end    = $scope.dateRange.max;
            }
            json.facet.date_range.gap    = $scope.period;

            
            json.facet.date_range1 = {};
            json.facet.date_range1.type   = "range";
            json.facet.date_range1.field  =  "created";
            if($scope.time_filtered_max.length > 0)
            {
              json.facet.date_range1.start  = $scope.time_filtered_min;
              json.facet.date_range1.end    = $scope.time_filtered_max;
            }
            else {
              json.facet.date_range1.start  = $scope.dateRange.min;
              json.facet.date_range1.end    = $scope.dateRange.max;
            }
            json.facet.date_range1.gap    = $scope.period;
            json.facet.date_range1.facet = {
              stats : {
                type : "query",
                q : "days_taken:[1 TO *]",
                facet : {
                  max :"max(days_taken)",
                  min :"min(days_taken)",
                  avg :"avg(days_taken)",

                }
              }
            };
            json.facet.days = {
               type : "query",
                q : "days_taken:[1 TO *]",
                facet : {
                  avg :"avg(days_taken)"
                }
            }




          
          $http.get(thisSolrAppUrl+JSON.stringify(json)+$scope.fqQuery()).
             success(function(data) {
                if(data.response.numFound>0) {
                    $scope.numFound = data.response.numFound;
                    $scope.step = data.facets.step.buckets;
                    $scope.country = data.facets.country.buckets
                    $scope.sector = data.facets.sector.buckets

                    $scope.column();
                    $scope.column1();
                    $scope.timelineChart(data.facets.date_range.buckets);
                    $scope.timelineChart1(data.facets.date_range1.buckets);
                    radarChart();

                    $scope.visa_pass_avg = data.response.numFound/data.facets.date_range.buckets.length
                    $scope.visa_pass_processing_avg = data.facets.days.avg;
                  
                }
                 

               }).
               error(function(data, status, headers, config) {
                 console.log('error');
                 console.log('status : ' + status); //Being logged as 0
                 console.log('headers : ' + headers);
                 console.log('config : ' + JSON.stringify(config));
                 console.log('data : ' + data); //Being logged as null
               });

               

    };



    $scope.getHeight = function(percent)  {
      return window.innerHeight * percent /100;
    }



     $scope.getComplaintTypeHeight = function() {
      return 'height:'+$scope.getHeight(10)+'px'
     }


     

    $scope.complaint_chart1 = function() {
       console.log( window.innerHeight);
      $scope.show_overall = true
       var _state = $scope.complaint_category1[0].category.buckets;

       var stateName = [];
       var stateData = [];
//chart.series[i].data[j].select(true, true);
      for (var i =0,l=_state.length; i < l; i++) {
           stateName.push(_state[i].val)
           stateData.push(_state[i].count)
        }

      var chart = Highcharts.chart('highchart_complaint',{
        chart : {
            type : 'column',
            height:$scope.getHeight(60),
            backgroundColor: backgroundColor,
            style: {
                fontFamily: 'Open Sans'
            }
        },
         plotOptions: {
        pie: {
            dataLabels: {
                distance: -45
            }
        }
        },
        xAxis: {
            categories: stateName
        },
         yAxis: {
          title: {
            enabled: false
          },
             gridLineColor: 'transparent',
             lineWidth: 0,
             minorGridLineWidth: 0,
             lineColor: 'transparent',
             labels: {
                 enabled: false
             },
             minorTickLength: 0,
             tickLength: 0
        },
        plotOptions:{

          column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                    
                }
            }
        },
        tooltip: {
            formatter: function() {
                var s = '<b>'+ this.x +'</b>',
                    sum = 0;

                $.each(this.points, function(i, point) {
                    s += '<br/>'+ point.series.name +': '+
                        point.y ;
                    sum += point.y;
                });

                s += '<br/><b>Jumlah: '+sum +'</b>'

                return s;
            },
            shared: true
        },

        exporting: { enabled: false },
            title: {
              text: 'Jumlah Aduan Mengikut Kategori',
              x: -20 //center
            },
            series: [{
            name: $scope.complaint_category1[0].val,
       //     colorByPoint: true,
            data: stateData,
            color: $scope.getNatureColorAscii($scope.complaint_category1[0].val),
            showInLegend:false,
          point:{
              events:{
                  click: function (event) {
                      $scope.clickCountry(event.point.category);
                  }
              }
          }
        }]
          });

      for (var j =1,k=$scope.complaint_category1.length; j< k; j++) {
          _state = $scope.complaint_category1[j].category.buckets;
          stateData = [];

          for (var i =0,l=_state.length; i < l; i++) {
             stateData.push(_state[i].count)
            
          }
           chart.addSeries({                        
                  name: $scope.complaint_category1[j].val,
                  data: stateData,
                  color: $scope.getNatureColorAscii($scope.complaint_category1[j].val)
              }, false)
        }
        chart.redraw();
     

    }


     $scope.column = function() {
      console.log("chart")
       console.log( window.innerHeight);
       var ht = window.innerHeight * .35;
       console.log(ht)
       var sel = -1;
       var _state = $scope.country;

       var stateName = [];
       var stateData = [];
//chart.series[i].data[j].select(true, true);
      for (var i =0,l=_state.length; i < l; i++) {
           if($scope.selectedCountry == _state[i].val) {
            debugger;
             sel = i;
           }
           stateName.push(_state[i].val)
           stateData.push(_state[i].count)
        }

      var chart = Highcharts.chart('highchart_col',{
        chart : {
            type : 'bar',
            height:$scope.getHeight(45),
            backgroundColor: backgroundColor,
            style: {
                fontFamily: 'Open Sans'
            }
        },
         plotOptions: {
        pie: {
            dataLabels: {
                distance: -45
            }
        }
        },
        xAxis: {
            categories: stateName
        },
         yAxis: {
          title: {
            enabled: false
          },
             gridLineColor: 'transparent',
             lineWidth: 0,
             minorGridLineWidth: 0,
             lineColor: 'transparent',
             labels: {
                 enabled: false
             },
             minorTickLength: 0,
             tickLength: 0
        },
        plotOptions:{
          series:{
            allowPointSelect: true,
            states: {
              select: {
                  color: '#00B16A'
              }
            },
            dataLabels: {
                    enabled: true,
                    crop: false,
                        enabled: true,
                        overflow: 'none'
                },
                pointPadding: 0.1,
                groupPadding: 0
          }
        },
        exporting: { enabled: false },
            title: {
              text: 'Negara Teratas',
              x: -20 //center
            },
            series: [{
            name: 'Negara',
       //     colorByPoint: true,
            data: stateData,
            color: '#34495E',
            showInLegend:false,
          point:{
              events:{
                  click: function (event) {
                      $scope.clickCountry(event.point.category);
                  }
              }
          }
        }]
          });
      if(sel != -1) {
        chart.series[0].data[sel].select(true, true);
      }
      //
    }
 $scope.column1 = function() {
      console.log("chart")
       console.log( window.innerHeight);
       var ht = window.innerHeight * .35;
       console.log(ht)
       var sel = -1;
       var _state = $scope.sector;

       var stateName = [];
       var stateData = [];
//chart.series[i].data[j].select(true, true);
      for (var i =0,l=_state.length; i < l; i++) {
           if($scope.selectedSector == _state[i].val) {
             sel = i;
           }
           stateName.push(_state[i].val)
           stateData.push(_state[i].count)
        }

      var chart = Highcharts.chart('highchart_col1',{
        chart : {
            type : 'bar',
            height:$scope.getHeight(45),
            backgroundColor: backgroundColor,
            style: {
                fontFamily: 'Open Sans'
            }
        },
         plotOptions: {
        pie: {
            dataLabels: {
                distance: -45
            }
        }
        },
        xAxis: {
            categories: stateName
        },
         yAxis: {
          title: {
            enabled: false
          },
             gridLineColor: 'transparent',
             lineWidth: 0,
             minorGridLineWidth: 0,
             lineColor: 'transparent',
             labels: {
                 enabled: false
             },
             minorTickLength: 0,
             tickLength: 0
        },
        plotOptions:{
          series:{
            allowPointSelect: true,
            states: {
              select: {
                  color: '#00B16A'
              }
            },
            dataLabels: {
                    enabled: true,
                    crop: false,
                        enabled: true,
                        overflow: 'none'
                },
                pointPadding: 0.1,
                groupPadding: 0
          }
        },
        exporting: { enabled: false },
            title: {
              text: 'Sektor Utama',
              x: -20 //center
            },
            series: [{
            name: 'Sektor',
       //     colorByPoint: true,
            data: stateData,
            color: '#34495E',
            showInLegend:false,
          point:{
              events:{
                  click: function (event) {
                      $scope.clickSektor(event.point.category);
                  }
              }
          }
        }]
          });
      if(sel != -1) {
        chart.series[0].data[sel].select(true, true);
      }
      //
    }
        $scope.timelineChart = function(data_range) {

      console.log(data_range);
      //alert(data_range.facets.date_range.buckets[0]);
      //alert(data_range[1][0]);
      //console.log(data_range.facets.date_range.buckets);
      var data = [];
      var change = [];
      var initial = 0;
       for( var i=0,l = data_range.length;i<l; i++){
         var obj = data_range[i];
         var element =[];
         var changeObj =[];
         element.push(new Date(obj.val).getTime());
         changeObj.push(new Date(obj.val).getTime());
         element.push(obj.count);
         if(initial == 0)
         {
            initial = obj.count;
             changeObj.push(0);
         }
        else {
          changeObj.push(
            parseInt(parseFloat(((obj.count - initial)/initial) * 100).toFixed(2))
            )
          initial = obj.count;
          
        }

    change.push(changeObj);
         data.push(element);
         
       }

        var chart = Highcharts.chart('time', {
            chart: {
              marginLeft: 40, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20,
                 height:$scope.getHeight(25),
                events: {
                }
            },
            tooltip: {
            shared: true
        },
                title: {
                    text: "Visa & Pas digunakan",
                    align: 'left',
                    margin: 0,
                    x: 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
            xAxis: {
                type: 'datetime',
                crosshair: true,
                    events: {
                        setExtremes: syncExtremes
                    }
            },
                tooltip: {
                    positioner: function () {
                        return {
                            x: this.chart.chartWidth - this.label.width, // right aligned
                            y: -1 // align to title
                        };
                    },
                    borderWidth: 0,
                    backgroundColor: 'none',
                    pointFormat: '{point.y}',
                    headerFormat: '',
                    shadow: false,
                    style: {
                        fontSize: '18px'
                    },
                   // valueDecimals: dataset.valueDecimals
                },
            yAxis:  { // Primary yAxis
                title: {
                        text: 'Tahanan'
                    },
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    },
                    min:0,
                    verticalAlign: 'middle', // Position them vertically in the middle
                    align: 'bottom' 
                //}
            },
            exporting: { enabled: false },
            plotOptions: {
                area:{
                  fillOpacity: 0.4,
                  lineWidth:3,
                  marker: {
                    fillColor: '#9acae6',
                    lineWidth: 2,
                    lineColor: null
                  }
                  
                },
                column: {
                  stacking:'normal',
                    dataLabels: {
                        enabled: true,
                        crop: false,
                        overflow: 'none',
                        verticalAlign:'bottom'//,
                       // y:40
                    }
                },
                line: {
                    dataLabels: {
                        formatter: function () {
                            return this.y + '%'
                        },
                        enabled: true,
                        crop: false,
                        overflow: 'none'
                    }
                }
            },

            series: [{
                type: 'area',
                name: 'Tangkapan',
                color:'#9acae6',
                data: data
                
            }
            ]
        });
    };

       $scope.timelineChart1 = function(data_range) {

      var data_avg = [];
      var data_area_range = [];
      var data_min = [];
       for( var i=0,l = data_range.length;i<l; i++){
         var obj = data_range[i];
         var element1 =[];
         var element2 =[];
         element1.push(new Date(obj.val).getTime());
         element2.push(new Date(obj.val).getTime());
         if(obj.count>0 && obj.stats.count >0) {
           element1.push(obj.stats.avg);
           element2.push(obj.stats.max);
           element2.push(obj.stats.min);
         }
         else
         {
           element1.push(0);
           element2.push(0);
           element2.push(0);
         }
         data_avg.push(element1);
         data_area_range.push(element2)
         
       }

        var chart = Highcharts.chart('time1', {
            chart: {
              marginLeft: 40, // Keep all charts left aligned
                    spacingTop: 20,
                    spacingBottom: 20,
                 height:$scope.getHeight(25),
                events: {
                }
            },
            tooltip: {
            shared: true
        },
                title: {
                    text: "Hari Yang Diambil",
                    align: 'left',
                    margin: 0,
                    x: 30
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
            xAxis: {
                type: 'datetime',
                crosshair: true,
                    events: {
                        setExtremes: syncExtremes
                    }
            },
            yAxis:  { // Primary yAxis
                title: {
                        text: 'Tahanan'
                    }
            },
            exporting: { enabled: false },
            

            series: [
              {
                type: 'arearange',
                name: 'minimum - maksimum',
                color:'#36D7B7',
                data: data_area_range
                
              },

              {
                  type: 'line',
                  name: 'Purata',
                  
                  data: data_avg
                  
              }
            
            ]
        });
    };


    function radarChart(){

      var obj = $scope.country[0];
      var data = [];
      var category = []
       for( var i=0,l = obj.sector.buckets.length;i<l; i++){
          var o = obj.sector.buckets[i];
          data.push(o.count);
          category.push(o.val)
       }
      
          var chart = Highcharts.chart('radar_container', {

            chart: {
               // polar: true,
                type: 'bar',
                 height:$scope.getHeight(45),
            },

            title: {
                text: 'Negara vs Sektor'
            },

           plotOptions: {
                bar: {
                    stacking: 'normal',
                    
                }
            },

            xAxis: {
                categories:category,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                lineWidth: 0,
                min: 0
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },
            series: [{
              name: $scope.country[0].val,
              data: data,
              pointPlacement: 'on'
            }]
        });

        for(var j=1,m=$scope.country.length;j<m;j++) {
          var obj = $scope.country[j];
          var data = [];
           for( var i=0,l = obj.sector.buckets.length;i<l; i++){
              var o = obj.sector.buckets[i];
              data.push(o.count);
           }
           chart.addSeries({
              name: $scope.country[j].val,
              data: data,
              pointPlacement: 'on'
           })

        }


    }


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("visa.dashboard");




/**
 * Override the reset function, we don't need to hide the tooltips and crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
    return undefined;
};

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
    this.onMouseOver(); // Show the hover marker
    this.series.chart.tooltip.refresh(this); // Show the tooltip
    this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
};

/**
 * Synchronize zooming through the setExtremes event handler.
 */
function syncExtremes(e) {
    var thisChart = this.chart;

    if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {
            if (chart !== thisChart) {
                if (chart.xAxis[0].setExtremes) { // It is null while updating
                    chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, { trigger: 'syncExtremes' });
                }
            }
        });
    }
}



// Get the data. The contents of the data file can be viewed at
// https://github.com/highcharts/highcharts/blob/master/samples/data/activity.json

});
