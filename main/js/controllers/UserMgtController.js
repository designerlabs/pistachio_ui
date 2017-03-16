'use strict';





MetronicApp.controller('UserMgtController', function($rootScope, $scope, $http, NgTableParams,$sce) {
    $scope.$on('$viewContentLoaded', function() {   
        load();
    });

    function load(){
      console.log("reloading the page")
         $http.get(globalURL+"user?user="+getUser)
            .success(function(response) {
                $scope.users = response;
                 $scope.records = new NgTableParams({ }, {counts: [], dataset: $scope.users});
                 $scope.originalRow = angular.copy($scope.users)
            });
        

    }

        var getUser = localStorage.getItem("username");
           



       $http.get(globalURL+"api/role")
         .success(function(responseRole) {
             $scope.roles = responseRole;
        });

        $scope.go = function(data){
            location.href=data;
            var categoryId = this.$$watchers[2].last;
        };

        $scope.cancel = function(row, rowForm) {
          var originalRow = resetRow(row, rowForm);
          angular.extend(row, originalRow);
        }


    $scope.actDeAct = function(row,stat) {
        console.log("Activating/DeActivating User with Id"+row.id)
       /* $http.get( globalURL+"user/"+row.id+"?activate="+stat, function( data ) {
            load();
        });*/
/*           $http.get(globalURL+"user/"+row.id+"?activate="+stat)
             .success(function(responseRole) {
                 
            });*/

            $.get(globalURL+"user/"+row.id+"?activate="+stat, function( data ) {
                load();
            });

        
    }

    $scope.save = function(row,rowForm){
        var authority = row.authorities;
        var roles = [];
        debugger;
        for(var i =0;i<authority.length;i++) {
            var obj ={}
            obj.name = authority[i].name
            obj.value =authority[i].value
            roles.push(obj)
        }
         $http.put(globalURL + "user/"+row.id+"/role", JSON.stringify(roles))
            .success(function (data, status, headers, config) {
                load()
            })

    }

    $scope.del = function(row) {
        $http.delete( globalURL+"user/"+row.id, function( data ) {
            load();
        });
    }

$scope.showPop = false;
    $scope.closePop = function(row){
       $scope.showPop =false;
    }
    
    function resetRow(row, rowForm){
      row.isEditing = false;
      rowForm.$setPristine();
    load()

  }

  $scope.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: 'myPopoverTemplate.html',
    title: 'Title'
  };



    $rootScope.settings.layout.pageSidebarClosed = false;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("usermgt");
});
