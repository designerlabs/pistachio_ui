MetronicApp.controller('RobotDocumentController', function ($rootScope, $scope, $http, settings, authorities, fileUpload) {

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax();


        var fileArr = [];
        var count = 0;
        var extraObj = $("#fileuploader").uploadFile({
            //url: globalURL + "api/pistachio/upload?user=",
            fileName: "myfile",
            acceptFiles: ".pdf, .csv, .doc, .docx, .ppt, .html, image/*",
            autoSubmit: false,
            uploadStr: 'Browse',
            cancelStr: '<i class="fa fa-times"></i>',
            doneStr: '<i class="fa fa-check"></i>',
            showProgress: true,
            showDone:true,
            //returnType:"json",
            //showDelete: true,
            onSelect: function(files){
                $scope.abb = {};
                $scope.abb.name = files;
                fileArr.push($scope.abb.name);
                $("#cancelbutton").removeClass('hide');
                $("#removebutton").addClass('hide');
                
            },
            onSubmit: function (files) {
                var uploadUrl = globalURL + "api/pistachio/upload?user=";
                fileUpload.uploadFileToUrl(fileArr[0][count], uploadUrl);
                count++;
                $('#cancelbutton').addClass('hide');
                $("#removebutton").removeClass('hide');
               //return false;
            }

        });

        $scope.uploadFile = function () {
            extraObj.startUpload();

        };

        $scope.cancelAll = function (){
            extraObj.cancelAll();
            $('#cancelbutton').addClass('hide');
            $('#removebutton').addClass('hide');
        };

        $scope.removeAll = function (){
            extraObj.reset();
            $('#removebutton').addClass('hide');
            $('#cancelbutton').addClass('hide');
        };






        //$("#extrabutton").click(function () {
        // console.log(extraObj);
        // debugger;
        //extraObj.startUpload();
        //});
    });


    $("#queryUISubmitTemplate").click(function (event) {

        var queryNameValTemp = $("#queryFormTemplate #query-name").val();

        /*var dtRange = $("#queryFormTemplate #dtRange").prop("checked");
        var stateVal = $("#queryFormTemplate #stateVal").prop("checked");
        var branchVal = $("#queryFormTemplate #branchVal").prop("checked");
        var deptVal = $("#queryFormTemplate #deptVal").prop('checked');
        console.log(deptVal);
        console.log($("#queryFormTemplate #deptVal").prop('checked'));*/
        $.each(templateFileName, function (index, value) {
            console.log(value);
            inputValidation("#queryFormTemplate", setTimeout(queryAjax(index), 1000));
        });


        function queryAjax(count) {
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
                    reportFileName: templateFileName[count],
                    query: 'NA',
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


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("robot");
});
