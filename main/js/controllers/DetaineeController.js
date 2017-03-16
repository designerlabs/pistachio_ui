'use strict';
var selected_countries = [];
var filter_query = "";

MetronicApp.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});




MetronicApp.controller('DetaineeController', function($rootScope, $scope, $http,NgTableParams,$uibModal) {

   //Scroll on top
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
  function sliceSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}

function addSlice(id, sliceSize, pieElement, offset, sliceID, color) {
  $(pieElement).append("<div class='slice " + sliceID + "'><span></span></div>");
  var offset = offset - 1;
  var sizeRotation = -179 + sliceSize;

  $(id + " ." + sliceID).css({
    "transform": "rotate(" + offset + "deg) translate3d(0,0,0)"
  });

  $(id + " ." + sliceID + " span").css({
    "transform": "rotate(" + sizeRotation + "deg) translate3d(0,0,0)",
    "background-color": color
  });
}

function iterateSlices(id, sliceSize, pieElement, offset, dataCount, sliceCount, color) {
  var
    maxSize = 179,
    sliceID = "s" + dataCount + "-" + sliceCount;

  if (sliceSize <= maxSize) {
    addSlice(id, sliceSize, pieElement, offset, sliceID, color);
  } else {
    addSlice(id, maxSize, pieElement, offset, sliceID, color);
    iterateSlices(id, sliceSize - maxSize, pieElement, offset + maxSize, dataCount, sliceCount + 1, color);
  }
}

function createPie(id) {
  var listData = [];
  var listTotal = 0;
  var offset = 0;
  var i = 0;
  var pieElement = id + " .pie-chart__pie";
  var dataElement = id + " .pie-chart__legend";

  var color = [
    "tomato",
 
    "turquoise"
  ];

  //color = shuffle(color);

/*  $(dataElement + " span").each(function() {
    listData.push(Number($(this).html()));
  });*/
  listData.push(Number($scope.male))
  listData.push(Number($scope.female))
    for (i = 0; i < listData.length; i++) {
    listTotal += listData[i];
  }

  for (i = 0; i < listData.length; i++) {
    var size = sliceSize(listData[i], listTotal);
    iterateSlices(id, size, pieElement, offset, i, 0, color[i]);
    $(dataElement + " li:nth-child(" + (i + 1) + ")").css("border-color", color[i]);
    offset += size;
  }
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }

  return a;
}

