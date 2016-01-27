'use strict';
var categoryId = undefined;
var categoryTitle, timer = undefined;


MetronicApp.controller('ReportCategoryController',  ['$rootScope', '$scope', '$http', 'settings', function($rootScope, $scope, $http, settings) {
    $scope.$on('$viewContentLoaded', function() {   

        // initialize core components
        Metronic.initAjax();
        var getUser = localStorage.getItem("token");
        var getSideMenu = localStorage.getItem("sideMenuValue");
    	//$http.get(globalURL+"auth/token?token="+getUser)
      $http.get(globalURL+'auth/subreports?token='+getUser+'&parent='+getSideMenu)
    	.success(function(response) {


            //$http({method: 'GET', url: 'json/json_price_1.json'}).success(function(data) {
                $scope.names = [];
                angular.forEach(response, function(value, key) {
                    $scope.names.push(value);
                });
                $scope.isVisible = function(name){
                    return true;// return false to hide this artist's albums
                };
            //});

           /* $scope.names= response;
            $scope.crudVal = [];
            angular.forEach(response, function(value, key) {
                $scope.crudVal.push(value.subReports);
            });
          
            $scope.isVisible = function(name){
                return true;// return false to hide this artist's albums
            };*/
            //console.log(response.subReports);
    		//$scope.names = response;
       });

            $scope.countDown = 1;    
            timer = setInterval(function(){
                $scope.countDown++;
                $scope.$apply();
                console.log($scope.countDown);
            }, 1000);  

    	$scope.go = function(data){
    		location.href="#/reports/e-reporting.html";
            categoryId = this.x.subReports.queryCategory;
            categoryTitle = this.x.subReports.queryCategoryName;
            $scope.category = categoryId;
            $scope.categoryTitle = categoryTitle;
            //$scope.message = sharedService.categoryId;
          	//$scope.myservice = categoryId; 
          	$("#reportCategoryID").val(categoryId);
          	//if(!localStorage.setItem("reportCategoryID"){
            localStorage.setItem("reportPrivilege", this.x.add);    
          	localStorage.setItem("reportCategoryID", categoryId);
            localStorage.setItem("reportCategoryTitle", categoryTitle);
          	//}	
          	
    	};


    	

        $scope.goes = function(data){
            location.href="#/report2.html";
            $http.get(globalURL+"query/report/"+data)
                .success(function(response) {
                $scope.namesB = response;
                console.log(response);
            });
            
            
        };


        $("#downloadBtn").click(function(event) {
            event.preventDefault(); //stop the browser from following
            window.location.href = globalURL+'download/csv/' + selectedQueryRunId;
        });
        
         $("#downloadBtnXLS").click(function(event) {
            event.preventDefault(); //stop the browser from following
            window.location.href = globalURL+'download/xls/' + selectedQueryRunId;
        });
        
         $("#downloadBtnPDF").click(function(event) {
            event.preventDefault(); //stop the browser from following
            window.location.href = globalURL+'download/pdf/' + selectedQueryRunId;
        });
        //console.log($scope);

        $(document).ajaxStop(function() {
            clearInterval(timer);
        });

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageSidebarClosed = false;
}]);
