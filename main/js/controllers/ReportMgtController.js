'use strict';

MetronicApp.controller('ReportMgtController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   

        $("#databaseList").show();
        $("#tableList").hide();

        // initialize core components
        Metronic.initAjax();


        var databases;


        function databaseDataFunc() {
            databases = $('#databaseData').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL+"etl/databases",
                    "dataSrc": ""
                },
                "columns": [{
                        "data": "dbName"
                    }, {
                        "data": "dbType"
                    }, {
                        "data": "username"
                    }, {
                        "data": "createdDate",
                        "width": "10%"
                    }, {
                        "data": "action",
                        "width": "35%",
                        "render": function(data, type, full, meta) {
                            return '<button class="btn btn-success btn-sm tableView"><i class="fa fa-eye"></i> view</button><button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
                        }
                    }
                ]
            });
        }
        
        formInputValidation("#databaseForm");
        $("#databaseUISubmit").click(function(event) {
            var databaseNameVal = $("#databaseForm #database-name").val();
            var databaseTypeVal = $("#databaseForm #database-type").val();
            var databaseURLVal = $("#databaseForm #database-url").val();
            var databaseUserVal = $("#databaseForm #database-uname").val();
            var databasePwdVal = $("#databaseForm #database-pwd").val();
            var databaseDriverVal = $("#databaseForm #database-driver").val();
            inputValidation("#databaseForm", databaseAjax);

            function databaseAjax() {
                $.ajax({
                        url: globalURL+"etl/databases",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            dbName: databaseNameVal,
                            dbType: databaseTypeVal,
                            dbUrl: databaseURLVal,
                            dbUsername: databaseUserVal,
                            dbPassword: databasePwdVal,
                            dbDriver: databaseDriverVal,
                            active: "active",
                            username: "admin"

                        })
                    })
                    .done(function() {
                        databases.destroy();
                        databaseDataFunc();
                        $("#databaseAddForm").modal('hide');
                        $("#databaseRequire").hide();
                    })
                    .fail(function(data) {
                        console.log(data.responseJSON.error);
                        $("#databaseRequire span").html(data.responseJSON.error);
                        $("#databaseRequire").show();
                        //alert('Failed!');
                    });
            }
        });

        databaseDataFunc();


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