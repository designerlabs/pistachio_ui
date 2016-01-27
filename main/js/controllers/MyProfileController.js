'use strict';

MetronicApp.controller('MyProfileController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        Metronic.initAjax(); // initialize core components      

 		var getUser = localStorage.getItem("username");
 		var getAuthority = localStorage.getItem("authorities");
 		var getLangDB = localStorage.getItem("langDB");

        $('#myprofile-name').val(getUser);
        $('#myprofile-authority').val(getAuthority);
        $('#myprofile-lang').val( (getLangDB == "en") ? "English" : "Bahasa Malayu");

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});