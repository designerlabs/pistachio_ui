
'use strict';

MetronicApp.controller('WorkflowadminController', ['$rootScope', '$scope', '$http', 'settings', 'authorities',  function($rootScope, $scope, $http, settings, authorities) {
	$scope.$on('$viewContentLoaded', function() {   

	    // initialize core components
	    Metronic.initAjax();
	    var getUser = localStorage.getItem("username");
		$http.get(globalURL+"workflow/request/")
		.success(function(response) {
			console.log(response);
			$scope.names = response;
	   });


		/*$scope.go = function(data){
	        
	        $("#iframeContainer").show();
	        //$("#iframeContainer iframe").attr('ng-src',data);
	        $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.data);
			//location.href=data;
	        $("#iframeContainer iframe").attr('src',data);
	        var categoryId = this.$$watchers[2].last;
	        //$scope.message = sharedService.categoryId;
	      
		};

	    $("#iframeCloseBtn").click(function(){
	        $("#iframeContainer").hide();
	        $("#iframeContainer iframe").attr('src','');
	    });
	    console.log($scope);*/

	});
}]);

