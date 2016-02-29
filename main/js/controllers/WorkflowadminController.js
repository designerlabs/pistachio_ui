
'use strict';

MetronicApp.controller('WorkflowadminController', ['$rootScope', '$scope', '$http', 'settings', 'authorities',  function($rootScope, $scope, $http, settings, authorities) {
	$scope.$on('$viewContentLoaded', function() {   


	    // initialize core components
	    Metronic.initAjax();
	    var getUser = localStorage.getItem("username");
		$http.get(globalURL+"workflow/request/")
		.success(function(response) {
			console.log(response);
			$scope.names = response.content;
			$scope.TotalCounts = response.totalElements;
			console.log($scope.TotalCounts);
	   });




		
		$scope.selectedList = {};

		$scope.go = function(data){

		var currentId = this.data.id;

/*		
		 if($scope.selectedList[data]) {
		    $scope.selectedPselectedListeeps[data] = false;
		  } else {
		    $scope.selectedList[data] = true;
		  }
*/

			$http.get(globalURL+"workflow/request/"+data)
			.success(function(k){
				console.log(k);
				$scope.details = k;
				$('.mt-comment').removeClass('activeComment');
				$('.'+currentId).closest('.mt-comment').addClass('activeComment');
			});



			$http.get(globalURL+"workflow/request/"+data+"/comments")
			.success(function(m){
				console.log(m);
				$scope.commentsDet = m;
			});

			$scope.reqid = data;

			
			
			//Mouse Active
			//$(data.target).addClass('activeComment');
		};

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
	$scope.currentTab = 'new.html';

	$scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
       /* $http.get(globalURL+"workflow/request/")
		.success(function(response) {
			console.log(response);
			$scope.names = response.content;
			console.log($scope.TotalCounts);
			console.log(response);
			
	   });*/
        
    }


    $scope.submitComment = function(){
	     	
		 	 $.ajax({
	              url: globalURL + "workflow/request/"+ $scope.reqid +"/comments",
	              contentType: "application/json",
	              type: 'POST',
	              dataType: "json",
	              data: JSON.stringify({
					"username":"Admin",
					"message":$scope.myMsgAdmin,
					"requestId":$scope.reqid,
					"displayName":"Admin" 					
	                }),
	          }).done(function (data) {
	          		$http.get(globalURL+"workflow/request/" + $scope.reqid + "/comments")
	 			.success(function(response) {
	 				console.log(response);
	 				$scope.commentsDet = response;
	 		   });
	          	  console.log("successfully send request form");
	          }); 	 	
	    }

    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }


	$scope.tabs = [{
	        	title: 'New',
	        	url: 'new.html',
	        	filter : 'new',

	   		},
	   		{
	        	title: 'In Progress',
	            url: 'inprogress.html',
	            filter : 'inprog'
	    	},
	    	{
	          	title: 'Close',
	            url: 'close.html',
	            filter : 'close'
    	}];

}]);

