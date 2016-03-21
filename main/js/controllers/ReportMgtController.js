'use strict';

MetronicApp.controller('ReportMgtController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        $("#reportMgtList").show();
        $("#tableList").hide();

        // initialize core components
        Metronic.initAjax();

        var reportMgts;
        $.extend( true, $.fn.dataTable.defaults, {
         stateSave: true
        });
        function reportMgtDataFunc() {
            reportMgts = $('#reportMgtdata').DataTable({
                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL + "query/cato",
                    "dataSrc": ""
                },
                "columns": [
                	// {
                	// 	"data": "id"
                 //    },
                    {
                        "data": "queryCategoryName"
                    }, {
                        "data": "parent"
                    },{
                        "data": "queryCategory"
                    }, {
                        "data": "className"
                    },{
                        "data": "icon"
                    // }, {
                    //     "data": "role"                        
                    // }, {
                    //  "data": "activated"
                    }, {
                        "data": "action",
                        "width": "25%",
                        "render": function(data, type, full, meta) {
                            return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
                        }
                    }
                ]
            });

           
        }
        
        formInputValidation("#reportMgtForm");


        var onlyname = undefined;
        $scope.close = false;
        $scope.open = true;
        $("#selectIconBtn").click(function(event){
            $scope.close = true;
            $scope.open = false;
            $("#selectIconBtn").addClass('ng-hide');
            $("#closeIconBtn").removeClass('ng-hide');
            var fileExt = {};
            fileExt[0]=".png";
            fileExt[1]=".jpg";
            fileExt[2]=".gif";
        $.ajax({
            //This will retrieve the contents of the folder if the folder is configured as 'browsable'
            url: '../main/assets/pistachio/report',
            success: function (data) {
               //List all png or jpg or gif file names in the page
               $(data).find('a:contains('+ fileExt[0] + '),a:contains(' + fileExt[1] + '),a:contains(' + fileExt[2] + ')').each(function () {
                   //console.log(this);
                   var filename = this.href.replace(window.location.host, "").replace("http:///main/", "");
                   onlyname = filename.replace(".png", "");
                    
                   $("#loadIcon").append('<span data-value="'+filename+'" class="iconBg '+onlyname+'"><img src="assets/pistachio/report/'+filename+'" width="60px"></span>');
                   $("#loadIcon").show();

                   $("."+onlyname).click(function(){
                        var without_png = this.dataset.value.replace(".png", "");
                        $("#reportMgt-icon").val(without_png);
                        $("#reportMgtIconDiv").html(without_png);
                        $('.reportMgt-icon').html('Selected Icon');
                        $(".selectedIcon").html('<img class="selectedIconImage" src="assets/pistachio/report/'+without_png+'.png">');
                    });
                   
               });
             }
          });

        });

        $("#closeIconBtn").click(function(event){
            $scope.close = false;
            $scope.open = true;
            $("#loadIcon").hide();
            $("#loadIcon").html('');
        });

        $('#reportMgtAddForm').on('hidden.bs.modal', function () {

            $("#selectIconBtn").removeClass('ng-hide');
            $("#closeIconBtn").addClass('ng-hide');
            $("#loadIcon").hide();
            $("#reportMgtIconDiv").html('');
            $("#loadIcon").html('');
        });

        


        
        $("#reportMgtUISubmit").click(function(event) {
        	
            var reportMgtTitleVal = $("#reportMgtForm #reportMgt-title").val();
            var reportMgtCategoryVal = $("#reportMgtForm #reportMgt-category").val();
            var reportMgtParentVal = $("#reportMgtForm #inpHiddenParent").val(); //$("#reportMgtForm #reportMgt-parent").val();
            var reportMgtThemeVal = $("#reportMgtForm #reportMgt-theme").val();
            var reportMgtIconVal = $("#reportMgtForm #reportMgt-icon").val();
            // var reportMgtRoleVal = $("#reportMgtForm #reportMgt-role").val();
            // var reportMgtActivateVal = $("#reportMgtForm #reportMgt-activated").val();
            var reportMgtParentDisplayName = $("#reportMgtForm #inpHiddenParentName").val();
            
            inputValidation("#reportMgtForm", reportMgtAjax);


        
            function reportMgtAjax() {
                $.ajax({
                        url: globalURL+"query/cato",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            queryCategoryName: reportMgtTitleVal,
                            queryCategory: reportMgtCategoryVal,
                            parent: reportMgtParentVal,
                            className: reportMgtThemeVal,
                            // activated: reportMgtActivateVal,
                            // role: reportMgtRoleVal,                            
                            icon: reportMgtIconVal
                        })
                    })
                    .done(function() {
                        reportMgts.destroy();
                        reportMgtDataFunc();
                        $("#reportMgtAddForm").modal('hide');
                        $("#reportMgtRequire").hide();
                        //send to report cat

                        	// Send Parent data on Submit
                            if(!$('#chkExistingParent').prop('checked')){

                        	$.ajax({
                        		url:  globalURL + 'reportcat/',
		                        type: "POST",
		                        dataType: 'json',
		                        contentType: "application/json; charset=utf-8",
		                        data: JSON.stringify({
		                            name: reportMgtParentVal,
		                            display: reportMgtParentDisplayName
		                        })
	                   		})
							.done(function(){
								reportMgts.destroy();
								reportMgtDataFunc();
		                    })
		                    .fail(function(data) {
		                        console.log(data.responseJSON.error);
		                        $("#reportMgtRequire span").html(data.responseJSON.error);
		                        $("#reportMgtRequire").show();
		                        //alert('Failed!');
		                    });
                        }

                    })
                    .fail(function(data) {
                        console.log(data.responseJSON.error);
                        $("#reportMgtRequire span").html(data.responseJSON.error);
                        $("#reportMgtRequire").show();
                        //alert('Failed!');
                    });
            }
        });

        reportMgtDataFunc();
        //Update Record
        var selectedreportMgtId = undefined;
        $('#reportMgtdata').on('click', 'button.updateBtn', function() {
        	//$('#reportMgt-paren').removeClass('hide');
            $(".selectedIcon").show();
        	$('#chkExistingParent').prop('checked', true); 
        	$('#chkExistingParent').parent().addClass('checked');
        	$('#reportMgt-parent').removeClass('hide');
            $('#inpParent').addClass('hide');            
            
        	var selectedreportMgt = reportMgts.row($(this).parents('tr')).data();
            selectedreportMgtId = selectedreportMgt.id;
            $("#reportMgtAddForm #reportMgtUISubmit").addClass('hide');
            $("#reportMgtAddForm #reportMgtUIUpdate").removeClass('hide');
            $("#reportMgtForm #reportMgt-title").val(selectedreportMgt.queryCategoryName);
            $("#reportMgtForm #reportMgt-parent").val(selectedreportMgt.parent);
            $("#reportMgtForm #reportMgt-category").val(selectedreportMgt.queryCategory);
            $("#reportMgtForm #reportMgt-theme").val(selectedreportMgt.className);
            // $("#reportMgtForm #reportMgt-role").val(selectedreportMgt.role);
            // $("#reportMgtForm #reportMgt-activated").val(selectedreportMgt.activated.toString());
            $("#reportMgtForm #reportMgt-icon").val(selectedreportMgt.icon);
            $("#reportMgtIconDiv").html(selectedreportMgt.icon);

            $(".selectedIcon").html('<img class="selectedIconImage" src="../main/assets/pistachio/report/'+selectedreportMgt.icon+'.png">');
            $("#reportMgtAddFormHeader").html("Update Report");            
            $("#reportMgtAddForm").modal('show');
            $('#inpHiddenParent').val($('#reportMgt-parent').val()); 
            $('#inpHiddenParentName').val($('#reportMgt-parent option:selected').text());
        });

        $("#reportMgtUIUpdate").click(function(event) {
        	var reportMgtUpdateCategoryVal = $("#reportMgtForm #reportMgt-category").val();
        	//var reportMgtUpdateActivatedVal = $("#reportMgtForm #reportMgt-activated").val();
            var reportMgtUpdateTitleVal = $("#reportMgtForm #reportMgt-title").val();           
            var reportMgtUpdateParentVal = $("#reportMgtForm #inpHiddenParent").val(); //$("#reportMgtForm #reportMgt-parent").val();
            var reportMgtUpdateThemeVal = $("#reportMgtForm #reportMgt-theme").val();
           // var reportMgtUpdateRoleVal = $("#reportMgtForm #reportMgt-role").val();
            var reportMgtUpdateIconVal = $("#reportMgtForm #reportMgt-icon").val();
            var reportMgtUpdateParentDisplayName = $("#reportMgtForm #inpHiddenParentName").val();
            
            $.ajax({
                    url: globalURL + "query/cato",
                    type: "PUT",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                    	className: reportMgtUpdateThemeVal,
                        id: selectedreportMgtId,
                        queryCategoryName: reportMgtUpdateTitleVal,
                        queryCategory: reportMgtUpdateCategoryVal,  
                        parent: reportMgtUpdateParentVal,                   
                        //role: reportMgtUpdateRoleVal,
                        icon: reportMgtUpdateIconVal
                       // activated: reportMgtUpdateActivatedVal                        
                    })
                })
                .done(function(data) {
                	reportMgts.destroy();
                    reportMgtDataFunc();
                    $("#reportMgtAddForm").modal('hide');

                      //send to report cat
                        	// Send Parent data on Update

                        	$.ajax({
                        		url:  globalURL + 'reportcat/',
		                        type: "POST",
		                        dataType: 'json',
		                        contentType: "application/json; charset=utf-8",
		                        data: JSON.stringify({
		                            name: reportMgtUpdateParentVal,
		                            display: reportMgtUpdateParentDisplayName
		                        })
	                   		})
							.done(function(){
								reportMgts.destroy();
								reportMgtDataFunc();
		                    })
		                    .fail(function(data) {
		                        console.log(data.responseJSON.error);
		                        $("#reportMgtRequire span").html(data.responseJSON.error);
		                        $("#reportMgtRequire").show();
		                        //alert('Failed!');
		                    });
                })
                .fail(function(e) {
                    console.log(e);
                });
        });

        //Delete Record
        var selectedreportMgtForDelete;
        $('#reportMgtdata').on('click', 'button.deleteBtn', function() {
            $("#reportMgtDelete").modal('show');
            selectedreportMgtForDelete = reportMgts.row($(this).parents('tr')).data();
            $("#reportMgtDelete .modal-body h3").html('Are you sure do you want to<br>delete the reportMgt <strong>' + selectedreportMgtForDelete.queryCategoryName + '</strong> ?');
        });

         $('#reportMgtDataDeleteBtn').click(function(event) {

            $.ajax({
                url: globalURL + 'query/cato/' + selectedreportMgtForDelete.id,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    reportMgts.destroy();
                    reportMgtDataFunc();
                    $("#reportMgtDelete").modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $("#errorTitle").html(XMLHttpRequest.responseJSON.error);
                    $("#reportMgtDeleteErrorMsg").modal('show');
                    $("#reportMgtDelete").modal('hide');
                }
            });

        });

        // Load the Existing parent list from url 
        loadParentMenu();
        function loadParentMenu(){
              $.ajax({
        	        type: "GET",
        	        cache:false,
        	        url: globalURL+'reportcat/',
        	        success: function(data)
        	        {
        	            $.each(data, function (key, value) {
        				    $('#reportMgt-parent').append(
        				        $("<option></option>")
        				          .attr("value", value.name)
        				          .text(value.display)
        				    );
        				});
        	        }
        	    });
        }
        var getUser = localStorage.getItem("username");
    	$http.get(globalURL+"role/report?user="+getUser)
    	.success(function(response) {
    		$scope.names = response;
       });

    	$scope.go = function(data){
    		location.href=data;
            var categoryId = this.$$watchers[2].last;
    	};
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});
