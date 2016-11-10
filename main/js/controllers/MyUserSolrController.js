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


MetronicApp.controller('MyUserSolrController', function($rootScope, $scope, $http) {
    var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/immigration2/query?collection=myuser&json='

    $scope.$on('$viewContentLoaded', function() {
        $scope.firstTime = true;
        // initialize core components
        Metronic.initAjax();
        $(".page-sidebar-menu > li").removeClass('active');
        $("#dashboardLink").addClass('active');
        //alert("HI");
        var getUser = localStorage.getItem("username");

        $scope.reset();
        $scope.date_range();


    });

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      $scope.generateBarGraph('#dashboard-stats')
    });
        
    $rootScope.$on('loading:progress', function (){
        console.log("loading");
        $scope.loading = true;
    });

    $rootScope.$on('loading:finish', function (){
        $scope.loading = false;
        console.log("stop");
    });



    function cb(start, end) {
      $('#vaa-range span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $scope.date_range = function() {

      cb(moment("20120101", "YYYYMMDD"), moment());

      $('#vaa-range').daterangepicker({
          ranges: {
             'Last 30 Days': [moment().subtract(29, 'days'), moment()],
             '2016': [moment("20160101", "YYYYMMDD"), moment()],
             '2015': [moment("20150101", "YYYYMMDD"), moment("20151231", "YYYYMMDD")],
             '2014': [moment("20140101", "YYYYMMDD"), moment("20141231", "YYYYMMDD")],
             '2013': [moment("20130101", "YYYYMMDD"), moment("20131231", "YYYYMMDD")],
             '2012': [moment("20120101", "YYYYMMDD"), moment("20121231", "YYYYMMDD")]//,
           //  '2011': [moment("20110101", "YYYYMMDD"), moment("20111231", "YYYYMMDD")],
           //  '2010': [moment("20100101", "YYYYMMDD"), moment("20101231", "YYYYMMDD")]

          },
          opens : "right",
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




    $scope.queryType = 'active';
    $scope.changeQueryType = function () {
       // $scope.querySolr();
    };

    $scope.moreJobs = function(){
      $scope.jobCount = $scope.jobCount + 10;

      var json = {};
      json.limit  = 0;
      json.offset = 0
      json.query = $scope.formQuery();
      json.filter = $scope.filterQuery();
      json.facet = {};
      json.facet.job = {};
      json.facet.job.type   = "terms";
      json.facet.job.field  =  "job_en";
      json.facet.job.limit  =  $scope.jobCount;
      $scope.jobCount
      $http.get(thisSolrAppUrl+JSON.stringify(json)).
           success(function(data) {
              $scope.jobs = data.facets.job.buckets;
              //return data;
            })

    }

    $scope.reset = function(){
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
$scope.selectBranch = false;
         $scope.dateRange = {};
         $scope.dateRange.min = "2012-01-01T00:00:00Z"
         $scope.dateRange.max = "2016-01-01T00:00:00Z"
         cb(moment("20100101", "YYYYMMDD"), moment());
         //$scope.analysiType = 'overall';
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
        $scope.addFilter("sex","Sex : "+data,"sex:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickRank = function(data) {
        $scope.rankSelected = data;
        $scope.formUserGraph($scope.selectedBranch);
        $scope.addFilter("rnk","Rank : "+data,"{!tag=RANK}rank:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickState = function(data) {
        $scope.stateSelected = data;
        $scope.addFilter("sta","Negeri :"+data,"{!tag=STATE}state:"+$scope.cleanQuery(data));
        $scope.querySolr();
       }

       $scope.clickBranch = function(data) {
        $scope.selectBranch = true
        $scope.selectedBranch = data;
        $scope.addFilter("brn","Branch :"+data,"{!tag=BRANCH}branch_short:"+$scope.cleanQuery(data));
        $scope.formUserGraph(data)
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
        $scope.addFilter("cnt","Country : "+data,"country:"+$scope.cleanQuery(data));
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
            if(data == "sta") $scope.stateSelected = "";
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
       $scope.formUserGraph = function(data) {
        var width = 500,
            height = 400
        if(data == undefined) return;
        
        var brnch = data.split("-")[0]
        var fq = "branch_code:"+brnch;
        var q = "*:*"
        if($scope.rankSelected.length > 0)
           q = "rank:\""+$scope.rankSelected+"\""

       // debugger;
         var graph = {};
         $http.get("http://hnode3:8983/solr/myuser/stream?expr= \
gatherNodes(myuser,\
gatherNodes(myuser, \
search(myuser, q="+q+" ,fl=user_id, sort=user_id asc, fq="+fq+", qt=/export), \
walk=\"user_id->user_id\", \
trackTraversal=\"true\", \
gather=\"suprivisor\"), \
walk=\"node->user_id\", \
scatter=\"leaves,branches\", \
gather=\"suprivisor\")")
        .success(function(data) {
            
            var graph = data["result-set"].docs;
             var links = [];
             var nodes = [];
             var fnodes = [];
            for (var i in graph) {

                var node = {}
                var doc = graph[i];
                if(doc["EOF"]) continue;
                node.name = doc["node"];
                node.id = parseInt(i);
                nodes[node.name] = node
            }
            
            for (var i in graph) {
                var doc = graph[i];
                    var node = {}
 if(doc["EOF"]) continue;
                    node.name = doc["node"];
                    node.id = parseInt(i);
                    console.log(doc["field"]);
                    var sources = doc.ancestors;
                    if(doc["field"] == "user_id")
                        node.same_branch = true;
                    else
                        node.same_branch = false;
                    for( var j in sources) {
                        var link = {};
                        node.type = "suprivisor"            
                        var s = sources[j];
                        var n = nodes[s]

                        link.source = parseInt(i);
                        
                        link.target =n.id;
                        links.push(link);
                    }
                    fnodes.push(node);
            }
            $scope.userGraph(fnodes,links)

        });


        
       }

   $scope.userGraph = function (nodes, links) {
        var margin = {top: -5, right: -5, bottom: -5, left: -5};
        var width = Metronic.getViewPort().width - margin.left - margin.right;
        width = width *.7;
    var height = Metronic.getViewPort().height- margin.top - margin.bottom;
    height = 600;//height*1;
    console.log( "height :"+height)
    console.log( "width :"+width)

    var linkedByIndex = {};
    links.forEach(function(d) {
    linkedByIndex[d.source + "," + d.target] = true;
    });

    function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    function hasConnections(a) {
        for (var property in linkedByIndex) {
                s = property.split(",");
                if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property])                    return true;
        }
    return false;
    }

    var color = d3.scale.category20();

    //Forcus
    var focus_node = null, highlight_node = null;
    var highlight_color = "red";
    var highlight_trans = 0.1;
    var towhite = "stroke";

    var force = d3.layout.force()
                  .nodes(nodes)
                  .links(links)
                  .size([width, height])
                  .linkDistance(60)
                  .charge(-100)
                  .on("tick", tick)
                  .start();
    d3.selectAll("#usergraph > *").remove();


    var svg = d3.select("#usergraph").append("svg:svg")
                .attr("width", width)
                .attr("height", height);

    var arrow = svg.append("defs").selectAll("marker")
    .data(["end"]) 
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .style("fill", "grey")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5");

    var path = svg.append("svg:g")
                  .selectAll("path")
                  .data(force.links())
                  .enter().append("svg:path")
                  .attr("class", function (d) {
                      return "link " + d.id;
                  }).attr("marker-end", "url(#end)");

    var circle = svg.append("svg:g")
                    .selectAll("circle")
                    .data(force.nodes())
                    .enter().append("svg:circle")
                    .attr("r", 6)
                    .style("fill", function(d) { 
                        if(d.same_branch)
                           return "#6AABF7"
                        else
                            return "#8000FF"
                    })
                    .call(force.drag);

    var text = svg.append("svg:g")
                  .selectAll("g")
                  .data(force.nodes())
                  .enter().append("svg:g")
                  .attr("class", "nodeText");

    // A copy of the text with a thick white stroke for legibility.
    text.append("svg:text")
        .attr("x", 8)
        .attr("y", ".31em")
        .attr("class", "shadow")
        .text(function (d) {
            return d.name;
        });

    text.append("svg:text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function (d) {
            return d.name;
        });

        circle.on("mouseover", function(d) {
            var coordinates = d3.mouse(this);
            var padding = {x: -220, y: -20};
            d3.select("#d3-tooltip")
            .style("left", d.x + padding.x + "px")
            .style("top", d.y + padding.y + "px")
            .select("#info")
            .text(get_info(d.name));
            d3.select("#d3-tooltip").classed("hidden", false);

            set_highlight(d);
        })
        .on("click", function(d) { d3.event.stopPropagation();
            focus_node = d;
            set_focus(d)
            if (highlight_node === null) set_highlight(d)
        })
        .on("mouseout", function(d) {
            exit_highlight();
            d3.select("#d3-tooltip").classed("hidden", true);
        })
        .on("contextmenu", function(d) {
            xit_focus(d);
            exit_highlight();
        })
        ;

        function get_info(name) {
            $http.get("http://hnode3:8983/solr/myuser/get?id=IXLA01")
            .success(function(data) {
                $scope.officer_name = data.doc.name;
                return "data.doc.name"
            });
        }

        function exit_highlight()
        {
                highlight_node = null;
            if (focus_node===null)
            {
                svg.style("cursor","move");
                if (highlight_color!="white")
                {
                  circle.style(towhite, "white").attr("r",6);
                  text.style("font-weight", "normal").style("font-size",10);
                  path.style("stroke", function(o) {return "grey"});
                }
                    
            }
        }

function set_focus(d)
{   
if (highlight_trans<1)  {
    circle.style("opacity", function(o) {
                return isConnected(d, o) ? 1 : highlight_trans;
            });

            text.style("opacity", function(o) {
                return isConnected(d, o) ? 1 : .2;
            });
            
            path.style("opacity", function(o) {
                return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
            });     
    }
}

function xit_focus(d) {
    circle.style("opacity", 1);
    text.style("opacity", 1);
    path.style("opacity",1);     
}


function set_highlight(d)
{
    svg.style("cursor","pointer");
    if (focus_node!==null) d = focus_node;
    highlight_node = d;

    if (highlight_color!="white")
    {
          circle.style(towhite, function(o) {
                return isConnected(d, o) ? highlight_color : "white";})
          .attr("r",function(o) {
                return isConnected(d, o) ? 12 : 3;}) 
           ;
            text.style("font-weight", function(o) {
                return isConnected(d, o) ? "bold" : "normal";})
            .style("font-size", function(o) {
                return isConnected(d, o) ? 12 : 0;});
            path.style("stroke", function(o) {
              return o.source.index == d.index || o.target.index == d.index ? highlight_color : "grey";

            });
    }
}

function tick() {
        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0 1," + d.target.x + "," + d.target.y;
        });

        circle.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        text.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }


        
    
    }



       $scope.querySolr = function() {

          $scope.filters = false;
          var json = {};
          if($scope.analysiType == 'overall')
          {
            json.limit  = 10;
            json.offset = 0
            json.query = $scope.formQuery();
           // json.filter = $scope.filterQuery();
            json.facet = {};
            json.facet.rank = {};
            json.facet.rank.type   = "terms";
            json.facet.rank.field  =  "rank";
            json.facet.rank.domain = {};
            json.facet.rank.domain.excludeTags ="RANK"
            json.facet.branch = {};
            json.facet.branch.type   = "terms";
            json.facet.branch.limit   = 6;
            json.facet.branch.field  =  "branch_short";
            json.facet.branch.domain = {};
            json.facet.branch.domain.excludeTags ="BRANCH"
            json.facet.state = {};
            json.facet.state.type   = "terms";
            json.facet.state.field  =  "state";
            json.facet.state.domain = {};
            json.facet.state.domain.excludeTags ="STATE"
            json.facet.state.limit  =  20;
            json.facet.user_type = {};
            json.facet.user_type.type   = "terms";
            json.facet.user_type.field  =  "user_type";
          }
          var active = "&fq=xit_date:[ "+moment().format('YYYY-MM-DDT00:00:00')+'Z' + " TO * ]"
          $http.get(thisSolrAppUrl+JSON.stringify(json)+active+$scope.fqQuery()).
             success(function(data) {
              $scope.numFound = data.response.numFound;
              $scope.officer = data.response.docs;
                 if(selected_countries == 0) {
                   $scope.rank = data.facets.rank.buckets;
                   $scope.branch = data.facets.branch.buckets
                   $scope.state = data.facets.state.buckets
                   $scope.user_type = data.facets.user_type.buckets
                  
                   console.log($scope.sex1);
                   $scope.column();
                   
                  // $scope.pie();
                  // $scope.timelineChart(data.facets.date_range.buckets);
                   $scope.rankChart();
                   //$scope.activeOverall();
                   //$scope.generateBarGraph('#dashboard-stats');
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

       

    $scope.pie = function() {
      Highcharts.chart('highchart_pie',{
        chart : {
            type : 'pie',
            height : 260,
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



    $scope.column = function() {
       var sel = -1;
       var _state = $scope.state;

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
              text: 'negeri',
              x: -20 //center
            },
            series: [{
            name: 'negeri',
       //     colorByPoint: true,
            data: stateData,
            showInLegend:false,
          point:{
              events:{
                  click: function (event) {
                      $scope.clickState(event.point.category);
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
         if($scope.rankSelected == _state[i].val) {
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
              text: 'Rank',
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
                      $scope.clickRank(event.point.category);
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



    $scope.getDateLimits = function () {
      //var query = "q=-created%3A\"1900-01-01T00%3A00%3A00Z\"&json.facet ={\"min_date\":\"min(created)\",\"max_date\":\"max(created)\"}}"
      //var sq = "http://"+solrHost+":8983/solr/immigration2/query?"
      //$http.get(sq+query).
      // success(function(data) {
         var y = {};


    }

    $scope.date_query = function () {

      if($scope.analysiType != 'timeline')
       return;

      var query = ""
      var sq = "http://"+solrHost+":8983/solr/myuser/query?json=";

      var json = {};
      json.query = "*:*"
      json.limit = 0;

      var filter = $scope.jsonFilterQuery();
      console.log(filter);
      //alert(filter.length);
      if(filter.length>0)
      {
        json.filter = filter;
      }

      json.facet = {};
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

      json.facet.date_range.gap    = "%2B1MONTH";



      $http.get(sq+JSON.stringify(json)).
       success(function(data) {
         console.log(data);
         $scope.timelineChart(data);
         //return data;
       })
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
                text: 'Visa Applications'

            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
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
    $rootScope.settings.layout.setTitle("myuseranalysis");
});
