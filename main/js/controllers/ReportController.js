'use strict';

MetronicApp.controller('EReportViewController', function($scope, $rootScope, $http  ) {

    var reportCategoryID = localStorage.getItem("reportCategoryID");
    $scope.title = localStorage.getItem('reportCategoryTitle')
    $scope.parent = localStorage.getItem('sideMenuValue')
    $scope.user = localStorage.getItem('username')
    var queryString = "query"
    $scope.params = {};
    $scope.$on('$viewContentLoaded', function() {
    	$scope.getReportPrivilege = localStorage.getItem('reportPrivilege');
        $scope.reportPrivilege = JSON.parse($scope.getReportPrivilege);
    	getReports();

    });


    $scope.adhocOrSql = function(file) {
    	if(file==undefined){
    	return "fa fa-edit"	
    	} 
    	else{
    		return "fa fa-file-text-o"
    	}
    }

    $scope.isItMyReport = function(user){
    	if(user == $scope.user) return true;
    	else return false;
    }

    $scope.downloadPDF = function(report) {
    	if($scope.active_report!= undefined && $scope.active_report.id != report.id){
    		$scope.params = {};
    	}
    	$scope.active_report = report;

    	if(report.reportFileName == undefined)
    	{

    	 window.location.href = globalURL + 'download/pdf/' + report.id;
    	}
    	else {
    		if(isParamRequired(report)) {
    			$scope.active_request = "pdf"
    			$('#mdlReportParam').modal('show');
    		}
    		else {
    		$scope.params.username = localStorage.getItem('username')
		    window.location.href = globalURL + 'jasperreport/pdf/' + report.id + '?' + JSON.stringify($scope.params);	
    		}
    		
            

    	}
    }

    $scope.download = function(report,type) {
    	if($scope.active_report!= undefined && $scope.active_report.id != report.id){
    		$scope.params = {};
    	}
    	$scope.active_report = report;

    	if(report.reportFileName == undefined)
    	{

    	 window.location.href = globalURL + 'download/'+type+'/' + report.id;
    	}
    	else {
    		if(isParamRequired(report)) {
    			$scope.active_request = type
    			$('#mdlReportParam').modal('show');
    		}
    		else {
	    		$scope.params.username = localStorage.getItem('username')
			    window.location.href = globalURL + 'jasperreport/'+type+'/' + report.id + '?' + JSON.stringify($scope.params);	
    		}
    		
            

    	}
    }

  $scope.saveClose = function() {

  	getReports();
  }


    
    $scope.continueRequest = function() {
    	$scope.submission = $scope.params
    	$scope.submission.username = localStorage.getItem('username')
    	if($scope.submission.branch !=undefined)
    		$scope.submission.branch= $scope.submission.branch.substr(0, $scope.submission.branch.indexOf(' - '))
    	console.log(globalURL + 'jasperreport/pdf/' + $scope.active_report.id + '?' + JSON.stringify($scope.submission))

    	if($scope.active_request == "pdf") {
    		$scope.active_request = ""
    		window.location.href = globalURL + 'jasperreport/pdf/' + $scope.active_report.id + '?' + JSON.stringify($scope.submission);	
    	}
    	else if($scope.active_request == "csv") {
    		$scope.active_request = ""
			window.location.href = globalURL + 'jasperreport/csv/' + $scope.active_report.id + '?' + JSON.stringify($scope.submission);	
    	}
    	else if($scope.active_request == "xls") {
    		$scope.active_request = ""
    		window.location.href = globalURL + 'jasperreport/xls/' + $scope.active_report.id + '?' + JSON.stringify($scope.submission);	
    	}

    }
     $scope.uploadFile = function(){
            var file = $scope.myFile;
            console.log('file is ' );
            console.dir(file);
            var uploadUrl = globalURL + "api/pistachio/upload?user=";
            fileUpload.uploadFileToUrl(file, uploadUrl);
    };

    $scope.view = function(report) {
    /*	if($scope.active_report!= undefined && $scope.active_report.id != report.id){
    		$scope.params = {};
    	}
    	report.parent =  $scope.parent
    	$scope.active_report = report;
    	if(isParamRequired(report)){
    		
    		$('#mdlReportParam').modal('show');
    		
    	}
    	else*/
    	report.parent =  $scope.parent
    
    	$scope.active_report = report;
    	
    	$("#mdlSaveReport").modal('show');
    	//debugger;
    	
    }

    function isParamRequired(report) {
    	if(report.applicant ||
    		report.applicationStatus ||
    		report.applicationStep ||
    		report.applicationType ||
    		report.branch ||
    		report.dtRange ||
    		report.dept ||
    		report.nationality ||
    		report.pasType ||
    		report.sector ||
    		report.sex ||
    		report.state ||
    		report.applicant ||
    		report.applicant) return true
    	else return false
    }

    $scope.showSQL = function (report) {
    	console.log(report)
    	$scope.active_query = report.query;
    	report.parent = $scope.parent;
    	$scope.active_report= report;

    	$("#mdlSaveReport").modal('show');
    }

    $scope.addReport = function() {
		var report= {};
		report.visiblity = false;
		report.parent = $scope.parent;
		report.category = reportCategoryID;
		$scope.active_report = report;
		$("#mdlSaveReport").modal('show');
    }

    $scope.closeSaveModal = function() {
    	$("#mdlSaveReport").modal('hide');
    }


    function getReports() {
    	$http.get(globalURL + queryString + "?" + categoryName + "=" + reportCategoryID).
            then(function(response) {
            	$scope.reports = response.data;
        });
     }


      
     

     



        $rootScope.settings.layout.pageSidebarClosed = true;
        $rootScope.skipTitle = true;
       // $rootScope.settings.layout.setTitle("queryeditor");
    
});
