'use strict';

MetronicApp.controller('SQLEditorMgtController', function($scope,$http) {

$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        $scope.database = "default";
	});

fn_LoadDb();

$scope.database;
$scope.OnDBClick = function(sel){
	$scope.database = sel;
	fn_LoadDt(sel);
}

$('.tab').click(function(){
	$(this).siblings().removeClass('active'); //remove opened tab
	$(this).addClass('active'); //activate clicked tab
	if(this.id == "tabResult"){
		$(".tab-content").children().removeClass('active in'); //hide other tab contents
		$('.tab_Result').addClass('active in'); //show relevant tab contents
	}else if(this.id=="tabHistory"){
		$(".tab-content").children().removeClass('active in');
		$('.tab_History').addClass('active in');
	}else if(this.id=="tabSavedQuery"){
		$(".tab-content").children().removeClass('active in');
		$('.tab_Saved_Query').addClass('active in');
	}

// var seltab = "#" + $(this).attr('data');
// $(this).parent().siblings().removeClass('active in');
// $(seltab).addClass('active in');

	return false;
});

    $('.exec').click(function(){
		$('.nav-tabs').children().removeClass('active')
		$('#tabResult').addClass('active');
		$(".tab-content").children().removeClass('active in'); //hide other tab contents
		$('.tab_Result').addClass('active in'); //show relevant tab contents
			if($('#tblResult').dataTableSettings.length > 0){
	    			var table = $('#tblResult').DataTable();
	    			table.clear()
	              		 .draw();
	    	}

	    	var qry = $scope.aceDocumentValue;
			fn_ExecQuery(qry);

    });

    $('.newqry').click(function(){
    	var editor = ace.edit("qryeditor");
    	editor.$blockScrolling = Infinity
    	editor.session.setValue('');
    });

	$scope.aceLoaded = function(_editor) {
		$scope.aceSession = _editor.getSession();
	};
	
    $scope.aceChanged = function () {
      	  $scope.aceDocumentValue = $scope.aceSession.getDocument().getValue();
    };

var dataSet;
var aryJSONColTable = [];

function fn_ExecQuery(qry){
if(qry != null && qry.length > 0){

	// var req = {
	// 	method: 'POST',
	// 	url: globalURL + "api/pistachio/secured/runSQL",
	// 	headers: {
	// 	   'Content-Type': "application/json; charset=utf-8",
	// 	},
	// 	data: qry.trim()
	// }

	$http.post({
		url: globalURL + "api/pistachio/secured/runSQL",
		data: qry.trim()
	}).then(function(result){
		if (result != null) {
			var	resultOutputCol = jQuery.parseJSON(result.columns);
			var	resultOutput = jQuery.parseJSON(result.results);
		    var myArrayColumn = [];
		    var i = 0;

		    $.each(resultOutputCol, function (index, val) {
		        var obj = {
		            sTitle: val
		        };
		        myArrayColumn[i] = obj;
		        i++;
		    });

		    var myArrayRow = [];
		    var i = 0;

		    $.each(resultOutput, function (index, val) {
		        var rowData = [];
		        var j = 0;
		        $.each(resultOutput[i], function (index, val) {
		            rowData[j] = val;
		            j++;
		        });

		        myArrayRow[i] = rowData;
		        i++;
		    });
		    queryResultFunc(myArrayRow,myArrayColumn);
		    $(".page-content").height($(".profile-content").height()+400);
	    }else{
		    $("#messageView div span").html('No Data to Show...');
	    	$("#messageView div").removeClass("alert-success");
	    	$("#messageView div").addClass('alert-danger');
	    	$("#messageView div").show().delay(5000).fadeOut();
	    	$(".page-content").height($(".profile-content").height()+400);
		}
	}, 
		function(data){
			$("#messageView div span").html(data.responseJSON.error);
	    	$("#messageView div").removeClass("alert-success");
	    	$("#messageView div").addClass('alert-danger');
	    	$("#messageView div").show().delay(5000).fadeOut();
		});


	// $.ajax({
	//     url: globalURL + "api/pistachio/secured/runSQL",
	//     type: "POST",
	//     dataType: 'json',
	//     contentType: "application/json; charset=utf-8",
	//     data: qry.trim(),
	//     success: function (result) {
			
	// 	},
	//     error: function(data){
	    	
	//     }
	// });
}else{
	$("#messageView div span").html("No Query found...");
	$("#messageView div").removeClass("alert-success");
	$("#messageView div").addClass('alert-danger');
	$("#messageView div").show().delay(5000).fadeOut();

}

}


function queryResultFunc(rw,col) {

			    	var oTable = $('#tblResult').DataTable({
					"bDestroy": true,
			        "bScrollCollapse": true,
			        "bJQueryUI": true,
			        "bScrollCollapse": true,
			        "bInfo": true,
			        "bFilter": true,
			        "bSort": true,
			        "aaData": rw,
			        "aoColumns": col,
			        "scrollCollapse": true,
			        "paging": true
					});
}

function fn_LoadDb(){

	$http.get(globalURL + "api/pistachio/secured/hadoop/db")
	    .then(function(response) {
	    	$scope.databaseLength = response.data.length;
	    	$scope.databaseList = response.data;
	    	// $scope.database = response.data[0];
	    	console.log("dblist" + response.data[0]);

	    	fn_LoadDt(response.data[0]);
	});

	// $.getJSON(globalURL + "api/pistachio/secured/hadoop/db", function (json) { //api/pistachio/secured/hadoop/db
 // 	         $.each(json, function(k, v){
 //            $("#lstDB").append('<option value='+k+'>'+v+'</option>');
 //         });
 //     }).done(function(){
 //     	var Seldb = $('#lstDB option:selected').text();
	// 	fn_LoadDt(Seldb);
	// 	//fn_LoadDt();

 //     });
}

function fn_LoadDt(seldb){	//seldb
	// $.getJSON(globalURL + "api/pistachio/secured/hadoop/tables?db=" + seldb , function (json) { //"api/report/reference/state
 // 	        $.each(json, function(k, v){									
 //            	$("#lstDBtbl ul").append('<li data-value='+k+'>'+v+'</li>'); 	 
 //     		});
	// });

	$http.get(globalURL + "api/pistachio/secured/hadoop/tables?db=" + seldb)
	    .then(function(response) {
	    	$scope.datatableLength = response.data.length;
	    	$scope.datatableList = response.data;
	    	// $scope.database = response.data[0];
	    	console.log("dtlist" + response.data[0]);

	    	
	});

}
});
