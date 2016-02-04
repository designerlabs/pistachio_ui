'use strict';

MetronicApp.controller('MyProfileController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        Metronic.initAjax(); // initialize core components      
 		
 		var getAuthority = localStorage.getItem("authorities"); 		
 		var getToken = localStorage.getItem("token");

		$.ajax({
		        url: globalURL+'auth/user?token=' + getToken,
                type: 'GET',
            }).done(function(data) {
            	setProfileInfo(data);

        });

		function setProfileInfo(info){
		    $('#myprofile-firstname').val(info.firstName);
		    $('#myprofile-lastname').val(info.lastName);
		    $('#myprofile-email').val(info.email);
		    $('#myprofile-unit').val(info.unit);
		    $('#myprofile-rank').val(info.rank);
		    $('#myprofile-state').val('not available');
		    $('#myprofile-branch').val(info.branch);
		    $('#myprofile-dept').val(info.department);
		    $('#myprofile-authority').val(getAuthority);        
	        $('#myprofile-lang').val((info.lang == "en") ? "English" : "Bahasa Malayu");
		}       

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = true;
});