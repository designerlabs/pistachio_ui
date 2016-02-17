'use strict';
var getToken = undefined;
MetronicApp.controller('MyProfileController', function($rootScope, $scope, $http, $timeout) {
    $scope.noedit =true;
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components

  //  var getAuthority = localStorage.getItem("authorities");
  //   alert(getAuthority);
    getToken = localStorage.getItem("token");
  //   alert(getToken);
     $http.get(globalURL+'auth/user?token=' + getToken)
     .success(function(response) {
       $scope.firstName_1 = response.firstName;
       $scope.rank = response.rank;
       $scope.email = response.email;
       $scope.setProfileInfo(response);
       $scope.noedit =true;
      });

    });

    $scope.tabs = [{
            title: 'Profile',
            url: 'edit.profile.html'
        }, {
            title: 'Change Avatar',
            url: 'edit.avatar.html'
        }, {
            title: 'Change Password',
            url: 'change.password.html'
    }];

    $scope.currentTab = 'edit.profile.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    $scope.edit = function(){
      $scope.noedit = false;
       $http.get(globalURL+'auth/user?token=' + getToken)
      .success(function(response) {
        $('.edit-form [name=editname]').val(response.firstName);    
        $('.edit-form [name=editemail]').val(response.email);
        $('.edit-form [name=editlang]').val((response.lang == "en") ? "English" : "Bahasa Malayu");
       });

    };
    $scope.overview = function(){
       $scope.noedit =true;
      $http.get(globalURL+'auth/user?token=' + getToken)
     .success(function(response) {
       $scope.setProfileInfo(response);      
      });
    };

    $scope.setProfileInfo = function(info){
      $('#myprofileDsp-firstname').val(info.firstName);
      // $('#myprofileDsp-lastname').val(info.lastName);
      $('#myprofileDsp-email').val(info.email);
      $('#myprofileDsp-unit').val(info.unit);
      $('#myprofileDsp-rank').val(info.rank);
      // $('#myprofileDsp-state').val(info.state);
      $('#myprofileDsp-branch').val(info.branch);
      $('#myprofileDsp-dept').val(info.department);
    //  $('#myprofile-authority').val(getAuthority);
      var langval = (info.lang == "en") ? "English" : "Bahasa Malayu";
      $('#myprofileDsp-lang').val(langval);
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});
