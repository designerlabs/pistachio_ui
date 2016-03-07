'use strict';

MetronicApp.controller('UserMgtController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   

        $("#userMgtList").show();
        $("#tableList").hide();

        // initialize core components
        Metronic.initAjax();


        var userMgts;


        function userMgtDataFunc() {
            userMgts = $('#userMgtdata').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL + "user",
                    "dataSrc": ""
                },
                "columns": [

                    /*{
                        "data": "login"
                    },*/ {
                        "data": "firstName"
                    }, {
                        "data": "lastName"
                    }, {
                        "data": "email"
                    },{
                        "data": "activated",
                        "render": function(data, type, full, meta) {
                            if(data == true){
                            return '<button class="btn btn-success btn-sm actBtn"><i class="fa fa-check"></i> Activated</button>';
                            }else{
                            return '<button class="btn btn-danger btn-sm dActBtn"><i class="fa fa-close"></i> Deactivated</button>';
                            }
                        }                        
                    },{
                        "data": "authorities",
                        "render": function(data, type, full, meta) {
                            /*$.each(full.authorities, function(index, val) {
                                 console.log(val.name);
                                 console.log('--');
                            });*/
                            var arr = Object.keys(data).map(function(k) { return '<span class="badge badge-primary badge-roundless">'+data[k].name+'</span>' });

                            return '<div class="roleClass">'+arr+'</div>';

                        }
                    }, {
                    	"data": "department"
                    }, {
                        "data": "action",
                        "width": "15%",
                        "render": function(data, type, full, meta) {
                            return '<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button>';
                            //<button class="btn btn-primary btn-sm updateBtn"><i class="fa fa-edit"></i> Edit</button><button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>
                        }
                    }
                ]
            });
        }
        


        formInputValidation("#userMgtForm");
        /*$("#userMgtUISubmit").click(function(event) {
            var userMgtTitleVal = $("#userMgtForm #usertMgt-title").val();
            var userMgtCategoryVal = $("#userMgtForm #userMgt-category").val();
            var userMgtThemeVal = $("#userMgtForm #userMgt-theme").val();
            //var userMgtIconVal = $("#userMgtForm #userMgt-icon").val();
            var userMgtRoleVal = $("#userMgtForm #userMgt-role").val();
            var userMgtActivateVal = $("#userMgtForm #userMgt-activated").val();
            inputValidation("#userMgtForm", userMgtAjax);

            function userMgtAjax() {
                $.ajax({
                        url: globalURL+"query/cato",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            queryCategoryName: userMgtTitleVal,
                            queryCategory: userMgtCategoryVal,
                            className: userMgtThemeVal,
                            role: userMgtRoleVal,
                            activated: userMgtActivateVal
                        })
                    })
                    .done(function() {
                        userMgts.destroy();
                        userMgtDataFunc();
                        $("#userMgtAddForm").modal('hide');
                        $("#userMgtRequire").hide();
                    })
                    .fail(function(data) {
                        console.log(data.responseJSON.error);
                        $("#userMgtRequire span").html(data.responseJSON.error);
                        $("#userMgtRequire").show();
                        //alert('Failed!');
                    });
            }
        });*/

        userMgtDataFunc();
        //Update Record
        var selecteduserMgtId = undefined;
        $('#userMgtdata').on('click', 'button.updateBtn', function() {
            var selecteduserMgt = userMgts.row($(this).parents('tr')).data();
            selecteduserMgtId = selecteduserMgt.id;
            $("#userMgtAddForm #userMgtUISubmit").addClass('hide');
            $("#userMgtAddForm #userMgtUIUpdate").removeClass('hide');
            $("#userMgtForm #userMgt-title").val(selecteduserMgt.firstName);
            $("#userMgtForm #userMgt-category").val(selecteduserMgt.lastName);
            $("#userMgtForm #userMgt-theme").val(selecteduserMgt.email);
            $("#userMgtForm #userMgt-role").val(selecteduserMgt.activate);
            $("#userMgtForm #userMgt-activated").val(selecteduserMgt.activated);
            var userAuthorities = Object.keys(selecteduserMgt.authorities).map(function(k) { return selecteduserMgt.authorities[k].name; });
            $("#roleMultiple").val(userAuthorities);
            //$("#userMgtForm #userMgt-role").val(userAuthorities);
            $("#userMgtForm #userMgt-dept").val(selecteduserMgt.department);
            
            $("#userMgtAddFormHeader").html("Update User");
            $("#userMgtAddForm").modal('show');

        });


        //To De Activate the user
        var selecteduserMgtActId = undefined;
        var selecteduserMgtDActId = undefined;
        var getActivate = undefined;
        $('#userMgtdata').on('click', 'button.actBtn', function() {
            //$("#userMgtForm input").parent('.form-group').removeClass('has-error');
            var selecteduserMgt = userMgts.row($(this).parents('tr')).data();
            selecteduserMgtActId = selecteduserMgt.id;
            getActivate = selecteduserMgt.activated;
             $.get( globalURL+"user/"+selecteduserMgtActId+"?activate=false", function( data ) {
                userMgts.destroy();
                userMgtDataFunc();
            });
        });

        //To Activate the user
        $('#userMgtdata').on('click', 'button.dActBtn', function() {
            //$("#userMgtForm input").parent('.form-group').removeClass('has-error');
            var selecteduserMgt = userMgts.row($(this).parents('tr')).data();
            selecteduserMgtDActId = selecteduserMgt.id;
            getActivate = selecteduserMgt.activated;
            $.get(globalURL+"user/"+selecteduserMgtDActId+"?activate=true", function( data ) {
                userMgts.destroy();
                userMgtDataFunc();
            });


        });

        $("#userMgtUIUpdate").click(function(event) {
            console.log(selecteduserMgtId);

            if( $('#roleMultiple :selected').length > 0){
               //var selectedValue = {};
               var selectedText = [];
               
               var colName = "name";
               var colValue = "value";
               
               $('#roleMultiple :selected').each(function(i, selected) {
                     
                    var jsonData = {};     
                   jsonData[colName] = $(selected).val();
                   jsonData[colValue] = $(selected).data('val');
                   selectedText.push(jsonData);
                   //var arr = {'name':'+$(selected).val()+','value':'+$(selected).data('val')+'}; 
                   //console.log(selected, i);
                   //selectedText.push(JSON.parse(arr));
                   //alert(selectedText[i]);
                   //selectedValue[i] = $(selected).data('val');
               });



                   
                    console.log(JSON.stringify(selectedText));

               //var obj = $.parseJSON(selectedText);
               //console.log(selectedText);
               $.ajax({
                       url: globalURL + "user/"+selecteduserMgtId+"/role",
                       type: "PUT",
                       dataType: 'json',
                       contentType: "application/json; charset=utf-8",
                       data: JSON.stringify(selectedText)
                           /*id: selecteduserMgtId,
                           queryCategoryName: userMgtTitleVal,
                           queryCategory: userMgtCategoryVal,
                           className: userMgtThemeVal,
                           role: userMgtRoleVal,
                           activated: userMgtActivatedVal*/
                       
                   })
                   .done(function(data) {
                     userMgts.destroy();
                        userMgtDataFunc();
                         $("#userMgtAddForm").modal('hide');
                   })
                   .fail(function(e) {
                        console.log(e);
                       //alert('Failed!');
                   });
                
            }
            var valuesArray = $('select[name=roleMultiple]').val();
            //console.log(valuesArray);
            var userMgtTitleVal = $("#userMgtForm #userMgt-title").val();
            var userMgtCategoryVal = $("#userMgtForm #userMgt-category").val();
            var userMgtThemeVal = $("#userMgtForm #userMgt-theme").val();
            var userMgtRoleVal = $("#userMgtForm #userMgt-role").val();
            var userMgtActivatedVal = $("#userMgtForm #userMgt-activated").val();

        });
        //Delete Record
        var selecteduserMgtForDelete;
        $('#userMgtdata').on('click', 'button.deleteBtn', function() {
            $("#userMgtDelete").modal('show');
            selecteduserMgtForDelete = userMgts.row($(this).parents('tr')).data();
            $("#userMgtDelete .modal-body h3").html('Are you sure do you want to<br>delete the userMgt <strong>' + selecteduserMgtForDelete.queryCategoryName + '</strong> ?');
        });

         $('#userMgtDataDeleteBtn').click(function(event) {

            $.ajax({
                url: globalURL + 'query/cato/' + selecteduserMgtForDelete.id,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    userMgts.destroy();
                    userMgtDataFunc();
                    $("#userMgtDelete").modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $("#errorTitle").html(XMLHttpRequest.responseJSON.error);
                    $("#userMgtDeleteErrorMsg").modal('show');
                    $("#userMgtDelete").modal('hide');
                }
            });

        });

        var getUser = localStorage.getItem("username");
    	$http.get(globalURL+"user?user="+getUser)
    	.success(function(response) {
    		$scope.names = response;
       });

        //Roles
        $http.get(globalURL+"api/role")
        .success(function(responseRole) {
            $scope.name = responseRole;
       });


         $http.get(globalURL+"api/role")
         .success(function(responseRole) {
             $scope.name = responseRole;
        });

    	$scope.go = function(data){
    		location.href=data;
            var categoryId = this.$$watchers[2].last;
    	};
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
});
