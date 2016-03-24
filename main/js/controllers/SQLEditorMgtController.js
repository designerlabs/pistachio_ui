'use strict';

MetronicApp.controller('SQLEditorMgtController', function($scope,$http) {

$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        $scope.database = "default";
	});

fn_LoadDb();
$scope.database;
//$scope.started = true;
var editor = ace.edit("qryeditor");
editor.$blockScrolling = Infinity;

var oResultTable;
var historyTbl;

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
		fn_showHistory();
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
    	fn_GotoResultTab();
		var qry = $scope.aceDocumentValue;
		fn_ExecQuery(qry);

    });

    $('.newqry').click(function(){    	
    	editor.session.setValue('');
    	fn_GotoResultTab();
    	if(oResultTable != undefined){
    		// oResultTable.destroy();
    		oResultTable.clear()
	            		 .draw();	  	
    	}
    });

	$scope.aceLoaded = function(_editor) {
		$scope.aceSession = _editor.getSession();
	};
	
    $scope.aceChanged = function () {
      	  $scope.aceDocumentValue = $scope.aceSession.getDocument().getValue();
    };


var dataSet;
var aryJSONColTable = [];

//All the Functions started here

function fn_ExecQuery(qry){
	if(qry != null && qry.length > 0){	
		$http.post(globalURL + "api/pistachio/secured/runSQL",qry.trim())
		.then(function successCallback(result){
		if (result != null && result.data.columns != null) {
			var	resultOutputCol = jQuery.parseJSON(result.data.columns);
			var	resultOutput = jQuery.parseJSON(result.data.results);
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
    		fn_ClearResultTbl();
		    $("#messageView div span").html('No Data to Show...');
	    	$("#messageView div").removeClass("alert-success");
	    	$("#messageView div").addClass('alert-danger');
	    	$("#messageView div").show().delay(5000).fadeOut();
	    	$(".page-content").height($(".profile-content").height()+400);
		}
	}, 
	function errorCallback(response){
		fn_ClearResultTbl();
		$("#messageView div span").html(response.data.error);
		$("#messageView div").removeClass("alert-success");
		$("#messageView div").addClass('alert-danger');
		// $("#messageView div").show().delay(15000).fadeOut();
	});
		
}else{
		fn_ClearResultTbl();
		$("#messageView div span").html("No Query found...");
		$("#messageView div").removeClass("alert-success");
		$("#messageView div").addClass('alert-anger');
		$("#messageView div").show().delay(5000).fadeOut();

	}

}

function queryResultFunc(rw,col) {
	oResultTable = $('#tblResult').DataTable({
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
	    	console.log("dblist" + response.data[0]);
	    	fn_LoadDt(response.data[0]);
	});
	
}

function fn_LoadDt(seldb){	
	$http.get(globalURL + "api/pistachio/secured/hadoop/tables?db=" + seldb)
	    .then(function(response) {
	    	$scope.datatableLength = response.data.length;
	    	$scope.datatableList = response.data;
	    	// $scope.database = response.data[0];
	    	console.log("dtlist" + response.data[0]);

	    	
	});
}

function fn_showHistory(){
	var historyResult;
	$http.get(globalURL + "api/pistachio/secured/history")
	    .then(function(response) {
	    	if(historyTbl != undefined){
	    		historyTbl.destroy();
	    	}
			historyResult = response.data;
			historyTbl = $('#tblHistory').DataTable({
					"processing": true,
			        "data": historyResult,
			        "columns": [	        	
			            {
			                "data": "id"
			            }, {
			                "data": "login"
			            },{
			                "data": "query"
			            }	            
			        ]
			});
			$('#tblHistory tbody').on('click', 'tr', function() {
				 var data = historyTbl.row( this ).data();
				 editor.session.setValue('');
				 editor.session.setValue(data.query);
			});
			 $(".page-content").height($(".profile-content").height()+400);
	    });	
}

function fn_GotoResultTab(){
	$('.nav-tabs').children().removeClass('active')
	$('#tabResult').addClass('active');
	$(".tab-content").children().removeClass('active in'); //hide other tab contents
	$('.tab_Result').addClass('active in');
}

function fn_ClearResultTbl(){
if(oResultTable != undefined){
			oResultTable.clear()
	        	    	.draw();	 
	    }
}

});
