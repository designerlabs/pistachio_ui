'use strict';
MetronicApp.controller('TravelerTrackerController', function($rootScope,$scope,$http, $timeout) {
<<<<<<< HEAD
$rootScope.settings.layout.pageSidebarClosed = true;
=======

>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
$scope.lock = 'true';
$scope.res = "result";
$('.MismatchArea').hide();
$('.clkditem').hide();
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
	 	// Get details of visa and in and outs
			//$.get("http://pistachio_server:8983/solr/his/query?rows=2&json={query: 'country:PAKISTAN AND doc_no:AA0929482',limit: 1,sort  : 'xit_date desc',facet: {branch : {type: terms,field: branch},exits: {type: range,field: xit_date,start: '2015-01-01T00:00:00Z',end: '2016-03-23T00:00:00Z',gap: '%2B1DAY'},in_outs: {type: terms,field: dy_action_ind,facet: {branch : {type: terms,field: branch}}},officer :{type: terms,field: dy_create_id}}}}")

	}
	// "+$rootScope.docno+" "+$rootScope.cntry+"
	//http://10.4.104.177:8983/ //immigration2
	console.log(solrHost);
$scope.fn_getBasicInfo = function(){//mad_pas_typ_cd

	$.get("http://"+solrHost+":8983/solr/immigration2/query?sort=created desc&json={query :'"+Qparam+"',limit:20000,facet: {visa : {type: terms,field: pass_typ},employers : {type: terms,field: employer}}}") //mad_pas_typ_cd - pass_typ
	.then(function(data) {
		// debugger;
		if(data.response.docs.length !== 0){
		 	console.log(data.response.docs);
<<<<<<< HEAD
		 	var strdob = data.response.docs[0].birth_date.toString();
		 	$scope.dob = strdob.substr(0,4) +"-"+strdob.substr(4,2) +"-"+ strdob.substr(6,2);

		 	var year=Number(strdob.substr(0,4));
		 	var month=Number(strdob.substr(4,2))-1;
		 	var day=Number(strdob.substr(6,2));
		 	
		 	$scope.age=today.getFullYear()-year;

=======
>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
			$scope.passdetails = data.response.docs[0]; 	
			$scope.totalvisa = data.response.docs.length;
			// $scope.vstartdt = $scope.basicdetails.created.toString().substr(0,10);
			// $scope.vstartdt = $scope.basicdetails.mad_crt_dt.toString().substr(0,10);
			// $scope.venddt = $scope.basicdetails.vend.toString().substr(0,10);
			// $scope.venddt = $scope.basicdetails.vend.toString().substr(0,10); //end date is not avail in immi..
			$scope.titleDetails = "Visa details"
<<<<<<< HEAD

			

=======

			

>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
			$scope.basicdetailsTbl = data.response.docs;

			$('#tblvisa').DataTable( {
			    data: data.response.docs,
			    columns: [
			    	{ "data": "doc_no" },
			        { "data": "name" },
			        { "data": "pass_typ" },
<<<<<<< HEAD
			        // { "data": "visitor_typ" },
=======
			        { "data": "visitor_typ" },
>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
			        { "data": "job_en" },
			        { "data": "employer" },
			        { "data": "created"},
			        { "data": "vend" }
			        // { "data": "mad_doc_no" },
			        // { "data": "mad_applcnt_nm" },
			        // { "data": "mad_pas_typ_cd" },
			        // // { "data": "visitor_typ" },
			        // { "data": "job_en" },
			        // { "data": "employer" },
			        // { "data": "mad_crt_dt"},
			        // { "data": "mad_crt_dt" }
			    ]
			} );
			$scope.$apply();
			
		}else{
<<<<<<< HEAD
			// alert('No data find in immigration2 table');
=======
			alert('No data find in immigration2 table');
>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
		}			
	 	console.log(data.response.docs);
		$scope.passdetails = data.response.docs[0]; 	
		$scope.totalvisa = data.response.docs.length;
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
		        // { "data": "visitor_typ" },
		        { "data": "job_en" },
		        { "data": "employer" },
		        { "data": "vstart"},
		        { "data": "vend" }
		        // { "data": "mad_doc_no" },
		        // { "data": "mad_applcnt_nm" },
		        // { "data": "mad_pas_typ_cd" },
		        // // { "data": "visitor_typ" },
		        // { "data": "job_en" },
		        // { "data": "employer" },
		        // { "data": "mad_crt_dt"},
		        // { "data": "mad_crt_dt" }
		    ]
		} );
		$scope.$apply();			
   });
}
	var today = new Date();
	//http://10.4.104.176:8983/
