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
                            return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Update</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>';
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

                          //Now adding Parents to the newly created Role...
                            $.ajax({
                                url: globalURL + "api/role/" + roleMgtNameVal + "/main",
                                type: "POST",
                                dataType: 'json',
                                contentType: "application/json; charset=utf-8",
                                data: JSON.stringify(selAry)
                            })
                            .done(function() {
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

                    });         
            }
        });

        roleMgtDataFunc();

        //Update Record
        //Update click from Data Table
        var selectedroleMgtId = undefined;
        $('#roleMgtdata').on('click', 'button.updateBtn', function() {
            $("#roleMgtForm")[0].reset();
            $('#myParentSel').multiSelect('deselect_all');
            $("#roleMgtAddFormHeader").html("Update Report");            
            $("#roleMgtAddForm").modal('show');
            
            var selectedroleMgt = roleMgts.row($(this).parents('tr')).data();
            //selectedroleMgtName = selectedroleMgt.name;
            $("#roleMgtAddForm #roleMgtUISubmit").addClass('hide');
            $("#roleMgtAddForm #roleMgtUIUpdate").removeClass('hide');
            $("#roleMgtForm #roleMgt-name").val(selectedroleMgt.name); 

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
                })
                .fail(function() {
                    alert('Failed!');
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
                    type: "POST",
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

       
        var getUser = localStorage.getItem("username");
    	$http.get("http://pistachio_server:8080/user?user="+getUser)
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
