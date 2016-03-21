'use strict';

MetronicApp.controller('SQLEditorMgtController', function($scope) {
   
   // $scope.aceLoaded = function(_editor) {
   //    $scope.aceSession = _editor.getSession();
   //    console.log('first '+ _editor.getSession());
   //  };
   //  $scope.aceChanged = function () {
   //    $scope.aceDocumentValue = $scope.aceSession.getDocument().getValue();
   //     console.log('secound '+$scope.aceSession.getDocument().getValue());
   //  };


$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components 	
	});

fn_LoadDb();



                 
$("#lstDB").change(function(){
	var Seldb = $('#lstDB option:selected').text();
	fn_LoadDt(Seldb);
	// fn_LoadDt();

});
    
// $scope.tabs = [{
//             title: 'Result',
//             url: 'result.sql.html',
//             href: '#tab_Result'        
// 	        }, {
// 	            title: 'History',
// 	            url: 'history.sql.html',
// 	            href: '#tab_History' 
// 	    	}, {
// 	            title: 'Saved Query',
// 	            url: 'savedqry.sql.html',
// 	            href: '#tab_Saved' 
// 	    	}];


  // $scope.currentTab = 'result.sql.html';
  // $scope.currentTab = 'tab_Result';

    // $scope.onClickTab = function (tab) {
    //     // $scope.currentTab = tab.url;
    //     // $scope.currentTab = tab.href;
    //     if(tab.title == 'Result'){
    //     	// $('#tblResult').DataTable( {
    //     	//     language: {
    //     	//         infoEmpty: "No records available - Got it?",
    //     	//     }
    //     	// });          
    //     }
        
    //     $("#messageView div").hide();
    // }

    // $scope.isActiveTab = function(tabUrl) {
    //     return tabUrl == $scope.currentTab;
    // }
     
//      function onClickTab(){
// alert("hello");
//      }

$('.tab').click(function(){
	$(this).siblings().removeClass('active');
	$(this).addClass('active');
	if(this.id == "tabResult"){
		$(".tab-content").children().removeClass('active in');
		$('.tab_Result').addClass('active in');
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

    	if($('#tblResult').dataTableSettings.length > 0){
    			var table = $('#tblResult').DataTable();
    			table.clear()
              		 .draw();
    	}
 
    	var qry = $scope.aceDocumentValue;
		fn_ExecQuery(qry);  

    });

	$scope.aceLoaded = function(_editor) {
	      $scope.aceSession = _editor.getSession();
	      // console.log('first '+ _editor.getSession());
	       // _editor.setReadOnly(true);
	};
    $scope.aceChanged = function () {
      	  $scope.aceDocumentValue = $scope.aceSession.getDocument().getValue();
          // console.log('secound '+$scope.aceSession.getDocument().getValue());
    };

   
//create JSON array for aoColumnDefs
var dataSet;
var aryJSONColTable = [];
// var myArrayRow = [];

function fn_ExecQuery(qry){	 
if(qry != null && qry.length > 0){
	$.ajax({
	    url: globalURL + "api/pistachio/secured/runSQL",
	    type: "POST",
	    dataType: 'json',
	    contentType: "application/json; charset=utf-8",
	    data: qry.trim(),
	    success: function (result) {			
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
		    }else{
			    $("#messageView div span").html('No Data to Show...');          
		    	$("#messageView div").removeClass("alert-success");          
		    	$("#messageView div").addClass('alert-danger');
		    	$("#messageView div").show().delay(5000).fadeOut();
	    	}
		},
	    error: function(data){
	    	$("#messageView div span").html(data.responseJSON.error);          
	    	$("#messageView div").removeClass("alert-success");          
	    	$("#messageView div").addClass('alert-danger');
	    	$("#messageView div").show().delay(5000).fadeOut();
	    }
	});
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
	$.getJSON(globalURL + "api/pistachio/secured/hadoop/db", function (json) { //api/pistachio/secured/hadoop/db
 	         $.each(json, function(k, v){									
            $("#lstDB").append('<option value='+k+'>'+v+'</option>');
         });
     }).done(function(){
     	var Seldb = $('#lstDB option:selected').text();
		fn_LoadDt(Seldb);
		//fn_LoadDt();

     });
}

function fn_LoadDt(seldb){	//seldb
	//$("#lstDBtbl ").empty();
	$.getJSON(globalURL + "api/pistachio/secured/hadoop/tables?db=" + seldb , function (json) { //"api/report/reference/state
 	        $.each(json, function(k, v){									
            $("#lstDBtbl").append('<option value='+k+'>'+v+'</option>');
			// $("#lstDBtbl ul").append('<li class="mt-list-item">'+
	  //               '<div class="list-item-content">'+
	  //                   '<h5>'+ v +'</h5>'+
	  //               '</div></li>');
         });
     });
}
   
});