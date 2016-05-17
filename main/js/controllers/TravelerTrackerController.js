'use strict';
MetronicApp.controller('TravelerTrackerController', function($rootScope,$scope,$http, $timeout) {

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
		 	var strdob = data.response.docs[0].birth_date.toString();
		 	$scope.dob = strdob.substr(0,4) +"-"+strdob.substr(4,2) +"-"+ strdob.substr(6,2);

		 	var year=Number(strdob.substr(0,4));
		 	var month=Number(strdob.substr(4,2))-1;
		 	var day=Number(strdob.substr(6,2));

		 	$scope.age=today.getFullYear()-year;

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
			// alert('No data find in immigration2 table');
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
			// $scope.inoutTbl = result.facets.exits.buckets;
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

	newary.forEach(function(e,k) {
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
	   	e.content = e.xit_date.toString().substr(0,10)+ " " + e.xit_date.toString().substr(11,8)+ ' , ' +e.branch + ' , ' + e.dy_create_id;
	   }else{
	   	e.title = e.xit_date.toString().substr(0,10)+ " " + e.xit_date.toString().substr(11,8)+ ' , ' +e.branch + ' , ' + e.dy_create_id;
	   }

	   if( k != 0 && e.dy_action_ind == newary[k-1].dy_action_ind){
	   	 tempwrg =[];
	   	 tempwrg={
	   	 	start : e.xit_date,
	   	 	end : newary[k-1].xit_date,
	   	 	ind: e.dy_action_ind,
	   	 	content : 'Mismatching '+ e.dy_action_ind.toUpperCase(),
	   	 	className : 'orange'
	   	 };

	      wrg.push(tempwrg);
	   }

	});

     var container = document.getElementById('visualization');
     // newary.push(wrg);
     var newitems = $.merge( newary, wrg);
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
});

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
