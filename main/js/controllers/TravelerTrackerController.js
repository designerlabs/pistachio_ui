'use strict';

MetronicApp.controller('TravelerTrackerController', function($rootScope,$scope,$http) {


// angular.element(document).ready(function () {
// alert('Hi this is fn_LoadAllRequest');
    // alert($rootScope.docno + ", " + $rootScope.cntry );
fn_LoadAllRequest();
var inoutTbl = undefined;
function fn_LoadAllRequest(){	  
	 	 debugger;
	 	// Get Basic details of traveler
	 	//$rootScope.docno
	 	// $rootScope.cntry

			$.get("http://pistachio_server:8983/solr/immigration1/query?json={query : 'mad_doc_no:SK4107002 AND country:PAKISTAN',sort  : 'mad_crt_dt desc',limit : 20000,facet: {visa : {type: terms,field: mad_pas_typ_cd},employers : {type: terms,field: employer}}}")
			.success(function(data) {
			 	console.log(data.response.docs[0].mad_applcnt_nm);
				$scope.basicdetails = data.response.docs[0];
				
		   });
		// Get details of visa and in and outs
			//$.get("http://pistachio_server:8983/solr/his/query?rows=2&json={query: 'country:PAKISTAN AND doc_no:AA0929482',limit: 1,sort  : 'xit_date desc',facet: {branch : {type: terms,field: branch},exits: {type: range,field: xit_date,start: '2015-01-01T00:00:00Z',end: '2016-03-23T00:00:00Z',gap: '%2B1DAY'},in_outs: {type: terms,field: dy_action_ind,facet: {branch : {type: terms,field: branch}}},officer :{type: terms,field: dy_create_id}}}}")
			$.get("http://pistachio_server:8983/solr/his/query?rows=2&json={query:%20%22country:SINGAPORE%20AND%20doc_no:E3522027C%22,limit:%201,sort%20%20:%20%27xit_date%20desc%27,facet:%20{exits:%20{type:%20range,field:%20xit_date,mincount%20:%201,start:%20%222000-01-01T00:00:00Z%22,end:%20%222016-03-23T00:00:00Z%22,gap:%20%22%2B1DAY%22,facet:{in_outs:%20{type:%20terms,field:%20dy_action_ind,facet:%20{branch%20:%20{type:%20terms,field:%20branch,facet%20:{officer%20:{type:%20terms,field:%20dy_create_id}}}}}}}}}}")
			.success(function(data) {
			 	console.log(data.facets.count);			 	
				$scope.persondetails = data.response.docs[0];
				$scope.InOutdetails = data.facets.exits.buckets;
				$scope.inoutTbl = data.facets.exits.buckets;
				// $scope.Officers = data.facets.officer.buckets;				
				 // newj =  data.facets.branch.buckets;
				// svg.append("svg:text")
				//   .attr("class", "aster-score")
				//   .attr("dy", ".35em")
				//   .attr("text-anchor", "middle") // text-align: right
				//   .text($scope.InOutdetails.count.toString());
		   });
		}
// });
// debugger;
	$scope.inoutTbl.forEach(function(e) {
	   e.start = e.val;	   
	   e.content =(e.in_outs.buckets[0].val == 1 ? 'IN' : 'OUT');	   
	});
 

     var container = document.getElementById('visualization');
     var newitems = $scope.InOutdetails;
      var options = {
 	    height: '300px',
 	    min: new Date(2012, 0, 1),                // lower limit of visible range
 	    max: new Date(2017, 0, 1),                // upper limit of visible range
 	    zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
 	    zoomMax: 1000 * 60 * 60 * 24 * 31 * 3     // about three months in milliseconds
 	  };
     var timeline = new vis.Timeline(container, newitems, options);

     /**
      * Move the timeline a given percentage to left or right
      * @param {Number} percentage   For example 0.1 (left) or -0.1 (right)
      */
     function move (percentage) {
         var range = timeline.getWindow();
         var interval = range.end - range.start;

         timeline.setWindow({
             start: range.start.valueOf() - interval * percentage,
             end:   range.end.valueOf()   - interval * percentage
         });
     }

     /**
      * Zoom the timeline a given percentage in or out
      * @param {Number} percentage   For example 0.1 (zoom out) or -0.1 (zoom in)
      */
     function zoom (percentage) {
         var range = timeline.getWindow();
         var interval = range.end - range.start;

         timeline.setWindow({
             start: range.start.valueOf() - interval * percentage,
             end:   range.end.valueOf()   + interval * percentage
         });
     }

     // attach events to the navigation buttons
     document.getElementById('zoomIn').onclick    = function () { zoom(-0.2); };
     document.getElementById('zoomOut').onclick   = function () { zoom( 0.2); };
     document.getElementById('moveLeft').onclick  = function () { move( 0.2); };
     document.getElementById('moveRight').onclick = function () { move(-0.2); };


// //All the function of d3 chart

// var j = [{"id":"FIS","order":"1.1","score":"59","weight":"0.5","color":"#90041","label":"KL INTERNATIONAL AIRPORT"},
// 			{"id":"MAR","order":"1.3","score":"24","weight":"0.5","color":"#C32F4B","label":"LTA BAYAN LEPAS"},
// 			{"id":"AO","order":"2","score":"98","weight":"1","color":"#E1514B","label":"GELANG PATAH LALUAN KEDUA 1"},
// 			{"id":"NP","order":"3","score":"60","weight":"1","color":"#F47245","label":"KL INTERNATIONAL AIRPORT - SERVER 2"}];
// 	var width = 300,
// 	    height = 300,
// 	    radius = Math.min(width, height) / 2,
// 	    innerRadius = 0.3 * radius;

// 	var pie = d3.layout.pie()
// 	    .sort(null)
// 	    .value(function(d) { return d.width; });

// 	var tip = d3.tip()
// 	  .attr('class', 'd3-tip')
// 	  .offset([0, 0])
// 	  .html(function(d) {
// 	    return d.data.label + ": <span style='color:orangered'>" + d.data.score + "</span>";
// 	  });

// 	var arc = d3.svg.arc()
// 	  .innerRadius(innerRadius)
// 	  .outerRadius(function (d) { 
// 	    return (radius - innerRadius) * (d.data.score / 100.0) + innerRadius; 
// 	  });

// 	var outlineArc = d3.svg.arc()
// 	        .innerRadius(innerRadius)
// 	        .outerRadius(radius);

// 	var svg = d3.select("#BranchChart").append("svg")
// 	    .attr("width", width)
// 	    .attr("height", height)
// 	    .append("g")
// 	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// 	svg.call(tip);
// 	a();

// 	// d3.csv('aster_data.csv', function(error, data) {
// function a(){
// 	var data = j;
// 	  data.forEach(function(d) {
// 	    d.id     =  d.id;
// 	    d.order  = +d.order;
// 	    d.color  =  d.color;
// 	    d.weight = +d.weight;
// 	    d.score  = +d.score;
// 	    d.width  = +d.weight;
// 	    d.label  =  d.label;
// 	  });
// 	  // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }
	  
// 	  var path = svg.selectAll(".solidArc")
// 	      .data(pie(data))
// 	    .enter().append("path")
// 	      .attr("fill", function(d) { return d.data.color; })
// 	      .attr("class", "solidArc")
// 	      .attr("stroke", "gray")
// 	      .attr("d", arc)
// 	      .on('mouseover', tip.show)
// 	      .on('mouseout', tip.hide);

// 	  var outerPath = svg.selectAll(".outlineArc")
// 	      .data(pie(data))
// 	    .enter().append("path")
// 	      .attr("fill", "none")
// 	      .attr("stroke", "gray")
// 	      .attr("class", "outlineArc")
// 	      .attr("d", outlineArc);  


	  // calculate the weighted mean score
	  // var score = 
	  //   data.reduce(function(a, b) {
	  //     //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
	  //     return a + (b.score * b.weight); 
	  //   }, 0) / 
	  //   data.reduce(function(a, b) { 
	  //     return a + b.weight; 
	  //   }, 0);

	  // svg.append("svg:text")
	  //   .attr("class", "aster-score")
	  //   .attr("dy", ".35em")
	  //   .attr("text-anchor", "middle") // text-align: right
	  //   .text();
		
	// };

	// console.log('hello'+$scope.InOutdetails.count.toString());

$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        $scope.database = "default";       
	});

});


