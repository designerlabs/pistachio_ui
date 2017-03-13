'use strict';

MetronicApp.controller('SQLEditorMgtController', function($scope, $rootScope, $http,$interval, $sce) {

    var tableCompleter;
    var dbCompletor;
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
        $scope.database = "jimp";
        $scope.start = 0;
        $scope.svdstart = 0;
        $scope.rows = 10;
        $scope.svdrows = 10;
        $scope.showResults = false; 
        $scope.haveResData = false;    
        $scope.database;
        $scope.btnExec = true;
        $scope.Saveqry = true;
        $scope.dbTables = "Tables";
        $scope.showResCol = false;
        $scope.showExpl = false;
        $scope.explainMsg = "";
        $scope.exec_id=-1;
        $scope.btnReport = true;
        fn_showSavedQry();
        fn_showHistory();
        fn_LoadDb();
        // $('#jstree_Col').jstree();
        });
      
        // fn_showHistory();

           $scope.IntroOptions = {
            steps:[
            {
                element: document.querySelector('#db-help'),
                intro: "Database and Tables",
                position:"right"
            },
            {
                element: document.querySelector('#db-db'),
                intro: "Menunjukkan satu senarai database yang boleh didapati <BR> \
                Database are listed based on permission, Please contact Admin if required database is not shown",
                position: 'right'
            },
            {
                element: document.querySelector('#acive-db'),
                intro: "Active DB and its Tables",
                position: 'right'
            },
            {
                element: document.querySelector('#db-help1'),
                intro: "Active database",
                position: 'right'
            },

            {
                element: document.querySelector('#db-help2'),
                intro: "No of tables in the selected database",
                position: 'right'
            },
            {
                element: document.querySelector('#db-help3'),
                intro: "type to filter the tables in the selected database ",
                position: 'right'
            },
            {
                element: document.querySelector('#save'),
                intro: "Save the query",
                position: 'left'
            },
            {
                element: document.querySelector('#exec'),
                intro: "Execute the query",
                position: 'left'
            },
            {
                element: document.querySelector('#explain'),
                intro: "Explain the complexity of the query",
                position: 'left'
            },
            {
                element: document.querySelector('#new'),
                intro: "Clear the current query",
                position: 'left'
            },
            {
                element: document.querySelector('#tabHistory'),
                intro: "SQL history",
                position: 'left'
            }
            ],
            showStepNumbers: false,
            exitOnOverlayClick: true,
            exitOnEsc:true,
            nextLabel: '<strong>Seterusnya</strong>',
            prevLabel: '<span style="color:green">Sebelum</span>',
            skipLabel: 'Keluar',
            doneLabel: 'Terima Kasih'
        };

    $scope.ShouldAutoStart = false;
       
        

        //$scope.started = true;
        var editor = ace.edit("qryeditor");
        editor.$blockScrolling = Infinity;
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
        
        editor.commands.addCommand({
            name: 'run',
            bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
            exec: function(editor) {
                    $btn = $('exec');
                    $btn.button('loading');
                    fn_GotoResultTab();
                    var qry;
                    if(editor.getSelectedText().length > 0){
                        qry = editor.getSelectedText();
                    }else{
                         qry = $scope.aceDocumentValue;
                    }
                   // fn_ExecQuery(qry);
                   fn_ExecQuery_newImplementation(qry)
            },
            readOnly: true // false if this command should not apply in readOnly mode
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
            if($(currentList).find('.tblColLst').length == 0){
                fn_showCol(currentList);
            }else{
                 $('.tblColLst').remove();
            }
           
            
            
            
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
            window.location.href = globalURL + "api/pistachio/secured/csv?query=" + qry.trim().replace(/\n/g, " ");

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
           // fn_ExecQuery(qry);
           $scope.active_query = qry;
           $scope.active_report = {};
           $scope.active_report.query = qry;
           $scope.active_report.visiblity = false;

           fn_ExecQuery_newImplementation(qry)

        });

        $scope.saveQuery = function() {
             $('#savequery-name').val('');
            $("#mdlSaveQry").modal('show');
        }

        $scope.saveEReport = function() {
             $('#savequery-name').val('');
            $("#mdlSaveReport").modal('show');
        }

        $('.saveqry').click(function() {
            $btnSave = $(this);
            $btnSave.button('loading');
            // fn_GotoResultTab();
           
            // $scope.Saveqry = true;
            // $scope.Saveqry = false;
            // fn_ExecQuery(qry);

        });
        $('.report').click(function() {
            $btnSave = $(this);
            // fn_GotoResultTab();
            $("#mdlReport").modal('show');
            fn_ExecQuery_report(0)
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
        $('.explain').click(function(){
            $scope.showExpl = true;
            var qry;
            if(editor.getSelectedText().length > 0){
                qry = editor.getSelectedText();
            }else{
                 qry = $scope.aceDocumentValue;
            }
            fn_showExplain(qry.trim()); 
            $scope.$apply();

            $(".tab-content").children().removeClass('active in');
            $('.result_container li').removeClass('active');
            $('.tab_Explain').addClass('active in');
            $('.result_container #tabExpn').addClass('active');
            $("#messageView div").hide();
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

        function fn_ExecQuery_newImplementation(qry) {
            if (qry != null && qry.length > 0) {
                //Run Sql Query
                if($scope.exec_id !=-1)
                {
                    $http.get(globalURL + "api/pistachio/secured/sql/close/" + $scope.exec_id)
                    .then(function(result) {
                        console.log("Previous session closed")
                    });
                }

                $http.post(globalURL + "api/pistachio/secured/sql/run?dbname=" + $scope.database, qry.trim())
                    .then(function(result) {
                        $scope.exec_id = result.data;

                        fn_ExecQuery_newFetch($scope.exec_id )
                        //fn_ExecQuery_getStatus($scope.exec_id)
                        //$scope.delay = true
                       // $interval.cancel($scope.status)
                       // $scope.status = $interval(fn_ExecQuery_getStatus, 2000);
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



        function fn_ExecQuery_getStatus(id) {
            //if(!$scope.delay)
            $http.get(globalURL + "api/pistachio/secured/sql/status/" + $scope.exec_id)
                    .then(function(result) {
                        
                        console.log(result)
                        }); //});
        //    $scope.delay = false;
        }

        $scope.export_jxrml = function() {
            window.location.href = globalURL + "api/pistachio/secured/sql/jxrml/" +$scope.exec_id;
        }

        function fn_ExecQuery_report(id) {
            $scope.reportHtml=$sce.trustAsHtml("<h2>PROCESSING</H2>");
            $http.get(globalURL + "api/pistachio/secured/sql/report/" + $scope.exec_id)
                    .then(function(result) {

                        $scope.reportHtml=$sce.trustAsHtml(result.data);
                    });
        }

        $scope.update_report = function() {
            $scope.reportHtml=$sce.trustAsHtml("<h2>PROCESSING</H2>");
             $http.get(globalURL + "api/pistachio/secured/sql/report/" + $scope.exec_id+"/update?title="+$scope.reportTitle+"&style="+$scope.selectedStyle)
                    .then(function(result) {

                        $scope.reportHtml=$sce.trustAsHtml(result.data);
                    });
        }
        function fn_ExecQuery_newFetch(id) {
            if (id!=-1) {
                //Run Sql Query
                $http.get(globalURL + "api/pistachio/secured/sql/fetch/" + id)
                    .then(function(result) {
                        $scope.resultColumns=result.data.metaData.columns;
                        //$interval.cancel($scope.status)
                        $scope.btnReport = false;
                        $scope.showResults = true;
                            if (result != null && result.data.columns != null) {     
                                $scope.haveResData = true;           
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
                                $scope.haveResData = false; 
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

        function fn_ExecQuery(qry) {
            if (qry != null && qry.length > 0) {
                //Run Sql Query
                $http.post(globalURL + "api/pistachio/secured/runSQL?dbname=" + $scope.database, qry.trim())
                    .then(function(result) {
                        $scope.showResults = true;
                            if (result != null && result.data.columns != null) {     
                                $scope.haveResData = true;           
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
                                $scope.haveResData = false; 
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
                    fn_LoadDt( $scope.database);
                            
                });

        }

        function autoComplete(seldb) {
            var dbCompleter = {
                    getCompletions: function(editor, session, pos, prefix, callback) {
                        var wordList = $scope.databaseList;
                        callback(null, wordList.map(function(word) {
                            return {
                                caption: word,
                                value: word,
                                meta: "database"
                            };
                        }));

                    }
                }
             var  tableCompleter = {
                    getCompletions: function(editor, session, pos, prefix, callback) {
                        var wordList = $scope.datatableList;
                        callback(null, wordList.map(function(word) {
                            return {
                                caption: word,
                                value: word,
                                meta: seldb
                            };
                        }));

                    }
                }
            var  sqlCompleter = {
                    getCompletions: function(editor, session, pos, prefix, callback) {
                        var wordList = ['select * from','select','from','distinct','where','order by','group by','union','join','left join']
                        callback(null, wordList.map(function(word) {
                            return {
                                caption: word,
                                value: word,
                                meta: "sql"
                            };
                        }));

                    }
                }

        editor.completers = [sqlCompleter,tableCompleter,dbCompleter]
        }



        function fn_LoadDt(seldb) {
            $http.get(globalURL + "api/pistachio/secured/hadoop/tables?db=" + seldb)
                .then(function(response) {
                    $scope.datatableLength = response.data.length;
                    $scope.datatableList = response.data;
                    // $scope.database = response.data[0];
                    console.log("dtlist" + response.data[0]);
                   autoComplete(seldb)
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
                    // if(response.data.content.length > 0){
                    //     $scope.NoData = false;
                    // }else{
                    //     $scope.NoData = true;
                    // }
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
                            "width": "10%",
                            "render": function(data, type, full, meta) {
                                if (data == true) {
                                    return '<label class="label label-success"> Success </label>';
                                } else {
                                    return '<label class="label label-danger"> Error </label>';
                                }
                            }
                        }, {
                            "data": "runTime",
                            "width": "20%"
                        },{
                            "data": "action",
                            "width": "10%",
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
                    // if(response.data.content.length > 0){
                    //     $scope.NoData = false;
                    // }else{
                    //     $scope.NoData = true;
                    // }
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
                            "width": "20%"
                        },{
                            "data": "action",
                            "width": "10%",
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
                    if(response.data.length > 0){
                        $('.tblColLst').remove();
                        $(currentList).append('<div class="tblColLst" style="padding-top: 5px; padding-left: 20px;" ><ul></ul></div');
                        $.each(response.data, function (key, value) {
                            $(".tblColLst ul").append('<li style="list-style-type: none;"><a><div><i class="fa fa-columns"></i>'+value.column +' ('+ value.type +')'+'</div></a></li>');
                        });
                    }else{
                        // $('.tblColLst').remove();
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

        $scope.$on('$locationChangeStart', function (event) {
            $http.get(globalURL + "api/pistachio/secured/sql/close/" + $scope.exec_id)
                    .then(function(result) {
                        console.log("Previous session closed")
                    });
          });

        $rootScope.settings.layout.pageSidebarClosed = true;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("queryeditor");
    
});
