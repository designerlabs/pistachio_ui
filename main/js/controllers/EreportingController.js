/* Setup E-Reporting page controller */
var tableFunc, jobsDataFunc, selectedQueryRunId, reportCategoryID, fromDate, toDate, FrmTemplate = undefined, login;

//reportCategoryID =   $("#reportCategoryID").val();


    /* resize function */
        function onResize1() {
            var $width = $(document).width();
            //Iphone
            if ($width < 1250 && $width > 300) {
                $('td .tableView').html('<i class="fa fa-eye"></i>');
                $('td .btn1').html('<i class="fa fa-play"></i>');
                $('td .updateBtn').html('<i class="fa fa-edit"></i>');
                $('td .deleteBtn, td .btn2').html('<i class="fa fa-trash"></i>');
                $('td .btn3').html('<i class="fa fa-clock-o"></i>');
                $('td .btn').css('padding', '3px');
            } else {
                $('.tableView').html('<i class="fa fa-eye"></i> View');
                $('td .btn1').html('<i class="fa fa-play"></i> Start');
                $('td .updateBtn').html('<i class="fa fa-edit"></i> Edit');
                $('td .deleteBtn, td .btn2').html('<i class="fa fa-trash"></i> Delete');
                $('td .btn3').html('<i class="fa fa-clock-o"></i> Schedule');
                $('td .btn').css('padding', '6px 12px');
            }
        }