$scope.fn_getPersonalInfo = function(){
	// $("#loader").css('height', $(".page-content").height() + 140 + 'px');
	// $("#loader .page-spinner-bar").removeClass('hide');
	// $("#loader").show();
//http://"+solrHost+":8983/solr/hismove/query?sort=xit_date desc&json={query:'"+Qparam.replace('mad_','')+"',limit:1,facet:%20{exits:%20{type:%20range,field:%20xit_date,mincount:1,sort:'xit_date desc',start:%20%221900-01-01T00:00:00Z%22,end:'"+today.toISOString()+"',gap:%20%22%2B1DAY%22,facet:{in_outs:%20{type:%20terms,field:%20dy_action_ind,facet:%20{branch%20:%20{type:%20terms,field:%20branch,facet%20:{officer%20:{type:%20terms,field:%20dy_create_id}}}}}}}}}}
	$.get("http://"+solrHost+":8983/solr/hismove/query?sort=xit_date desc&json={query:'"+Qparam+"',limit:100000}")
	.then(function(result) {
		console.log(result);
		$scope.summary = { entry : $.grep( result.response.docs, function( n, i ) {
							  return n.dy_action_ind =='in';
							}),
					exit : $.grep( result.response.docs, function( n, i ) {
							  return n.dy_action_ind =='out';
							})
				}
		

		if(result.response.docs.length !== 0){
			$scope.res = result.response.docs[0];		
<<<<<<< HEAD
			// $scope.inoutTbl = result.facets.exits.buckets;	
=======
			// $scope.inoutTbl = result.facets.exits.buckets;
			$scope.CreateInoutChart(result.response.docs);
			var strdob = result.response.docs[0].dy_birth_date.toString();
			$scope.dob = strdob.substr(0,4) +"-"+strdob.substr(4,2) +"-"+ strdob.substr(6,2);
			$scope.age=today.getFullYear()-year;		
			
>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
			$('#tblinout').DataTable( {
		    data: result.response.docs,
		    columns: [		    	
		        { "data": "xit_date",
		          "render": function (data, type, full, meta){    
		          				var strdt = data.toString().substr(0,10) +" "+ data.toString().substr(11,8);               
                            return strdt;                       
                    }	
		         },
		        { "data": "dy_action_ind",
		          "render": function (data, type, full, meta){                      
                            return (data =='in'?'Entry':'Exit');                              
                    }	 
		         },
		        { "data": "branch" },
		        { "data": "dy_create_id" }		        
		    ]
		} );
			$scope.CreateInoutChart(result.response.docs);
			$scope.$apply();

		}else{
			alert('No date found in himove table');
		}
		$("#loader .page-spinner-bar").addClass('hide');
		$("#loader").hide();

   });
}
 
