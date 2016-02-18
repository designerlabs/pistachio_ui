'use strict';
var getToken, userId = undefined;
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
        $http.get(globalURL+"api/pistachio/audit/"+response.login+"?start=0&rows=5")
         .success(function(response) {
           $scope.contents = response.content;
          });
       $scope.setProfileInfo(response);
       $scope.noedit =true;
       userId = response.id;
      });

    });

    $scope.tabs = [{
            title: 'Profile',
            url: 'edit.profile.html'
        // }, {
        //     title: 'Change Avatar',
        //     url: 'edit.avatar.html'
        }, {
            title: 'Change Password',
            url: 'change.password.html'
    }];

    $scope.currentTab = 'edit.profile.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
        if(tab.title == 'Profile'){
           $http.get(globalURL+'auth/user?token=' + getToken)
          .success(function(response) {
            $('.edit-form [name=editname]').val(response.firstName);    
            $('.edit-form [name=editemail]').val(response.email);
            $('.edit-form #userselLang').val((response.lang == "en") ? "en" : "my");
           });
        }
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
        $('.edit-form #userselLang').val((response.lang == "en") ? "en" : "my");
       });
    };
    $rootScope.editSaveChanges = function(){
      var firstnameValue = $('.edit-form input[name=editname]').val();      
      var emailValue = $('.edit-form input[name=editemail]').val();
      var userlangValue = $('.edit-form #userselLang').val(); 
      $.ajax({
              url: globalURL + 'user',
              contentType: "application/json",
              type: 'PUT',
              dataType: "json",
              data: JSON.stringify({
                  "firstName": firstnameValue,
                  "lastName": "null",
                  "email": emailValue,
                  "unit": "null",
                  "branch": "null",
                  "rank": "null",
                  "department": "null",
                  "login": "null",
                  "password": "null",
                  "lang": userlangValue,
                  "id": userId           
              }),
          }).done(function (data) {
              console.log("successfully Saved Profile informations");
              // $("#Profile.errorinfo").html("successfully Saved Profile informations");
              // $("#Profile.errorinfo").show();
          });       
    }

    $rootScope.OnChangePwd = function(){
      var oldPsw =   $('.PwdChangeform [name=CurrentPwd]').val();
      var newPsw =   $('.PwdChangeform [name=NewPwd]').val();

      $.get( globalURL + 'api/user/' + userId + '/change_password?opass='+ oldPsw +'&npass='+ newPsw, function( data ) {
        console.log("successfully Changed Password");
      });
    }


    $scope.overview = function(){
       $scope.noedit =true;
      $http.get(globalURL+'auth/user?token=' + getToken)
     .success(function(response) {
       $scope.setProfileInfo(response);      
      });
    };

    $scope.setProfileInfo = function(info){
      // userId = infor.id;
      $('#myprofileDsp-firstname').val('info.firstName');
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