/* EreportingController starts */
MetronicApp.controller('EreportingController', ['$rootScope', '$scope', '$http', 'settings', 'authorities', 'fileUpload', function ($rootScope, $scope, $http, settings, authorities, fileUpload) {



    $scope.$on('$viewContentLoaded', function () {
        // initialize core components

        Metronic.initAjax();
        Layout.fixContentHeight(); 
    
        $scope.uploadFile = function(){
            var file = $scope.myFile;
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = globalURL + "api/pistachio/upload?user=";
            fileUpload.uploadFileToUrl(file, uploadUrl);
        };


        $.extend( true, $.fn.dataTable.defaults, {
         stateSave: true
        });
        $("#tableList").hide();
        $scope.chkRole = authorities.checkRole;
        $scope.getReportPrivilege = localStorage.getItem('reportPrivilege');
        $scope.reportPrivilege = JSON.parse($scope.getReportPrivilege);


        $(".page-sidebar-menu > li").removeClass('active');
        $(".sub-menu > li").removeClass('active');

        $("#ereportLink").addClass('active');
        //$("#roleManagementLink").addClass('active');

        
        var databases;
        $scope.authoritiesValue = localStorage.getItem('authorities');

        $scope.res = $scope.authoritiesValue.split(",");
        $scope.roles = $scope.res;
        /*
                $scope.checkRole = function(x){
                    alert(x);
                    //alert(x + " Admin");
                    var arrayChk = $.inArray(x,$scope.roles);
                    if(arrayChk != -1){
                     return true;
                    }else{
                     return false;
                    }

                }*/
        $scope.reporttitle = localStorage.getItem("selSystemDisplayName"); //Display parent name in e-reporting.html
        $('#lblReportTitle').text(localStorage.getItem('reportCategoryTitle'));

        function databaseDataFunc() {
            databases = $('#databaseData').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL + "etl/databases",
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
                        "render": function (data, type, full, meta) {
                            return '<button class="btn btn-success btn-sm tableView"><i class="fa fa-eye"></i> view</button><button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
                        }
                    }
                ]
            });
        }



        formInputValidation("#databaseForm");
        $("#databaseUISubmit").click(function (event) {
            var databaseNameVal = $("#databaseForm #database-name").val();
            var databaseTypeVal = $("#databaseForm #database-type").val();
            var databaseURLVal = $("#databaseForm #database-url").val();
            var databaseSchemaVal = $("#databaseForm #database-schema").val();
            var databaseUserVal = $("#databaseForm #database-uname").val();
            var databasePwdVal = $("#databaseForm #database-pwd").val();
            var databaseDriverVal = $("#databaseForm #database-driver").val();
            inputValidation("#databaseForm", databaseAjax);

            function databaseAjax() {
                $.ajax({
                        url: globalURL + "etl/databases",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            dbName: databaseNameVal,
                            dbType: databaseTypeVal,
                            dbUrl: databaseURLVal,
                            dbSchemaName: databaseSchemaVal,
                            dbUsername: databaseUserVal,
                            dbPassword: databasePwdVal,
                            dbDriver: databaseDriverVal,
                            active: "active",
                            username: "admin"

                        })
                    })
                    .done(function () {
                        databases.destroy();
                        databaseDataFunc();
                        $("#databaseAddForm").modal('hide');
                        $("#databaseRequire").hide();
                    })
                    .fail(function (data) {
                        //console.log(data.responseJSON.error);
                        $("#databaseRequire span").html(data.responseJSON.error);
                        $("#databaseRequire").show();
                        //alert('Failed!');
                    });
            }
        });

        databaseDataFunc();


        // configuration
        var configuration;
        configurationDataFunc = function () {
            configuration = $('#config').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL + "config",
                    "dataSrc": ""
                },
                "columns": [{
                    "data": "id"
                }, {
                    "data": "configName"
                }, {
                    "data": "configValue"
                }, {
                    "data": "application"
                }, {
                    "data": "action",
                    "width": "22%",
                    "render": function (data, type, full, meta) {
                        return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
                    }
                }]
            });
        }




        formInputValidation("#configForm");
        $("#configUISubmit").click(function (event) {
            var configNameVal = $("#configForm #config-name").val();
            var configVal = $("#configForm #config-value").val();
            var configApp = $("#configForm #config-application").val();
            inputValidation("#configForm", configAjax);

            function configAjax() {
                $.ajax({
                        url: globalURL + "config/",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            configName: configNameVal,
                            configValue: configVal,
                            application: configApp
                        })
                    })
                    .done(function () {
                        configuration.destroy();
                        configurationDataFunc();
                        //$("#configForm input").parent('.form-group').removeClass('has-error');
                        $("#configAddForm").modal('hide');
                        $("#configRequire").hide();
                    })
                    .fail(function (data) {
                        //console.log(data.responseJSON.error);
                        $("#configRequire span").html(data.responseJSON.error);
                        $("#configRequire").show();
                    });
            }

        });


        configurationDataFunc();

        var selectedConfigId = undefined;
        $('#config').on('click', 'button.updateBtn', function () {
            $("#configForm input").parent('.form-group').removeClass('has-error');
            var selectedConfig = configuration.row($(this).parents('tr')).data();
            selectedConfigId = selectedConfig.id;
            $("#configAddForm #configUISubmit").addClass('hide');
            $("#configAddForm #configUIUpdate").removeClass('hide');
            $("#configForm #config-name").val(selectedConfig.configName);
            $("#configForm #config-value").val(selectedConfig.configValue);
            $("#configForm #config-application").val(selectedConfig.application);
            $("#configAddForm").modal('show');
            $("#configAddFormHeader").html("Update Configuration");
        });


        $("#configUIUpdate").click(function (event) {
            var configNameVal = $("#configForm #config-name").val();
            var configVal = $("#configForm #config-value").val();
            var configApp = $("#configForm #config-application").val();
            //alert(selectedQueryId);
            $.ajax({
                    url: globalURL + "config/",
                    type: "PUT",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        id: selectedConfigId,
                        configName: configNameVal,
                        configValue: configVal,
                        application: configApp
                    })
                })
                .done(function (data) {
                    configuration.destroy();
                    configurationDataFunc();
                    $("#configAddForm").modal('hide');
                    //selectedQueryId = null;
                })
                .fail(function (e) {
                    console.log(e);
                });
        });

        var selectedConfigForDelete;
        $('#config').on('click', 'button.deleteBtn', function () {
            $("#configDelete").modal('show');
            selectedConfigForDelete = configuration.row($(this).parents('tr')).data();
            $("#configDelete .modal-body h3").html('Are you sure do you want to<br>delete the config <strong>' + selectedConfigForDelete.configName + '</strong> ?');
        });

        $('#configDataDeleteBtn').click(function (event) {

            $.ajax({
                url: globalURL + 'config/' + selectedConfigForDelete.id,
                type: 'DELETE',
                success: function (result) {
                    // Do something with the result
                    configuration.destroy();
                    configurationDataFunc();
                    $("#configDelete").modal('hide');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#configErrorTitle").html(XMLHttpRequest.responseJSON.error);
                    $("#configDeleteErrorMsg").modal('show');
                    $("#configDelete").modal('hide');
                }
            });

        });


        var jobsData;
        jobsDataFunc = function () {
            jobsData = $('#jobsContainer').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL + "etl/jobs",
                    "dataSrc": ""
                },
                "columns": [{
                    "data": "jobName"
                }, {
                    "data": "dbId"
                }, {
                    "data": "status"
                }, {
                    "data": "progress",
                    "render": function (data, type, full, meta) {
                        /*return '<div class="progress progress-striped">'
                                    +'<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="'+data+'" aria-valuemin="0" aria-valuemax="100" style="width: '+data+'%">'
                                        +'<span class="sr-only">'
                                        +data+'% Complete (success) </span>'
                                    +'</div>'
                                +'</div>';*/
                        if (data == 0) {
                            return '<div class="progress">' + '<div class="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar" aria-valuenow="' + data + '" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width:' + data + '%">' + data + '%' + '</div>' + '</div>';
                        } else if (data == 100) {
                            return '<div class="progress">' + '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + data + '" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width:' + data + '%">' + data + '%' + '</div>' + '</div>';
                        } else {
                            return '<div class="progress">' + '<div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="' + data + '" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width:' + data + '%">' + data + '%' + '</div>' + '</div>';
                        }

                    }
                }, {
                    "data": "noOfJobs"

                }, {
                    "data": "jobsCompleted"
                }, {
                    "data": "status",
                    "width": "52%",
                    "render": function (data, type, full, meta) {
                        //if ((data == "JOB_RUNNING") || (data == "JOB_COMPLETED")) {
                        //return '<button class="btn btn-success btn-sm" disabled><i class="fa fa-play"></i> Start</button><button class="btn btn-danger btn-sm" disabled><i class="fa fa-times"></i> Delete</button>';
                        //} else {

                        if (data == "JOB_CREATED") {
                            return '<button class="btn btn-success btn-sm btn1"><i class="fa fa-play"></i> Start</button><button class="btn btn-danger btn-sm btn2"><i class="fa fa-trash"></i> Delete</button><button class="btn btn-info btn-sm btn3"><i class="fa fa-clock-o"></i> Schedule</button>';
                        } else {
                            return '<button class="btn btn-success btn-sm btn1"><i class="fa fa-play"></i> Start</button><button class="btn btn-danger btn-sm btn2"><i class="fa fa-trash"></i> Delete</button><button class="btn btn-info btn-sm btn3" disabled><i class="fa fa-clock-o"></i> Schedule</button>';
                        }
                    }

                }]
            });
        }

        jobsDataFunc();

        $('#btnProduction').click(function(){
            $.get(globalURL+'etl/jobs/prod');
            alert('Prod');

        });

        $('#btnStage').click(function(){
            $.get(globalURL+'etl/jobs/stage');
            alert('Stage');
        });

        var reportCategoryID = localStorage.getItem("reportCategoryID");

        var queryData;
        //console.log(categoryId);
        queryDataFunc = function () {

            //if($scope.chkRole('ROLE_ADMIN')){
            if ($scope.reportPrivilege) {
                queryData = $('#queryContainer').DataTable({

                    "ajax": {
                        "processing": true,
                        "serverSide": true,
                        "url": globalURL + queryString + "?" + categoryName + "=" + reportCategoryID,
                        "dataSrc": ""
                    },
                    "columns": [{
                        "data": "id"
                }, {
                        "data": "queryName"
                }, {
                        "data": "query"
                }, {
                        "data": "reportFileName",
                        "render": function (data, type, full, meta) {
                            // alert(data);
                            console.log(data);
                            if (data == null) {
                                return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-eye"></i> View</button></a>';
                            } else {
                                return '<button class="btn btn-success btn-sm TemplateBtn details-control"><i class="fa fa-plus-circle"></i> Expand</button>';
                            }
                        }
                }, {
                        "data": "action",
                        "width": "29%",
                        "render": function (data, type, full, meta) {
                            return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button><button class="btn btn-warning btn-sm downloadBtn"><i class="fa fa-download"></i> Template</button>';
                        }
                }]
                })
            } else {
                queryData = $('#queryContainerAdmin').DataTable({

                    "ajax": {
                        "processing": true,
                        "serverSide": true,
                        "url": globalURL + queryString + "?" + categoryName + "=" + reportCategoryID,
                        "dataSrc": ""
                    },
                    "columns": [{
                        "data": "queryName"
                }, {
                        "data": "execute",
                        "render": function (data, type, full, meta) {

                            if (full.reportFileName) {
                                return '<button class="btn btn-success btn-sm TemplateBtn details-control"><i class="fa fa-plus-circle"></i> Expand</button>';
                            } else {
                                  return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-eye"></i> View</button></a>';
                                
                            }

                                //return '<button class="btn btn-success btn-sm TemplateBtn details-control"><i class="fa fa-plus-circle"></i> Expand</button>';
                                //return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-play"></i> RUN</button></a>';

                            }
                            /* "render": function(data, type, full, meta) {
                                 return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-play"></i> RUN</button></a>';
                             }*/
                }]
                })
            };

        };

        // Add event listener for opening and closing details
        $('#queryContainer, #queryContainerAdmin').on('click', '.details-control', function () {
            var tr = $(this).closest('tr');
            var row = queryData.row(tr);
            //console.log(row);

            // if( $('#childRow').length > 0){
            //     $('#childRow').parent().parent().prev('tr').removeClass('shown');
            //     $('#childRow').parent().parent().remove();
            //     // tr.removeClass('shown');
            // }else{
            //     row.child(format(row.data())).show();
            //     tr.addClass('shown');
            //     createCalenderCtrl();
            // }



            if (row.child.isShown()) {

                $(this).html('<i class="fa fa-plus-circle"></i> Expand');
                $(this).removeClass('btn-warning');
                $(this).removeClass('btn-danger');
                $(this).addClass('btn-success');
               /* $(this).removeClass('btn-danger');
                $(this).removeClass('btn-warning');
                $(this).addClass('btn-success');*/
                //$(this).html('<i class="fa fa-plus-circle"></i> Expand');
                // This row is already open - close it
                row.child.remove();
                // $('#childRow').parent().parent().remove();
                tr.removeClass('shown');

            } else {
                $('.TemplateBtn').html('<i class="fa fa-plus-circle"></i> Expand');
                $('.TemplateBtn').removeClass('btn-warning');
                $('.TemplateBtn').addClass('btn-success');

                $(this).html('<i class="fa fa-minus-circle"></i> Close');
                $(this).removeClass('btn-warning');
                $(this).removeClass('btn-success');
                $(this).addClass('btn-danger');
                // Open this row
                if ($('#childRow').length > 0) {
                    $('#childRow').parent().parent().prev('tr').removeClass('shown');
                    $('#childRow').parent().parent().remove();
                    tr.removeClass('shown');
                }


                row.child(format(row.data())).show();
                $(".dtRangeGroup").toggle(row.data().dtRange);
                $(".branchGroup").toggle(row.data().branch);
                $(".stateGroup").toggle(row.data().state);
                $(".deptGroup").toggle(row.data().dept);
                $(".nationalityGroup").toggle(row.data().nationality);
                $(".pastypeGroup").toggle(row.data().pastype);
                $(".applicantGroup").toggle(row.data().applicant);
                $(".applicationStatusGroup").toggle(row.data().applicationStatus);
                $(".applicationStepGroup").toggle(row.data().applicationStep);
                $(".applicationTypeGroup").toggle(row.data().applicationType);
                $(".cityGroup").toggle(row.data().city);
                $(".sectorGroup").toggle(row.data().sector);
                $(".sexGroup").toggle(row.data().sex);


                tr.addClass('shown');
                // $('#reportrange').daterangepicker();

                 createCalenderCtrl();

                  $.getJSON(globalURL + "api/report/reference/state", function (json) { //api/user/reference/
                     $.each(json, function(k, v){
                        $("#temp-state").append('<option value='+k+'>'+v+'</option>');
                     });
                 });


                $.getJSON(globalURL + "api/report/reference/nationality", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-nationality").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                 $.getJSON(globalURL + "api/report/reference/pastype", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-pastype").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                 $.getJSON(globalURL + "api/report/reference/branch", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-branch").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                 $.getJSON(globalURL + "api/user/reference/dept", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-dept").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                 $.getJSON(globalURL + "api/report/reference/applicant", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicant").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                 $.getJSON(globalURL + "api/report/reference/applicationstatus", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicationStatus").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                 $.getJSON(globalURL + "api/report/reference/applicationstep", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicationStep").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                 $.getJSON(globalURL + "api/report/reference/applicationtype", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicationType").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                 $.getJSON(globalURL + "api/report/reference/city", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-city").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                  $.getJSON(globalURL + "api/report/reference/sector", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-sector").append('<option value='+k+'>'+v+'</option>');
                     });
                 });

                    $.getJSON(globalURL + "api/report/reference/sex", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-sex").append('<option value='+k+'>'+v+'</option>');
                     });
                 });


            }
        });

        /* Formatting function for row details - modify as you need */
        function format(d) {
            // `d` is the original data object for the row

            return '<form id="childRow" class="col-lg-12 col-md-12 col-sm-12 col-xs-12" action="#">' +
                '<div class="form-body">' +
                //Report Title
                '<div class="form-group col-md-12">' +
                '<label class="control-label">Selected Template Name </label>' +
                '<div class="">' +
                '<h4> ' + d.reportFileName + ' </h4>' +
                '<input id="temp-reportid" type="hidden" value=' + d.id + '>' +
                '</div>' +
                '</div>' +
                //Report title end
                //Datepicker
                '<div class="col-md-4 col-sm-6 col-xs-12 dtRangeGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">Choose date </label>' +
                '<div class="btn default form-control" id="reportrange">' +
                '<i class="fa fa-calendar"></i> &nbsp;' +
                '<span>From and To </span>' +
                '<b class="fa fa-angle-down"></b>' +
                '</div>' +
                '</div></div>' +
                //Datepicker end

                //State dropdown
                '<div class=" col-md-4 col-sm-6 col-xs-12 stateGroup">'+
                '<div class="form-group" >' +
                '<label class="control-label">State </label>' +
                '<select id="temp-state" class="form-control"></select>' +
                '</div></div>' +
                //State dropdown end

                //Branch dropdown
                '<div class=" col-md-4 col-sm-6 col-xs-12 branchGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">Branch </label>' +
                '<select id="temp-branch" class="form-control"></select>' +
                '</div></div>' +
                //Branch dropdown end

                //Department dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 deptGroup">'+
                '<div class="form-group">' +
                '<label class="control-label ">Department </label>' +
                '<select id="temp-dept" class="form-control department"></select>' +
                '</div></div>' +
                //Department dropdown end

                //Nationality dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 nationalityGroup">'+
                '<div class="form-group">'  +
                '<label class="control-label ">Nationality </label>' +
                '<select id="temp-nationality" class="form-control nationality"></select>' +
                '</div></div>' +
                //Nationality dropdown end

                //Pass Type dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 pastypeGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">Pas type </label>' +
                '<select id="temp-pastype" class="form-control pastype"></select>' +
                '</div></div>' +
                //Pass Type dropdown end

                //Applicant dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 applicantGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">Applicant </label>' +
                '<select id="temp-applicant" class="form-control applicant"></select>' +
                '</div></div>' +
                //Applicant dropdown end


                //Application Status dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 applicationStatusGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">Application Status </label>' +
                '<select id="temp-applicationStatus" class="form-control applicationStatus"></select>' +
                '</div></div>' +
                //Application Status dropdown end

                //Application Step dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 applicationStepGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">Application Step</label>' +
                '<select id="temp-applicationStep" class="form-control applicationStep"></select>' +
                '</div></div>' +
                //Pass Type dropdown end

                //Application Type dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 applicationTypeGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">Application Type</label>' +
                '<select id="temp-applicationType" class="form-control applicationType"></select>' +
                '</div></div>' +
                //Application Type dropdown end

                //City dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 cityGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">City </label>' +
                '<select id="temp-city" class="form-control city"></select>' +
                '</div></div>' +
                //City dropdown end

                //Sector dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 sectorGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">Sector </label>' +
                '<select id="temp-sector" class="form-control sector"></select>' +
                '</div></div>' +
                //Sector dropdown end

                //Sex dropdown
                '<div class="col-md-4 col-sm-6 col-xs-12 sexGroup">'+
                '<div class="form-group">' +
                '<label class="control-label">Sex</label>' +
                '<select id="temp-sex" class="form-control sex"></select>' +
                '</div></div>' +
                //Sex dropdown end


                '<div class="row">&nbsp;</div>' +
                '</div>' +
                '<div class="form-actions col-md-12">' +
                '<div class="text-right">' +
                '<a href="#/queryExe.html"  class="btn btn-success btn-md btnRunTemp"><i class="fa fa-eye"></i> View </a>' +
                ' <a href="#" class="btn btn-md btn-warning" id="btnReset"><i class="fa fa-refresh"></i> Reset</a>' +
                '</div>' +
                '</div>' +
                '</form>';
        }




        var reportPermitMasukData;
        queryMasukFunc = function () {
            reportPermitMasukData = $('#reportPermitMasukContainer').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL + queryString + "?cat=masuk",
                    "dataSrc": ""
                },
                "columns": [{
                    "data": "id"
                }, {
                    "data": "queryName"
                }, {
                    "data": "query"
                }, {
                    "data": "execute",
                    "render": function (data, type, full, meta) {
                        return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-play"></i> RUN</button></a>';
                    }


                }, {
                    "data": "action",
                    "width": "22%",
                    "render": function (data, type, full, meta) {
                        return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
                    }
                }]
            });

        }

        function createCalenderCtrl() {
            // $("#reportrange").daterangepicker({
            //          // opens: App.isRTL() ? "left" : "right",
            //          startDate: moment().subtract(29,"days"),
            //          endDate: moment(),
            //          minDate: "01/01/1900",
            //          maxDate: "12/31/2900",
            //          dateLimit: {
            //              days: 60
            //          },
            //          showDropdowns: !0,
            //          showWeekNumbers: !0,
            //          timePicker: !1,
            //          timePickerIncrement: 1,
            //          timePicker12Hour: !0,
            //          ranges: {
            //              Today: [moment(), moment()],
            //              Yesterday: [moment().subtract(1,"days"), moment().subtract(1,"days")],
            //              "Last 7 Days": [moment().subtract(6,"days"), moment()],
            //              "Last 30 Days": [moment().subtract(29,"days"), moment()],
            //              "This Month": [moment().startOf("month"), moment().endOf("month")],
            //              "Last Month": [moment().subtract("month", 1).startOf("month"), moment().subtract(1,"month").endOf("month")]
            //          },
            //          buttonClasses: ["btn"],
            //          applyClass: "green",
            //          cancelClass: "default",
            //          format: "MM/DD/YYYY",
            //          separator: " to ",
            //          locale: {
            //              applyLabel: "Apply",
            //              fromLabel: "From",
            //              toLabel: "To",
            //              customRangeLabel: "Custom Range",
            //              daysOfWeek: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            //              monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            //              firstDay: 1
            //          }
            //      },
            //       function(startdt, enddt) {
            //          $("#reportrange span").html(startdt.format("MMMM D, YYYY") + " - " + enddt.format("MMMM D, YYYY"))
            //          fromDate=startdt;
            //          toDate=enddt;
            //      }),
            //       $("#reportrange span").html(moment().subtract(29,"days").format("DD-MM-YYYY") + " - " + moment().format("DD-MM-YYYY"));

            $('#reportrange').daterangepicker({

            });
        }

        $('#queryContainer').on('apply.daterangepicker', function (ev, picker) {

            $("#reportrange span").html(picker.startDate.format("MMMM D, YYYY") + " - " + picker.endDate.format("MMMM D, YYYY"))
            fromDate = picker.startDate.format('YYYYMMDD');
            toDate = picker.endDate.format('YYYYMMDD');
        });

        $('#queryContainer').on('cancel.daterangepicker', function (ev, picker) {
            // alert("on cancel");
        });

        // formInputValidation("#queryForm");
        $('#queryContainer').on('click', '.btnRunTemp', function () {
            console.log(fromDate + ' - ' + toDate);
            var reportid = $('#temp-reportid')[0].value;
            var _state = $('#temp-state option:selected').text();
            var _dept = $('#temp-dept option:selected').text();
            var _branch = $('#temp-branch option:selected').text();
            var _nationality = $('#temp-nationality option:selected').text();
            var _pastype = $('#temp-pastype option:selected').text();
            var _applicant = $('#temp-applicant option:selected').text();
            var _applicationStatus = $('#temp-applicationStatus option:selected').text();
            var _applicationStep = $('#temp-applicationStep option:selected').text();
            var _applicationType = $('#temp-applicationType option:selected').text();
            var _city = $('#temp-city option:selected').text();
            var _sector = $("#temp-sector option:selected").text();
            var _sex = $("temp-sex option:selected").text();

            // console.log( globalURL+ 'jasperreport/' + fileformat + '/' + reportid);
            var selTemplateVal = JSON.stringify({
        username: localStorage.username,
                fromDt: fromDate,
                toDt: toDate,
                state: _state.substr(0, _state.indexOf(' - ')),
                dept: _dept.substr(0, _dept.indexOf(' - ')),
                branch: _branch.substr(0, _branch.indexOf(' - ')),
                nationality: _nationality.substr(0, _nationality.indexOf(' - ')),
                pastype: _pastype.substr(0, _pastype.indexOf(' - ')),
                applicant: _applicant.substr(0, _applicant.indexOf(' - ')),
                applicationstatus: _applicationStatus.substr(0, _applicationStatus.indexOf(' - ')),
                applicationstep: _applicationStep.substr(0, _applicationStep.indexOf(' - ')),
                applicationtype: _applicationType.substr(0, _applicationType.indexOf(' - ')),
                city: _city.substr(0, _city.indexOf(' - ')),
                sector: _sector.substr(0, _sector.indexOf(' - ')),
                sex: _sex.substr(0, _sex.indexOf(' - '))
            });
            localStorage.setItem("selTemplateVal", selTemplateVal);


            $.ajax({
                url: globalURL + queryString + '/' + reportid + "/exec",
                type: "POST",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: selTemplateVal,
                success: function (result) {

                    queryData.destroy();
                    queryDataFunc();

                    resultOutputCol = jQuery.parseJSON(result.columns);
                    resultOutput = jQuery.parseJSON(result.results);


                    if (resultOutput != null && resultOutput.length > 0) {
                        var myArrayColumn = [];
                        var i = 0;

                        $.each(resultOutputCol, function (index, val) {
                            //console.log(val);
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
                                //console.log(val);
                                rowData[j] = val;
                                j++;
                            });

                            myArrayRow[i] = rowData;
                            i++;
                        });

                        function queryUIFunc() {
                            queryUI = $("#jqueryRunData").dataTable({
                                "bDestroy": true,
                                "bScrollCollapse": true,
                                "bJQueryUI": true,
                                "bInfo": true,
                                "bFilter": true,
                                "bSort": true,
                                "aaData": myArrayRow,
                                "aoColumns": myArrayColumn,
                                "scrollCollapse": true,
                                "paging": true
                            });
                        }

                        queryUIFunc();

                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest, textStatus, errorThrown);
                }
            }).done(function () {
                // alert("Post done successfully");
            }).fail(function (data) {
                // alert("Poset exec url falied");
            });

            // $.ajax({
            //     url: globalURL+ 'jasperreport/' + fileformat + '/' + reportid,
            //     type: "POST",
            //     dataType: 'json',
            //     contentType: "application/json; charset=utf-8",
            //     data: JSON.stringify({
            //         fromDt: fromDate,
            //         toDt : toDate,
            //         state : "tst",
            //         dept  : "hello",
            //         branch : "bb"

            //     })
            // })
            // .done(function() {


            // })
            // .fail(function(data) {

            // });


        });




        formInputValidation("#queryForm");
        formInputValidation("#queryFormTemplate");

        $("#queryUISubmit").click(function (event) {

            var queryNameVal = $("#queryForm #query-name").val();
            var queryTextVal = $("#queryForm #query-text").val();

            inputValidation("#queryForm", queryAjax);

            function queryAjax() {
                $.ajax({
                        url: globalURL + queryString + "/",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            queryName: queryNameVal,
                            query: queryTextVal,
                            category: reportCategoryID,
                            cached: null,
                login: localStorage.username
                        })
                    })
                    .done(function () {
                        queryData.destroy();
                        queryDataFunc();
                        queryMasukFunc();
                        $("#queryAddForm").modal('hide');
                        $("#queryRequire").hide();
                    })
                    .fail(function (data) {
                        //console.log(data.responseJSON.error);
                        $("#queryRequire span").html(data.responseJSON.error);
                        $("#queryRequire").show();
                        //alert('Failed!');
                    });
            }


        });
         var templateFileName;
        $("#templateBrowse").change(function(){
           var getVal = $('input[type=file]').val();
            templateFileName = getVal.split(/(\\|\/)/g).pop();
        });


        $("#queryUISubmitTemplate").click(function (event) {
            var queryNameValTemp = $("#queryFormTemplate #query-name").val();

            /*var dtRange = $("#queryFormTemplate #dtRange").prop("checked");
            var stateVal = $("#queryFormTemplate #stateVal").prop("checked");
            var branchVal = $("#queryFormTemplate #branchVal").prop("checked");
            var deptVal = $("#queryFormTemplate #deptVal").prop('checked');
            console.log(deptVal);
            console.log($("#queryFormTemplate #deptVal").prop('checked'));*/

            inputValidation("#queryFormTemplate", setTimeout(queryAjax, 1000));

            function queryAjax() {
                $.ajax({
                        url: globalURL + queryString + "/",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            queryName: queryNameValTemp,
                           /* dtRange:dtRange,
                            state:stateVal,
                            branch:branchVal,
                            dept:deptVal,*/
                            category: reportCategoryID,
                            reportFileName: templateFileName,
                            query:'NA',
                            cached: null,
                            login: localStorage.username
                        })
                    })
                    .done(function () {
                        queryData.destroy();
                        queryDataFunc();
                        queryMasukFunc();
                        $("#queryAddForm").modal('hide');
                        $("#queryRequire").hide();
                    })
                    .fail(function (data) {
                        //console.log(data.responseJSON.error);
                        $("#queryRequire span").html(data.responseJSON.error);
                        $("#queryRequire").show();
                        //alert('Failed!');
                    });
            }


        });



        $("#queryUIUpdateTemplate").click(function (event) {
            var queryNameValTemp = $("#queryFormTemplate #query-name").val();
           /*
            var dtRange = $("#queryFormTemplate #dtRange").prop("checked");
            var stateVal = $("#queryFormTemplate #stateVal").prop("checked");
            var branchVal = $("#queryFormTemplate #branchVal").prop("checked");
            var deptVal = $("#queryFormTemplate #deptVal").prop('checked');
            console.log(deptVal);
            console.log($("#queryFormTemplate #deptVal").prop('checked'));*/

            inputValidation("#queryFormTemplate", setTimeout(queryAjax, 1000));

            function queryAjax() {
                $.ajax({
                        url: globalURL + queryString + "/",
                        type: "PUT",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            queryName: queryNameValTemp,
                            /*dtRange:dtRange,
                            state:stateVal,
                            branch:branchVal,
                            dept:deptVal,*/
                            id: selectedQueryId,
                            category: reportCategoryID,
                            reportFileName: templateFileName,
                            query:'NA',
                            cached: null,
                login: localStorage.username
                        })
                    })
                    .done(function () {
                        queryData.destroy();
                        queryDataFunc();
                        queryMasukFunc();
                        $("#queryAddForm").modal('hide');
                        $("#queryRequire").hide();
                    })
                    .fail(function (data) {
                        //console.log(data.responseJSON.error);
                        $("#queryRequire span").html(data.responseJSON.error);
                        $("#queryRequire").show();
                        //alert('Failed!');
                    });
            }


        });




        queryDataFunc();
        queryMasukFunc();
        var selectedQueryId = undefined;
        $('#queryContainer').on('click', 'button.updateBtn', function () {
            var selectedQuery = queryData.row($(this).parents('tr')).data();
            selectedQueryId = selectedQuery.id;
            $("#queryAddForm #queryUISubmit").addClass('hide');
            $("#queryAddForm #queryUIUpdate").removeClass('hide');

            $("#queryAddForm #queryUISubmitTemplate").addClass('hide');
            $("#queryAddForm #queryUIUpdateTemplate").removeClass('hide');


            $("#queryForm #query-name").val(selectedQuery.queryName);
            $("#queryFormTemplate #query-name").val(selectedQuery.queryName);

            $("#queryForm #query-text").val(selectedQuery.query);
            $("#queryForm #query-template").val(selectedQuery.reportFileName);
            $("#queryAddFormHeader").html("Update Query UI");
            $("#queryAddForm").modal('show');

        });

    var selectedQueryReportId = undefined;
        $('#queryContainer').on('click', 'button.downloadBtn', function () {
            var selectedQuery = queryData.row($(this).parents('tr')).data();
            selectedQueryReportId = selectedQuery.id;
            window.location.href = globalURL + 'download/jasper/' + selectedQueryReportId;
        });

        $("#queryAddForm").on('hidden.bs.modal', function () {
            $('form').trigger('reset');
            $('#queryRequire').hide();
            $('.form-group').removeClass('has-error');
        });

        $('#queryContainer').on('click', 'button.runBtn', function () {
            var selectedRunQuery = queryData.row($(this).parents('tr')).data();
            selectedQueryRunId = selectedRunQuery.id;
            FrmTemplate = '';
            localStorage.setItem("selTemplateVal", "");
            //alert(selectedQueryRunId);
        });

        $('#queryContainer').on('click', 'button.TemplateBtn', function () {
            var selectedRunQuery = queryData.row($(this).parents('tr')).data();
            selectedQueryRunId = selectedRunQuery.id;
            FrmTemplate = 'Yes';
            localStorage.setItem("selTemplateVal", "");
            //alert(selectedQueryRunId);
        });

        $('#queryContainerAdmin').on('click', 'button.runBtn', function () {
            var selectedRunQuery = queryData.row($(this).parents('tr')).data();
            selectedQueryRunId = selectedRunQuery.id;
            //alert(selectedQueryRunId);
        });

         $('#queryContainerAdmin').on('click', 'button.TemplateBtn', function () {
            var selectedRunQuery = queryData.row($(this).parents('tr')).data();
            selectedQueryRunId = selectedRunQuery.id;
            FrmTemplate = 'Yes';
            localStorage.setItem("selTemplateVal", "");
        });




        var selectedQueryForDelete;
        $('#queryContainer').on('click', 'button.deleteBtn', function () {
            $("#queryDataDelete").modal('show');
            selectedQueryForDelete = queryData.row($(this).parents('tr')).data();
            $("#queryDataDelete .modal-body h3").html('Are you sure do you want to<br>delete the query <strong>' + selectedQueryForDelete.queryName + '</strong>?');
        });

        $('#queryDataDeleteBtn').click(function (event) {

            $.ajax({
                url: globalURL + queryString + '/' + selectedQueryForDelete.id,
                type: 'DELETE',
                success: function (result) {
                    // Do something with the result
                    queryData.destroy();
                    queryDataFunc();
                    $("#queryDataDelete").modal('hide');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert("Status: " + textStatus);
                    //alert("Error: " + errorThrown);
                    $("#queryErrorTitle").html(XMLHttpRequest.responseJSON.error);
                    $("#queryDeleteErrorMsg").modal('show');
                    $("#queryDataDelete").modal('hide');
                }
            });

        });
        var queryUI, resultOutput;

        $('#queryContainer').on('click', 'button.runBtn', function () {
            //$("#jqueryRunData").remove();
            var selectedQueryForExecute = queryData.row($(this).parents('tr')).data();
            $.ajax({
                    url: globalURL + queryString + '/' + selectedQueryForExecute.id + "/exec",
                    type: 'GET',
                    timeout: 50000000,
                    success: function (result) {
                        //$("#QueryUIList").hide();
                        //$("#QueryUIListRun, #jqueryRunData").show();
                        // Do something with the result
                        //debugger;
                        queryData.destroy();
                        queryDataFunc();
                        //console.log(result);
                        //resultOutput = null;
                        resultOutputCol = jQuery.parseJSON(result.columns);
                        resultOutput = jQuery.parseJSON(result.results);


                        if (resultOutput != null && resultOutput.length > 0) {
                            var myArrayColumn = [];
                            var i = 0;

                            $.each(resultOutputCol, function (index, val) {
                                //console.log(val);
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
                                    //console.log(val);
                                    rowData[j] = val;
                                    j++;
                                });

                                myArrayRow[i] = rowData;
                                i++;
                            });

                            function queryUIFunc() {
                                queryUI = $("#jqueryRunData").dataTable({
                                    "bDestroy": true,
                                    "bScrollCollapse": true,
                                    "bJQueryUI": true,
                                    "bScrollCollapse": true,
                                    "bInfo": true,
                                    "bFilter": true,
                                    "bSort": true,
                                    "aaData": myArrayRow,
                                    "aoColumns": myArrayColumn,
                                    "scrollCollapse": true,
                                    "paging": true
                                });
                            }

                            queryUIFunc();

                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest, textStatus, errorThrown);
                    }
                })
                .done(function () {
                    queryData.destroy();
                    queryDataFunc();
                })
                .fail(function (e) {
                    console.log(e);
                });
        });



        $('#queryContainerAdmin').on('click', 'button.runBtn', function () {
            //$("#jqueryRunData").remove();
            var selectedQueryForExecute = queryData.row($(this).parents('tr')).data();

            $.ajax({
                    url: globalURL + queryString + '/' + selectedQueryForExecute.id + "/exec",
                    type: 'GET',
                    success: function (result) {
                        //$("#QueryUIList").hide();
                        //$("#QueryUIListRun, #jqueryRunData").show();
                        // Do something with the result
                        //debugger;
                        queryData.destroy();
                        queryDataFunc();
                        //console.log(result);
                        //resultOutput = null;
                        resultOutputCol = jQuery.parseJSON(result.columns);
                        resultOutput = jQuery.parseJSON(result.results);


                        if (resultOutput != null && resultOutput.length > 0) {
                            var myArrayColumn = [];
                            var i = 0;

                            $.each(resultOutputCol, function (index, val) {
                                console.log(val);
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

                            function queryUIFunc() {
                                queryUI = $("#jqueryRunData").dataTable({
                                    "bDestroy": true,
                                    "bScrollCollapse": true,
                                    "bJQueryUI": true,
                                    "bScrollCollapse": true,
                                    "bInfo": true,
                                    "bFilter": true,
                                    "bSort": true,
                                    "aaData": myArrayRow,
                                    "aoColumns": myArrayColumn,
                                    "scrollCollapse": true,
                                    "paging": true
                                });
                            }

                            queryUIFunc();

                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest, textStatus, errorThrown);
                        //alert("Execution falied, Please re-try after some time!");
                        //alert("Error: " + errorThrown);
                    }
                })
                .done(function () {
                    queryData.destroy();
                    queryDataFunc();
                })
                .fail(function () {

                });
        });

       /* $("#queryUIUpdateTemplate").click(function (event){
            var queryNameValTempUpdated = $("#queryForm #query-name-update").val();
        });*/

        $("#queryUIUpdate").click(function (event) {
            var queryNameValUpdated = $("#queryForm #query-name").val();

            var queryTextValUpdated = $("#queryForm #query-text").val();
            //alert(selectedQueryId);
            $.ajax({
                    url: globalURL + queryString + "/",
                    type: "PUT",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        id: selectedQueryId,
                        queryName: queryNameValUpdated,
                        query: queryTextValUpdated,
                        cached: null,
            login: localStorage.username
                    })
                })
                .done(function (data) {
                    queryData.destroy();
                    queryDataFunc();
                    //selectedQueryId = null;
                })
                .fail(function (e) {
                    console.log(e);
                    //alert('Failed!');
                });
        });


        $(document).ajaxStart(function () {
//            $("#loader").css('height', $(".page-content").height() + 140 + 'px');
            $("#loader .page-spinner-bar").removeClass('hide');
            $("#loader").show();
        });

        $(document).ajaxStop(function () {
            onResize1();
            $("#loader .page-spinner-bar").addClass('hide');
            $("#loader").hide();
        });




        $('#jobsContainer').on('click', 'button.btn1', function () {
            //alert('start');
            var jobData = jobsData.row($(this).parents('tr')).data();

            $.ajax({
                url: globalURL + 'etl/jobs/' + jobData.id + '/start',
                type: 'GET',
                success: function (result) {
                    // Do something with the result
                    //alert('done');
                    jobsData.destroy();
                    jobsDataFunc();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        });



        $('#jobsContainer').on('click', 'button.btn3', function () {

            var jobData = jobsData.row($(this).parents('tr')).data();

            $.ajax({
                url: globalURL + 'etl/jobs/' + jobData.id + '/schedule',
                type: 'GET',
                success: function (result) {
                    // Do something with the result
                    //alert('done');
                    jobsData.destroy();
                    jobsDataFunc();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest, textStatus, errorThrown);
                }
            });
        });



        var jobData;
        $('#jobsContainer').on('click', 'button.btn2', function () {
            $("#jobDataDelete").modal('show');
            jobData = jobsData.row($(this).parents('tr')).data();
            $("#jobDataDelete .modal-body h3").html('Are you sure do you want to<br>delete the job <strong>' + jobData.jobName + '</strong>?');
        });

        $('#jobDataDeleteBtn').click(function (event) {

            $.ajax({
                url: globalURL + 'etl/jobs/' + jobData.id + '/delete',
                type: 'DELETE',
                success: function (result) {
                    // Do something with the result
                    jobsData.destroy();
                    jobsDataFunc();
                    $("#jobDataDelete").modal('hide');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert("Status: " + textStatus);
                    //alert("Error: " + errorThrown);
                    $("#jobErrorTitle").html(XMLHttpRequest.responseJSON.error);
                    $("#jobDataDelete").modal('hide');
                    $("#jobDeleteErrorMsg").modal('show');
                }
            });

        });

      

        $("#backBtn").click(function (event) {
            $("#databaseList").show();
            $("#tableList").hide();
        });
        $('#btnRefresh').click(function(event){
            $.get(globalURL+'etl/databases/'+ $scope.SelectedViewID +'/refresh');
        });

        // set sidebar closed and body solid layout mode
          $rootScope.settings.layout.pageSidebarClosed = true;
          $rootScope.skipTitle = true;
          $rootScope.settings.layout.setTitle("reporttitles");
    });



}]);

MetronicApp.controller('GeneralPageController', function($scope, Idle, settings, Keepalive, $modal, $rootScope){
      $scope.started = false;
      console.log($scope.started );
      function closeModals() {
        if ($scope.warning) {
          $scope.warning.close();
          $scope.warning = null;
        }

        if ($scope.timedout) {
          $scope.timedout.close();
          $scope.timedout = null;
        }
      }

      $scope.$on('IdleStart', function() {
        closeModals();

        $scope.warning = $modal.open({
          templateUrl: 'warning-dialog.html',
          windowClass: 'modal-danger'
        });
      });

      $scope.$on('IdleEnd', function() {
        closeModals();
      });

      $scope.$on('IdleTimeout', function() {
        closeModals();
        $scope.timedout = $modal.open({
          templateUrl: 'timedout-dialog.html',
          windowClass: 'modal-danger'
        });
      });

      $rootScope.start = function() {

        closeModals();
        Idle.watch();

        $scope.started = true;
      };

      $scope.stop = function() {
        closeModals();
        Idle.unwatch();
        $scope.started = false;

      };

    });