$scope.CreateInoutChart = function(_data){
	var newary = _data;
	var cnt = _data.length;
	var wrg = [];
	var tempwrg =[];
	
<<<<<<< HEAD
	newary.forEach(function(e,k) {
=======
	newary.forEach(function(e) {
>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
	   e.start = e.xit_date;	   
	   // e.content =(e.in_outs.buckets[0].val == 'in' ? 'IN' : 'OUT');
	   // className 
	   if(e.dy_action_ind == 'in'){
	   	// e.content = "IN";
	   	e.className = 'green';
	   }else if(e.dy_action_ind == 'out'){
	   	// e.content = "OUT";
	   	e.className = 'red';
	   }else if(e.dy_action_ind == 'in0out'){
	   	e.className = 'orange';
	   }

	   if(cnt <= 10){
<<<<<<< HEAD
	   	e.content = e.xit_date.toString().substr(0,10)+ " " + e.xit_date.toString().substr(11,8)+ ' , ' +e.branch + ' , ' + e.dy_create_id;
	   }else{
	   	e.title = e.xit_date.toString().substr(0,10)+ " " + e.xit_date.toString().substr(11,8)+ ' , ' +e.branch + ' , ' + e.dy_create_id;
=======
	   	e.content = e.xit_date.toString().substr(0,10)+ ' , ' +e.branch + ' , ' + e.dy_create_id;
>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
	   }

	   if( k != 0 && e.dy_action_ind == newary[k-1].dy_action_ind){
	   	 tempwrg =[];
	   	 tempwrg={
	   	 	start : e.xit_date,
<<<<<<< HEAD
	   	 	end : newary[k-1].xit_date,	   	 	
	   	 	ind: e.dy_action_ind,
	   	 	content : 'Mismatching '+ e.dy_action_ind.toUpperCase(),
=======
	   	 	end : newary[k-1].xit_date,
	   	 	content : 'Some Thing not Correct',
>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
	   	 	className : 'orange'
	   	 };
	   	  
	      wrg.push(tempwrg);
	   }   

	});

     var container = document.getElementById('visualization');
     // newary.push(wrg);
<<<<<<< HEAD
     var newitems = $.merge( newary, wrg);
=======
     var newitems = newary;
>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a
     var chart_height = (_data.length < 100 ? "400px" : "800px");
     console.log("chart_height=" + chart_height);

      var options = {
 	    height: chart_height,
 	    min: new Date(2012, 0, 1),                // lower limit of visible range
 	    max: new Date(2017, 0, 1),                // upper limit of visible range
 	    zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
 	    zoomMax: 1000 * 60 * 60 * 24 * 31 * 12,     // about three months in milliseconds
 	    dataAttributes: ['title']
 	    // dataAttributes: 'all'
 	  };

     var timeline = new vis.Timeline(container, newitems, options);
    if(wrg.length >= 1){
    	$('.MismatchArea').show();
	    $scope.MisMatchCnt = wrg.length;
		$('#tblMisMatch').DataTable({			
		    data: wrg,
		    columns: [
		    	{ "data": "ind",
		          "render": function (data, type, full, meta){                      
                            return (data =='in'?'Entry':'Exit');}
                },
		        { "data": "start",
		          "render": function (data, type, full, meta){    
		          				return data.toString().substr(0,10) +" "+ data.toString().substr(11,8);
                    }	 },
		        { "data": "end",
		          "render": function (data, type, full, meta){    
		          				return data.toString().substr(0,10) +" "+ data.toString().substr(11,8);
                    } 
                }]
		});
	}

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
     
     $('.vis-item-content').click(function(e){
     	$('.clkditem').show();
     	$('.clkditem').text("Selected item : "+ this.parentElement.getAttribute('data-title'));
     });

}

$scope.fn_getPersonalInfo();
$scope.fn_getBasicInfo();

$('.tool').tooltip();
$scope.availHeight = window.screen.availHeight;

$('.lk').click(function(){
	alert('clicked');
	$scope.lock == 'true'?'false':'true';
});

$('.bck').click(function() {
	parent.history.back();
		return false;
<<<<<<< HEAD
});
=======
})
// Starts --Convert Hex string to Base64----- 
if (!window.atob) {
  var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var table = tableStr.split("");

  window.atob = function (base64) {
    if (/(=[^=]+|={3,})$/.test(base64)) throw new Error("String contains an invalid character");
    base64 = base64.replace(/=/g, "");
    var n = base64.length & 3;
    if (n === 1) throw new Error("String contains an invalid character");
    for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
      var a = tableStr.indexOf(base64[j++] || "A"), b = tableStr.indexOf(base64[j++] || "A");
      var c = tableStr.indexOf(base64[j++] || "A"), d = tableStr.indexOf(base64[j++] || "A");
      if ((a | b | c | d) < 0) throw new Error("String contains an invalid character");
      bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
      bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
      bin[bin.length] = ((c << 6) | d) & 255;
    };
    return String.fromCharCode.apply(null, bin).substr(0, bin.length + n - 4);
  };

  window.btoa = function (bin) {
    for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
      var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
      if ((a | b | c) > 255) throw new Error("String contains an invalid character");
      base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
                              (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
                              (isNaN(b + c) ? "=" : table[c & 63]);
    }
    return base64.join("");
  };

}

function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

function base64ToHex(str) {
  for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join(" ");
}

// Ends --Convert Hex string to Base64----- 

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

>>>>>>> d001184dc7f783d68b280a0400e48c4d58246e4a

var docno =  Qparam.split('AND')[0].replace("doc_no:","").trim();
$('.loadimg').show();
	$.get(globalURL+"api/image/docno/" + docno)
      	.then(function(response) {      		
      		console.log(response);
      		$('.loadimg').hide();
         }).fail(function(response){
         	console.log(response.responseText);
         	$scope.imagetxt="data:image/bmp;base64," +response.responseText;
         	$('.loadimg').hide();
         	$scope.$apply();
         });
});



