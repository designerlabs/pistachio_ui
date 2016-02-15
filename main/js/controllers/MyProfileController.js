'use strict';

MetronicApp.controller('MyProfileController', function($rootScope, $scope, $http, $timeout) {
    $scope.noedit =true;
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components

 	//	var getAuthority = localStorage.getItem("authorities");
  //   alert(getAuthority);
 		var getToken = localStorage.getItem("token");
  //   alert(getToken);
     $http.get(globalURL+'auth/user?token=' + getToken)
     .success(function(response) {
       $scope.firstName_1 = response.firstName;
       $scope.rank = response.rank;
       $scope.email = response.email;
      // alert(response.firstName)
       $scope.setProfileInfo(response);
       $scope.noedit =true;
      })

      ;

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
    };
    $scope.overview = function(){
      $scope.noedit = true;
    };

    $scope.setProfileInfo = function(info){
      $('#myprofile-firstname').val(info.firstName);
      $('#myprofile-lastname').val(info.lastName);
      $('#myprofile-email').val(info.email);
      $('#myprofile-unit').val(info.unit);
      $('#myprofile-rank').val(info.rank);
      $('#myprofile-state').val('not available');
      $('#myprofile-branch').val(info.branch);
      $('#myprofile-dept').val(info.department);
    //  $('#myprofile-authority').val(getAuthority);
        $('#myprofile-lang').val((info.lang == "en") ? "English" : "Bahasa Malayu");
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});
