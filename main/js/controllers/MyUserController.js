'use strict';

MetronicApp.controller('MyUserController', function($rootScope, $scope, $http, sortable, NgTableParams, $filter, $q) {

    $scope.$on('$viewContentLoaded', function () {
        //$scope.requestData();
        //$scope.pname = "test";
        $scope.showOfficer = false;
        $scope.activeGraph = false;
        $scope.showPie = false;
        $scope.selectedDayTime = false;
        $scope.ErrorMsg = false;
        $scope.branchList = function (start, end, day, hour) {
            this.start = start;
            this.end = end;
            if ((day == undefined) || (hour == undefined)) {
                $scope.triggerHourDt = "";
            } else {
                $scope.triggerHourDt = "?day=" + day + "&hour=" + hour;
            }
          //  api/secured/pistachio/myuser/branch
            $http.get(globalURL + "api/secured/pistachio/myuser/branch" + $scope.triggerHourDt)
                .success(function (response) {
                    console.log(response);
                    $scope.branches = response;
                    if ($scope.branches.length === 0) {
                        $scope.checkList = true;
                        $scope.activeBranch = false;
                        $scope.showOfficer = false;
                    } else {
                        $scope.checkList = false;
                    }
                    sortable($scope, response, 8, 'updated_at');
                    $scope.loading = false;
                })
                .error(function (response) {
                    //debugger;
                });
        };
        //$scope.branchList();
        $scope.getBranchDetails = function (total, hour, day, branch, activityName) {
            $scope.loading = true;
            //$scope.activityName = undefined;
            var Hr = hour.split('&');
            var Dt = day.split('&');
            console.log( $('rect').hasClass('activeBox'));
            if(hour){
                $scope.Hr = Hr[1];
                $scope.Dt = Dt[1];
            }else{
                $scope.Hr = undefined;
                $scope.Dt = undefined;
            }
            
            $('.selectedBox').html("On <b>" + Dt[0] + "</b> @ " + Hr[0] + ", total activity: <b>" + total + "</b>");
            $scope.branch_selected(branch, Dt[1], Hr[1], activityName);
            $scope.branchList(this.start, this.end, Dt[1], Hr[1]);
        };


         var start = moment().subtract(6, 'days');
        var end = moment();

        function cb(start, end) {


            // if(($scope.activeBranch) && ($scope.activeUser)){
            //     $scope.startDt = start.format('YYYY-MM-DD');
            //     $scope.endDt  = end.format('YYYY-MM-DD');
            //     $scope.branch_selected($scope.activeBranch);
            //     $scope.officer_change($scope.activeUser);

            // }else  
            if ($scope.activeBranch) {
                //$scope.branchList(start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD'));
                $scope.startDt = start.format('YYYY-MM-DD');
                $scope.endDt = end.format('YYYY-MM-DD');
                $scope.branch_selected($scope.activeBranch);
                $scope.branchList(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                
            } else {
                $scope.branchList(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                $('#branches').collapse('show');
            }



            //$scope.showOfficer = false;

            //$scope.showHeatMap = false;
            $('rect').removeAttr('class', 'activeBox');
            $('rect').attr('class', 'hour bordered');
            //$scope.activeBranch = false;
            $scope.startDt = start.format('YYYY-MM-DD');
            $scope.endDt = end.format('YYYY-MM-DD');
            $('#reportrange span').html(start.format('MMM DD, YYYY') + ' - ' + end.format('MMM DD, YYYY'));
            $scope.startdt = start.format('MMMM D, YYYY');
            $scope.enddt = end.format('MMMM D, YYYY');
        }

        
        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            "alwaysShowCalendars": false,
            opens: 'left',
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);

        
        $("#zoomInOut").change(function(){
            var newValue = this.value;
            $("#newValue").html(newValue);
            $('#usergraph svg g:nth(0)').css({
                '-webkit-transform' : 'scale(' + newValue + ')',
                '-moz-transform'    : 'scale(' + newValue + ')',
                '-ms-transform'     : 'scale(' + newValue + ')',
                '-o-transform'      : 'scale(' + newValue + ')',
                'transform'         : 'scale(' + newValue + ')',
                'transform-origin'  : '50% 50%'
            });
        });

        $('body').on('mousedown', '#tooltip', function() {
            $(this).addClass('draggable').parents().on('mousemove', function(e) {
                $('.draggable').offset({
                    top: e.pageY - $('.draggable').outerHeight() / 2,
                    left: e.pageX - $('.draggable').outerWidth() / 2
                }).on('mouseup', function() {
                    $(this).removeClass('draggable');
                });
                 e.preventDefault();
            });
           
        }).on('mouseup', function() {
            $('.draggable').removeClass('draggable');
        });
    });


    $scope.branch_selected = function (name, day, hour, activityName) {
  
        $scope.activeBranch = name;
        $scope.activeUser = false;
        $scope.loading = true;
        $scope.selectedDayTime = false;
        $('.selectedBox').hide('200');
        $('rect').removeAttr('class', 'activeBox');
        $('rect').attr('class', 'hour bordered');
        if(activityName == undefined){
            $scope.activityName = undefined;
            $scope.activity = "";
        }else{
            $scope.activity = "&txn="+activityName;
        }

        if ((day == undefined) || (hour == undefined)) {
            $scope.triggerHourDt = "";
        } else {
            $scope.triggerHourDt = "&day=" + day + "&hour=" + hour;
        }
        $http.get(globalURL + "api/secured/pistachio/myaudit/officer?branch=" + name + "&from=" + $scope.startDt + "&to=" + $scope.endDt + $scope.triggerHourDt + $scope.activity,
            { headers: { 'Content-Type': 'application/json' } })
            .success(function (response) {
                //$scope.loading = false;
                
                $scope.officers = response;
                if ($scope.officers.length === 0) {
                    $scope.showOfficer = false;
                } else {
                    $scope.showOfficer = true;
                }
                $('#branches').collapse('hide');
                $("#branchHeader span").html('<i class="fa fa-chevron-circle-up" aria-hidden="true"></i>');
            });
        console.log("Getting branch heatmap");
         //$scope.loading = true;
        $http.get(globalURL + "api/secured/pistachio/myaudit/branch/heatmap?branch=" + name + "&from=" + $scope.startDt + "&to=" + $scope.endDt + $scope.triggerHourDt + $scope.activity,
            { headers: { 'Content-Type': 'application/json' } }

        )
            .success(function (response) {
                $scope.ErrorMsg = false;
                $scope.loading = false;
                $scope.requestData(name, $scope.startDt, $scope.endDt);
                
            }).error(function (data, status, headers, config) {
                $scope.loading = false;
                $scope.ErrorMsg = true;
                return status;
            });
    }
    $scope.getStatus = [{id: "", title: "All"}, {id: 'Active', title: 'Active'}, {id: 'In-Active', title: 'In-Active'}];
    $scope.requestData = function (bName, fDate, tDate) {
         $scope.loading = true;
        $("#usergraph").html("");
        $http.get(globalURL + "api/secured/pistachio/myaudit/branch/usermap?branch="+ bName +"&from="+fDate+"&to="+tDate,
            { headers: { 'Content-Type': 'application/json' } }

        )
            .success(function (response) {
                    $scope.loading = false;
                    
                    if(response.links){
                        var unique = {};
                        var distinct = [];
                        for( var i in response.nodes){
                            if( typeof(unique[response.nodes[i].status]) == "undefined"){
                                distinct.push(response.nodes[i].status);
                            }
                            unique[response.nodes[i].status] = 0;
                        }
                        
                        $("#zoomInOut").val(1);
                        $('select[name="status"] option[label="All"]').attr('selected', 'selected');
                        $('input[name="name"]').attr('placeholder', 'Search by name');
                        $scope.tableParams = new NgTableParams({page: 1, count: 10}, { dataset: response.nodes});
                        $scope.officersCount = response.nodes.length;
                        $scope.activeGraph = true;
                        $scope.test(response.nodes, response.links);
                    }else{
                        $scope.ErrorMsg = true;
                        $scope.activeGraph = false;
                    }
                    
             
            });
    }



Date.prototype.days=function(to){
    return  Math.round(Math.floor( to.getTime() / (3600*24*1000)) -  Math.floor( this.getTime() / (3600*24*1000)))
};


$scope.test = function (nodes,links) {

    var margin = {top: -5, right: -5, bottom: -5, left: -5};
    var width = Metronic.getViewPort().width - margin.left - margin.right;
    width = width *.7;
    var height = Metronic.getViewPort().height- margin.top - margin.bottom;
    height = height*1;
    console.log( "height :"+height)
    console.log( "width :"+width)

    var color = d3.scale.category20();
    
    var force = d3.layout.force()
            .charge(-200)
            .gravity(.65)
            .linkDistance(80)
           // .alpha(0.1) 
            .size([width + margin.left + margin.right, height + margin.top + margin.bottom]);

        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 10])
            .on("zoom", zoomed);

        var drag = d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", dragstarted)
            .on("drag", dragged)
            .on("dragend", dragended);

   d3.select("#usergraph.svg").remove();
        var svg = d3.select("#usergraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
            .call(zoom);

        var container = svg.append("g");
        
       
//d3.json('http://blt909.free.fr/wd/map2.json', function(error, graph) {
                
                force
                    .nodes(nodes)
                    .links(links)
                    .start();
                
      $scope.click = false;
        
        var link = container.append("g")
                        .attr("class", "links")
                        .selectAll(".link")
            .data(links)
                        .enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) { return 2; });
 
        var node = container.append("g")
                        .attr("class", "nodes")
                        .selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; })
                        .call(drag);
          
        var circle = node.append("circle")
            .attr("r", function(d) { return 12 })
            .style("stroke",function(e) {
                return color(e.rank)
            })
            .style("fill", function(d) { 

                if(d.validDays <30 ) return "#FB572F";
                else if(d.status == "In-Active") return "grey"
                else return "#6AABF7" });
         
                
                force.on("tick", function() {
                    link.attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                });
                
                var linkedByIndex = {};
                links.forEach(function(d) {
                    linkedByIndex[d.source.index + "," + d.target.index] = 1;
                });

                function isConnected(a, b) {
                    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
                }

                    node.on("mouseover", function(d){
                        if($scope.click ==  true) {
                            return
                        }
                        $scope.pname = d.name;
                        console.log($scope.pname);
                        
                        node.classed("node-active", function(o) {
                            var thisOpacity = isConnected(d, o) ? true : false;
                            
                            this.setAttribute('fill-opacity', thisOpacity);
                            return thisOpacity;
                        });

                        $scope.connectedOfficer = $(".node-active").length;
            

                        link.classed("link-active", function(o) {
                            return o.source === d || o.target === d ? true : false;
                        });
                        var formatDate = d3.time.format("%d / %m / %Y"), parseDate = d3.time.format("%Y-%m-%d").parse;
                       

                        var currentDate = new Date();
                        var day = currentDate.getDate();
                        var month = currentDate.getMonth() + 1;
                        var year = currentDate.getFullYear();
                        var todayDt = year+"/" + month + "/" +day;

                        
                        var remainingValidity = new Date(todayDt).days(new Date(d.endDate));
                      
                        d3.select(this).classed("node-active", 0.1);
                        //debugger;
                        $(".nodes > .node").not('.node-active').children('circle').attr({
                            'fill-opacity': 0.2,
                            'stroke-opacity': 0.2
                        });

                        $(".links > .link").not('.link-active').attr('style', 'stroke-opacity : 0.15 !important');

                        d3.select(this).select("circle").transition()
                            .duration(750)
                            .attr("r", 25);
                        d3.select("#tooltip")
                            .select("#info")
                            .text(function(e) {  return d.name});
                        d3.select("#tooltip")
                            .select("#rank")
                            .text(function(e) {  return d.rank});
                        d3.select("#tooltip")
                            .select("#createDt")
                            .text(function(e) {  return formatDate(parseDate(d.createDate))});
                        d3.select("#tooltip")
                            .select("#endDt")
                            .text(function(e) {  return formatDate(parseDate(d.endDate))});
                        d3.select("#tooltip")
                            .select("#validity")
                            .text(function(e) {
                             
                                if(isNaN(Math.log(remainingValidity))){
                                    $("#validity").parent('p').removeClass();
                                    $("#validity").parent('p').addClass('bg_danger');
                                }else if(remainingValidity <= 60){
                                    $("#validity").parent('p').removeClass();
                                    $("#validity").parent('p').addClass('bg_warning');
                                }else{
                                    $("#validity").parent('p').removeClass();
                                    $("#validity").parent('p').addClass('bg_success');
                                };
                                return remainingValidity+" Day(s)"
                            });

                        d3.select("#tooltip")
                            .select("#duration")
                            .text(function(e){ return d.validDays });
                         d3.select("#tooltip")
                            .select("#usrId")
                            .text(function(e) {  return d.usrId});
                        d3.select("#tooltip")
                            .select("#adminId")
                            .text(function(e) {  return d.crtId});
                        d3.select("#tooltip")
                            .select("#connectedOfficer")
                            .text(function(e) {  return $scope.connectedOfficer});
                          d3.select("#tooltip").classed("hidden", false);
                })
        
        .on("mouseout", function(d){
            if($scope.click == false) {
                $(".nodes > .node").children('circle').attr({
                            'fill-opacity': 1,
                            'stroke-opacity': 1
                        });

                        $(".links > .link").attr('style', 'stroke-opacity : 1 !important');

                        $(".nodes > .node").attr('fill-opacity', 1);
                        node.classed("node-active", false);
                        link.classed("link-active", false);
                         $("#validity").parent('p').removeClass();
                        d3.select(this).select("circle").transition()
                                .duration(750)
                                .attr("r", 15);
                        $("#tooltip .summaryTitle p span").html('<span style="color:red;"></span>');
            }
                       
                        //d3.select("#tooltip").classed("hidden", true);
                })
        .on("click", function(d){
            if($scope.click)
                $scope.click = false;
            else
                $scope.click = true;
            //alert("click")
            //d3.select("#tooltip").classed("hidden", fa);
                });
        function dottype(d) {
          d.x = +d.x;
          d.y = +d.y;
          return d;
        }
        createFilter();

        // Method to create the filter, generate checkbox options on fly
        function createFilter() {
            d3.select(".filterContainer").selectAll("div").remove();
            d3.select(".filterContainer").selectAll("div")
              .data(["Active", "In-Active"])
              .enter()  
              .append("div")
              .attr("class", "checkbox-inline")
              .append("label")
              .each(function (d) {
                    // create checkbox for each data
                    d3.select(this).append("input")
                      .attr("type", "checkbox")
                      .attr("id", function (d) {
                          return "chk_" + d;
                       })
                      .attr("checked", true)
                      .on("click", function (d, i) {

                          var lVisibility = this.checked ? "visible" : "hidden";
                          filterGraph(d, lVisibility);
                       })
                    d3.select(this).append("span")
                        .text(function (d) {
                            return d;
                        });
            });
            $("#sidebar").show();
        }
        function filterGraph(aType, aVisibility) {
        // change the visibility of the connection path
        var lOriginalVisibility = $(this).css("visibility");

        circle.style("visibility", function (o) {
            return o.status === aType ? aVisibility : lOriginalVisibility;
        });
        link.style("visibility", function (o) {
          //  debugger;
            
            return o.source.status === aType ||o.target.status === aType ? aVisibility : lOriginalVisibility;
        });

        
    }

        function zoomed() {
          container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        function dragstarted(d) {
          d3.event.sourceEvent.stopPropagation();
          
          d3.select(this).classed("dragging", true);
          force.start();
        }

        function dragged(d) {
          
          d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
          
        }

        function dragended(d) {
          
          d3.select(this).classed("dragging", false);
        }
    }



    $scope.userGraph = function (nodes, links) {
        var width = 960,
            height = 900
            //debugger;
        if ($scope.svg_network != undefined)
            $scope.svg_network.remove();

        $scope.svg_network = d3.select("#usergraph").append("svg")
            .attr("width", width)
            .attr("height", height);


        var force = d3.layout.force()
            .gravity(.25)
            .distance(100)
            .charge(-120)
            .size([width, height]);

        force
            .nodes(nodes)
            .links(links)
            .start();
        console.log(links)
       
        var link = $scope.svg_network.selectAll("link")
            .data(links)
            .enter().append('line')
            .attr('class', 'link')
            .style('stroke-width', 3);
        var node = $scope.svg_network.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        node.append("circle")
            .attr("r", "15")
            .attr("fill", function(d) { 
                
                if(d.validDays <30 ) return "#FB572F"
                else return "#D3FAF2"
                 })

     
      //  node.append("text")
      //      .attr("dx", 22)
      //      .attr("dy", ".35em")
      //      .text(function (d) { return d.name });
        var padding = {x: 50, y: 20};
        var linkedByIndex = {};
                links.forEach(function(d) {
                    linkedByIndex[d.source.index + "," + d.target.index] = 1;
                });

                 
          node.on( 'mouseenter', function(d) {
                
/*                 var coordinates = d3.mouse(this);
                             d3.select("#tooltip")
                            .style("left", coordinates[0] + padding.x + "px")
                            .style("top", coordinates[1] + padding.y + "px")
                            .select("#info")
                            .text(function(e) {  return d.name});
                            d3.select("#tooltip").classed("hidden", false);
*/
                   fade(.1);
    /*                    d3.select(this).select("circle").transition()
                                .duration(750)
                                .attr("r",35);
*/
          })
          // set back
          .on( 'mouseleave', function() {
                fade(.8);
                    
                        d3.select(this).select("circle").transition()
                                .duration(750)
                                .attr("r", 15);
                //d3.select("#tooltip").classed("hidden", true);
          });

        
        force.on("tick", function () {
            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

 
        function isConnected(a, b) {
                        console.log("checking connected")
                        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
                    }
                     function fade(opacity) {
                        console.log("fade start")
                        return function(d) {
                            console.log("fade in")
                            node.style("stroke-opacity", function(o) {
                                thisOpacity = isConnected(d, o) ? 1 : opacity;
                                this.setAttribute('fill-opacity', thisOpacity);
                                console.log("fading"+thisOpacity)
                                return thisOpacity;
                            });

                            link.style("stroke-opacity", function(o) {
                                return o.source === d || o.target === d ? 1 : opacity;
                            });
                        };
                    }

                    function showTooltip() {
                           
                    }

    }

    
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("myuseranalysis");

});