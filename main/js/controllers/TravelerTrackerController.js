'use strict';

MetronicApp.controller('TravelerTrackerController', function($rootScope,$scope,$http, $timeout) {

$scope.res = "result";
 $scope.personal12 = "result";
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        $scope.database = "default"; 
               // fn_LoadAllRequest();             
            
	});

console.log(window.location.href);
var Qstring = window.location.href;
var Qparam = Qstring.replace('=',':').replace('=',':').replace('&',' AND ').split('?')[1];

var inoutTbl = undefined;
function fn_LoadAllRequest(){	  
	 	// Get Basic details of traveler
	 	$rootScope.docno
	 	$rootScope.cntry

		// Get details of visa and in and outs
			//$.get("http://pistachio_server:8983/solr/his/query?rows=2&json={query: 'country:PAKISTAN AND doc_no:AA0929482',limit: 1,sort  : 'xit_date desc',facet: {branch : {type: terms,field: branch},exits: {type: range,field: xit_date,start: '2015-01-01T00:00:00Z',end: '2016-03-23T00:00:00Z',gap: '%2B1DAY'},in_outs: {type: terms,field: dy_action_ind,facet: {branch : {type: terms,field: branch}}},officer :{type: terms,field: dy_create_id}}}}")

	}
	// "+$rootScope.docno+" "+$rootScope.cntry+"
	//http://10.4.104.177:8983/ //immigration2
$scope.fn_getBasicInfo = function(){//mad_pas_typ_cd
	$.get("http://10.4.104.177:8983/solr/immigration2/query?json={query :'"+Qparam+"',limit:20000,facet: {visa : {type: terms,field: pass_typ},employers : {type: terms,field: employer}}}") //mad_pas_typ_cd - pass_typ
	.then(function(data) {
		// debugger;
	 	console.log(data.response.docs);
		$scope.basicdetails = data.response.docs[0];
		// $scope.vstartdt = $scope.basicdetails.created.toString().substr(0,10);
		// $scope.vstartdt = $scope.basicdetails.mad_crt_dt.toString().substr(0,10);
		// $scope.venddt = $scope.basicdetails.vend.toString().substr(0,10);
		// $scope.venddt = $scope.basicdetails.vend.toString().substr(0,10); //end date is not avail in immi..
		$scope.titleDetails = "Visa details"

		$scope.basicdetailsTbl = data.response.docs;

		$('#tblvisa').DataTable( {
		    data: data.response.docs,
		    columns: [
		    	{ "data": "doc_no" },
		        { "data": "name" },
		        { "data": "pass_typ" },
		        { "data": "visitor_typ" },
		        { "data": "job_en" },
		        { "data": "employer" },
		        { "data": "vstart"},
		        { "data": "vend" }
		        // { "data": "mad_doc_no" },
		        // { "data": "mad_applcnt_nm" },
		        // { "data": "mad_pas_typ_cd" },
		        // { "data": "visitor_typ" },
		        // { "data": "job_en" },
		        // { "data": "employer" },
		        // { "data": "mad_crt_dt"},
		        // { "data": "mad_crt_dt" }
		    ]
		} );
		

		$scope.$apply();			

   });
}
	var today=new Date();
	//http://10.4.104.176:8983/
$scope.fn_getPersonalInfo = function(){		
	$.get("http://10.4.104.176:8983/solr/hismove/query?json={query:'"+Qparam+"',limit:1,facet:%20{exits:%20{type:%20range,field:%20xit_date,mincount:1,start:%20%221900-01-01T00:00:00Z%22,end:'"+today.toISOString()+"',gap:%20%22%2B1DAY%22,facet:{in_outs:%20{type:%20terms,field:%20dy_action_ind,facet:%20{branch%20:%20{type:%20terms,field:%20branch,facet%20:{officer%20:{type:%20terms,field:%20dy_create_id}}}}}}}}}}")
	.then(function(result) {
		console.log(result);
		if(result.response.docs.length !== 0){
			$scope.res = result.response.docs[0];		

			$scope.InOutdetails = result.facets.exits.buckets;
			$scope.inoutTbl = result.facets.exits.buckets;
			$scope.CreateInoutChart(result.facets.exits.buckets);

			var strdob = result.response.docs[0].dy_birth_date.toString();
			$scope.dob = strdob.substr(0,4) +"-"+strdob.substr(4,2) +"-"+ strdob.substr(6,2);

			var year=Number(strdob.substr(0,4));
			var month=Number(strdob.substr(4,2))-1;
			var day=Number(strdob.substr(6,2));
			
			$scope.age=today.getFullYear()-year;

			$scope.$apply();
		}else{
			alert('No date found in himove table');
		}
   });
}




 
$scope.CreateInoutChart = function(_data){
	var newary = _data;
	newary.forEach(function(e) {
	   e.start = e.val;	   
	   // e.content =(e.in_outs.buckets[0].val == 'in' ? 'IN' : 'OUT');
	   // className 
	   if(e.in_outs.buckets[0].val == 'in'){
	   	// e.content = "IN";
	   	e.className = 'green';
	   }else{
	   	// e.content = "OUT";
	   	e.className = 'red';
	   }	   
	   e.content = e.in_outs.buckets[0].branch.buckets[0].val + ' , ' + e.in_outs.buckets[0].branch.buckets[0].officer.buckets[0].val;
	});

     var container = document.getElementById('visualization');
     var newitems = newary;
      var options = {
 	    height: '300px',
 	    min: new Date(2012, 0, 1),                // lower limit of visible range
 	    max: new Date(2017, 0, 1),                // upper limit of visible range
 	    zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
 	    zoomMax: 1000 * 60 * 60 * 24 * 31 * 12     // about three months in milliseconds
 	  };
     var timeline = new vis.Timeline(container, newitems, options);

      function move (percentage) {
         var range = timeline.getWindow();
         var interval = range.end - range.start;

         timeline.setWindow({
             start: range.start.valueOf() - interval * percentage,
             end:   range.end.valueOf()   - interval * percentage
         });
     }

     function zoom (percentage) {
         var range = timeline.getWindow();
         var interval = range.end - range.start;

         timeline.setWindow({
             start: range.start.valueOf() - interval * percentage,
             end:   range.end.valueOf()   + interval * percentage
         });
     }

     document.getElementById('zoomIn').onclick    = function () { zoom(-0.2); };
     document.getElementById('zoomOut').onclick   = function () { zoom( 0.2); };
     document.getElementById('moveLeft').onclick  = function () { move( 0.2); };
     document.getElementById('moveRight').onclick = function () { move(-0.2); };

     // var tblvisabind;
     //     function fn_tblvisabind() {
     //         // alert('add '+ data); 
     //        tblvisabind = $('#tblvisa').DataTable( { 
     //         searching: false, 
     //         // paging: false,
     //         "pageLength":5,
     //            "columns": [
     //            {
     //                "data": "id",
     //                "searchable": false,
     //                className: "hide "
     //            },
     //            {
     //                "data": "parentname",
     //                "searchable": false,
     //                className: "hide "
     //            },


}
      
$scope.fn_getPersonalInfo();
$scope.fn_getBasicInfo();

$('.tool').tooltip();
$scope.availHeight = window.screen.availHeight;
// $('#topfield').fitText();
// $('#tblvisa').dataTable({
// 	// "paging": true
// });

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


});



