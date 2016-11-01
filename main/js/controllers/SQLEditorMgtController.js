'use strict';

MetronicApp.controller('SQLEditorMgtController', function($scope, $rootScope, $http) {


    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        $scope.database = "default";
        $scope.start = 0;
        $scope.svdstart = 0;
        $scope.rows = 10;
        $scope.svdrows = 10;
        $scope.showResults = false;     
        $scope.database;
        $scope.btnExec = true;
        $scope.Saveqry = true;
        $scope.dbTables = "Tables";
        $scope.showResCol = false;
        $scope.explainMsg = "";
        fn_showSavedQry();
        fn_showHistory();
        fn_LoadDb();
        // $('#jstree_Col').jstree();
        });
      
        // fn_showHistory();


       
        

        //$scope.started = true;
        var editor = ace.edit("qryeditor");
        editor.$blockScrolling = Infinity;
        editor.setOptions({
            enableBasicAutocompletion: true
        });
        var oResultTable;
        var historyTbl;
        var SavedQryTbl;
        var ColTbl;
        var ResultColTbl

        $scope.OnDBClick = function(sel) {
            $scope.database = sel;
            // $scope.db_clicked = "collapsed";
            fn_LoadDt(sel);
            //collapse the datatable list
            $('#lstDB').prev().addClass('collapsed');
            $('#lstDB').prev().attr('aria-expanded', 'false');
            $('#lstDB').addClass('collapsing');
            $('#lstDB').removeClass('in');
            $('#lstDB').removeClass('collapsing');
            $('#lstDB').attr('aria-expanded', 'false');
            $('#lstDB').attr('style', 'height:0px');

            $scope.dbTables = "Tables";
            // $('#lstDB').toggle();
            // $('#lstDB').attr('style','');
        } 

        $scope.OnDBTblClick = function(seltbl) {
             $scope.SeldbTables = seltbl; 
            $("#lstDBtbl > ul > li").removeClass('activeBg');
            $("#lstDBtbl > ul > li > div > span > .openEye").hide();
            // $('ul.lstcol').css({background:'transparent'}).find('> li').css({background:'transparent'});
             var currentList = event.target;
             $(currentList).parent().addClass('activeBg');
            //  $('.activeBg  .openEye').show();
            $(currentList).find('.openEye').show();
            fn_showCol(currentList);
            
            
            
            // $scope.db_clicked = "collapsed";
            // fn_LoadDt(sel);
            //collapse the datatable list
            // $('#lstDBtbl').prev().addClass('collapsed');
            // $('#lstDBtbl').prev().attr('aria-expanded', 'false');
            // $('#lstDBtbl').addClass('collapsing');
            // $('#lstDBtbl').removeClass('in');
            // $('#lstDBtbl').removeClass('collapsing');
            // $('#lstDBtbl').attr('aria-expanded', 'false');
            // $('#lstDBtbl').attr('style', 'height:0px');

            // $(".tab-content").children().removeClass('active in');
            // $('.tab_Columns').addClass('active in');
            
            $("#messageView div").hide();
        }

        $('#lstDB').prev().click(function() {
            // $('#lstDB').attr('style','');

        });

        $('#lstDB').click(function() {
            // $('#lstDB').toggle('expand');
        });

        $('.tab').click(function() {
            $(this).siblings().removeClass('active'); //remove opened tab
            $(this).addClass('active'); //activate clicked tab
            if (this.id == "tabResult") {
                $(".tab-content").children().removeClass('active in'); //hide other tab contents
                $('.tab_Result').addClass('active in'); //show relevant tab contents
                $("#messageView div").hide();
            } else if (this.id == "tabHistory") {
                $(".tab-content").children().removeClass('active in');
                $('.tab_History').addClass('active in');
                // fn_showHistory();
                $("#messageView div").hide();
            } else if (this.id == "tabSavedQuery") {
                $(".tab-content").children().removeClass('active in');
                $('.tab_Saved_Query').addClass('active in');
                // fn_showSavedQry();
                $("#messageView div").hide();
            // } else if(this.id == "tabClms"){ // Column tab removed and added under datatable 
            //     $(".tab-content").children().removeClass('active in');
            //     $('.tab_Columns').addClass('active in');
            //     // fn_showCol();
            //     $("#messageView div").hide();
            } else if(this.id == "tabExpn"){
                $(".tab-content").children().removeClass('active in');
                $('.tab_Explain').addClass('active in');
                // fn_showExplain();
                $("#messageView div").hide();
            } else if(this.id == 'tabResCol'){
                $(".tab-content").children().removeClass('active in');
                $('.tab_ResultCol').addClass('active in');
                // fn_showExplain();
                $("#messageView div").hide();

            }

            // var seltab = "#" + $(this).attr('data');
            // $(this).parent().siblings().removeClass('active in');
            // $(seltab).addClass('active in');

            return false;
        });

        $scope.export_csv = function() {
            var qry = $scope.aceDocumentValue;
            //  $http.get(globalURL + "api/pistachio/secured/csv?query="+qry.trim())
            window.location.href = globalURL + "api/pistachio/secured/csv?query=" + qry.trim();

        }
        var $btn;
        var $btnSave;
        $('.exec').click(function() {
            $btn = $(this);
            $btn.button('loading');
            fn_GotoResultTab();
            var qry;
            if(editor.getSelectedText().length > 0){
                qry = editor.getSelectedText();
            }else{
                 qry = $scope.aceDocumentValue;
            }
            fn_ExecQuery(qry);

        });
        $('.saveqry').click(function() {
            $btnSave = $(this);
            $btnSave.button('loading');
            // fn_GotoResultTab();
            $('#savequery-name').val('');
            $("#mdlSaveQry").modal('show');
            // $scope.Saveqry = true;
            // $scope.Saveqry = false;
            // fn_ExecQuery(qry);

        });
        $('#btncancl').click(function() {
            $btnSave.button('reset');
        });

        $('#btnSaveQry').click(function() {
            // var saveqry = $scope.aceDocumentValue;
            var qry = JSON.stringify({
                "query": $scope.aceDocumentValue
            });
            fn_saveQuery($('#savequery-name').val().trim(), qry);
        });

        $('.newqry').click(function() {
            editor.session.setValue('');
            // fn_GotoResultTab();            
            // fn_ClearResultTbl();


        });


        $scope.aceLoaded = function(_editor) {
            $scope.aceSession = _editor.getSession();

        };

        $scope.aceChanged = function() {
            $scope.aceDocumentValue = $scope.aceSession.getDocument().getValue();
            if ($scope.aceSession.getDocument().getValue().trim().length > 0) {
                $scope.btnExec = false;
                $scope.Saveqry = false;
            } else {
                $scope.btnExec = true;
                $scope.Saveqry = true;
            }
        };


        var dataSet;
        var aryJSONColTable = [];

        //All the Functions started here

        function fn_ExecQuery(qry) {
            if (qry != null && qry.length > 0) {
                //Run Sql Query
                $http.post(globalURL + "api/pistachio/secured/runSQL?dbname=" + $scope.database, qry.trim())
                    .then(function(result) {
                            if (result != null && result.data.columns != null) {
                                $scope.showResults = true;
                                var resultOutputCol = jQuery.parseJSON(result.data.columns);
                                var resultOutput = jQuery.parseJSON(result.data.results);
                                var myArrayColumn = [];
                                var i = 0;

                                $.each(resultOutputCol, function(index, val) {
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
                                        rowData[j] = val;
                                        j++;
                                    });

                                    myArrayRow[i] = rowData;
                                    i++;
                                });
                                fn_ClearResultTbl();
                                if(myArrayRow.length > 0){
                                    queryResultFunc(myArrayRow, myArrayColumn);                                    
                                }
                                if(result.data.rowLength == 0 && result.statusText == "OK"){
                                 $btn.button('reset');
                                 $("#messageView div span").html('Successfully Executed...');
                                 $("#messageView div").removeClass("alert-danger");
                                 $("#messageView div").addClass('alert-success');
                                 $("#messageView div").show().delay(5000).fadeOut();
                                }
                                else
                                {
                                    $btn.button('reset');
                                }
                                //$(".page-content").height($(".profile-content").height() + 400);
                                // setTimeout(function() {
                                //     $btn.button('reset');
                                // }, 1000);                                      

                            } else {
                                fn_ClearResultTbl();
                                $("#messageView div span").html('No Data to Show...');
                                $("#messageView div").removeClass("alert-success");
                                $("#messageView div").addClass('alert-danger');
                                $("#messageView div").show().delay(5000).fadeOut();
                                //$(".page-content").height($(".profile-content").height() + 400);
                                setTimeout(function() {
                                    $btn.button('reset');
                                }, 1000);
                            }
                        if (result != null && result.data.metaData.columns != null) {
                            $scope.showResCol = true;
                            if (ResultColTbl != undefined) {
                                        ResultColTbl.destroy();
                            }
                            ResultColTbl = $('#tblResultCol').DataTable({
                                // "order": [[ 0, "desc" ]],
                                "processing": true,
                                "data": result.data.metaData.columns,
                                "paging": true,
                                "bInfo": false,
                                "columns": [{
                                    "data": "position",
                                    "width": "10%",
                                    "render":function(data, type, full, meta){
                                            return data + 1;  
                                        }                                    
                                },{
                                    "data": "column",
                                    "width": "40%"
                                }, {
                                    "data": "type",
                                    "width": "40%"
                                }]
                            });  
                        }else{
                            $scope.showResCol = false;
                        }   

                            fn_showHistory();
                        },
                        function(response) {
                            fn_ClearResultTbl();
                            $("#messageView div span").html(response.data.error);
                            $("#messageView div").removeClass("alert-success");
                            $("#messageView div").addClass('alert-danger');
                            $("#messageView div").show().delay(15000).fadeOut();
                            setTimeout(function() {
                                $btn.button('reset');
                            }, 1000);
                        });              
                // $scope.showResCol = true;
                fn_showExplain(qry.trim());               

            } else {
                fn_ClearResultTbl();
                $("#messageView div span").html("No Query found...");
                $("#messageView div").removeClass("alert-success");
                $("#messageView div").addClass('alert-anger');
                $("#messageView div").show().delay(5000).fadeOut();
                setTimeout(function() {
                    $btn.button('reset');
                }, 1000);
            }

        }

        function fn_saveQuery(qry_name, qry) {
            if (qry_name != null && qry_name.length > 0) {
                $http.post(globalURL + "api/pistachio/secured/save?name=" + qry_name, qry)
                    .then(function successCallback(result) {
                            fn_showSavedQry(); //loading saved query table again.
                            $btnSave.button('reset');
                        }, function errorCallback(response) {
                            fn_ClearResultTbl();
                            $("#messageView div span").html(response.data.error);
                            $("#messageView div").removeClass("alert-success");
                            $("#messageView div").addClass('alert-danger');
                            $("#messageView div").show().delay(15000).fadeOut();
                            setTimeout(function() {
                                $btn.button('reset');
                            }, 1000);
                            $("#mdlSaveQry").modal('hide');
                            $btnSave.button('reset');
                        }

                    );
            }
        }

        function queryResultFunc(rw, col) {
            oResultTable = $('#tblResult').DataTable({
                // "bProcessing": true,
                "bDestroy": true,
                "bScrollCollapse": true,
                "bJQueryUI": true,
                "bInfo": true,
                "bFilter": true,
                "bSort": true,
                "aaData": rw,
                "aoColumns": col,
                "scrollCollapse": true,
                "paging": true
            });
        }


        function fn_LoadDb() {
            $http.get(globalURL + "api/pistachio/secured/hadoop/db/role")
                .then(function(response) {
                    $scope.databaseLength = response.data.length;
                    $scope.databaseList = response.data;
                    console.log("dblist" + response.data[0]);
                    // fn_LoadDt(response.data[0]);
                    fn_LoadDt("default");

                });

        }

        function fn_LoadDt(seldb) {
            $http.get(globalURL + "api/pistachio/secured/hadoop/tables?db=" + seldb)
                .then(function(response) {
                    $scope.datatableLength = response.data.length;
                    $scope.datatableList = response.data;
                    // $scope.database = response.data[0];
                    console.log("dtlist" + response.data[0]);

                    // $('#lstDB').attr('aria-expanded','false');
                    // $('#lstDB').removeClass('in');

                });
        }
        $scope.next = function() {
            $scope.start = $scope.start + 1;
            fn_showHistory()
        }

        $scope.previous = function() {
            $scope.start = $scope.start - 1;
            if($scope.start < 0)
            $scope.start = 0;
            fn_showHistory();
        }

        $scope.svdnext = function() {
            $scope.svdstart = $scope.svdstart + 1;
            fn_showSavedQry()
        }

        $scope.svdprevious = function() {
            $scope.svdstart = $scope.svdstart - 1;
            if($scope.svdstart < 0)
            $scope.svdstart = 0;
            fn_showSavedQry();
        }

        function loadHistory(historyResult) {

        }

        function fn_showHistory() {
            var historyResult;
            $http.get(globalURL + "api/pistachio/secured/hist?start=" + $scope.start + "&rows=" + $scope.rows)
                .then(function(response) {
                    $scope.first = response.data.first;  
                    $scope.last = response.data.last; 
                    if (historyTbl != undefined) {
                        historyTbl.destroy();
                    }

                    historyResult = response.data.content;
                    historyTbl = $('#tblHistory').DataTable({
                        "order": [[ 2, "desc" ]],
                        "select": true,                        
                        "processing": true,
                        "data": historyResult,
                        "paging": false,
                        "bInfo": false,
                        "columns": [{
                            "data": "query",
                            "width": "60%"
                        }, {
                            "data": "success",
                            "render": function(data, type, full, meta) {
                                if (data == true) {
                                    return '<label class="label label-success"> Success </label>';
                                } else {
                                    return '<label class="label label-danger"> Error </label>';
                                }
                            }
                        }, {
                            "data": "runTime"
                        },{
                            "data": "action",
                            "render":function(data, type, full, meta){
                                return '<button class="btn btn-warning btn-sm copyto">Copy All</button>';  
                            }
                        }]
                    });
                    $('#tblHistory tbody').on('click', 'tr td:first-child', function() {
                        var data = window.getSelection().toString();
                        if(data.length > 0){
                            editor.session.setValue('');
                            editor.session.setValue(data);      
                        }               
                    });
                    $('#tblHistory tbody').on('click', 'button.copyto', function() {
                        var data = historyTbl.row($(this).parents('tr')).data();
                        editor.session.setValue('');
                        editor.session.setValue(data.query);
                    });
                    
                });


        }



        function fn_showSavedQry() {
            var SavedQryResult;
            $http.get(globalURL + "api/pistachio/secured/save?start=" + $scope.svdstart + "&rows=" + $scope.svdrows)
                .then(function(response) {
                    $scope.firstsve = response.data.first; 
                    $scope.lastsve = response.data.last;
                    if (SavedQryTbl != undefined) {
                        SavedQryTbl.destroy();
                    }

                    SavedQryResult = response.data.content;
                    SavedQryTbl = $('#tblSavedQuery').DataTable({
                        "order": [[ 2, "desc" ]],
                        "processing": true,
                        "data": SavedQryResult,
                        "paging": false,
                        "bInfo": false,
                        "columns": [{
                            "data": "name",
                            "width": "20%"
                        }, {
                            "data": "query",
                            "width": "50%"
                        }, {
                            "data": "savedTime",
                            "width": "30%"
                        },{
                            "data": "action",
                            "render":function(data, type, full, meta){
                                return '<button class="btn btn-warning btn-sm sacopyto">Copy All</button>';  
                            }
                        }]
                    });
                    $('#tblSavedQuery tbody').on('click', 'tr td:nth-child(2)', function() {
                        var data = window.getSelection().toString();
                        if(data.length > 0){
                            editor.session.setValue('');
                            editor.session.setValue(data);      
                        }  
                        // var data = SavedQryTbl.row(this).data();
                        // editor.session.setValue('');
                        // editor.session.setValue(data.query);
                         // $scope.Saveqry = false;
                    });
                    $('#tblSavedQuery tbody').on('click', 'button.sacopyto', function() {
                        var data = SavedQryTbl.row($(this).parents('tr')).data();
                        editor.session.setValue('');
                        editor.session.setValue(data.query);
                    });
                    //$(".page-content").height($(".profile-content").height() + 400);
                    $("#mdlSaveQry").modal('hide');
                });
        }

        function fn_showCol(currentList) {
            // var ColResult;//api/pistachio/secured/hadoop/column?db=analytics&table=employee_details
            // if($scope.dbTables !== "Tables"){
            $http.get(globalURL + "api/pistachio/secured/hadoop/column?db=" + $scope.database + "&table=" + $scope.SeldbTables)
                .then(function(response) {
                    // $scope.firstsve = response.data.first; 
                    // $scope.lastsve = response.data.last;
                    if (ColTbl != undefined) {
                        ColTbl.destroy();
                    }
                    var tempnum = 0;
                    // $scope.ColResult = response.data;
                    if(response.data.length > 0 && $(currentList).find('.tblColLst').length == 0){
                        $('.tblColLst').remove();
                        $(currentList).append('<div class="tblColLst" style="padding-top: 5px; padding-left: 20px;" ><ul></ul></div');
                        $.each(response.data, function (key, value) {
                            $(".tblColLst ul").append('<li style="list-style-type: none;"><div><i class="fa fa-columns"></i>'+value.column +'('+ value.type +')'+'</div></li>');
                        });
                    }else{
                        $('.tblColLst').remove();
                    }
                    // ColTbl = $('#tblColumns').DataTable({
                    //     "processing": true,
                    //     "data": $scope.ColResult,
                    //     "paging": true,
                    //     "bInfo": false,
                    //     "columns": [{
                    //         "data": "column",
                    //         "width": "10%",
                    //         "render":function(data, type, full, meta){
                    //             return tempnum = tempnum + 1;  
                    //         }
                    //     },{
                    //         "data": "column",
                    //         "width": "40%"
                    //     }, {
                    //         "data": "type",
                    //         "width": "40%"
                    //     }]
                    // });    
                                              
                });
            // }else{
            //     $("#messageView div span").html('Please select Table');
            //     $("#messageView div").addClass("alert-danger");
            //     $("#messageView div").removeClass('alert-success');
            //     $("#messageView div").show().delay(5000).fadeOut();

            // }
        }

        function fn_showExplain(_qry){
            //Explain Query
                $http.post(globalURL + "api/pistachio/secured/sql/explain", _qry)
                    .then(function (result){
                        $scope.explainMsg = result.data.trim().toString();
                    },
                    function (response) {
                        // $scope.explainMsg = response.message;
                    });
        }

       


        function fn_GotoResultTab() {
            $('.nav-tabs').children().removeClass('active')
            $('#tabResult').addClass('active');
            $(".tab-content").children().removeClass('active in'); //hide other tab contents
            $('.tab_Result').addClass('active in');
        }

        function fn_ClearResultTbl() {
            if (oResultTable != undefined) {
                // oResultTable.destroy();
                oResultTable.clear()
                    .draw();
                $('#tblResult thead tr').remove();
                $('#tblResult_wrapper .row').remove();

            }


        }

        $rootScope.settings.layout.pageSidebarClosed = true;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("queryeditor");
    
});
