
'use strict';

MetronicApp.controller('WorkflowadminController', ['$rootScope', '$scope', '$http', 'settings', 'authorities',  function($rootScope, $scope, $http, settings, authorities) {
	$scope.$on('$viewContentLoaded', function() {   

		

	    // initialize core components
	    Metronic.initAjax();

	 	fn_LoadAllRequest();
	});


	$scope.getCounts = function(){

    	$http.get(globalURL+"workflow/request/?filter=new").success(function(response) {
    		$scope.getCountNew = response.totalElements;
        });

    	$http.get(globalURL+"workflow/request/?filter=prog").success(function(response) {
    		$scope.getCountProg = response.totalElements;
        });

    	$http.get(globalURL+"workflow/request/?filter=failed").success(function(response) {
    		$scope.getCountFailed = response.totalElements;
        });
        $http.get(globalURL+"workflow/request/?filter=completed").success(function(response) {
    		$scope.getCountCompleted = response.totalElements;
        });
	};

	$scope.opt = 'INPROGRESS'; // for submit button
	var getToken = localStorage.getItem("token");
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
	};



	//Add and update Request Form submission
	$scope.onReqSubmit = function (opt) {
		console.log($scope.details);
	 	formInputValidation("#frmRequest");
	 	var reportName = $('#userReqTitle').val();
	 	var description = $('#userReqDes').val();
	 	var priority = $('#userPriority option:selected').val();
	 	if(opt == "NEW"){
	 	 fn_SendRequest($scope.details.reportName, $scope.details.description, $scope.details.priority, $scope.details.id, 'INPROGRESS', $scope.details.username, $scope.details.displayName);
      	}else if(opt=="INPROGRESS"){
      	 fn_SendRequest($scope.details.reportName, $scope.details.description, $scope.details.priority, $scope.details.id, 'COMPLETED', $scope.details.username, $scope.details.displayName);
      	}else if(opt=="COMPLETED"){
      	 fn_SendRequest($scope.details.reportName, $scope.details.description, $scope.details.priority, $scope.details.id, 'SUCCESS', $scope.details.username, $scope.details.displayName);
      	}else if(opt=="FAILED"){
      	 fn_SendRequest($scope.details.reportName, $scope.details.description, $scope.details.priority, $scope.details.id, 'FAILED', $scope.details.username, $scope.details.displayName);
      	}
	}


	function fn_LoadAllRequest(){
		$http.get(globalURL+"workflow/request/?token=" + getToken + "&start="+ $scope.start +"&rows=5&filter="+$scope.currentTabName)
		.success(function(response) {
			console.log(response);
			$scope.getCounts();
			$scope.names = response.content;
			$scope.newReq = response.numberOfElements;
		 	//$scope.TotalCounts = response.totalElements;
		 	$scope.first = response.first;
		 	$scope.last = response.last;
	   });
	}


	function fn_SendRequest(title,desc,priority,reqid, status, userName, dspName){
	 	 $.ajax({
              url: globalURL + 'workflow/request/',
              contentType: "application/json",
              type: "POST",
              dataType: "json",
              data: JSON.stringify({
              	"id": reqid,
				"description":desc,
				"email":"",
				"status":status,
				"admin":"NA",
				"adminEmail":"NA",
				"createdDate":null,
				"lastModifiedDate":null,
				"user":userName,
				"displayName": dspName,
				"reportName":title,
                "priority": priority}),
          }).success(function (data) {
              console.log("successfully send request form");
              $("#messageView div span").html("Successfully Submitted Your Request");            
              $("#messageView div").addClass('alert-success');
              $("#messageView div").show();
              fn_LoadAllRequest();
              $('#userReqTitle').val("");
              $('#userReqDes').val("");
              $('#userPriority option:selected').text("Normal");
          }); 

	}

	
	$scope.selectedList = {};

	$scope.go = function(data){
		
		    var currentId = this.data;
			fn_ViewRequestAdmin(data);
			// $scope.showComments(data);				
			$scope.reqid = data;
			fn_PostComments(data);
	};

	function fn_ViewRequestAdmin(Reqid){
		$http.get(globalURL+"workflow/request/"+Reqid)
				.success(function(k){
					console.log(k);
					$scope.details = k;
					$('.mt-comment').removeClass('activeComment');
					$('.'+Reqid).addClass('activeComment');
				});		
	}

	$scope.currentTab = 'new.html';
	$scope.currentTabName = 'new';
	$scope.onClickTab = function (tab) {
	   $scope.getCounts();
	   $scope.start = 0;
       $scope.currentTabName = tab.filter;
        $http.get(globalURL+"workflow/request/?start="+$scope.start+"&rows=5&filter="+tab.filter)
		.success(function(response) {
			console.log(response);
			$scope.names = response.content;
			$scope.newReq = response.numberOfElements;
		 	$scope.first = response.first;
		 	$scope.last = response.last;
			console.log(response);
			
	   });
    }

    $scope.next = function() {
      $scope.start = $scope.start + 1;
      $scope.showApplications();
    }

    $scope.previous = function() {
      $scope.start = $scope.start - 1;
      if($scope.start < 0)
        $scope.start = 0;
    	$scope.showApplications();
    }


    $scope.showApplications = function() {

    	
    	var query = "";
    	query = globalURL+"workflow/request/?start="+$scope.start+"&rows=5&filter="+$scope.currentTabName;
	 	$http.get(query)
		.success(function(response) {
			//debugger;
			$scope.applicationsFound = response.numberOfElements;
			console.log(response);
			$scope.names = response.content;
			$scope.first = response.first; //Show or hide previous 
		 	$scope.last = response.last; //Show or hide next 
			
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
	      }).success(function (data) {
	      		$scope.commentsDetFalse = false;
	      		$http.get(globalURL+"workflow/request/" + $scope.reqid + "/comments")
					.success(function(response) {
						console.log(response);
						$scope.commentsDet = response;
						//$scope.go(response);
						$scope.myMsgAdmin.text = "";
			   		});
	      	  console.log("successfully send request form");
	      }); 	 	
	}

	function fn_PostComments(Reqid){
		$http.get(globalURL+"workflow/request/" + Reqid + "/comments")
			.success(function(response) {
				if(response.length === 0){
					//$scope.commentsDet;
					$scope.commentsDet = false;	
					$scope.commentsDetFalse = true;
				}else{
					$scope.commentsDet = true;
					$scope.commentsDetFalse = false;
			
					$scope.commentsDet = response;
					$('#messageVal').val("");
				}
				
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
	            filter : 'prog'
	    	},
	    	{
	        	title: 'Completed',
	            url: 'completed.html',
	            filter : 'completed'
	    	},
	    	{
	          	title: 'Failed',
	            url: 'close.html',
	            filter : 'failed'
    	}];

}]);

