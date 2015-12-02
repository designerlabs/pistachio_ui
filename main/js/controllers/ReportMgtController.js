'use strict';

MetronicApp.controller('ReportMgtController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   

        $("#reportMgtList").show();
        $("#tableList").hide();

        // initialize core components
        Metronic.initAjax();


        var reportMgts;


        function reportMgtDataFunc() {
            reportMgts = $('#reportMgtdata').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL + "query/cato",
                    "dataSrc": ""
                },
                "columns": [{
                		"data": "id"
                    },{
                        "data": "queryCategoryName"
                    }, {
                        "data": "queryCategory"
                    }, {
                        "data": "className"
                    }, {
                        "data": "queryCategory"
                    },{
                        "data": "role"                        
                    }, {
                    	"data": "activated"
                    }, {
                        "data": "action",
                        "width": "20%",
                        "render": function(data, type, full, meta) {
                            return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
                        }
                    }
                ]
            });
        }
        
        formInputValidation("#reportMgtForm");
        $("#reportMgtUISubmit").click(function(event) {
            var reportMgtTitleVal = $("#reportMgtForm #reportMgt-title").val();
            var reportMgtCategoryVal = $("#reportMgtForm #reportMgt-category").val();
            var reportMgtThemeVal = $("#reportMgtForm #reportMgt-theme").val();
            //var reportMgtIconVal = $("#reportMgtForm #reportMgt-icon").val();
            var reportMgtRoleVal = $("#reportMgtForm #reportMgt-role").val();
            var reportMgtActivateVal = $("#reportMgtForm #reportMgt-activated").val();
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
                            className: reportMgtThemeVal,
                            role: reportMgtRoleVal,
                            activated: reportMgtActivateVal
                        })
                    })
                    .done(function() {
                        reportMgts.destroy();
                        reportMgtDataFunc();
                        $("#reportMgtAddForm").modal('hide');
                        $("#reportMgtRequire").hide();
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
            //$("#reportMgtForm input").parent('.form-group').removeClass('has-error');
            var selectedreportMgt = reportMgts.row($(this).parents('tr')).data();
            selectedreportMgtId = selectedreportMgt.id;
            //$("#reportMgtAddForm #reportMgtUIForm").addClass('hide');
            $("#reportMgtAddForm #reportMgtUISubmit").addClass('hide');
            $("#reportMgtAddForm #reportMgtUIUpdate").removeClass('hide');
            $("#reportMgtForm #reportMgt-title").val(selectedreportMgt.queryCategoryName);
            $("#reportMgtForm #reportMgt-category").val(selectedreportMgt.queryCategory);
            $("#reportMgtForm #reportMgt-theme").val(selectedreportMgt.className);
            $("#reportMgtForm #reportMgt-role").val(selectedreportMgt.role);
            $("#reportMgtForm #reportMgt-activated").val(selectedreportMgt.activated);
            $("#reportMgtAddFormHeader").html("Update Report");            
            $("#reportMgtAddForm").modal('show');

        });

        $("#reportMgtUIUpdate").click(function(event) {
            var reportMgtTitleVal = $("#reportMgtForm #reportMgt-title").val();
            var reportMgtCategoryVal = $("#reportMgtForm #reportMgt-category").val();
            var reportMgtThemeVal = $("#reportMgtForm #reportMgt-theme").val();
            var reportMgtRoleVal = $("#reportMgtForm #reportMgt-role").val();
            var reportMgtActivatedVal = $("#reportMgtForm #reportMgt-activated").val();
            $.ajax({
                    url: globalURL + "query/cato",
                    type: "PUT",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        id: selectedreportMgtId,
                        queryCategoryName: reportMgtTitleVal,
                        queryCategory: reportMgtCategoryVal,
                        className: reportMgtThemeVal,
                        role: reportMgtRoleVal,
                        activated: reportMgtActivatedVal
                    })
                })
                .done(function(data) {
                	 reportMgts.destroy();
                     reportMgtDataFunc();
                      $("#reportMgtAddForm").modal('hide');
                })
                .fail(function() {
                    alert('Failed!');
                });
        });
        //Delete Record
        var selectedreportMgtForDelete;
        $('#reportMgtdata').on('click', 'button.deleteBtn', function() {
            $("#reportMgtDelete").modal('show');
            selectedreportMgtForDelete = reportMgts.row($(this).parents('tr')).data();
            $("#reportMgtDelete .modal-body h3").html('Are you sure do you want to<br>delete the reportMgt <strong>' + selectedreportMgtForDelete.id + '</strong> ?');
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


        var getUser = localStorage.getItem("username");
    	$http.get("http://10.1.17.25:8080/role/report?user="+getUser)
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