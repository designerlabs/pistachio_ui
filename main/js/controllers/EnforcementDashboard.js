'use strict';



MetronicApp.controller('EnforcementDashboard', function($rootScope, $scope, $http) {
   var backgroundColor = '#f1f3fa'
   var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/offender/query?json='
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

      cb(moment().startOf('month'), moment());
      debugger;

      var rne = '[ '+ moment().startOf('month').format('YYYY-MM-DDT00:00:00')+'Z TO '+moment().format('YYYY-MM-DDT00:00:00')+'Z ]'
      $scope.addFilter("tim","Time :This Month","created:"+rne);
      $('#dashboard-report-range').daterangepicker({
          ranges: {
             'This Month': [moment().startOf('month'), moment().endOf('month')],
             'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
             '2016': [moment("20160101", "YYYYMMDD"), moment()],
             '2015': [moment("20150101", "YYYYMMDD"), moment("20151231", "YYYYMMDD")]
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
             $scope.queryOperation();
              $scope.queryComplaints();
              $scope.queryCompound();
      });

    }

     $scope.pickDayRange = function(days) {
      if(days < 2) {
        $scope.period = "%2B1HOUR"
      }
      else if (days < 14) {
        $scope.period = "%2B1DAY"
      }
      else if (days < 60) {
       $scope.period = "%2B7DAY" 
      }
      else if(days < 500 ) {
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
         
         $scope.dateRange.min = moment("20110101", "YYYYMMDD").format('YYYY-MM-DDT00:00:00')+'Z';//moment().startOf('year').format('YYYY-MM-DDT00:00:00')+'Z';
         $scope.dateRange.max = moment().format('YYYY-MM-DDT00:00:00')+'Z';
         $scope.querySolr();
         $scope.queryCompound();
         $scope.queryOperation();
         $scope.queryComplaints();
         $scope.drawHeatMap()

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
            if(data == "brn") $scope.selectBranch = false
            if(data == "cnt") $scope.stateSelected = "";
            if(data == "doc") $scope.docSelected = "";
            $scope.querySolr();
          }
            
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

       $scope.queryOperation = function() {
          var solrUrl = 'http://'+solrHost+':8983/solr/tef_operation/query?json='
          $scope.filters = false;
          var json = {};
            json.limit  = 2000;
            json.offset = 0
            json.fields ="operation_no,operation_date,branch,operation_name,loc";
            json.query = $scope.formQuery();
            json.filter = $scope.filterQuery();
            json.facet = {};
            json.facet.operation = {}
            json.facet.operation.type = "terms"
            json.facet.operation.limit = 15
            json.facet.operation.field = "operation_name"

           
          
          $http.get(solrUrl+JSON.stringify(json)+$scope.fqQuery()).
             success(function(data) {
                 console.log(data)    
                 //$scope. = data.facets.compound
                 $scope.operations = data.response.numFound;
                 if($scope.operations>0) {
                 $scope.operation = data.facets.operation.buckets
                 $scope.operation_chart();
                 console.log($scope.operations)
                 drawMarker(data.response.docs) 
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

       $scope.queryComplaints = function() {
          var solrUrl = 'http://'+solrHost+':8983/solr/tef_complaint/query?json='
          $scope.filters = false;
          var json = {};
            json.limit  = 0;
            json.offset = 0
           // json.fields ="operation_no,operation_date,branch,operation_name,loc";
            json.query = $scope.formQuery();
            json.filter = $scope.filterQuery();
            json.facet = {};
            json.facet.category = {}
            json.facet.category.type = "terms"
            json.facet.category.limit = 15
            json.facet.category.field = "complaint_category"
            json.facet.nature = {}
            json.facet.nature.type = "terms"
            json.facet.nature.limit = 6
            json.facet.nature.field = "complaint_nature"
            json.facet.cat = {}
            json.facet.cat.type = "terms"
            json.facet.cat.field = "complaint_nature"
            json.facet.cat.facet = {}
            json.facet.cat.facet.category = {}
            //json.facet.cat.facet.category.terms = "complaint_category"
            json.facet.cat.facet.category.field = "complaint_category"
            json.facet.cat.facet.category.type = "terms"
            json.facet.cat.facet.category.limit= 15
            json.facet.cat.facet.category.sort = "index"

           
          
          $http.get(solrUrl+JSON.stringify(json)+$scope.fqQuery()).
             success(function(data) {
                 console.log(data)    
                 //$scope. = data.facets.compound
                 $scope.complaints = data.response.numFound;
                 if($scope.complaints>0) {
                  $scope.complaint_category = data.facets.category.buckets
                  $scope.complaint_nature = data.facets.nature.buckets;
                  $scope.complaint_category1 = data.facets.cat.buckets
                  $scope.complaint_chart(); 
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

      $scope.getNatureClass = function(item) {
        if(item =="TELEFON") return "icon-imi-telefon_imi"
        if(item =="SURAT") return "icon-imi-surat_imi"
        if(item =="HADIR SENDIRI") return "icon-imi-hadir_imi"
        if(item =="LAPORAN") return "icon-imi-elaporan_imi"
        if(item =="EMEL") return "icon-imi-emel_imi"
        if(item =="FAKS") return "fa fa-fax"
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
        if(item =="TELEFON") return "blue"
        if(item =="SURAT") return "green"
        if(item =="HADIR SENDIRI") return "tomato"
        if(item =="LAPORAN") return "green-turquoise"
        if(item =="EMEL") return "yellow-soft"
        if(item =="FAKS") return "blue-hoki"
        if(item =="ARAHAN KHAS") return "grey-gallery"
        if(item =="MEDIA MASSA") return "purple-soft"
        if(item =="SMS") return "yellow-haze"
        return "grey-cararra"
      } 

    function drawMarker(data) {


      var markerArray = []; //create new markers array
      var markers = L.markerClusterGroup();
      for (var i =0,l=data.length;i<l; i++) {
           var loc = data[i].loc
           if(loc != undefined && loc.length>3)
           {
              var latlng = loc.split(",")
              //var marker = L.marker([latlng[0], latlng[1]]).addTo($scope.map); 
              var title = data[i].operation_name;
              var pop = "Operation : <B>"+data[i].operation_no+
                        "</B><BR>Name : <B>"+data[i].operation_name+
                        "</B><BR>No of Officers : <B>"+data[i].officer_count+
                        "</B><BR>Branch : <B>"+data[i].branch+
                        "</B><BR>Date : <B>"+data[i].operation_date+"</B><BR>"
              var pulsingIcon = L.icon.pulse({iconSize:[10,10],color:'#26c281',heatbeat:3});
              var marker = L.marker(new L.LatLng(latlng[0], latlng[1]), {icon: pulsingIcon});
              marker.bindPopup(pop);
              marker.bindLabel(title,{ noHide: true , opacity:.8})
             // marker.addTo($scope.map); 
             markers.addLayer(marker)
              markerArray.push(marker); //add each markers to array
           }
      }
       var group = L.featureGroup(markerArray); //add markers array to featureGroup
       $scope.map.addLayer(markers);
       $scope.map.fitBounds(group.getBounds());   
    }

       
       $scope.queryCompound = function() {
          var solrUrl = 'http://'+solrHost+':8983/solr/tef_compound/query?json='
          $scope.filters = false;
          var json = {};
            json.limit  = 0;
            json.offset = 0
            json.query = $scope.formQuery();
           // json.filter = $scope.filterQuery();
            json.facet = {};
            json.facet.compound = "sum(amount)"
            json.facet.offence = {}
            json.facet.offence.type = "terms"
            json.facet.offence.field = "offence"
            json.facet.offence.facet = {}
            json.facet.offence.facet.compound = "sum(amount)"
           
          
          $http.get(solrUrl+JSON.stringify(json)+$scope.fqQuery()).
             success(function(data) {
                 console.log(data)    
                 $scope.compound = data.response.numFound//data.facets.compound

               }).
               error(function(data, status, headers, config) {
                 console.log('error');
                 console.log('status : ' + status); //Being logged as 0
                 console.log('headers : ' + headers);
                 console.log('config : ' + JSON.stringify(config));
                 console.log('data : ' + data); //Being logged as null
               });
    };


       $scope.querySolr = function() {

          $scope.filters = false;
          var json = {};
            json.limit  = 10;
            json.offset = 0
            json.query = $scope.formQuery();
           // json.filter = $scope.filterQuery();
            json.facet = {};
            json.facet.country = {};
            json.facet.country.type   = "terms";
            json.facet.country.field  =  "country";
            json.facet.country.domain = {};
            json.facet.country.domain.excludeTags ="COUNTRY"
            json.facet.country.limit  =  10;

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
            json.facet.date_range.facet    = {};
            json.facet.date_range.facet.pati    = {};
            json.facet.date_range.facet.pati.type    = "terms";
            json.facet.date_range.facet.pati.field   = "country";
            json.facet.date_range.facet.pati.filter   = "citizen:MYS";


          
          $http.get(thisSolrAppUrl+JSON.stringify(json)+$scope.fqQuery()).
             success(function(data) {
              $scope.detainee = data.response.numFound;
              $scope.page.total = data.response.numFound;
              if($scope.page.total < $scope.page.limit) $scope.page.last =true
               //  $scope.records =  data.response.docs
              $scope.detainees = data.response.docs //new NgTableParams({page: 1, count: 10}, { dataset: data.response.docs});
                  
                   $scope.country = data.facets.country.buckets
                   
                   $scope.column();
                   $scope.timelineChart(data.facets.date_range.buckets);
                 

               }).
               error(function(data, status, headers, config) {
                 console.log('error');
                 console.log('status : ' + status); //Being logged as 0
                 console.log('headers : ' + headers);
                 console.log('config : ' + JSON.stringify(config));
                 console.log('data : ' + data); //Being logged as null
               });

               

    };


     $scope.drawHeatMap = function () {
      console.log("map")
       $("#mapid").css('height', $scope.getHeight(60));

            var map = L.map("mapid", { fullscreenControl: true }).setView([4, 100], 7);

    L.tileLayer('//c.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //L.tileLayer('http://10.23.124.233/osm_tiles/{z}/{x}/{y}.png', {
      attribution: '&copy; NSL | Mimos'
    }).addTo(map);
    map.once('focus', function() { 
      map.scrollWheelZoom.enable();
      $('#map-label').addClass('operation-map-label-active');
      $('#map-label').removeClass('operation-map-label');
       });
    map.scrollWheelZoom.disable()

      $scope.map = map;

      }

    $scope.getHeight = function(percent)  {
      return window.innerHeight * percent /100;
    }



     $scope.operation_chart = function() {
      console.log("chart")
       console.log( window.innerHeight);
      
       var sel = -1;
       var _state = $scope.operation;

       var stateName = [];
       var stateData = [];
//chart.series[i].data[j].select(true, true);
      for (var i =0,l=_state.length; i < l; i++) {
           if($scope.stateSelected == _state[i].val) {
            debugger;
             sel = i;
           }
           stateName.push(_state[i].val)
           stateData.push(_state[i].count)
        }


      var chart = Highcharts.chart('highchart_operation',{
        
                chart : {
            type : 'bar',
            height:$scope.getHeight(60),
           // backgroundColor: backgroundColor,
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
              text: 'Jumlah Operasi Mengikut Jenis Operasi',
              x: -20 //center
            },
            series: [{
            name: 'Operasi',
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

     $scope.getComplaintTypeHeight = function() {
      return 'height:'+$scope.getHeight(10)+'px'
     }


     $scope.complaint_chart = function() {
       console.log( window.innerHeight);
       $scope.show_overall = false
       var sel = -1;
       var _state = $scope.complaint_category;

       var stateName = [];
       var stateData = [];
//chart.series[i].data[j].select(true, true);
      for (var i =0,l=_state.length; i < l; i++) {
           if($scope.stateSelected == _state[i].val) {
            
             sel = i;
           }
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
              text: 'Jumlah Aduan Mengikut Kategori',
              x: -20 //center
            },
            series: [{
            name: 'Aduan',
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
      chart.redraw()
      //
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
           if($scope.stateSelected == _state[i].val) {
            debugger;
             sel = i;
           }
           stateName.push(_state[i].val)
           stateData.push(_state[i].count)
        }

      var chart = Highcharts.chart('highchart_col',{
        chart : {
            type : 'bar',
            height:$scope.getHeight(35),
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
              text: 'Tangkapan Mengikut Status Sabjek',
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

        console.log(data);
      Highcharts.chart('highchart_timeline',{
            chart: {
              backgroundColor:backgroundColor ,
                zoomType: 'x',
                 height:$scope.getHeight(35),
                events: {
                selection: function (event) {
                    if (event.xAxis) {
                        var range = "[ "+ Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].min) +" TO "+ Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].max)+" ]";
                        var display = "[ "+ Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].min) +" TO "+ Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].max)+" ]";
                        $scope.time_filtered_max = Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].max);
                        $scope.time_filtered_min = Highcharts.dateFormat('%Y-%m-%dT00:00:00Z', event.xAxis[0].min);
                            $scope.addFilter("tim","Time :"+display,"created:"+range);
                            $scope.querySolr();
                    } else {
                      //  alert('Selection reset');
                        $scope.time_filtered_max = "";
                        $scope.time_filtered_min = "";
                        $scope.updateFilter("tim",true);
                    }
                  }
                }
            },
            tooltip: {
            shared: true
        },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 80,
                floating: true,
                backgroundColor: '#FFFFFF'
            },
            title: {
                text: 'Trend Tangkapan'

            },
            xAxis: {
                type: 'datetime'
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


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("enforcement.dashboard");
});
