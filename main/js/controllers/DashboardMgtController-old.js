'use strict';

MetronicApp.controller('DashboardMgtController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        $scope.dashboardentity = {};
        Metronic.initAjax();
        $("#dashboard").show();
        $("#tableList").hide();

        $(".page-sidebar-menu > li").removeClass('active');
        $(".sub-menu > li").removeClass('active');

        $("#adminLink").addClass('active');
        $("#dashboardmgtLink").addClass('active');

        $('.sub-menu li a').click(function() {
        
            $(".nav-item").removeClass("active");
            $(".nav-item").removeClass("open");
            $('.sub-menu').hide();
            $(this).parent('li').addClass('active');
            console.log(this);

            //alert(this);
            $(this).parents('ul').parent('li').addClass("active");
        });

        var dashboards;



        $.extend( true, $.fn.dataTable.defaults, {
         stateSave: true
        });
        

        function dashboardDataFunc() {
            dashboards = $('#dashboardData').DataTable({

                "ajax": {
                    "processing": true,
                    "serverSide": true,
                    "url": globalURL+"pistachio/dashboard",
                    "dataSrc": ""
                },
                "columns": [{
                        "data": "title"
                    }, {
                        "data": "url"
                    }, {
                        "data": "ext"
                    }, {
                        "data": "icon",
                        "width": "10%"
                    }, {
                        "data": "color",
                        "width": "bg-green"
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

        formInputValidation("#dashboardForm");

       /* //Icon files
        var fileExt = {};
            fileExt[0]=".png";
            fileExt[1]=".jpg";
            fileExt[2]=".gif";
        $.ajax({
            //This will retrieve the contents of the folder if the folder is configured as 'browsable'
            url: '../../icons/images/',
            success: function (data) {
                 $(".iconfiles").html('<option value="">please select</option>');
               //List all png or jpg or gif file names in the page
               $(data).find('a:contains('+ fileExt[0] + '),a:contains(' + fileExt[1] + '),a:contains(' + fileExt[2] + ')').each(function () {
                   //console.log(this);
                   var filename = this.href.replace(window.location.host, "").replace("http:///projects/mimos/pistachio_ui/main/", "").replace(".png", "");
                  
                   $(".iconfiles").append('<option value="'+filename+'">'+filename+'</option>');
               });
             }     
          });*/


        $.ajax({
            url: globalURL+"api/gui/icons",
            success: function (data) {
                 $(".iconfiles").html('<option value="">please select</option>');
               //List all png or jpg or gif file names in the page
                $.each( data, function( i, val ) {
                  $(".iconfiles").append('<option value="fa-'+val+'">'+val+'</option>');
                  // Will stop running after "three"
                  //return ( val !== "three" );
                });
            }     
          });    
        

        $.ajax({
            url: globalURL+"api/gui/themes",
            success: function (data) {
                 $(".themefiles").html('<option value="">please select</option>');
               //List all png or jpg or gif file names in the page
                $.each( data, function( i, val) {
                  $(".themefiles").append('<option value="bg-'+val+'">'+val+'</option>');
                  // Will stop running after "three"
                  //return ( val !== "three" );
                });
            }     
          });
    

        $("#dashboardUISubmit").click(function(event) {
            var dashboardTitleVal = $("#dashboardForm #dashboard-title").val();
            var dashboardURLVal = $("#dashboardForm #dashboard-url").val();
            var dashboardExtVal = $("#dashboardForm #dashboard-ext").val();
            var dashboardIconVal = $("#dashboardForm #dashboard-icon").val();
            var dashboardThemeVal = $("#dashboardForm #dashboard-theme").val();
            inputValidation("#dashboardForm", dashboardAjax);

            function dashboardAjax() {
                $.ajax({
                        url: globalURL+"pistachio/dashboard",
                        type: "POST",
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({
                            title: dashboardTitleVal,
                            url: dashboardURLVal,
                            ext: dashboardExtVal,
                            icon: dashboardIconVal,
                            color: dashboardThemeVal,
                            active: "active",
                            username: "admin"

                        })
                    })
                    .done(function() {
                        dashboards.destroy();
                        dashboardDataFunc();
                        $("#dashboardAddForm").modal('hide');
                        $("#dashboardRequire").hide();
                    })
                    .fail(function(data) {
                        console.log(data.responseJSON.error);
                        $("#dashboardRequire span").html(data.responseJSON.error);
                        $("#dashboardRequire").show();
                        //alert('Failed!');
                    });
            }
        });

        dashboardDataFunc();


        var selectedDashboardId = undefined;
        $('#dashboardData').on('click', 'button.updateBtn', function() {
            var selectedDashboard = dashboards.row($(this).parents('tr')).data();
            selectedDashboardId = selectedDashboard.id;
            console.log(selectedDashboard);
            $("#dashboardAddForm #dashboardUISubmit").addClass('hide');
            $("#dashboardAddForm #dashboardUIUpdate").removeClass('hide');
            $scope.dashboardentity = selectedDashboard;
            console.log($scope.dashboardentity)
           // $("#dashboardForm #dashboard-title").val(selectedDashboard.title);
           // $("#dashboardForm #dashboard-url").val(selectedDashboard.url);
            //var userAuthorities = Object.keys(selectedDashboard.ext).map(function() { return selectedDashboard.ext });
            //$("#roleMultiple").val(userAuthorities);
            //$("#dashboardForm #dashboard-ext").val(selectedDashboard.ext).change();
            //$('#dashboardForm #dashboard-ext option[value='+selectedDashboard.ext+']').attr('selected','selected');
            $('#dashboardForm select[name=dashboard-ext] option[value='+selectedDashboard.ext+']').attr('selected','selected');
      

            //$("#dashboardForm #dashboard-icon").val(selectedDashboard.icon);
            $("#dashboardForm select[name=dashboard-icon]").val(selectedDashboard.icon);
            //console.log(selectedDashboard);
            $("#dashboardForm select[name=dashboard-theme]").val(selectedDashboard.color);
            $("#dashboardAddFormHeader").html("Update Dashboard");
            $("#dashboardAddForm").modal('show');
        });
        

               console.log(event);
            
        

        $("#dashboardUIUpdate").click(function(event) {


            if( $('#dashboard-ext:selected').length > 0){
               //var selectedValue = {};
               var selectedText = [];
               
               var colName = "name";
               var colValue = "value";
               
               $('#dashboard-ext :selected').each(function(i, selected) {
                     
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

                
            }


            var dashboardUpdateTitleVal = $("#dashboardForm #dashboard-title").val();
            var dashboardUpdateURLVal = $("#dashboardForm #dashboard-url").val();
            var dashboardUpdateExtVal = $("#dashboardForm #dashboard-ext").val();
            var dashboardUpdateIconVal = $("#dashboardForm #dashboard-icon").val();
            var dashboardUpdateThemeVal = $("#dashboardForm #dashboard-theme").val();
            //alert(selectedQueryId);
            inputValidation("#dashboardForm", dashbardAjaxUpdate);


            function dashbardAjaxUpdate(){
            $.ajax({
                    url: globalURL+"pistachio/dashboard",
                    type: "PUT",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify({
                        id: selectedDashboardId,
                        title: dashboardUpdateTitleVal,
                        url: dashboardUpdateURLVal,
                        ext: dashboardUpdateExtVal,
                        icon: dashboardUpdateIconVal,
                        color: dashboardUpdateThemeVal,
                        active: "active",
                        username: "admin"
                    })
                })
                .done(function(data) {
                    dashboards.destroy();
                    dashboardDataFunc();
                    //selectedQueryId = null;
                })
                .fail(function(e) {
                    console.log(e);
                });

            }
        });



        var selectedDashboardForDelete;
        $('#dashboardData').on('click', 'button.deleteBtn', function() {
            $("#dashboardDelete").modal('show');
            selectedDashboardForDelete = dashboards.row($(this).parents('tr')).data();
            console.log(selectedDashboardForDelete);
            $("#dashboardDelete .modal-body h3").html('Are you sure do you want to<br>delete the dashboard <strong>' + selectedDashboardForDelete.title + '</strong>?');

        });

        $('#dashboardDataDeleteBtn').click(function(event) {
            //$('#databaseData').on('click', 'button.deleteBtn', function() {
            //var selectedDatabaseForDelete = databases.row($(this).parents('tr')).data();
            $.ajax({
                url: globalURL+'pistachio/dashboard/' + selectedDashboardForDelete.id,
                type: 'DELETE',
                success: function(result) {
                    // Do something with the result
                    dashboards.destroy();
                    dashboardDataFunc();
                    $("#dashboardDelete").modal('hide');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //alert("Status: " + textStatus);
                    //alert("Error: " + errorThrown);
                    //alert("request: " + XMLHttpRequest);
                    if (errorThrown) {
                        $("#errorTitle").html(XMLHttpRequest.responseJSON.error);
                        $("#dashboardDeleteErrorMsg").modal('show');
                        //console.log(XMLHttpRequest.responseJSON.error);
                    }
                    console.log(XMLHttpRequest);
                    $("#dashboardDelete").modal('hide');
                }
            });

        });


        var getUser = localStorage.getItem("username");
        $http.get(globalURL+"role/report?user="+getUser)
        .success(function(response) {
            $scope.names = response;
       });

        $scope.go = function(data){
            location.href=data;
            var categoryId = this.$$watchers[2].last;
            //$scope.message = sharedService.categoryId;
        };
        //console.log($scope);
        
        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageSidebarClosed = false;
        $rootScope.skipTitle = false;
        $rootScope.settings.layout.setTitle("dashboardmgt");
    });

});
