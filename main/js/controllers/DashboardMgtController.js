'use strict';

MetronicApp.controller('DashboardMgtController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   

        $("#dashboard").show();
        $("#tableList").hide();

        // initialize core components
        Metronic.initAjax();


        var dashboards;


        function dashboardDataFunc() {
            dashboards = $('#dashboardData').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL+"pistachio/dashboard",
                    "dataSrc": ""
                },
                "columns": [{
                        "data": "title"
                    }, {
                        "data": "url"
                    }, {
                        "data": "ext"
                    }, {
                        "data": "icon",
                        "width": "10%"
                    }, {
                        "data": "color",
                        "width": "bg-green"
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

        formInputValidation("#dashboardForm");
        $("#dashboardUISubmit").click(function(event) {
            var dashboardTitleVal = $("#dashboardForm #dashboard-title").val();
            var dashboardURLVal = $("#dashboardForm #dashboard-url").val();
            var dashboardExtVal = $("#dashboardForm #dashboard-ext").val();
            var dashboardIconVal = $("#dashboardForm #dashboard-icon").val();
            var dashboardThemeVal = $("#dashboardForm #dashboard-theme").val();
            inputValidation("#dashboardForm", dashboardAjax);

            function dashboardAjax() {
                $.ajax({
                        url: globalURL+"pistachio/dashboard",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            title: dashboardTitleVal,
                            url: dashboardURLVal,
                            ext: dashboardExtVal,
                            icon: dashboardIconVal,
                            color: dashboardThemeVal,
                            active: "active",
                            username: "admin"

                        })
                    })
                    .done(function() {
                        dashboards.destroy();
                        dashboardDataFunc();
                        $("#dashboardAddForm").modal('hide');
                        $("#dashboardRequire").hide();
                    })
                    .fail(function(data) {
                        console.log(data.responseJSON.error);
                        $("#dashboardRequire span").html(data.responseJSON.error);
                        $("#dashboardRequire").show();
                        //alert('Failed!');
                    });
            }
        });

        dashboardDataFunc();


        var selectedDashboardId = undefined;
        $('#dashboardData').on('click', 'button.updateBtn', function() {
            var selectedDashboard = dashboards.row($(this).parents('tr')).data();
            selectedDashboardId = selectedDashboard.id;
            $("#dashboardAddForm #dashboardUISubmit").addClass('hide');
            $("#dashboardAddForm #dashboardUIUpdate").removeClass('hide');
            $("#dashboardForm #dashboard-title").val(selectedDashboard.title);
            $("#dashboardForm #dashboard-url").val(selectedDashboard.url);
            $("#dashboardForm #dashboard-ext").val(selectedDashboard.ext);
            $("#dashboardForm #dashboard-icon").val(selectedDashboard.icon);
            $("#dashboardForm #dashboard-theme").val(selectedDashboard.color);
            $("#dashboardAddFormHeader").html("Update Dashboard");
            $("#dashboardAddForm").modal('show');
        });



        $("#dashboardUIUpdate").click(function(event) {

            var dashboardUpdateTitleVal = $("#dashboardForm #dashboard-title").val();
            var dashboardUpdateURLVal = $("#dashboardForm #dashboard-url").val();
            var dashboardUpdateExtVal = $("#dashboardForm #dashboard-ext").val();
            var dashboardUpdateIconVal = $("#dashboardForm #dashboard-icon").val();
            var dashboardUpdateThemeVal = $("#dashboardForm #dashboard-theme").val();
            //alert(selectedQueryId);
            $.ajax({
                    url: globalURL+"pistachio/dashboard",
                    type: "PUT",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        id: selectedDashboardId,
                        title: dashboardUpdateTitleVal,
                        url: dashboardUpdateURLVal,
                        ext: dashboardUpdateExtVal,
                        icon: dashboardUpdateIconVal,
                        color: dashboardUpdateThemeVal,
                        active: "active",
                        username: "admin"
                    })
                })
                .done(function(data) {
                    dashboards.destroy();
                    dashboardDataFunc();
                    //selectedQueryId = null;
                })
                .fail(function() {
                    alert('Failed!');
                });
        });



        var selectedDashboardForDelete;
        $('#dashboardData').on('click', 'button.deleteBtn', function() {
            $("#dashboardDelete").modal('show');
            selectedDashboardForDelete = dashboards.row($(this).parents('tr')).data();
            console.log(selectedDashboardForDelete);
            $("#dashboardDelete .modal-body h3").html('Are you sure do you want to<br>delete the dashboard <strong>' + selectedDashboardForDelete.title + '</strong>?');

        });

        $('#dashboardDataDeleteBtn').click(function(event) {
            //$('#databaseData').on('click', 'button.deleteBtn', function() {
            //var selectedDatabaseForDelete = databases.row($(this).parents('tr')).data();
            $.ajax({
                url: globalURL+'pistachio/dashboard/' + selectedDashboardForDelete.id,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    dashboards.destroy();
                    dashboardDataFunc();
                    $("#dashboardDelete").modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //alert("Status: " + textStatus);
                    //alert("Error: " + errorThrown);
                    //alert("request: " + XMLHttpRequest);
                    if (errorThrown) {
                        $("#errorTitle").html(XMLHttpRequest.responseJSON.error);
                        $("#dashboardDeleteErrorMsg").modal('show');
                        //console.log(XMLHttpRequest.responseJSON.error);
                    }
                    console.log(XMLHttpRequest);
                    $("#dashboardDelete").modal('hide');
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
            //$scope.message = sharedService.categoryId;
    	};
        //console.log($scope);

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});