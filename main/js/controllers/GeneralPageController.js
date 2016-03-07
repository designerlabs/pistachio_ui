/* Setup general page controller */
var tableFunc, jobsDataFunc, selectedQueryRunId, reportCategoryID, fromDate, toDate, FrmTemplate = undefined;

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




/* GeneralPageController starts */
MetronicApp.controller('GeneralPageController', ['$rootScope', '$scope', '$http', 'settings', 'authorities', 'fileUpload', function ($rootScope, $scope, $http, settings, authorities, fileUpload) {
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = globalURL + "api/pistachio/upload?user=sridhar";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
    
    
    $scope.$on('$viewContentLoaded', function () {
        $("#databaseList").show();
        $("#tableList").hide();
        $scope.chkRole = authorities.checkRole;
        $scope.getReportPrivilege = localStorage.getItem('reportPrivilege');
        $scope.reportPrivilege = JSON.parse($scope.getReportPrivilege);


        $("#dataManagement").click(function () {
            $("#sidebarMenu li").removeClass("active");
            $(this).addClass('active');
        });

        // initialize core components
        Metronic.initAjax();
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
                            if (data == null) {
                                return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-eye"></i> View</button></a>';
                            } else {
                                return '<button class="btn btn-success btn-sm TemplateBtn details-control"><i class="fa fa-plus-circle"></i> Expand</button>';
                            }
                        }
                }, {
                        "data": "action",
                        "width": "22%",
                        "render": function (data, type, full, meta) {
                            return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
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

                                return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-play"></i> RUN</button></a>';

                            }
                            /* "render": function(data, type, full, meta) {
                                 return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-play"></i> RUN</button></a>';
                             }*/
                }]
                })
            };

        };

        // Add event listener for opening and closing details
        $('#queryContainer').on('click', '.details-control', function () {
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
                
                tr.addClass('shown');
                // $('#reportrange').daterangepicker();

                 createCalenderCtrl();

                  $.getJSON(globalURL + "api/user/reference/state", function (json) {
                     $.each(json, function(k, v){
                        $("#temp-state").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
                 
                 
                $.getJSON(globalURL + "api/user/reference/nationality", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-nationality").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
                 
                 $.getJSON(globalURL + "api/user/reference/pastype", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-pastype").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
                 
                 
                 
                 $.getJSON(globalURL + "api/user/reference/branch", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-branch").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
                 
                 $.getJSON(globalURL + "api/user/reference/dept", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-dept").append('<option value='+k+'>'+v+'</option>');
                     });
                 });


            }
        });

        /* Formatting function for row details - modify as you need */
        function format(d) {
            // `d` is the original data object for the row             

            return '<form id="childRow" class="form-horizontal form-bordered col-xs-21 col-lg-11 col-sm-11 col-md-11" action="#">' +
                '<div class="form-body">' +
                '<div class="form-group">' +
                '<label class="control-label col-md-3">Selected Template Name </label>' +
                '<div class="col-md-4" style="padding-top: 8px;">' +
                '<Strong> ' + d.reportFileName + ' </Strong>' +
                '<input id="temp-reportid" type="hidden" value=' + d.id + '>' +
                '</div>' +
                '</div>' +
                '<div class="form-group dtRangeGroup">' +
                '<label class="control-label col-md-3">Choose date </label>' +
                '<div class="col-md-4">' +
                '<div class="btn default form-control" id="reportrange">' +
                '<i class="fa fa-calendar"></i> &nbsp;' +
                '<span>From and To </span>' +
                '<b class="fa fa-angle-down"></b>' +
                '</div>' +
                '</div>' +
                '</div>' +

                '<div class="form-group stateGroup" >' +
                '<label class="control-label col-md-3">State </label>' +
                '<div class="col-md-4">' +
                '<select id="temp-state" class="form-control"></select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group branchGroup">' +
                '<label class="control-label col-md-3">Branch </label>' +
                '<div class="col-md-4">' +
                '<select id="temp-branch" class="form-control"></select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group deptGroup">' +
                '<label class="control-label col-md-3">Department </label>' +
                '<div class="col-md-4">' +
                '<select id="temp-dept" class="form-control department"></select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group nationalityGroup">' +
                '<label class="control-label col-md-3">Nationality </label>' +
                '<div class="col-md-4">' +
                '<select id="temp-nationality" class="form-control nationality"></select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group pastypeGroup">' +
                '<label class="control-label col-md-3">Pas type </label>' +
                '<div class="col-md-4">' +
                '<select id="temp-pastype" class="form-control pastype"></select>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="form-actions">' +
                ' <div class="row">' +
                '<div class="col-md-offset-3 col-md-9">' +
                '<a href="#/queryExe.html"  class="btn btn-success btn-sm btnRunTemp"><i class="fa fa-eye"></i> View </a>' +
                ' <a href="#" class="btn btn-sm btn-warning" id="btnReset"><i class="fa fa-refresh"></i> Reset</a>' +
                '</div>' +
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
            // console.log( globalURL+ 'jasperreport/' + fileformat + '/' + reportid);
            var selTemplateVal = JSON.stringify({
                fromDt: fromDate,
                toDt: toDate,
                state: _state,
                dept: _dept,
                branch: _branch,
                nationality: _nationality,
                pastype: _pastype
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
                            cached: null
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

            inputValidation("#queryFormTemplate", queryAjax);

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
                            cached: null
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

            inputValidation("#queryFormTemplate", queryAjax);

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
                            cached: null
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
                        cached: null
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



        var selectedDatabaseId = undefined;
        $('#databaseData').on('click', 'button.updateBtn', function () {
            var selectedDatabase = databases.row($(this).parents('tr')).data();
            selectedDatabaseId = selectedDatabase.id;
            $("#databaseAddForm #databaseUISubmit").addClass('hide');
            $("#databaseAddForm #databaseUIUpdate").removeClass('hide');
            $("#databaseForm #database-name").val(selectedDatabase.dbName);
            $("#databaseForm #database-type").val(selectedDatabase.dbType);
            $("#databaseForm #database-url").val(selectedDatabase.dbUrl);
            $("#databaseForm #database-uname").val(selectedDatabase.dbUsername);
            $("#databaseForm #database-pwd").val(selectedDatabase.dbPassword);
            $("#databaseForm #database-driver").val(selectedDatabase.dbDriver);
            $("#databaseAddFormHeader").html("Update Database");
            $("#databaseAddForm").modal('show');
        });



        $("#databaseUIUpdate").click(function (event) {

            var databaseUpdateNameVal = $("#databaseForm #database-name").val();
            var databaseUpdateTypeVal = $("#databaseForm #database-type").val();
            var databaseUpdateURLVal = $("#databaseForm #database-url").val();
            var databaseUpdateUserVal = $("#databaseForm #database-uname").val();
            var databaseUpdatePwdVal = $("#databaseForm #database-pwd").val();
            var databaseUpdateDriverVal = $("#databaseForm #database-driver").val();
            //alert(selectedQueryId);
            $.ajax({
                    url: globalURL + "etl/databases/",
                    type: "PUT",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        id: selectedDatabaseId,
                        dbName: databaseUpdateNameVal,
                        dbType: databaseUpdateTypeVal,
                        dbUrl: databaseUpdateURLVal,
                        dbUsername: databaseUpdateUserVal,
                        dbPassword: databaseUpdatePwdVal,
                        dbDriver: databaseUpdateDriverVal,
                        active: "active",
                        username: "admin"
                    })
                })
                .done(function (data) {
                    databases.destroy();
                    databaseDataFunc();
                    //selectedQueryId = null;
                })
                .fail(function (e) {
                    console.log(e);
                });
        });

        var selectedDatabaseForDelete;
        $('#databaseData').on('click', 'button.deleteBtn', function () {
            $("#databaseDelete").modal('show');
            selectedDatabaseForDelete = databases.row($(this).parents('tr')).data();
            $("#databaseDelete .modal-body h3").html('Are you sure do you want to<br>delete the database <strong>' + selectedDatabaseForDelete.dbName + '</strong>?');

        });

        $('#databaseDataDeleteBtn').click(function (event) {
            //$('#databaseData').on('click', 'button.deleteBtn', function() {
            //var selectedDatabaseForDelete = databases.row($(this).parents('tr')).data();
            $.ajax({
                url: globalURL + 'etl/databases/' + selectedDatabaseForDelete.id,
                type: 'DELETE',
                success: function (result) {
                    // Do something with the result
                    databases.destroy();
                    databaseDataFunc();
                    $("#databaseDelete").modal('hide');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    //alert("Status: " + textStatus);
                    //alert("Error: " + errorThrown);
                    //alert("request: " + XMLHttpRequest);
                    if (errorThrown) {
                        $("#errorTitle").html(XMLHttpRequest.responseJSON.error);
                        $("#databaseDeleteErrorMsg").modal('show');
                        //console.log(XMLHttpRequest.responseJSON.error);
                    }
                    //console.log(XMLHttpRequest);
                    $("#databaseDelete").modal('hide');
                }
            });

        });






        $('#databaseData tbody').on('click', '.tableView', function () {
            var data = databases.row($(this).parents('tr')).data();
            var tables;
            $("#databaseList").hide();
            $("#tableList").show();
            tableFunc = function () {
                tables = $('#example12').DataTable({
                    "paginate": true,
                    "retrieve": true
                });
                tables.destroy();
                tables = $('#example12').DataTable({
                    "paginate": true,
                    "retrieve": true,
                    "ajax": {
                        "url": globalURL + "etl/databases/" + data.id + "/tables",
                        "dataSrc": ""
                    },
                    "columns": [{
                        "data": "tableName"
                    }, {
                        "data": "status"
                    }, {
                        "data": "progress"
                    }, {
                        "data": "status",
                        "render": function (data, type, full, meta) {
                            if ((data == "NOT_SYNCED") || (data == "NEVER_EXECUTED")) {
                                return '<button class="btn btn-success btn-sm sqoopBtn"><i class="fa fa-compress"></i> Sqoop</button>';
                            } else
                            if (data == "COMPLETED") {
                                return '<button class="btn btn-default btn-sm dailysqoopBtn" disabled><i class="fa fa-compress"></i> Sqooped</button><button class="btn btn-success btn-sm"><i class="fa fa-compress"></i> Daily Sqoop</button>';
                            } else {
                                return '<button class="btn btn-default btn-sm dailysqoopBtn" disabled><i class="fa fa-compress"></i> Sqooped</button><button class="btn btn-danger btn-sm"><i class="fa fa-compress"></i> Daily Sqoop</button>';
                            }
                        }
                    }],

                });
            }

            tableFunc();


            $('#example12 tbody').on('click', 'button.sqoopBtn', function () {
                var tableList = tables.row($(this).parents('tr')).data();
                $.ajax({
                    url: globalURL + "etl/databases/" + tableList.dbId + "/sync?table=" + tableList.tableName + "&hdfs=11",
                    type: 'GET',
                    success: function (result) {
                        // Do something with the result
                        //alert('done');
                        tableFunc();
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest, textStatus, errorThrown);
                    }
                }).error(function (e) {
                    console.log(e);
                });

            });



        });

        $(document).ajaxStart(function () {
            $("#loader").css('height', $(".page-content").height() + 140 + 'px');
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

        /*
                $('#jobsContainer').on('click', 'button.btn2', function() {
                    var jobData = jobsData.row($(this).parents('tr')).data();
                    //alert(jobData.id);
                    $.ajax({
                        url: globalURL+'etl/jobs/' + jobData.id + '/delete',
                        type: 'DELETE',
                        success: function(result) {
                            // Do something with the result
                            jobsData.destroy();
                            jobsDataFunc();
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            alert("Status: " + textStatus);
                            alert("Error: " + errorThrown);
                        }
                    });

                });*/

        $("#backBtn").click(function (event) {
            $("#databaseList").show();
            $("#tableList").hide();
        });




        /*
                $("#backBtnQuery").click(function(event) {
                    $("#QueryUIList").show();
                    $("#QueryUIListRun, #jqueryRunData").hide();
                });*/


    });
}]);

MetronicApp.controller('GeneralPageController', function($scope, Idle, Keepalive, $modal, $rootScope){
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
