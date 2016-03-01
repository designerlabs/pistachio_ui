
'use strict';

MetronicApp.controller('WorkflowadminController', ['$rootScope', '$scope', '$http', 'settings', 'authorities',  function($rootScope, $scope, $http, settings, authorities) {
	$scope.$on('$viewContentLoaded', function() {   


	    // initialize core components
	    Metronic.initAjax();
	    var getUser = localStorage.getItem("username");
		$http.get(globalURL+"workflow/request/?start=0&rows=2")
		.success(function(response) {
			console.log(response);
			$scope.names = response.content;
			$scope.TotalCounts = response.totalElements;
			console.log($scope.TotalCounts);
	   });

		$scope.start=0;


		$scope.showComments = function(data) {

			$http.get(globalURL+"workflow/request/"+data+"/comments")
			.success(function(m){
				if(m.length === 0){
					//$scope.commentsDet;
					$scope.commentsDet = false;	
					$scope.commentsDetFalse = true;
				}else{
					$scope.commentsDet = true;
					$scope.commentsDetFalse = false;
					$scope.commentsDet = m;	
					console.log( "comments" +m);
				}
				
				
			});
		}

		
		$scope.selectedList = {};

		$scope.go = function(data){
			
		var currentId = this.data.id;

			$http.get(globalURL+"workflow/request/"+data)
			.success(function(k){
				console.log(k);
				$scope.details = k;
				$('.mt-comment').removeClass('activeComment');
				$('.'+currentId).addClass('activeComment');
			});


			$scope.showComments(data);
			

			$scope.reqid = data;

	};

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

    var clicks = 2;
    $scope.newCount = clicks;

    $scope.next = function() {
      $(".previousBtn").prop( "disabled", false);
       clicks += 2;
      $scope.start = $scope.start + 1;
      $scope.showApplications();
      $scope.newCount = clicks;
      var listCount = 2;

    }

    $scope.previous = function() {
      clicks -= 2;
      $scope.start = $scope.start - 1;
      if(clicks == 2){
        $(".previousBtn").prop( "disabled", true);
      }else{
         $(".previousBtn").prop( "disabled", false);
      }
      if($scope.start < 0)
        $scope.start = 0;
        $scope.newCount = clicks;
        $scope.showApplications();
    }


    $scope.showApplications = function() {
    	var query = "";
	 	query = globalURL+"workflow/request/?start="+$scope.start+"&rows=2";
	 	$http.get(query)
		.success(function(response) {
			//debugger;
			$scope.applicationsFound = response.numberOfElements;
			console.log(response);
			$scope.names = response.content;
			$scope.TotalCounts = response.totalElements;
			console.log($scope.TotalCounts);
			if($scope.applicationsFound <= 1){
				$scope.newCount = $scope.applicationsFound;
		  		$(".nextBtn").prop("disabled", true);
			}else{
		  		$scope.newCount = clicks;
		  		$(".nextBtn").prop("disabled", false);
			}
	   });
	};


    $scope.submitComment = function(){
	 	 $.ajax({
	          url: globalURL + "workflow/request/"+ $scope.reqid +"/comments",
	          contentType: "application/json",
	          type: 'POST',
	          dataType: "json",
	          data: JSON.stringify({
				"username":"Admin",
				"message":$scope.myMsgAdmin.text,
				"requestId":$scope.reqid,
				"displayName":"Admin" 					
	            }),
	      }).done(function (data) {
	      		$scope.commentsDetFalse = false;
	      		$http.get(globalURL+"workflow/request/" + $scope.reqid + "/comments")
					.success(function(response) {
						console.log(response);
						$scope.commentsDet = response;
						//$scope.go(response);
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

