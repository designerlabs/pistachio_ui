/* Setup general page controller */
var tableFunc, jobsDataFunc, selectedQueryRunId, reportCategoryID = undefined;


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
        $('td .btn').css('padding', '3px');
    } else {
        $('.tableView').html('<i class="fa fa-eye"></i> View');
        $('td .btn1').html('<i class="fa fa-play"></i> Start');
        $('td .updateBtn').html('<i class="fa fa-edit"></i> Edit');
        $('td .deleteBtn, td .btn2').html('<i class="fa fa-trash"></i> Delete');
        $('td .btn').css('padding', '6px 12px');
    }
}




/* GeneralPageController starts */
MetronicApp.controller('GeneralPageController', ['$rootScope', '$scope', '$http', 'settings', 'authorities',  function($rootScope, $scope, $http, settings, authorities) {
    $scope.$on('$viewContentLoaded', function() {
        $("#databaseList").show();
        $("#tableList").hide();



        $scope.chkRole = authorities.checkRole;

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


        // configuration
        var configuration;
        configurationDataFunc = function() {
            configuration = $('#config').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL+"config",
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
                    "render": function(data, type, full, meta) {
                        return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
                    }
                }]
            });
        }




        formInputValidation("#configForm");
        $("#configUISubmit").click(function(event) {
            var configNameVal = $("#configForm #config-name").val();
            var configVal = $("#configForm #config-value").val();
            var configApp = $("#configForm #config-application").val();
            inputValidation("#configForm", configAjax);

            function configAjax() {
                $.ajax({
                        url: globalURL+"config/",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            configName: configNameVal,
                            configValue: configVal,
                            application: configApp
                        })
                    })
                    .done(function() {
                        configuration.destroy();
                        configurationDataFunc();
                        //$("#configForm input").parent('.form-group').removeClass('has-error');
                        $("#configAddForm").modal('hide');
                        $("#configRequire").hide();
                    })
                    .fail(function(data) {
                        console.log(data.responseJSON.error);
                        $("#configRequire span").html(data.responseJSON.error);
                        $("#configRequire").show();
                    });
            }

        });


        configurationDataFunc();

        var selectedConfigId = undefined;
        $('#config').on('click', 'button.updateBtn', function() {
            $("#configForm input").parent('.form-group').removeClass('has-error');
            var selectedConfig = configuration.row($(this).parents('tr')).data();
            selectedConfigId = selectedConfig.id;
            $("#configAddForm #configUISubmit").addClass('hide');
            $("#configAddForm #configUIUpdate").removeClass('hide');
            $("#configForm #config-name").val(selectedConfig.configName);
            $("#configForm #config-value").val(selectedConfig.configValue);
            $("#configForm #config-application").val(selectedConfig.application);
            $("#configAddForm").modal('show');

        });


        $("#configUIUpdate").click(function(event) {
            var configNameVal = $("#configForm #config-name").val();
            var configVal = $("#configForm #config-value").val();
            var configApp = $("#configForm #config-application").val();
            //alert(selectedQueryId);
            $.ajax({
                    url: globalURL+"config/",
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
                .done(function(data) {
                    configuration.destroy();
                    configurationDataFunc();
                    $("#configAddForm").modal('hide');
                    //selectedQueryId = null;
                })
                .fail(function() {
                    alert('Failed!');
                });
        });

        var selectedConfigForDelete;
        $('#config').on('click', 'button.deleteBtn', function() {
            $("#configDelete").modal('show');
            selectedConfigForDelete = configuration.row($(this).parents('tr')).data();
            $("#configDelete .modal-body h3").html('Are you sure do you want to<br>delete the config <strong>' + selectedConfigForDelete.configName + '</strong> ?');
        });

        $('#configDataDeleteBtn').click(function(event) {

            $.ajax({
                url: globalURL+'config/' + selectedConfigForDelete.id,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    configuration.destroy();
                    configurationDataFunc();
                    $("#configDelete").modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $("#configErrorTitle").html(XMLHttpRequest.responseJSON.error);
                    $("#configDeleteErrorMsg").modal('show');
                    $("#configDelete").modal('hide');
                }
            });

        });


        var jobsData;
        jobsDataFunc = function() {
            jobsData = $('#jobsContainer').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL+"etl/jobs",
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
                    "render": function(data, type, full, meta) {
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
                    "width": "22%",
                    "render": function(data, type, full, meta) {
                        //if ((data == "JOB_RUNNING") || (data == "JOB_COMPLETED")) {
                        //return '<button class="btn btn-success btn-sm" disabled><i class="fa fa-play"></i> Start</button><button class="btn btn-danger btn-sm" disabled><i class="fa fa-times"></i> Delete</button>';
                        //} else {
                        return '<button class="btn btn-success btn-sm btn1"><i class="fa fa-play"></i> Start</button><button class="btn btn-danger btn-sm btn2"><i class="fa fa-trash"></i> Delete</button>';
                        //}
                    }

                }]
            });
        }

        jobsDataFunc();

        var reportCategoryID = localStorage.getItem("reportCategoryID");

        var queryData;
        //console.log(categoryId);
        queryDataFunc = function() {
            
            queryData = $('#queryContainer').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL+queryString+"?"+categoryName+"="+reportCategoryID,
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
                    "render": function(data, type, full, meta) {
                        return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-play"></i> RUN</button></a>';
                    }


                }, {
                    "data": "action",
                    "width": "22%",
                    "render": function(data, type, full, meta) {
                        if($scope.chkRole('ROLE_ADMIN')){
                         return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';   
                     }else{
                        return '';
                     }
                        
                    }
                }]
            });

        };
		
		var reportPermitMasukData;
        queryMasukFunc = function() {
            reportPermitMasukData = $('#reportPermitMasukContainer').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL+queryString+"?cat=masuk",
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
                    "render": function(data, type, full, meta) {
                        return '<a href="#/queryExe.html"><button class="btn btn-success btn-sm runBtn"><i class="fa fa-play"></i> RUN</button></a>';
                    }


                }, {
                    "data": "action",
                    "width": "22%",
                    "render": function(data, type, full, meta) {
                        return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
                    }
                }]
            });

        }
		


        formInputValidation("#queryForm");
        $("#queryUISubmit").click(function(event) {
            var queryNameVal = $("#queryForm #query-name").val();
            var queryTextVal = $("#queryForm #query-text").val();

            inputValidation("#queryForm", queryAjax);

            function queryAjax(){
                $.ajax({
                    url: globalURL+queryString+"/",
                    type: "POST",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        queryName: queryNameVal,
                        query: queryTextVal,
                        category:reportCategoryID,
                        cached: null
                    })
                })
                .done(function() {
                    queryData.destroy();
                    queryDataFunc();
					queryMasukFunc();
                    $("#queryAddForm").modal('hide');
                    $("#queryRequire").hide();
                })
                .fail(function(data) {
                    console.log(data.responseJSON.error);
                    $("#queryRequire span").html(data.responseJSON.error);
                    $("#queryRequire").show();
                    //alert('Failed!');
                });
            }

            
        });
        

        
        queryDataFunc();
		queryMasukFunc();
        var selectedQueryId = undefined;
        $('#queryContainer').on('click', 'button.updateBtn', function() {
            var selectedQuery = queryData.row($(this).parents('tr')).data();
            selectedQueryId = selectedQuery.id;
            $("#queryAddForm #queryUISubmit").addClass('hide');
            $("#queryAddForm #queryUIUpdate").removeClass('hide');
            $("#queryForm #query-name").val(selectedQuery.queryName);
            $("#queryForm #query-text").val(selectedQuery.query);
            $("#queryAddFormHeader").html("Update Query UI");
            $("#queryAddForm").modal('show');

        });

        $('#queryContainer').on('click', 'button.runBtn', function() {
            var selectedRunQuery = queryData.row($(this).parents('tr')).data();
            selectedQueryRunId = selectedRunQuery.id;
            //alert(selectedQueryRunId);
        });

        $("#downloadBtn").click(function(event) {
            event.preventDefault(); //stop the browser from following
            window.location.href = globalURL+'download/csv/' + selectedQueryRunId;
        });
        
         $("#downloadBtnXLS").click(function(event) {
            event.preventDefault(); //stop the browser from following
            window.location.href = globalURL+'download/xls/' + selectedQueryRunId;
        });
        
         $("#downloadBtnPDF").click(function(event) {
            event.preventDefault(); //stop the browser from following
            window.location.href = globalURL+'download/pdf/' + selectedQueryRunId;
        });


        var selectedQueryForDelete;
        $('#queryContainer').on('click', 'button.deleteBtn', function() {
            $("#queryDataDelete").modal('show');
            selectedQueryForDelete = queryData.row($(this).parents('tr')).data();
            $("#queryDataDelete .modal-body h3").html('Are you sure do you want to<br>delete the query <strong>' + selectedQueryForDelete.queryName + '</strong>?');
        });

        $('#queryDataDeleteBtn').click(function(event) {

            $.ajax({
                url: globalURL+queryString+'/' + selectedQueryForDelete.id,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    queryData.destroy();
                    queryDataFunc();
                    $("#queryDataDelete").modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //alert("Status: " + textStatus);
                    //alert("Error: " + errorThrown);
                    $("#queryErrorTitle").html(XMLHttpRequest.responseJSON.error);
                    $("#queryDeleteErrorMsg").modal('show');
                    $("#queryDataDelete").modal('hide');
                }
            });

        });
        var queryUI, resultOutput;

        $('#queryContainer').on('click', 'button.runBtn', function() {
            //$("#jqueryRunData").remove();
            var selectedQueryForExecute = queryData.row($(this).parents('tr')).data();

            $.ajax({
                    url: globalURL+queryString+'/' + selectedQueryForExecute.id + "/exec",
                    type: 'GET',
                    success: function(result) {
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

                            $.each(resultOutputCol, function(index, val) {
                                console.log(val);
                                var obj = {
                                    sTitle: val
                                };
                                myArrayColumn[i] = obj;
                                i++;
                            });

                            var myArrayRow = [];
                            var i = 0;

                            $.each(resultOutput, function(index, val) {
                                var rowData = [];
                                var j = 0;
                                $.each(resultOutput[i], function(index, val) {
                                    console.log(val);
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
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("Status: " + textStatus);
                        alert("Error: " + errorThrown);
                    }
                })
                .done(function() {
                    queryData.destroy();
                    queryDataFunc();
                })
                .fail(function() {
                    alert('Failed!');
                });
        });


        $("#queryUIUpdate").click(function(event) {
            var queryNameValUpdated = $("#queryForm #query-name").val();
            var queryTextValUpdated = $("#queryForm #query-text").val();
            //alert(selectedQueryId);
            $.ajax({
                    url: globalURL+queryString+"/",
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
                .done(function(data) {
                    queryData.destroy();
                    queryDataFunc();
                    //selectedQueryId = null;
                })
                .fail(function() {
                    alert('Failed!');
                });
        });



        var selectedDatabaseId = undefined;
        $('#databaseData').on('click', 'button.updateBtn', function() {
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



        $("#databaseUIUpdate").click(function(event) {

            var databaseUpdateNameVal = $("#databaseForm #database-name").val();
            var databaseUpdateTypeVal = $("#databaseForm #database-type").val();
            var databaseUpdateURLVal = $("#databaseForm #database-url").val();
            var databaseUpdateUserVal = $("#databaseForm #database-uname").val();
            var databaseUpdatePwdVal = $("#databaseForm #database-pwd").val();
            var databaseUpdateDriverVal = $("#databaseForm #database-driver").val();
            //alert(selectedQueryId);
            $.ajax({
                    url: globalURL+"etl/databases/",
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
                .done(function(data) {
                    databases.destroy();
                    databaseDataFunc();
                    //selectedQueryId = null;
                })
                .fail(function() {
                    alert('Failed!');
                });
        });

        var selectedDatabaseForDelete;
        $('#databaseData').on('click', 'button.deleteBtn', function() {
            $("#databaseDelete").modal('show');
            selectedDatabaseForDelete = databases.row($(this).parents('tr')).data();
            $("#databaseDelete .modal-body h3").html('Are you sure do you want to<br>delete the database <strong>' + selectedDatabaseForDelete.dbName + '</strong>?');

        });

        $('#databaseDataDeleteBtn').click(function(event) {
            //$('#databaseData').on('click', 'button.deleteBtn', function() {
            //var selectedDatabaseForDelete = databases.row($(this).parents('tr')).data();
            $.ajax({
                url: globalURL+'etl/databases/' + selectedDatabaseForDelete.id,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    databases.destroy();
                    databaseDataFunc();
                    $("#databaseDelete").modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //alert("Status: " + textStatus);
                    //alert("Error: " + errorThrown);
                    //alert("request: " + XMLHttpRequest);
                    if (errorThrown) {
                        $("#errorTitle").html(XMLHttpRequest.responseJSON.error);
                        $("#databaseDeleteErrorMsg").modal('show');
                        //console.log(XMLHttpRequest.responseJSON.error);
                    }
                    console.log(XMLHttpRequest);
                    $("#databaseDelete").modal('hide');
                }
            });

        });






        $('#databaseData tbody').on('click', '.tableView', function() {
            var data = databases.row($(this).parents('tr')).data();
            var tables;
            $("#databaseList").hide();
            $("#tableList").show();
            tableFunc = function() {
                tables = $('#example12').DataTable({
                    "paginate": true,
                    "retrieve": true
                });
                tables.destroy();
                tables = $('#example12').DataTable({
                    "paginate": true,
                    "retrieve": true,
                    "ajax": {
                        "url": globalURL+"etl/databases/" + data.id + "/tables",
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
                        "render": function(data, type, full, meta) {
                            if ((data == "NOT_SYNCED") || (data == "NEVER_EXECUTED")) {
                                return '<button class="btn btn-success btn-sm sqoopBtn"><i class="fa fa-compress"></i> Sqoop</button>';
                            } else
                            if (data == "COMPLETED"){
                                return '<button class="btn btn-default btn-sm dailysqoopBtn" disabled><i class="fa fa-compress"></i> Sqooped</button><button class="btn btn-success btn-sm"><i class="fa fa-compress"></i> Daily Sqoop</button>';
                            }
                            else
                            {
                                return '<button class="btn btn-default btn-sm dailysqoopBtn" disabled><i class="fa fa-compress"></i> Sqooped</button><button class="btn btn-danger btn-sm"><i class="fa fa-compress"></i> Daily Sqoop</button>';
                            }
                        }
                    }],

                });
            }

            tableFunc();


            $('#example12 tbody').on('click', 'button.sqoopBtn', function() {
                var tableList = tables.row($(this).parents('tr')).data();
                $.ajax({
                    url: globalURL+"etl/databases/" + tableList.dbId + "/sync?table=" + tableList.tableName + "&hdfs=11",
                    type: 'GET',
                    success: function(result) {
                        // Do something with the result
                        //alert('done');
                        tableFunc();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert("Status: " + textStatus);
                        alert("Error: " + errorThrown);
                    }
                }).error(function() {
                    alert('not working');
                });

            });
            
            

        });

        $(document).ajaxStart(function() {
            $("#loader").css('height', $(".page-content").height() + 140 + 'px');
            $("#loader .page-spinner-bar").removeClass('hide');
            $("#loader").show();
        });

        $(document).ajaxStop(function() {
            onResize1();
            $("#loader .page-spinner-bar").addClass('hide');
            $("#loader").hide();
        });




        $('#jobsContainer').on('click', 'button.btn1', function() {
            //alert('start');
            var jobData = jobsData.row($(this).parents('tr')).data();

            $.ajax({
                url: globalURL+'etl/jobs/' + jobData.id + '/start',
                type: 'GET',
                success: function(result) {
                    // Do something with the result
                    //alert('done');
                    jobsData.destroy();
                    jobsDataFunc();
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert("Status: " + textStatus);
                    alert("Error: " + errorThrown);
                }
            });
        });



        var jobData;
        $('#jobsContainer').on('click', 'button.btn2', function() {
            $("#jobDataDelete").modal('show');
            jobData = jobsData.row($(this).parents('tr')).data();
            $("#jobDataDelete .modal-body h3").html('Are you sure do you want to<br>delete the job <strong>' + jobData.jobName + '</strong>?');
        });

        $('#jobDataDeleteBtn').click(function(event) {

            $.ajax({
                url: globalURL+'etl/jobs/' + jobData.id + '/delete',
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    jobsData.destroy();
                    jobsDataFunc();
                    $("#jobDataDelete").modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
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

        $("#backBtn").click(function(event) {
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
