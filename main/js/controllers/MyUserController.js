'use strict';

MetronicApp.controller('MyUserController', function($rootScope, $scope, $http) {

    $scope.$on('$viewContentLoaded', function () {
        $scope.requestData();
   //   $scope.test();
        $scope.pname = "test"
    });

    $scope.requestData = function () {
        $http.get(globalURL + "api/secured/pistachio/myaudit/branch/usermap?branch=LTA KUCHING" ,
            { headers: { 'Content-Type': 'application/json' } }

        )
            .success(function (response) {

                    $scope.test(response.nodes, response.links);
             
            });
    }


    $scope.test = function (nodes,links) {

var margin = {top: -5, right: -5, bottom: -5, left: -5};
    var width = Metronic.getViewPort().width - margin.left - margin.right;
    width = width *.7;
    var height = Metronic.getViewPort().height- margin.top - margin.bottom;
    height = height*.5;
    console.log( "height :"+height)
    console.log( "width :"+width)

        var color = d3.scale.category20();
    
    var force = d3.layout.force()
            .charge(-200)
            .gravity(.35)
            .linkDistance(50)
            .alpha(0.1) 
            .size([width + margin.left + margin.right, height + margin.top + margin.bottom]);

        var zoom = d3.behavior.zoom()
            .scaleExtent([1, 10])
            .on("zoom", zoomed);

        var drag = d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", dragstarted)
            .on("drag", dragged)
            .on("dragend", dragended);


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
          
        node.append("circle")
            .attr("r", function(d) { return 12 })
            .style("stroke",function(e) {
                return color(e.rank)
            })
            .style("fill", function(d) { 
                if(d.validDays <30 ) return "#FB572F";
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
                        $scope.pname = d.name;
                        console.log($scope.pname)
                        node.classed("node-active", function(o) {
                            var thisOpacity = isConnected(d, o) ? true : false;
                            this.setAttribute('fill-opacity', thisOpacity);
                            return thisOpacity;
                        });

                        link.classed("link-active", function(o) {
                            return o.source === d || o.target === d ? true : false;
                        });
                        
                        d3.select(this).classed("node-active", true);
                        d3.select(this).select("circle").transition()
                                .duration(750)
                                .attr("r", 25);
                          d3.select("#tooltip")
                            
                            .select("#info")
                            .text(function(e) {  return d.name})
                              d3.select("#tooltip")
                            .select("#rank")
                            .text(function(e) {  return d.validdays});
                            d3.select("#tooltip").classed("hidden", false);
                })
        
        .on("mouseout", function(d){
                        
                        node.classed("node-active", false);
                        link.classed("link-active", false);
                    
                        d3.select(this).select("circle").transition()
                                .duration(750)
                                .attr("r", 15);
                        d3.select("#tooltip").classed("hidden", true);
                });


        function dottype(d) {
          d.x = +d.x;
          d.y = +d.y;
          return d;
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
            height = 700
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
                d3.select("#tooltip").classed("hidden", true);
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

});