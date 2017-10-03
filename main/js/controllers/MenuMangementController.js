'use strict';

MetronicApp.controller('MenuMgmtController', function($rootScope, $scope, $http,NgTableParams) {
    $scope.$on('$viewContentLoaded', function() {   
        load();

    });

    function load(){
      console.log("reloading the page")
         $http.get(globalURL+"api/secured/pistachio/menu/")
            .success(function(response) {
                 $scope.menus = response;
            });

        $http.get(globalURL+"api/secured/pistachio/menu/parents")
            .success(function(response) {
                 $scope.parents = response;
            });

        

    }

    $scope.add = function() {
      $scope.record = {};
      $('#menuAddModal').modal('show');
    }


    $scope.cancel = function(row, rowForm) {
      var originalRow = resetRow(row, rowForm);
      angular.extend(row, originalRow);
    }

    $scope.edit = function(row) {
      $scope.record = row
      $('#menuAddModal').modal('show');
    }

    $scope.delete = function(row) {
      console.log("going to delete row")
      console.log(row)
       $http.delete(globalURL + "api/secured/pistachio/menu/"+row.id)
            .success(function (data, status, headers, config) {
                load()
            })
    }


   $scope.save = function(row){

         $http.post(globalURL + "api/secured/pistachio/menu/", row)
            .success(function (data, status, headers, config) {
              $('#menuAddModal').modal('hide');
                load()
            })

    }

    $scope.updt = function(row){

         $http.put(globalURL + "api/secured/pistachio/menu/", row)
            .success(function (data, status, headers, config) {
                $('#menuAddModal').modal('hide');
                load()
            })

    }


    $scope.del = function(row) {
        $http.delete( globalURL+"user/"+row.id, function( data ) {
            load();
        });
    }


    
    function resetRow(row, rowForm){
      row.isEditing = false;
      rowForm.$setPristine();
    load()

  }

    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("menu");
});
