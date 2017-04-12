'use strict';


   var ParameterModal = function ($scope, $uibModalInstance,$http,row) {
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
        $scope.row.author =$scope.user = localStorage.getItem('firstName')
        if($scope.row.id == undefined)
        {

           $http.post(globalURL + "/api/secured/pistachio/ereport/parameter/",JSON.stringify($scope.row))
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
          $http.put(globalURL + "/api/secured/pistachio/ereport/parameter/",$scope.row)
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
   }


MetronicApp.controller('DropDownController', function($rootScope, $scope, $http, NgTableParams,$sce,$uibModal) {
    $scope.$on('$viewContentLoaded', function() {   
        load();
    });

    function load(){
      console.log("reloading the page")
         $http.get(globalURL+"/api/secured/pistachio/ereport/parameter/")
            .success(function(response) {
                $scope.users = response;
                 $scope.records = new NgTableParams({ }, {counts: [], dataset: response});
            });
        

    }

    $scope.add =  function() {
      var row = {};

      var options = {
        templateUrl: 'myParameterModal.html',
        controller: ParameterModal,
        //size: 'sm',
        resolve: {
          row: function () {
            return row;
          }
        }
      };
      var modalInstance = $uibModal.open(options);
      modalInstance.result.then(function () {
         load()
      }, function () {
         load()
      });
   }

   $scope.edit =  function(row) {
      console.log(row)
      var options = {
        templateUrl: 'myParameterModal.html',
        controller: ParameterModal,
        //size: 'sm',
        resolve: {
          row: function () {
            return row;
          }
        }
      };
      var modalInstance = $uibModal.open(options);
      modalInstance.result.then(function () {
          //on close
          load()
      }, function () {
          //on exit
          load()
      });
   }

   $scope.delete =  function(row) {
           console.log(row)

            $http.delete(globalURL + "/api/secured/pistachio/ereport/parameter/"+row.id)
                .success(function (response) {
                  console.log("record deleted")
                  load()
                 })
                .error(function (response) {
                    //failed
                    console.log("delete failed")
          }); 
   }

    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("parameter");
});
