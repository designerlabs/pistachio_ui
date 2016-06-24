MetronicApp.controller('RobotDocumentController', function ($rootScope, $scope, $http, settings, authorities, fileUpload) {

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax();
    });
    $scope.uploadFile = function () {
        var file = $scope.myFile;
        console.log('file is ');
        console.dir(file);
        var uploadUrl = globalURL + "api/pistachio/upload?user=";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };

    var templateFileName=[];
    $("#file").change(function () {
        //var getVal = $('input[type=file]').val();
        var files = document.getElementById("file").files;
        for (var i = 0; i < files.length; i++){
            templateFileName.push(files[i].name);
          
        }
        
        //templateFileName = getVal.split(/(\\|\/)/g).pop();
    });

    $("#queryUISubmitTemplate").click(function (event) {

        var queryNameValTemp = $("#queryFormTemplate #query-name").val();

        /*var dtRange = $("#queryFormTemplate #dtRange").prop("checked");
        var stateVal = $("#queryFormTemplate #stateVal").prop("checked");
        var branchVal = $("#queryFormTemplate #branchVal").prop("checked");
        var deptVal = $("#queryFormTemplate #deptVal").prop('checked');
        console.log(deptVal);
        console.log($("#queryFormTemplate #deptVal").prop('checked'));*/
        $.each(templateFileName, function(index, value){
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
