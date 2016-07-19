'use strict';
var selectedroleMgt = undefined;
var triggerName = "";
var triggerDataTableName = "";
var SubReportAry = [];
var SubReportObj = [];
var flag_dashboard=[], flag_fastsearch=[], flag_database=[], _nme;
var getToken = localStorage.getItem("token");
MetronicApp.controller('RoleMgtController', function($rootScope, $scope, settings, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {

      // initialize core components
      Metronic.initAjax();


         $("#roleMgtList").show();
         $("#tableList").hide();

        $(".page-sidebar-menu > li").removeClass('active');
        $(".sub-menu > li").removeClass('active');

        $("#adminLink").addClass('active');
        $("#roleManagementLink").addClass('active');

        $('.sub-menu li a').click(function() {
        
            $(".nav-item").removeClass("active");
            $(".nav-item").removeClass("open");
            $('.sub-menu').hide();
            $(this).parent('li').addClass('active');
            console.log(this);
            //alert(this);
            $(this).parents('ul').parent('li').addClass("active");
        });
     
        var roleMgts;

        $.extend( true, $.fn.dataTable.defaults, {
         stateSave: true
        });



        function roleMgtDataFunc() {

          $http.get(globalURL + "api/role")
            .then(function successCallback(result) {
              roleMgts = $('#roleMgtdata').DataTable({
                data :result.data,
                columns: [{
                          "data": "name"
                      }, {
                          "data": "action",
                          "width": "25%",
                          "render": function(data, type, full, meta) {
                              return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
                          }
                }]
              });

            },
            function errorCallback(response) {
                console.log(response.data.error);
            });
            
        }

        formInputValidation("#roleMgtForm");

        $("#roleMgtUISubmit").click(function(event) {
            var roleMgtNameVal = $("#roleMgtForm #roleMgt-name").val();
            var selAry=[];
            var selObj=[];
             $('#myParentSel :selected').each(function(){
                var selObj = {
                    name: $(this).val(),
                    display: $(this).text()
                 };
                 selAry.push(selObj);
              });

            var roleMgtSelParentVal =  $("#roleMgtForm #myParentSel").val();
            inputValidation("#roleMgtForm", roleMgtAjax);

            function roleMgtAjax() {
                // Adding New Role to the DB first...
                var role_data = JSON.stringify({
                            name: roleMgtNameVal,
                            value: 0
                        });
                $http.post(globalURL + "api/role/", role_data)
                    .then(function successCallback(result) {
                      // console.log("Successfully added fastsearch in the role");
                      //Add Fast search details in role
                        $http.post(globalURL + "api/role/" + roleMgtNameVal + "/fastsearch", flag_fastsearch)
                         .then(function successCallback(result) {
                           console.log("Successfully added fastsearch in the role");
                         },
                         function errorCallback(response) {
                             console.log(response.data.error);
                             $("#roleMgtRequire span").html(response.data.error);
                             $("#roleMgtRequire").show();
                         });

                       //Add Dashboard details in role
                        $http.post(globalURL + "api/role/" + roleMgtNameVal + "/dashboard", flag_dashboard)
                         .then(function successCallback(result) {
                           console.log("Successfully added dashboard in the role");
                         },
                         function errorCallback(response) {
                             console.log(response.data.error);
                             $("#roleMgtRequire span").html(response.data.error);
                             $("#roleMgtRequire").show();
                         });

                      //Add Database details in role
                        $http.post(globalURL + "api/role/" + roleMgtNameVal + "/editor", flag_database)
                         .then(function successCallback(result) {
                           console.log("Successfully added editor/database in the role");
                         },
                         function errorCallback(response) {
                             console.log(response.data.error);
                             $("#roleMgtRequire span").html(response.data.error);
                             $("#roleMgtRequire").show();
                         });
                        console.log(selAry);

                       //Now adding Parent Reports to the newly created Role...

                        $http.post(globalURL + "api/role/" + roleMgtNameVal + "/main", JSON.stringify(selAry))
                           .then(function successCallback() {
                             //Now adding Sub Reports to the newly created Role...

                             $.each(SubReportAry,function(k,v){
                               $http.post(globalURL + "api/role/" + roleMgtNameVal + "/sub?sid=" + v.sid, JSON.stringify(v))
                                   .then(function successCallback(result) {
                                       console.log("Inserted sub done");
                                   },
                                   function errorCallback(response) {
                                     console.log(response.data.error);
                                     $("#roleMgtRequire span").html(response.data.error);
                                     $("#roleMgtRequire").show();
                                   });                                 
                             });

                             roleMgts.destroy();
                             roleMgtDataFunc();
                             $("#roleMgtAddForm").modal('hide');
                             $("#roleMgtRequire").hide();
                           },
                           function errorCallback(response) {
                               console.log(response.data.error);
                               $("#roleMgtRequire span").html(response.data.error);
                               $("#roleMgtRequire").show();
                           });
                         
                    },
                    function errorCallback(response) {
                        console.log(response.data.error);
                       $("#roleMgtRequire span").html(response.data.error);
                       $("#roleMgtRequire").show();
                    });                
            }
        });

        roleMgtDataFunc();

        //Update Record
        //Update click from Data Table
        var selectedroleMgtId = undefined;
        $('#roleMgtdata').on('click', 'button.updateBtn', function() {
          // $('#myParentSel').multiSelect('deselect_all');
           // $("#roleMgtForm")[0].reset();
           $('.nav-tabs li').removeClass('active');//remove opened tab
           $('.nav-tabs .tabRep').parent().addClass('active'); //activate clicked tab
           $(".tab-content").children().removeClass('active in'); //hide other tab contents
           $('#tab_Report').addClass('active in'); //show relevant tab contents
          
        triggerName = "update";
        triggerDataTableName = "update";
        SubReportAry = [];
         var dtable = $('#dtCURD').DataTable();
          dtable
               .clear()
               .draw();
        flag_fastsearch=[];
        flag_dashboard=[];
        flag_database=[];
            //$("#loader").css('height', $(".page-content").height() + 140 + 'px');
            selectedroleMgt = roleMgts.row($(this).parents('tr')).data();
            $("#loader .page-spinner-bar").removeClass('hide');

            $("#loader").show();
            $("#roleMgtRequire").hide();
            $("#roleMgtForm")[0].reset();
            $('#myParentSel option').remove();;
            $('#myParentSel').multiSelect('refresh');
            $('#mySubParentSel optgroup').remove();
            $('#mySubParentSel').multiSelect('refresh');

            $('#myDashboardSel option').remove();
            $('#myDashboardSel').multiSelect('refresh');      
            $('#myFastSearchSel').multiSelect('refresh');
            $('#myDatabaseSel option').remove();
            $('#myDatabaseSel').multiSelect('refresh');

            $.get( globalURL + "reportcat/", function( data ) {
              // debugger;
              $.each(data, function (key, value) {
                  $('#myParentSel').append(
                      $("<option></option>")
                        .attr("value", value.name)
                        .attr("key",key)
                        .text(value.display)
                  );
              });
              $("#myParentSel").multiSelect('refresh');
               //Fill and Select Main reports
             $.get(globalURL + "api/role/" + selectedroleMgt.name +"/main")
                .then(function successCallback(result) {
                  var resultMain = result;
                  $.each(resultMain, function(k,v){
                    $('#myParentSel').multiSelect('select', v.name);
                  });
                    $('#myParentSel').multiSelect('refresh');
                       $("#loader").hide();
                },
                function errorCallback(data) {
                    console.log(data.responseJSON.error);
                    $("#roleMgtRequire span").html(data.responseJSON.error);
                    $("#roleMgtRequire").show();
                });

            });
            //Load Fastsearch
            $.get( globalURL + "api/role/" + selectedroleMgt.name +"/fastsearch", function( data ) {
              // debugger;
              $.each(data, function (key, value) {
                  $('#myFastSearchSel').multiSelect('select', value);
              });
              $('#myFastSearchSel').multiSelect('refresh');
            });

            //Load database or Editor
            $.get( globalURL + "api/pistachio/secured/hadoop/db", function( data ) {
                $.each(data, function (key, value) {
                    $('#myDatabaseSel').append(
                        $("<option></option>")
                          .attr("value", value)
                          .text(value)
                    );
                });
                $("#myDatabaseSel").multiSelect('refresh');

                $.get( globalURL + "api/role/" + selectedroleMgt.name +"/editor", function( data ) {
                  // debugger;
                  $.each(data, function (key, value) {
                      $('#myDatabaseSel').multiSelect('select', value);
                  });
                  $('#myDatabaseSel').multiSelect('refresh');
                });
            }); 

            //Load dashboard

            $.get( globalURL + "pistachio/dashboard?user=" + getToken, function( data ) {
                $.each(data, function (key, value) {
                    $('#myDashboardSel').append(
                        $("<option></option>")
                          .attr("value", value.id)
                          .text(value.title)
                    );
                });
                $("#myDashboardSel").multiSelect('refresh');

                $.get( globalURL + "api/role/" + selectedroleMgt.name +"/dashboard", function( data ) {
                  // debugger;
                  $.each(data, function (key, value) {
                      $('#myDashboardSel').multiSelect('select', value.title);
                  });
                  $('#myDashboardSel').multiSelect('refresh');
                });
            });

            $("#roleMgtAddFormHeader").html("Update Role");
            $("#roleMgtAddForm").modal('show');
            
            //selectedroleMgtName = selectedroleMgt.name;
            $("#roleMgtAddForm #roleMgtUISubmit").addClass('hide');
            $("#roleMgtAddForm #roleMgtUIUpdate").removeClass('hide');
            $("#roleMgtForm #roleMgt-name").val(selectedroleMgt.name);
        });

        //Update event on the Form
        $("#roleMgtUIUpdate").click(function(event) {
            var roleMgtUpdateNameVal = $("#roleMgtForm #roleMgt-name").val();

            var selAryUpdate=[];
            var selObjUpdate=[];
           
             $('#myParentSel :selected').each(function(){
                 var selObjUpdate = {
                    name: $(this).val(),
                    display: $(this).text()
                 };
                 selAryUpdate.push(selObjUpdate);
              });

             // $http.put(globalURL + "api/role/" + roleMgtNameVal + "/dashboard", flag_dashboard)
             //  .then(function successCallback(result) {
             //  },
             //  function errorCallback(response) {
                  
             //  });

             $http.put(globalURL + "api/role/" + roleMgtUpdateNameVal + "/main", JSON.stringify(selAryUpdate),
                  {headers: { 'Content-Type': 'application/json' }})
              .then(function successCallback(data) {
                UpdateSubReportsCrud(roleMgtUpdateNameVal);
                // alert('after UpdateSubReportsCrud');
                  roleMgts.destroy();
                  roleMgtDataFunc();
                  $("#roleMgtAddForm").modal('hide');
                  $("#roleMgtRequire").hide();
              },
              function errorCallback(response) {
                  console.log(response.data.error);
                  $("#roleMgtRequire span").html(response.data.error);
                  $("#roleMgtRequire").show();
              });
            
                //Add Fast Search details in role

                $http.put(globalURL + "api/role/" + roleMgtUpdateNameVal + "/fastsearch", flag_fastsearch,
      {headers: { 'Content-Type': 'application/json' }})
                 .then(function successCallback(result) {
                   console.log("Successfully updated fastsearch in the role");
                 },
                 function errorCallback(response) {
                  console.log(response.data.error);
                   $("#roleMgtRequire span").html(response.data.error);
                   $("#roleMgtRequire").show();                     
                 });

                 //Add Dashboard details in role
                 $http.put(globalURL + "api/role/" + roleMgtUpdateNameVal + "/dashboard", flag_dashboard,
      {headers: { 'Content-Type': 'application/json' }})
                  .then(function successCallback(result) {
                    console.log("Successfully updated dashboard in the role");
                  },
                  function errorCallback(response) {
                   console.log(response.data.error);
                    $("#roleMgtRequire span").html(response.data.error);
                    $("#roleMgtRequire").show();                     
                  });                          

                //Add Database details in role

                $http.put(globalURL + "api/role/" + roleMgtUpdateNameVal + "/editor", flag_database,
      {headers: { 'Content-Type': 'application/json' }})
                 .then(function successCallback(result) {
                   console.log("Successfully updated editor in the role");
                 },
                 function errorCallback(response) {
                  console.log(response.data.error);
                   $("#roleMgtRequire span").html(response.data.error);
                   $("#roleMgtRequire").show();                     
                 });                        

        });

function UpdateSubReportsCrud(RoleName){
  $.each(SubReportAry,function(k,v){
    $http.put(globalURL + "api/role/" + RoleName + "/sub?sid=" + v.sid, JSON.stringify(v))
      .then(function successCallback(result) {
        console.log("Updated sub done");
      },
      function errorCallback(response) {
        console.log(response.data.error);
        $("#roleMgtRequire span").html(response.data.error);
        $("#roleMgtRequire").show();
      });
  });
}

        //Delete Record
        var selectedroleMgtForDelete;
        $('#roleMgtdata').on('click', 'button.deleteBtn', function() {
            $("#roleMgtDelete").modal('show');
            selectedroleMgtForDelete = roleMgts.row($(this).parents('tr')).data();
            $("#roleMgtDelete .modal-body h3").html('Are you sure do you want to<br>delete the roleMgt <strong>' + selectedroleMgtForDelete.name + '</strong> ?');
        });

        $('#roleMgtDataDeleteBtn').click(function(event) {

            $http.delete(globalURL + 'api/role/' + selectedroleMgtForDelete.name)
              .then(function successCallback(result) {
                roleMgts.destroy();
                roleMgtDataFunc();
                $("#roleMgtDelete").modal('hide');
              },
              function errorCallback(response) {
                $("#errorTitle").html(response.data.error);
                $("#roleMgtDeleteErrorMsg").modal('show');
                $("#roleMgtDelete").modal('hide');
              });
        });

        var RoleMgtsSubMenu;
        function roleMgtSubReportPermission() {
             // alert('add '+ data);
            RoleMgtsSubMenu = $('#dtCURD').DataTable( {
             searching: false,
             // paging: false,
             "pageLength":5,
                "columns": [
                {
                    "data": "id",
                    "searchable": false,
                    className: "hide "
                },
                {
                    "data": "parentname",
                    "searchable": false,
                    className: "hide "
                },
                {
                    "data":"name",
                    "width": "250"
                 },
                 {
                    "data":"add",
                     "width": "150",
                    "render": function (data, type, full, meta){
                        if(data == "true"){
                            return "<input type='checkbox' name='add' checked='true' />";
                        }else{
                             return '<input type="checkbox" name="add" />';
                        }
                    }
                 },
                 {
                    "data":"run",
                    "width": "150",
                    "render": function (data, type, full, meta){
                      if(data == "true"){
                            return "<input type='checkbox' name='run' checked='true' />";
                        }else{
                             return "<input type='checkbox' name='run' />";
                        }
                    }
                 },
                 {
                    "data":"update",
                    "width": "150",
                    "render": function (data, type, full, meta){
                     if(data == "true"){
                            return "<input type='checkbox' name='update' checked='true' />";
                        }else{
                             return "<input type='checkbox' name='update' />";
                        }
                    }
                 },
                 {
                    "data":"delete",
                    "width": "150",
                    "render": function (data, type, full, meta){
                      if(data == "true"){
                            return "<input type='checkbox' name='delete' checked='true' />";
                        }else{
                             return "<input type='checkbox' name='delete' />";
                        }
                    }
                 },
                 {
                    "data":"queryVisible",
                    "width": "150",
                    "render": function (data, type, full, meta){
                     if(data == "true"){
                            return "<input type='checkbox' name='queryVisible' checked='true' />";
                        }else{
                             return "<input type='checkbox' name='queryVisible' />";
                        }
                    }
                 }
              ]
            } );
        }

        roleMgtSubReportPermission();

        var selectedroelMgtRolePermission;

        $('#myParentSel').multiSelect({
          afterSelect: function (value) {
            // var value = key;
               var optgrp = $("<optgroup></optgroup>");
               optgrp[0].label = $("#myParentSel option[value =" + value + "]").text();

               //$("#loader").css('height', $(".page-content").height() + 140 + 'px');
               $("#loader .page-spinner-bar").removeClass('hide');

               $.get(globalURL + "query/report/" + value, function( data ) {
                $("#loader").show();
                     $.each(data, function (k, val) {
                     optgrp.append(
                          $("<option></option>")
                            .attr("reportid", "0") //id
                            .attr("dataid", val.id) //sid
                            .attr("parentname", val.parent)
                            .attr("value", val.queryCategory)
                            .text(val.queryCategoryName)
                        );
                     });
                     $('#mySubParentSel').append(optgrp);
                     $('#mySubParentSel').multiSelect('refresh');

               //Select sub reports
               var resultSub = undefined;
               // console.log("After select of myParentSel :"+ triggerName);
               if(triggerName){
                $http.get(globalURL + "api/role/" + selectedroleMgt.name +"/subcrud")
                  .then(function successCallback(result) {
                    resultSub = result.data;
                    SubReportAry = [];
                    $.each(resultSub, function(k,v){
                      $('#mySubParentSel').multiSelect('select', v.subReports.queryCategory);
                      $("#mySubParentSel option[dataid =" + v.sid + "]").attr('reportid',v.id);
                    });
                    $('#mySubParentSel').multiSelect('refresh');
                    UpdateCrud(resultSub);
                  },
                  function errorCallback(response) {
                      console.log(response.data.error);
                        $("#roleMgtRequire span").html(response.data.error);
                        $("#roleMgtRequire").show();
                  });

                  triggerName = "";
                }
                $("#loader").hide();
            });
          },
          afterDeselect: function(value){
            var optionText = '';
            optionText = $("#myParentSel option[value=" + value + "]").text();
            $("#mySubParentSel optgroup[label='" + optionText + "']").remove();
            $("#mySubParentSel").multiSelect('refresh');

            var oTable = $('#dtCURD').dataTable();
            $("tr:contains('" + value + "')").each(function()
               {
                 oTable.fnDeleteRow(this);
               }
            );
            var filteredNames = $(SubReportAry).filter(function( idx ) {
                  return SubReportAry[idx].parentname == value[0]
              });
             SubReportAry.splice($.inArray(filteredNames[0],SubReportAry),1);
            }
        });


      $('#mySubParentSel').multiSelect({
        selectableOptgroup: false,
        afterSelect: function (value) {
         // debugger;
                var disText =  $("#mySubParentSel option[value =" + value + "]").text();
                var disParentText = $("#mySubParentSel option[value =" + value + "]").parent().attr('label');
                var disid = $("#mySubParentSel option[value =" + value + "]").attr('dataid');
                var disparentname = $("#mySubParentSel option[value =" + value + "]").attr('parentname');
                if(!triggerDataTableName){
                      SubReportObj = {
                          'id' : '',
                          'sid': disid,
                          'add': false,
                          'run': false,
                          'update':false,
                          'delete':false,
                          'queryVisible':true,
                          'parentname' : disparentname
                      };
                      SubReportAry.push(SubReportObj);
                      var table = $('#dtCURD').DataTable();
                          table.rows.add( [{
                              "id": disid,
                              "parentname": disparentname,
                              "name":     disText,
                              "add":   "false",
                              "run":     "false",
                              "update":   "false",
                              "delete":   "false",
                              "queryVisible": "true"
                          }] )
                          .draw();
                      }
        },
        afterDeselect: function(value){
             var table = $('#dtCURD').DataTable();
             var disid = $("#mySubParentSel option[value =" + value + "]").attr('dataid');
             var disText =  $("#mySubParentSel option[value =" + value + "]").text();
             var oTable = $('#dtCURD').dataTable();
             $("tr:contains('" + disid + "')").each(function()
                {
                oTable.fnDeleteRow(this);
              });
             var filteredNames = $(SubReportAry).filter(function( idx ) {
                  return SubReportAry[idx].sid == disid
              });
             // SubReportAry.remove(filteredNames);
             SubReportAry.splice($.inArray(filteredNames[0],SubReportAry),1);

        }
    });



 $('#myDashboardSel').multiSelect({
  afterSelect: function (value) {
    flag_dashboard.push(value[0]); 
    // console.log(flag_dashboard); 
  },
  afterDeselect: function(value){ 
   _nme="";
   _nme = $(flag_dashboard).filter(function( k ) {
                  return flag_dashboard[k] == value;
              });
    console.log(_nme[0]); 
    flag_dashboard.splice($.inArray(_nme[0],flag_dashboard),1);  
    // console.log(flag_dashboard); 
  }
 });

 $('#myFastSearchSel').multiSelect({
  afterSelect: function (value) {  
    flag_fastsearch.push(value[0]);
    // console.log(flag_fastsearch); 
  },
  afterDeselect: function(value){  
   _nme="";  
   _nme = $(flag_fastsearch).filter(function( i ) {
                  return flag_fastsearch[i] == value 
              });
    flag_fastsearch.splice($.inArray(_nme[0],flag_fastsearch),1);   
    // console.log(flag_fastsearch);
  }
 });

 $('#myDatabaseSel').multiSelect({
  afterSelect: function (value) {  
    flag_database.push(value[0]);
    console.log(flag_database); 

  },
  afterDeselect: function(value){      
     _nme="";  
   _nme = $(flag_database).filter(function( i ) {
                  return flag_database[i] == value 
              });
    flag_database.splice($.inArray(_nme[0],flag_database),1);  
    console.log(flag_database); 
  }
 });

function UpdateCrud(_data){

               $.each(_data, function(k,v){
                  SubReportObj = {
                        'id' : v.id,
                        'sid': v.sid,
                        'add': v.add,
                        'run': v.run,
                        'update':v.update,
                        'delete':v.delete,
                        'queryVisible': v.queryVisible,
                        'parentname': v.subReports.parent
                    };
              SubReportAry.push(SubReportObj);
              var table = $('#dtCURD').DataTable();
                        table.rows.add( [{
                            "id": v.sid,
                            "parentname": v.subReports.parent,
                            "name":     v.subReports.queryCategoryName,
                            "add":   v.add.toString(),
                            "run":     v.run.toString(),
                            "update":  v.update.toString(),
                            "delete":   v.delete.toString(),
                            "queryVisible": v.queryVisible.toString()
                        }] )
                        .draw();
                });
             triggerDataTableName = "";
}

        $('#dtCURD tbody').on('click', 'input[type="checkbox"]', function(e){
         var $this = this;
         var table = $('#dtCURD').DataTable();
          var $row = $(this).closest('tr');
          // Get row data
          var data = table.row($row).data();

          // Get row ID
          var rowId = data[0];
          var ClmName = $this.name;
          var Status = $this.checked;
            //Update SubReportAry with latest data
          var result = $.grep(SubReportAry, function(e){ return e.sid == data.id; });
          // console.log(result);

          SubReportAry.splice($.inArray(result[0],SubReportAry),1);

             result[0][ClmName] = Status;
             SubReportAry.push(result[0]);
             // console.log(SubReportAry);

        });


    	$scope.go = function(data){
    		location.href=data;
            var categoryId = this.$$watchers[2].last;
    	};
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("rolemgt");
});

// http://pistachio_server:8080/api/role/{rolename}/subcrud -- To See sub report permissions
// http://pistachio_server:8080/api/role/{rolename}/subreport -- To See sub reports.. under  "queryCategoryName": "Kerja",
