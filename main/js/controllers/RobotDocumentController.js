var version = '11.0.0';
MetronicApp.controller('RobotDocumentController', ['$rootScope','$scope', '$http', '$timeout', '$compile', 'Upload', function ($rootScope, $scope, $http, $timeout, $compile, Upload) {

    $scope.$on('$viewContentLoaded', function () {
        Metronic.initAjax();

        $scope.usingFlash = FileAPI && FileAPI.upload != null;
        
 
    });

  $scope.invalidFiles = [];
  $scope.globalDownloadURL = globalURL+"api/secured/solr/document/download?filename=";
  

  $rootScope.$on('loading:progress', function (){
      console.log('loading');
      $scope.loading = true;
  });

  $rootScope.$on('loading:finish', function (){
    console.log('stop');
  $scope.loading = false;
  });

$scope.$watch('files', function (files) {
    $scope.formUpload = false;
    if (files != null) {
      if (!angular.isArray(files)) {
        $timeout(function () {
          $scope.files = files = [files];

        });
        return;
      }
      for (var i = 0; i < files.length; i++) {

        Upload.imageDimensions(files[i]).then(function (d) {
          $scope.d = d;

        });
        $scope.errorMsg = null;
        (function (f) {
          $scope.upload(f, true);

        })(files[i]);

      }
    }
  });  


  $scope.uploadPic = function (file) {
    $scope.formUpload = true;
    if (file != null) {
      $scope.upload(file);
    }
  };

  $scope.upload = function(file, resumable) {
    $scope.errorMsg = null;
    if ($scope.howToSend === 2) {
      uploadUsingUpload(file, resumable);
    } else if ($scope.howToSend == 1) {
      uploadUsing$http(file);
    } else {
      uploadS3(file);
    }
  };

  $scope.uploadCollapseHide = function(){
    $("#upload-container").collapse('hide');
  }

  $scope.isResumeSupported = Upload.isResumeSupported();

  $scope.restart = function(file) {
    if (Upload.isResumeSupported()) {
      $http.get('https://angular-file-upload-cors-srv.appspot.com/upload?restart=true&name=' + encodeURIComponent(file.name)).then(function () {
        $scope.upload(file, true);
      });
    } else {
      $scope.upload(file);
    }
  };

  $scope.chunkSize = 100000;
  function uploadUsingUpload(file, resumable) {
    sendUpload = true;
    file.upload = Upload.upload({
      url: globalURL+'api/pistachio/upload?user=' + $scope.getReqParams(),
     
      headers: {
         'Content-Type': file.type
      },
      data: {username: localStorage.getItem('username'), file: file}
    });

    file.upload.then(function (response) {

      $timeout(function () {
        file.result = response.data;
      });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function (xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }
  var thisSolrAppUrl = globalURL+'api/secured/solr/document?text='


  $scope.search = function(){
    $scope.currentPage=1;
      $http.get(thisSolrAppUrl+$scope.searchTxt+"&offset="+($scope.currentPage-1)*10).
           success(function(data) {
             if(data.length == 0){
               $scope.robotSearchError = "No record found";
               $scope.robotSearch = "";
             }else{
               $scope.robotSearchError = "";
                $scope.robotSearch = data.response;
                $scope.totalFound = data.numFound;
                for (var i = 0; i < $scope.robotSearch.length; i++) {
                  $scope.fileName  = $scope.robotSearch[i].attrfile[0].replace(/^.*[\\\/]/, '');
                  $scope.robotSearch[i].fileName = $scope.fileName;
                }
             }
              
    
              //return data;
            })
    };
 $scope.currentPage = 1;
  $scope.totalFound = 20
  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
     $http.get(thisSolrAppUrl+$scope.searchTxt+"&offset="+($scope.currentPage-1)*10).
           success(function(data) {
             if(data.length == 0){
               $scope.robotSearchError = "No record found";
               $scope.robotSearch = "";
             }else{
               $scope.robotSearchError = "";
                $scope.robotSearch = data.response;
                $scope.totalFound = data.numFound;
                for (var i = 0; i < $scope.robotSearch.length; i++) {
                  $scope.fileName  = $scope.robotSearch[i].attrfile[0].replace(/^.*[\\\/]/, '');
                  $scope.robotSearch[i].fileName = $scope.fileName;
                }
             }
              
    
              //return data;
            })
  };


  function uploadUsing$http(file) {
      var fd = new FormData();
      fd.append('file', file);
      sendUpload = true;

    file.upload = Upload.http({
      //url: 'https://angular-file-upload-cors-srv.appspot.com/upload' + $scope.getReqParams(),
      url: globalURL+'api/pistachio/upload?user=sridhar' + $scope.getReqParams(),
      method: 'POST',
      headers: {
        'Content-Type': undefined
      },
      data: fd
    });

    file.upload.then(function (response) {
      file.result = response.data;
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    });

    file.upload.progress(function (evt) {
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  }



  if (localStorage) {
    $scope.s3url = localStorage.getItem('s3url');
    $scope.AWSAccessKeyId = localStorage.getItem('AWSAccessKeyId');
    $scope.acl = localStorage.getItem('acl');
    $scope.success_action_redirect = localStorage.getItem('success_action_redirect');
    $scope.policy = localStorage.getItem('policy');
    $scope.signature = localStorage.getItem('signature');
  }

  $scope.success_action_redirect = $scope.success_action_redirect || window.location.protocol + '//' + window.location.host;
  $scope.jsonPolicy = $scope.jsonPolicy || '{\n  "expiration": "2020-01-01T00:00:00Z",\n  "conditions": [\n    {"bucket": "angular-file-upload"},\n    ["starts-with", "$key", ""],\n    {"acl": "private"},\n    ["starts-with", "$Content-Type", ""],\n    ["starts-with", "$filename", ""],\n    ["content-length-range", 0, 524288000]\n  ]\n}';
  $scope.acl = $scope.acl || 'private';




  $scope.confirm = function () {
    return confirm('Are you sure? Your local changes will be lost.');
  };

  $scope.getReqParams = function () {
    return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
    '&errorMessage=' + $scope.serverErrorMsg : '';
  };

  angular.element(window).bind('dragover', function (e) {
    e.preventDefault();
  });
  angular.element(window).bind('drop', function (e) {
    e.preventDefault();
  });

  $scope.modelOptionsObj = {};
  $scope.$watch('validate+dragOverClass+modelOptions+resize+resizeIf', function (v) {
    $scope.validateObj = eval('(function(){return ' + $scope.validate + ';})()');
    $scope.dragOverClassObj = eval('(function(){return ' + $scope.dragOverClass + ';})()');
    $scope.modelOptionsObj = eval('(function(){return ' + $scope.modelOptions + ';})()');
    $scope.resizeObj = eval('(function($file){return ' + $scope.resize + ';})()');
    $scope.resizeIfFn = eval('(function(){var fn = function($file, $width, $height){return ' + $scope.resizeIf + ';};return fn;})()');
  });

  $timeout(function () {
    $scope.capture = localStorage.getItem('capture' + version) || 'camera';
    $scope.pattern = localStorage.getItem('pattern' + version) || 'application/*,audio/*,video/*,image/*';
    $scope.acceptSelect = localStorage.getItem('acceptSelect' + version) || 'application/*,audio/*,video/*,image/*';
    $scope.modelOptions = localStorage.getItem('modelOptions' + version) || '{debounce:100}';
    $scope.dragOverClass = localStorage.getItem('dragOverClass' + version) || '{accept:\'dragover\', reject:\'dragover-err\', pattern:\'image/*,audio/*,video/*, text/*\'}';
    $scope.disabled = localStorage.getItem('disabled' + version) == 'true' || false;
    $scope.multiple = localStorage.getItem('multiple' + version) == 'true' || false;
    $scope.allowDir = localStorage.getItem('allowDir' + version) == 'true' || true;
    $scope.validate = localStorage.getItem('validate' + version) || '{size: {max: \'20MB\', min: \'10B\'}, height: {max: 12000}, width: {max: 12000}, duration: {max: \'5m\'}}';
    $scope.keep = localStorage.getItem('keep' + version) == 'true' || false;
    $scope.keepDistinct = localStorage.getItem('keepDistinct' + version) == 'true' || false;
    $scope.orientation = localStorage.getItem('orientation' + version) == 'true' || false;
    $scope.resize = localStorage.getItem('resize' + version) || "{width: 1000, height: 1000, centerCrop: true}";
    $scope.resizeIf = localStorage.getItem('resizeIf' + version) || "$width > 5000 || $height > 5000";
    $scope.dimensions = localStorage.getItem('dimensions' + version) || "$width < 12000 || $height < 12000";
    $scope.duration = localStorage.getItem('duration' + version) || "$duration < 10000";
    $scope.$watch('validate+capture+pattern+acceptSelect+disabled+capture+multiple+allowDir+keep+orientation+' +
      'keepDistinct+modelOptions+dragOverClass+resize+resizeIf', function () {
      localStorage.setItem('capture' + version, $scope.capture);
      localStorage.setItem('pattern' + version, $scope.pattern);
      localStorage.setItem('acceptSelect' + version, $scope.acceptSelect);
      localStorage.setItem('disabled' + version, $scope.disabled);
      localStorage.setItem('multiple' + version, $scope.multiple);
      localStorage.setItem('allowDir' + version, $scope.allowDir);
      localStorage.setItem('validate' + version, $scope.validate);
      localStorage.setItem('keep' + version, $scope.keep);
      localStorage.setItem('orientation' + version, $scope.orientation);
      localStorage.setItem('keepDistinct' + version, $scope.keepDistinct);
      localStorage.setItem('dragOverClass' + version, $scope.dragOverClass);
      localStorage.setItem('modelOptions' + version, $scope.modelOptions);
      localStorage.setItem('resize' + version, $scope.resize);
      localStorage.setItem('resizeIf' + version, $scope.resizeIf);
    });
  });


     /*   var fileArr = [];
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
*/
  


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("robot");
}]);