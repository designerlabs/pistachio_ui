'use strict';

MetronicApp.controller('RoleMgtController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   

         $("#roleMgtList").show();
         $("#tableList").hide();

        // initialize core components
        Metronic.initAjax();


        var roleMgts;

        function roleMgtDataFunc() {
            roleMgts = $('#roleMgtdata').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL + "api/role",
                    "dataSrc": ""
                },
                "columns": [                  
                    // {
                    //     "data": "value"
                    // }, 
                    {
                        "data": "name"
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
                $.ajax({
                    url: globalURL + "api/role/",
                    type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            name: roleMgtNameVal,
                            value: 0
                        })
                    })
                    .done(function(){
                         roleMgts.destroy();
                         roleMgtDataFunc(); 
                         console.log(selAry);

                          //Now adding Parent Reports to the newly created Role...

                            $.ajax({
                                url: globalURL + "api/role/" + roleMgtNameVal + "/main",
                                type: "POST",
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify(selAry)
                            })
                            .done(function() {
                                alert("Inserted Parent Report done");
                                roleMgts.destroy();
                                roleMgtDataFunc();
                                // $("#roleMgtAddForm").modal('hide');
                                // $("#roleMgtRequire").hide(); 

                          //Now adding Sub Reports to the newly created Role...

                                    $.each(SubReportAry,function(k,v){
                                        $.ajax({
                                            url: globalURL + "api/role/" + roleMgtNameVal + "/sub?sid=" + v.sid,
                                            type: "POST",
                                            dataType: 'json',
                                            contentType: "application/json; charset=utf-8",
                                            data: JSON.stringify(v)
                                        })
                                        .done(function() {
                                            // alert("Inserted sub done");
                                            // roleMgts.destroy();
                                            // roleMgtDataFunc();
                                            // $("#roleMgtAddForm").modal('hide');
                                            // $("#roleMgtRequire").hide();                                                  

                                        })
                                        .fail(function(data) {
                                            console.log(data.responseJSON.error);
                                            $("#roleMgtRequire span").html(data.responseJSON.error);
                                            $("#roleMgtRequire").show();
                                            //alert('Failed!');
                                        }); 

                                    });  

                                            roleMgts.destroy();
                                            roleMgtDataFunc();
                                            $("#roleMgtAddForm").modal('hide');
                                            $("#roleMgtRequire").hide();                                  

                            })
                            .fail(function(data) {
                                console.log(data.responseJSON.error);
                                $("#roleMgtRequire span").html(data.responseJSON.error);
                                $("#roleMgtRequire").show();
                                //alert('Failed!');
                            });  
                    })
                    .fail(function(){
                       console.log(data.responseJSON.error);
                       $("#roleMgtRequire span").html(data.responseJSON.error);
                       $("#roleMgtRequire").show();
                    });         
            }
        });

        roleMgtDataFunc();

        //Update Record
        //Update click from Data Table
        var selectedroleMgtId = undefined;
        $('#roleMgtdata').on('click', 'button.updateBtn', function() {
            $("#roleMgtForm")[0].reset();
            $('#myParentSel option').remove();;
            $('#myParentSel').multiSelect('refresh');
            $('#mySubParentSel optgroup').remove();
            $('#mySubParentSel').multiSelect('refresh');

            $.get( globalURL + "reportcat/", function( data ) {
              $.each(data, function (key, value) {
                  $('#myParentSel').append(
                      $("<option></option>")
                        .attr("value", value.name)
                        // .attr("SelName",value.name)
                        .text(value.display)
                  );
              });
              $("#myParentSel").multiSelect('refresh');
            });

            // $('#myParentSel').multiSelect('deselect_all');
            $("#roleMgtAddFormHeader").html("Update Report");            
            $("#roleMgtAddForm").modal('show');
            
            var selectedroleMgt = roleMgts.row($(this).parents('tr')).data();
            //selectedroleMgtName = selectedroleMgt.name;
            $("#roleMgtAddForm #roleMgtUISubmit").addClass('hide');
            $("#roleMgtAddForm #roleMgtUIUpdate").removeClass('hide');
            $("#roleMgtForm #roleMgt-name").val(selectedroleMgt.name); 
            
            //Fill and Select Main reports    
             $.ajax({
                    url: globalURL + "api/role/" + selectedroleMgt.name +"/main" ,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"                    
                })
                .done(function(data) {
                  //$('#myParentSel').multiSelect('refresh');
                  $.each(data, function(k,v){
                    $('#myParentSel').multiSelect('select', v.name); 
                  });

                     //Select sub reports  
                         $.ajax({
                                url: globalURL + "api/role/" + selectedroleMgt.name +"/subreport" ,
                                type: "GET",
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8"                    
                            })
                            .done(function(data) {
                              //$('#myParentSel').multiSelect('refresh');
                              $.each(data, function(k,v){
                                $('#mySubParentSel').multiSelect('select', v.queryCategory); 
                              });

                              // Select Each report Permissions
                                 $.ajax({
                                      url: globalURL + "api/role/" + selectedroleMgt.name +"/subcrud" ,
                                      type: "GET",
                                      dataType: 'json',
                                      contentType: "application/json; charset=utf-8"                    
                                  })
                                  .done(function(data) {

                                    $.each(data, function(k,v){
                                      $('#mySubParentSel').multiSelect('select', v.queryCategory); 
                                    });

                                   

                                  })
                                  .fail(function() {
                                      alert('Failed in Sub Reports Permissions!');
                                  });  


                            })
                            .fail(function() {
                                alert('Failed in Sub Reports!');
                            });  
                })
                .fail(function() {
                    alert('Failed in Parent Reports!');
                });

             


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
                       
            $.ajax({
                    url: globalURL + "api/role/" + roleMgtUpdateNameVal + "/main",
                    // url: "http://10.1.17.58:8080/api/role/" + roleMgtUpdateNameVal + "/main",
                    type: "PUT",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data:  JSON.stringify(selAryUpdate)
                })
                .done(function(data) {
                    roleMgts.destroy();
                    roleMgtDataFunc();
                    $("#roleMgtAddForm").modal('hide');                      
                })
                .fail(function() {
                    alert('Failed!');
                });
        });

        //Delete Record
        var selectedroleMgtForDelete;
        $('#roleMgtdata').on('click', 'button.deleteBtn', function() {
            $("#roleMgtDelete").modal('show');
            selectedroleMgtForDelete = roleMgts.row($(this).parents('tr')).data();
            $("#roleMgtDelete .modal-body h3").html('Are you sure do you want to<br>delete the roleMgt <strong>' + selectedroleMgtForDelete.name + '</strong> ?');
        });

         $('#roleMgtDataDeleteBtn').click(function(event) {

            $.ajax({
                url: globalURL + 'api/role/' + selectedroleMgtForDelete.name,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    roleMgts.destroy();
                    roleMgtDataFunc();
                    $("#roleMgtDelete").modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $("#errorTitle").html(XMLHttpRequest.responseJSON.error);
                    $("#roleMgtDeleteErrorMsg").modal('show');
                    $("#roleMgtDelete").modal('hide');
                }
            });

        });

       // $("#reportMgtAddBtn").click(function(event) {
       //      $("#reportMgtAddForm #reportMgtUISubmit").removeClass('hide');
       //      $("#reportMgtAddForm #reportMgtUIUpdate").addClass('hide');
       //      $("#reportMgtAddFormHeader").html("Add Report"); //Change
       //      $("#reportMgtForm")[0].reset();
       // });
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
            // $('#dtCURD').on('click', 'checkbox.yesBtn', function() {
               
            //     selectedroelMgtRolePermission = RoleMgtsSubMenu.row($(this).parents('tr')).data();
            //     var idx = RoleMgtsSubMenu.cell($(this)).index().column();
            //     var title = RoleMgtsSubMenu.column( idx ).header();
            //     alert(title);
            //     console.log(title);
            // });


        $('#myParentSel').multiSelect({
          afterSelect: function (value) {
               var optgrp = $("<optgroup></optgroup>");
               optgrp[0].label = $("#myParentSel option[value =" + value + "]").text();
               $.get(globalURL + "query/report/" + value, function( data ) {
               $.each(data, function (k, val) {
               optgrp.append(
                    $("<option></option>")
                      .attr("dataid", val.id)
                      .attr("value", val.queryCategory)
                      .text(val.queryCategoryName)
                  );
               });
               $('#mySubParentSel').append(optgrp);
               $('#mySubParentSel').multiSelect('refresh');
            });
          },
          afterDeselect: function(value){
            var optionText = '';
            optionText = $("#myParentSel option[value=" + value + "]").text();
            $("#mySubParentSel optgroup[label='" + optionText + "']").remove();
            $("#mySubParentSel").multiSelect('refresh');

            var oTable = $('#dtCURD').dataTable();            
            $("tr:contains('" + optionText + "')").each(function() 
               {
                 oTable.fnDeleteRow(this);
               }
            );
            }
        });
 
        var SubReportAry = [];
        var SubReportObj = [];

      $('#mySubParentSel').multiSelect({ 
        selectableOptgroup: false,
        afterSelect: function (value) {               
                var disText =  $("#mySubParentSel option[value =" + value + "]").text();
                var disParentText = $("#mySubParentSel option[value =" + value + "]").parent().attr('label');
                var disid = $("#mySubParentSel option[value =" + value + "]").attr('dataid');
                SubReportObj = {
                    'sid': disid,
                    'add': false,
                    'run': false,
                    'update':false,
                    'delete':false,
                    'queryVisible':true
                };
                SubReportAry.push(SubReportObj);
                var table = $('#dtCURD').DataTable();
                    table.rows.add( [{
                        "id": disid,
                        "parentname": disParentText,
                        "name":     disText,
                        "add":   "false",
                        "run":     "false",
                        "update":   "false",
                        "delete":   "false",
                        "queryVisible": "true" 
                    }] )
                    .draw();        
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

        $('#dtCURD tbody').on('click', 'input[type="checkbox"]', function(e){
          // debugger;
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
          console.log(result);
        
          SubReportAry.splice($.inArray(result[0],SubReportAry),1);

             result[0][ClmName] = Status;
             SubReportAry.push(result[0]);
             console.log(SubReportAry);         

        }); 
   
          
        var getUser = localStorage.getItem("username");
      	$http.get(globalURL+"user?user="+getUser)
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

// http://pistachio_server:8080/api/role/{rolename}/subcrud -- To See sub report permissions
// http://pistachio_server:8080/api/role/{rolename}/subreport -- To See sub reports.. under  "queryCategoryName": "Kerja",