function createPieCharts() {
  createPie('.pieID--categories');
}




   $scope.IntroOptions = {
        steps:[
        {
            element: document.querySelector('#sticky'),
            intro: "This is the filter bar. It shows the applied filter"
        },
        {
            element: document.querySelector('#resetbtn'),
            intro: "<strong>Click to clear the filter</strong> can also <em>include</em> HTML",
            position: 'bottom'
        },
        {
            element: document.querySelector('#vaa-range'),
            intro: "<strong>Click</strong> to view the date filter options",
            position: 'bottom'
        },
        {
            element: document.querySelector('#depotSearch'),
            intro: "type to search a depot",
            position: 'left'
        },
        {
            element: document.querySelector('#dashboard-branch'),
            intro: "Click to select a depot",
            position: 'left'
        },
        {
            element: document.querySelector('#highchart_col'),
            intro: "Click to on the bar to apply filter",
            position: 'top'
        }
        ],
        showStepNumbers: false,
        exitOnOverlayClick: true,
        exitOnEsc:true,
        nextLabel: '<strong>NEXT!</strong>',
        prevLabel: '<span style="color:green">Previous</span>',
        skipLabel: 'Exit',
        doneLabel: 'Thanks'
    };

    $scope.ShouldAutoStart = false;




    var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/tef_detainee/query?json='

   $scope.open = function () {
    var options = {
      templateUrl: 'detaineeview.html',
      controller: ModalInstanceCtrl,
      size: 'lg',
      resolve: {
        detainees: function () {
          return $scope.detainees;
        },
        page : function () {
          return $scope.page
        },
        filter : function () {
          return $scope.fqQuery();
        },
        solrUrl : function () {
          return thisSolrAppUrl;
        }
      }
    };
    var modalInstance = $uibModal.open(options);
    modalInstance.result.then(function () {
      $scope.show_profile = false;
    }, function () {
     $scope.show_profile = false;
    });
  };
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


    $scope.$on('$viewContentLoaded', function() {
        $scope.firstTime = true;
        // initialize core components
        Metronic.initAjax();
        $(".page-sidebar-menu > li").removeClass('active');
        $("#dashboardLink").addClass('active');
        //alert("HI");
        var getUser = localStorage.getItem("username");
        init_page();
        $scope.reset();
        $scope.date_range();


    });

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      $scope.generateBarGraph('#dashboard-stats')
      $scope.generateBarGraph('#dashboard-branch')

    });



    function cb(start, end) {
      $('#vaa-range span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $scope.date_range = function() {

      cb(moment("20120101", "YYYYMMDD"), moment());

      $('#vaa-range').daterangepicker({
          ranges: {
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
             '2017': [moment("20170101", "YYYYMMDD"), moment()],
             '2016': [moment("20160101", "YYYYMMDD"), moment("20161231", "YYYYMMDD")],
             '2015': [moment("20150101", "YYYYMMDD"), moment("20151231", "YYYYMMDD")],
             '2014': [moment("20140101", "YYYYMMDD"), moment("20141231", "YYYYMMDD")]
           //  '2011': [moment("20110101", "YYYYMMDD"), moment("20111231", "YYYYMMDD")],
           //  '2010': [moment("20100101", "YYYYMMDD"), moment("20101231", "YYYYMMDD")]

          },
          opens : "left",
          "alwaysShowCalendars": true,
          showDropdowns: true,
          minDate : moment("20120101", "YYYYMMDD")

      }, cb);

      $('#vaa-range').on('apply.daterangepicker', function(ev, picker) {
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


  


    $scope.reset = function(){
      $scope.male = 0;
      $scope.female = 0;
      $scope.radioValue = "Overall"
      $scope.cntName = "";
      $scope.officer_name = "";
      $scope.cntCode = "";
      $scope.cJobs = "";
       $scope.cEmply = "";
        $scope.cSex = "";
        $scope.cState = "";
        $scope.filters = false;
        $scope.filterButtons = [];
         $scope.analysiType = 'overall';
         $scope.loadTimeline = true;
         $scope.time_filtered_max = "";
         $scope.time_filtered_min = "";
        $scope.period = "%2B1YEAR"
         $scope.jobCount = 10;
         $scope.stateSelected = "";
         $scope.rankSelected = "";
         $scope.ageSelected = "";
         $scope.selectedBranch="";
         $scope.selectBranch = false;
         $scope.dateRange = {};
         $scope.dateRange.min = "2012-01-01T00:00:00Z"
         $scope.dateRange.max = "2017-01-01T00:00:00Z"
         cb(moment("20100101", "YYYYMMDD"), moment());
         //$scope.analysiType = 'overall';
         $scope.records = ""
        $scope.querySolr();

    }



       $scope.cleanQuery = function(data) {
          data = data.replace(/\(/g,"\\\(");
          data = data.replace(/\)/g,"\\\)");
          data = data.replace(/ /g,"*");
          return(data);
       }

       $scope.clickActive = function () {
         if($scope.radioValue == 'Active')
          $scope.addFilter("act","Active Visa/Pass","vend:[" +moment().format('YYYYMMDD')+" TO *]");
         else {
           $scope.updateFilter("act",false)
         }
         $scope.querySolr();
       }

       $scope.clickEmply = function(data) {
        $scope.addFilter("emp","Employer :"+data,"employer:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickSex = function(data) {
        $scope.addFilter("sex","Gender : "+data,"sex:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickDoc = function(data) {
        $scope.ageSelected= data
        var dt = data.split('-')
        $scope.addFilter("age","Age Range : "+data,"{!tag=AGE}age:["+dt[0] +" TO "+ dt[1]+" ]");
        $scope.querySolr();
       }

      
       $scope.activeBranch = function (brn) {
        if(brn == $scope.selectedBranch) return "active"
          else ""
       }

       $scope.clickBranch = function(data) {
        $scope.selectBranch = true
        $scope.selectedBranch = data;
        $scope.addFilter("brn","Depot :"+data,"{!tag=BRANCH}branch:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickPass = function(data) {
        $scope.selectedPass = data;
        $scope.addFilter("pas","Pass :"+data,"{!tag=PASS}pass_type:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }       


       $scope.clickJobs = function(data) {
        $scope.addFilter("job","Job : "+data,"job_en:"+$scope.cleanQuery(data));
        $scope.querySolr();
       };

       $scope.clickVisa = function(data) {
        $scope.addFilter("vis","Visa Type : "+data,"pass_type:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickCountry = function(data) {
        $scope.stateSelected = data;
        $scope.addFilter("cnt","Country : "+data,"{!tag=COUNTRY}country:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.updateActiveGeography = function(geography) {
          $scope.addFilter("cnt","country: "+geography.id,"cntry_cd:"+geography.id);
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
            if(data == "brn") $scope.selectBranch = false
            if(data == "cnt") $scope.stateSelected = "";
            if(data == "doc") $scope.docSelected = "";
            $scope.querySolr();
          }
            
       }

       $scope.formQuery = function() {

          var query = "branch:*";
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

       


       $scope.querySolr = function() {

          $scope.filters = false;
          var json = {};
          if($scope.analysiType == 'overall')
          {
            json.limit  = 10;
            json.offset = 0
            json.query = $scope.formQuery();
            //json.filter = $scope.filterQuery();
            json.facet = {};
            json.facet.rank = {};
            json.facet.rank.type   = "terms";
            json.facet.rank.field  =  "doc_type";
            json.facet.rank.domain = {};
            json.facet.rank.domain.excludeTags ="DOC"
            json.facet.sex = {};
            json.facet.sex.type   = "terms";
            json.facet.sex.field  =  "sex";
            json.facet.sex.domain = {};
            json.facet.sex.domain.excludeTags ="SEX"
            json.facet.branch = {};
            json.facet.branch.type   = "terms";
            json.facet.branch.limit   = 6;
            json.facet.branch.field  =  "branch";
            json.facet.branch.domain = {};
            json.facet.branch.domain.excludeTags ="BRANCH"
            json.facet.country = {};
            json.facet.country.type   = "terms";
            json.facet.country.field  =  "country";
            json.facet.country.domain = {};
            json.facet.country.domain.excludeTags ="COUNTRY"
            json.facet.country.limit  =  10;
            json.facet.user_type = {};
            json.facet.user_type.type   = "terms";
            json.facet.user_type.field  =  "pass_type";
            json.facet.user_type.domain = {};
            json.facet.user_type.domain.excludeTags ="PASS"
            json.facet.age_range = {};

            json.facet.age_range.type   = "range";
            json.facet.age_range.field  =  "age";
            json.facet.age_range.start  =  0;
            json.facet.age_range.end  =  100;
            json.facet.age_range.gap  =  10;
            json.facet.age_range.domain = {};
            json.facet.age_range.domain.excludeTags ="AGE"

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
          }
          
          $http.get(thisSolrAppUrl+JSON.stringify(json)+$scope.fqQuery()).
             success(function(data) {
              $scope.numFound = data.response.numFound;
              $scope.page.total = data.response.numFound;
              if($scope.page.total < $scope.page.limit) $scope.page.last =true
               //  $scope.records =  data.response.docs
              $scope.detainees = data.response.docs //new NgTableParams({page: 1, count: 10}, { dataset: data.response.docs});
                 if(selected_countries == 0) {
                   $scope.rank = data.facets.rank.buckets;
                   $scope.branch = data.facets.branch.buckets
                   $scope.country = data.facets.country.buckets
                   $scope.user_type = data.facets.user_type.buckets
                   //debugger;
                   var sex = data.facets.sex.buckets;
                   var i;
                   for(i = 0; i < sex.length; i++){
                    if( sex[i].name = sex[i]['val'] =="LELAKI")
                      $scope.male= sex[i]['count'];
                    if( sex[i].name = sex[i]['val'] =="PEREMPUAN")
                      $scope.female= sex[i]['count'];
                    
                      sex[i].name = sex[i]['val'];
                      sex[i].y = sex[i]['count'];
                      delete sex[i].val;
                      delete sex[i].count;
                    }
                    console.log(sex);
                   $scope.sex = sex;
                   $scope.age = data.facets.age_range.buckets
                   $scope.column();
                   
                  // $scope.pie();
                   $scope.timelineChart(data.facets.date_range.buckets);
                   $scope.rankChart();
                   $scope.ageChart();
                   //$scope.genderChart();
                   //$scope.activeOverall();
                   createPieCharts();
                   $scope.genderSize();
                   $scope.generateBarGraph('#dashboard-stats');
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

    $scope.genderPercentage = function(type) {
      if($scope.male == 0 || $scope.female == 0) return 0
      if(type == 'male' ) return Math.round(100*$scope.male/($scope.male+$scope.female))
      if(type == 'female' ) return Math.round(100*$scope.female/($scope.male+$scope.female))
    }

    $scope.genderSize =function() {
      if($scope.male == 0 || $scope.female == 0) return "small"
      var male = Math.round(100*$scope.male/($scope.male+$scope.female))
      var female = Math.round(100*$scope.female/($scope.male+$scope.female))
         if(male>female) {
          $scope.maleClass = "large"
          $scope.femaleClass= "medium"
         }
         else {
          $scope.maleClass = "medium"
          $scope.femaleClass= "large"
         }
      
    }

    

      $scope.$watch('searchBranch', function() {
        if($scope.searchBranch == undefined) return
        if($scope.searchBranch.length>=0)
        {
          $scope.branch_suggest($scope.searchBranch.toUpperCase())
        }
    });


    $scope.branch_suggest = function (entry) {
      var json = {};
      json.limit  = 0;
      json.offset = 0
      json.query = $scope.formQuery() +" AND branch:*"+entry +"*";
      json.filter = $scope.filterQuery();
      json.facet = {};
      json.facet.job = {};
      json.facet.job.type   = "terms";
      json.facet.job.field  =  "branch_short";
      json.facet.job.limit  =  5;
      $http.get(thisSolrAppUrl+JSON.stringify(json)).
           success(function(data) {
              $scope.branch = data.facets.job.buckets;
              //return data;
            })
     
    }




       $scope.generateBarGraph = function (wrapper) {
    // Set Up Values Array
    var values = [];
    // Get Values and save to Array
    $(wrapper + ' .bar').each(function(index, el) {
      values.push($(this).data('value'));
    });

    // Get Max Value From Array
    var max_value = Math.max.apply(Math, values);

    // Set width of bar to percent of max value
    $(wrapper + ' .bar').each(function(index, el) {
      var bar = $(this),
          value = bar.data('value'),
          percent = Math.ceil((value / max_value) * 100);

      // Set Width & Add Class
      bar.width(percent + '%');
      bar.addClass('in');
    });
  }

    $scope.genderChart = function() {
      Highcharts.chart('highchart_gender',{
        chart : {
            type : 'pie',
            //height : 260,
            style: {
                fontFamily: 'Open Sans'
            }
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
        
        xAxis: {
            categories: $scope.sex.val
        },
        yAxis: {

            title: {
                text: null
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        exporting: { enabled: false },
            title: {
              text: 'mengikut jantina',
              x: -20 //center
            },
            series: [{
            name: 'jantina',
            colorByPoint: true,
           // showInLegend:false,
            data: $scope.sex,
          point:{
              events:{
                  click: function (event) {
                      $scope.clickSex(this.name);
                  }
              }
          }
        }]
          });



      $scope.labels = $scope.sex.val;
      $scope.data = $scope.sex.count;
    };

    $scope.omitNa = function (data) {
      if(data.length == 0)
      {
        return "NOT MENTIONED"
      }
      else {
        return data
      }
    }

  $scope.ageChart = function() {
       var sel = -1;
       var _state = $scope.age;

       var stateName = [];
       var stateData = [];
       $scope.total = 0;
      for (var i =0,l=_state.length; i < l; i++) {
         
           var range = _state[i].val + "-" + (parseInt(_state[i].val)+9);
           $scope.total = $scope.total +parseInt(_state[i].val);
           if($scope.ageSelected == range) {
             sel = i;
           }
           stateName.push(range)
           stateData.push(_state[i].count)
        }

      var chart = Highcharts.chart('highchart_age',{
        chart : {
            type : 'bar',
            style: {
                fontFamily: 'Open Sans'
            }
        },
        plotOptions: {
            series: {
                shadow:false,
                borderWidth:0,
                dataLabels:{
                    enabled:true
                }
            }
        },
        xAxis: {
            categories: stateName
        },
        
        gridLineWidth: 0,
                minorGridLineWidth: 0,

        exporting: { enabled: false },
            title: {
              text: 'Age Range',
              x: -20 //center
            },
            series: [{
            name: 'age range',
          //  colorByPoint: true,
            data: stateData,
            showInLegend:false,
          point:{
              events:{
                  click: function (event) {
                      $scope.clickDoc(event.point.category);
                  }
              }
          }
        }]
          });
      if(sel != -1) {
        chart.series[0].data[sel].select(true, true);
      }
    }

    $scope.column = function() {
       var sel = -1;
       var _state = $scope.country;

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

      var chart = Highcharts.chart('highchart_col',{
        chart : {
            type : 'column',
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
              text: 'Negara',
              x: -20 //center
            },
            series: [{
            name: 'negara',
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

   

    
        $scope.rankChart = function() {
       var sel = -1;
       var _state = $scope.rank;

       var stateName = [];
       var stateData = [];

      for (var i =0,l=_state.length; i < l; i++) {
         if($scope.docSelected == _state[i].val) {
             sel = i;
           }
           stateName.push(_state[i].val)
           stateData.push(_state[i].count)
        }

      var chart = Highcharts.chart('highchart_rank',{
        chart : {
            type : 'bar',
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
        plotOptions:{
          series:{
            allowPointSelect: true,
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
        gridLineWidth: 0,
                minorGridLineWidth: 0,

        exporting: { enabled: false },
            title: {
              text: 'Document Type',
              x: -20 //center
            },
            series: [{
            name: 'rank',
          //  colorByPoint: true,
            data: stateData,
            showInLegend:false,
          point:{
              events:{
                  click: function (event) {
                      $scope.clickDoc(event.point.category);
                  }
              }
          }
        }]
          });
      if(sel != -1) {
        chart.series[0].data[sel].select(true, true);
      }
    }

    $scope.yyyymmdd = function(date) {
      var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = date.getDate().toString();
    return yyyy +"-" + (mm[1]?mm:"0"+mm[0]) +"-" + (dd[1]?dd:"0"+dd[0]) +"T00:00:00Z"; // padding
    };

    $scope.jsonFilterQuery = function () {
     var query = [];
     if($scope.filterButtons.length == 0)
       return query;
     for (var i =0,l=$scope.filterButtons.length; i < l; i++) {
           query.push($scope.filterButtons[i]["query"]);
       }
       //alert(query.length);
     return query;
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
                zoomType: 'x',
                height:405,
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
                text: 'Detainees'

            },
            xAxis: {
                type: 'datetime'
            },
            yAxis:  [{ // Primary yAxis
                title: {
                        text: 'No of Applications'
                    },
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    },
                    min:0,
                    verticalAlign: 'middle', // Position them vertically in the middle
                    align: 'bottom' 
                }, { // Secondary yAxis
                  title: {
                      text: 'Rage of Change',
                      style: {
                          color: Highcharts.getOptions().colors[1]
                      }
                  },
                  labels: {
                      format: '{value} %',
                      style: {
                          color: Highcharts.getOptions().colors[1]
                      }
                  },
                opposite: true
            }],
            exporting: { enabled: false },
            plotOptions: {
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
                type: 'column',
                name: 'distribution',
                data: data
                
            },
            {
                type: 'line',
                name: 'Rate of Change',
                yAxis: 1,
                data: change
            }
            ]
        });
    };






    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("detainee");
});
