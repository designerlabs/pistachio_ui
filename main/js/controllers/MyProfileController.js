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
       $scope.noedit =true; 
       $scope.overall = true;
       $scope.editonly = false;  

       $scope.ProInfoVal = response;
       $scope.firstName_1 = response.firstName;
       $scope.rank = response.rank;
       $scope.email = response.email;
        
      //  $scope.setProfileInfo(response);
                 
       userId = response.id;
       $scope.showAudit(response.login);
       $scope.showReportTemplate(response.login);
      });

    $scope.showAudit = function(login){
      $http.get(globalURL+"api/pistachio/audit/"+login+"?start=0&rows=5")
            .success(function(response) {
              $scope.contents = response.content;
              });
    }

    $scope.showReportTemplate = function(login){
        $http.get(globalURL+"jasperreport/query/"+login+"?start=0&rows=8")
          .then(function(response) {
            $scope.rptcontent = response.data;
          });
     }

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

    $scope.downloadReport = function(id) {
        window.location.href = globalURL + 'download/jasper/' + id;
      }

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

        $("#messageView div").hide();
    }

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }

    $scope.edit = function(){
       $scope.noedit = false;
      //  $scope.FirstHide = false; 
       $scope.overall = false;
       $scope.editonly = true; 
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
              $("#messageView div span").html("Successfully Saved Profile informations");
              $("#messageView div").addClass('alert-success');
              $("#messageView div").show();
          });
    }

    $rootScope.OnChangePwd = function(){
      var oldPsw =   $('.PwdChangeform [name=CurrentPwd]').val();
      var newPsw =   $('.PwdChangeform [name=NewPwd]').val();

      $.get( globalURL + 'api/user/' + userId + '/change_password?opass='+ oldPsw +'&npass='+ newPsw, function( data ) {
        console.log("successfully Changed Password");

      }).done(function() {
        $("#messageView div span").html("Successfully Changed Password");
        $("#messageView div").removeClass("alert-danger");
        $("#messageView div").addClass('alert-success');
        $("#messageView div").show();
      }).fail(function(data) {
        $("#messageView div span").html(data.responseJSON.error);
        $("#messageView div").removeClass("alert-success");
        $("#messageView div").addClass('alert-danger');
        $("#messageView div").show();
    });
    }


    $scope.overview = function(){
       $scope.noedit =true;
       $scope.overall = true;
       $scope.editonly = false;
      $http.get(globalURL+'auth/user?token=' + getToken)
     .success(function(response) {
      //  $scope.setProfileInfo(response);
       $scope.ProInfoVal = response;
      });
    };

    $scope.setProfileInfo = function(info){
      // userId = infor.id;
      $('#myprofileDsp-firstname',$('.ProInfo')).val(info.firstName);
      $('#myprofileDsp-email',$('.ProInfo')).val(info.email);
      $('#myprofileDsp-unit',$('.ProInfo')).val(info.unit);
      $('#myprofileDsp-rank',$('.ProInfo')).val(info.rank);
      // $('#myprofileDsp-state').val(info.state);
      $('#myprofileDsp-branch',$('.ProInfo')).val(info.branch);
      $('#myprofileDsp-dept'),$('.ProInfo').val(info.department);
      //  $('#myprofile-authority').val(getAuthority);
      var langval = (info.lang == "en") ? "English" : "Bahasa Malayu";
      $('#myprofileDsp-lang',$('.ProInfo')).val(langval);
    };

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.skipTitle = false;
    $rootScope.settings.layout.setTitle("profile");
    });
});
