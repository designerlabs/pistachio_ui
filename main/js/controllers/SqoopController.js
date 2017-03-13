'use strict';
   var ModalInstanceCtrl = function ($scope, $uibModalInstance,$http,row) {
    $scope.row = row;
    if(row.id == undefined)
      $scope.saveOrUpdate = "Save"
    else
      $scope.saveOrUpdate = "Update"

    $scope.checkForm = function(form){
      //.$invalid && sqoopForm.$pristine
      if(form.$invalid || !form.$dirty) return true;
      return false;
    }
      $scope.save = function () {
        console.log("Going to update the row:")
        console.log($scope.row)
        if($scope.row.id == undefined)
        {
          debugger;
           $http.post(globalURL + "/api/secured/pistachio/sqoop/database",JSON.stringify($scope.row))
                .success(function (response) {
                  $uibModalInstance.close();
                 })
                .error(function (response) {
                  alert = {};
                  alert.msg = "Failed, "+response.error
                  alert.type = "danger"
                  $scope.alert = alert
                });  
        }
        else
        {
          $http.put(globalURL + "/api/secured/pistachio/sqoop/database",$scope.row)
                .success(function (response) {
                  if(row.id == undefined)
                    row.id = response.data.id;
                  $uibModalInstance.close();
                 })
                .error(function (response) {
                  $uibModalInstance.close();
                    //debugger;
          });  
        }
        
        
      };

      

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

       $scope.view = function(data)  {
        
       }

       $scope.back = function(data) {
       }

       $scope.check = function() {
          alert = {};
          alert.msg = "Checking DB..."
          alert.type = "info"
          $scope.alert = alert
          $http.post(globalURL + "/api/secured/pistachio/sqoop/database/check/",$scope.row)
                .success(function (response) {
                  $scope.alert.msg = "Success, Valid DB"
                  $scope.alert.type = "success"
                 })
                .error(function (response) {
                   $scope.alert.msg = "Failed, "+response.error
                   $scope.alert.type = "danger"
        });
       }


   }

var ModalInstanceCtrlSqoop = function ($scope, $uibModalInstance,$http,row,NgTableParams) {
    $scope.row = row;
    $http.get(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.dbId+"/metadata?table="+$scope.row.tableName)
                .success(function (response) {
                    $scope.columns = response;
                    $scope.columnMeta = new NgTableParams({ }, {counts: [], dataset:  $scope.columns});
                 })
                .error(function (response) {
                  alert = {};
                  alert.msg = "Failed, "+response.error
                  alert.type = "danger"
                  $scope.alert = alert
                }); 
     $scope.param = {};
     $scope.param.hiveOverwriteTable = true;
     $scope.$on('$viewContentLoaded', function() {

     });

     $scope.typeFilter = function (item) { 
          return item.typeName === 'INT' ||
           item.typeName === 'BIGINT' ||
           item.typeName === 'DATE' ||
           item.typeName === 'DOUBLE' ||
           item.typeName === 'FLOAT' ||
            item.typeName === 'TIMESTAMP'; 
      };
         
      $scope.save = function () {
        console.log("Going to update the row:")
        console.log($scope.row)
        if($scope.row.id == undefined)
        {
          debugger;
           $http.post(globalURL + "/api/secured/pistachio/sqoop/database",JSON.stringify($scope.row))
                .success(function (response) {
                  $uibModalInstance.close();
                 })
                .error(function (response) {
                  alert = {};
                  alert.msg = "Failed, "+response.error
                  alert.type = "danger"
                  $scope.alert = alert
                });  
        }
        else
        {
          $http.put(globalURL + "/api/secured/pistachio/sqoop/database",$scope.row)
                .success(function (response) {
                  if(row.id == undefined)
                    row.id = response.data.id;
                  $uibModalInstance.close();
                 })
                .error(function (response) {
                  $uibModalInstance.close();
                    //debugger;
          });  
        }
        
        
      };

      

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

       $scope.view = function(data)  {
        
       }

       $scope.back = function(data) {
       }

       $scope.check = function() {
          alert = {};
          alert.msg = "Checking DB..."
          alert.type = "info"
          $scope.alert = alert
          $http.get(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.dbId+"/sync?table="+$scope.row.tableName)
                .success(function (response) {
                  $scope.alert.msg = "Success, Valid DB"
                  $scope.alert.type = "success"
                 })
                .error(function (response) {
                   $scope.alert.msg = "Failed, "+response.error
                   $scope.alert.type = "danger"
        });
       }


   }


