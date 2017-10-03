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

var ModalInstanceCtrlSqoop = function ($scope, $uibModalInstance,$http,row,NgTableParams,param) {
    $scope.row = row;

    $http.get(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.table.dbId+"/metadata?table="+$scope.row.table.tableName)
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
     if(param !=undefined)
      $scope.param = param
     else
     {
        $scope.param = {};
        $scope.param.hiveOverwriteTable = true; 
        $scope.param.schedule = 3;
        $scope.param.schedule = 3;
        $scope.param.incremental = "FULL"
        $scope.param.type = "NA"
        //$scope.type = "NA"
     }
     
     $scope.$on('$viewContentLoaded', function() {

     });

     $scope.typeFilter = function (item) { 
      if(
        item.typeName == 'CHAR' ||
        item.typeName == 'NCHAR' ||
        item.typeName == 'VARCHAR' ||
        item.typeName == 'VARNCHAR' ||
        item.typeName == 'LONGVARCHAR' ||
        item.typeName == 'OTHER' ||
        item.typeName == 'CLOB' ||
        item.typeName == 'BLOB' ||
/*        item.typeName == 'LONGNVARCHAR' ||
        item.typeName == 'LONGNVARCHAR' ||*/
        item.typeName == 'LONGNVARCHAR'
        )
        return false
      else
        return true
      };
         
      $scope.save = function () {
        console.log("Going to update the row:")
        console.log($scope.row)
        if($scope.row.id == undefined)
        {
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
          });  
        }
        
        
      };

      $scope.refreshTable = function() {
            $http.get(globalURL + "/api/secured/pistachio/sqoop/database/table/"+$scope.row.table.tableDB)
                .success(function (response) {
                 $scope.row.jobs = response.jobs
                   $uibModalInstance.close();
                 })
                .error(function (response) {
                  $uibModalInstance.close();

                });
      }


      $scope.createJob = function() {
        $scope.param.tableName = $scope.row.table.tableName
        $scope.param.dbId = +$scope.row.table.dbId
        console.log("Run Create and Run Sqoop Job")
        console.log("Params :")
        console.log($scope.param)
        console.log($scope.row)
        console.log(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.table.dbId+"/job")
         $http.post(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.table.dbId+"/job",JSON.stringify(processParam($scope.param)))
                .success(function (response) {
                 $scope.refreshTable()
                   $uibModalInstance.close();
                 })
                .error(function (response) {
                  $uibModalInstance.close();

                }); 
      }

      $scope.createAndRunJob = function() {
        $scope.param.tableName = $scope.row.table.tableName
        $scope.param.dbId = +$scope.row.table.dbId
        console.log("Run Create and Run Sqoop Job")
        console.log("Params :")
        console.log($scope.param)
        console.log($scope.row)
        $scope.row.table.isRunning = true;
        $uibModalInstance.close();
         $http.post(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.table.dbId+"/saveNrun",JSON.stringify(processParam($scope.param)))
                .success(function (response) {
                    $scope.refreshTable()
                    $scope.row.table.tableCreated = true;
                    $scope.row.table.isRunning = undefined;
                 })
                .error(function (response) {
                 

                }); 
      }


      function processParam(param) {
        if(param.duplicateColumn == null || param.duplicateColumn == undefined) return param
        var sParam = param
        sParam.duplicateColumn = sParam.duplicateColumn.join()
        return(sParam)
      }

       $scope.runJob = function() {
        $scope.param.tableName = $scope.row.table.tableName
        $scope.param.dbId = +$scope.row.table.dbId
        console.log("Run Create and Run Sqoop Job")
        console.log("Params :")
        console.log($scope.param)
        console.log($scope.row)
         $scope.row.table.isRunning = true;
         $scope.apply();
        console.log(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.table.dbId+"/runJob")
         $http.post(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.table.dbId+"/job",JSON.stringify(processParam($scope.param)))
                .success(function (response) {
                  $uibModalInstance.close();
                  $scope.row.table.isRunning = undefined;
                 })
                .error(function (response) {
                  $scope.row.table.isRunning = undefined;
                }); 
      }

      $scope.runJobWithId = function() {
        $scope.param.tableName = $scope.row.table.tableName
        $scope.param.dbId = +$scope.row.table.dbId
        console.log("Run Create and Run Sqoop Job")
        console.log("Params :")
        console.log($scope.param)
        console.log($scope.row)
        
         $scope.apply();
        console.log(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.table.dbId+"/job")
         $http.post(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.table.dbId+"/job",JSON.stringify($scope.param))
                .success(function (response) {
                 })
                .error(function (response) {
                }); 
      }

      

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
          $http.get(globalURL + "/api/secured/pistachio/sqoop/database/"+$scope.row.table.dbId+"/sync?table="+$scope.row.table.tableName)
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
      $scope.currentDB = row;
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

   $scope.runWithId = function(row,group) {
      group.table.isRunning = true
       $http.get(globalURL + "/api/secured/pistachio/sqoop/database/job/run/"+row.id)
                .success(function (response) {
                  group.table.isRunning = undefined;
                     $scope.refreshTable(group)
                 })
                .error(function (response) {
                  
                });
   }

   $scope.deleteWithId = function(row,group) {
       $http.delete(globalURL + "/api/secured/pistachio/sqoop/database/job/"+row.id)
                .success(function (response) {
                    $scope.refreshTable(group)
                 })
                .error(function (response) {
                  
                });
   }

   $scope.refreshTable = function(group) {
            $http.get(globalURL + "/api/secured/pistachio/sqoop/database/table/"+group.table.tableDB)
                .success(function (response) {
                 group.jobs = response.jobs
                 group.history = response.history
                   
                 })
                .error(function (response) {
                  
                });
      }

  $scope.editWithId = function(row,group) {
       var options = {
        templateUrl: 'sqoopTable.html',
        controller: ModalInstanceCtrlSqoop,
        size: 'lg',
        resolve: {
          row: function () {
            return group;
          },
          param: function () {
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

   $scope.autoSync = function(row) {
    console.log(row)
    row.table.isRunning = true;
               $http.get(globalURL + "/api/secured/pistachio/sqoop/database/"+row.table.dbId+"/sync?table="+row.table.tableName)
                .success(function (response) {
                  $scope.refresh(row.table.dbId);
                  row.table.isRunning = undefined;
                  row.table.tableCreated = true;
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
          },
          param: function () {
            return undefined;
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
    $rootScope.settings.layout.setTitle("sqoop");
  

});