MetronicApp.controller('SqoopController', function($rootScope, $scope, $http,NgTableParams,$uibModal) {
    $scope.$on('$viewContentLoaded', function() {
      $scope.sqoopJobs = 0;
      $scope.go();
     });


    $scope.go = function(){

       $http.get(globalURL + "/api/secured/pistachio/sqoop/database")
                .success(function (response) {
                  $scope.dbList = response
                  $scope.records = new NgTableParams({ }, {counts: [], dataset: $scope.dbList});
                 })
                .error(function (response) {
                    //debugger;
        });

    };

     $scope.dynamicPopover = {
      content: 'Hello, World!',
      templateUrl: 'myPopoverTemplate.html',
      title: 'Title'
    };


   $scope.addDB =  function() {
      var row = {};

      var options = {
        templateUrl: 'myModalContent.html',
        controller: ModalInstanceCtrl,
        size: 'lg',
        resolve: {
          row: function () {
            return row;
          }
        }
      };
      var modalInstance = $uibModal.open(options);
      modalInstance.result.then(function () {
        $scope.go();
      }, function () {
       $scope.go();
      });
   }

   $scope.edit = function(row) {
      var options = {
        templateUrl: 'myModalContent.html',
        controller: ModalInstanceCtrl,
        size: 'lg',
        resolve: {
          row: function () {
            return row;
          }
        }
      };
      var modalInstance = $uibModal.open(options);
      modalInstance.result.then(function () {
        $scope.show_profile = false;
      }, function () {
       $scope.show_profile = false;
      });
   }

   $scope.delete = function(id) {
        $http.delete(globalURL + "/api/secured/pistachio/sqoop/database/"+id)
                .success(function (response) {
                  $scope.go();
                 })
                .error(function (response) {
                  
                });
      }

    $scope.view = function(row) {
      $scope.currentPage = 1

       $http.get(globalURL + "api/secured/pistachio/sqoop/database/"+row.id+"/table")
                .success(function (response) {
                    $scope.dbTables = response;
                    $scope.tables = new NgTableParams({ }, {counts: [], dataset: response});
                    $scope.showTables = true;

                 })
                .error(function (response) {
                  
                });

   }
   $scope.refresh = function(id) {
      $scope.currentPage = 1

       $http.get(globalURL + "api/secured/pistachio/sqoop/database/"+id+"/table")
                .success(function (response) {
                    $scope.dbTables = response;
                    $scope.tables = new NgTableParams({ }, {counts: [], dataset: response});
                    $scope.showTables = true;

                 })
                .error(function (response) {
                  
                });

   }

   $scope.autoSync = function(row) {
    console.log(row)
    $scope.sqoopJobs = $scope.sqoopJobs +1;
           $http.get(globalURL + "/api/secured/pistachio/sqoop/database/"+row.dbId+"/sync?table="+row.tableName)
                .success(function (response) {
                  $scope.refresh(row.dbId);
                  $scope.sqoopJobs = $scope.sqoopJobs -1;
                 })
                .error(function (response) {
        });
   }

   $scope.sync = function(row) {
      var options = {
        templateUrl: 'sqoopTable.html',
        controller: ModalInstanceCtrlSqoop,
        size: 'lg',
        resolve: {
          row: function () {
            return row;
          }
        }
      };
      var modalInstance = $uibModal.open(options);
      modalInstance.result.then(function () {
        $scope.show_profile = false;
      }, function () {
       $scope.show_profile = false;
      });

   }

    $scope.showTables = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("audit");
  

});
