'use strict';

var ParamterController = function ($scope,$rootScope,$http,Upload) {
    

   $scope.$on('$viewContentLoaded', function() {

        
    });

   $scope.$watch('report', function(newValue, oldValue) {
        console.log("report")
       
    });

    $scope.createCalenderCtrl = function() {

            $("#reportrange").daterangepicker({
                   
                   startDate: moment(),
                    endDate: moment(),
                    "alwaysShowCalendars": false                    
                 },
                  function(startdt, enddt) {
                     $("#reportrange span").html(startdt.format("MMM DD, YYYY") + " - " + enddt.format("MMM DD, YYYY"))
                     $scope.params.fromDate=startdt;
                     $scope.params.toDate =enddt;
                     console.log($scope.params)
                 });
                 //for initial date range details. 
                //  $("#reportrange span").html(moment().subtract(29,"days").format("MMM DD YYYY") + " - " + moment().format("MMM DD YYYY"));

            
        }

        $scope.initUser = function() {
          $.getJSON(globalURL + "api/report/reference/myuser", function (json) {
                     $.each(json, function(k, v){
                        $("#temp-myuser").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
        }

        $scope.initBranch = function() {
         /* if($scope.branches == undefined) {
            $scope.showLoading = true;
            $http.get(globalURL + "api/report/reference/branch").
                then(function(response) {
                  $scope.branches = response.data;
                  $scope.showLoading = false;
            });
          
          }*/
            $.getJSON(globalURL + "api/report/reference/branch", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-branch").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
            
           }

           $scope.initMyUser = function() {
              $.getJSON(globalURL + "api/report/reference/myuser", function (json) {
                   $.each(json, function(k, v){
                      $("#temp-myuser").append('<option value='+k+'>'+v+'</option>');
                   });
               });

           }

          $scope.initState = function() {
              $.getJSON(globalURL + "api/report/reference/state", function (json) { //api/user/reference/
                 $.each(json, function(k, v){
                    $("#temp-state").append('<option value='+k+'>'+v+'</option>');
                 });
             });
          }

          $scope.initNationality = function() {
            $.getJSON(globalURL + "api/report/reference/nationality", function (json) {
                 $.each(json, function(k, v){
                     $("#temp-nationality").append('<option value='+k+'>'+v+'</option>');
                 });
             });
          }
          $scope.initPasType = function() {
                 $.getJSON(globalURL + "api/report/reference/pastype", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-pastype").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initDept = function() {
                 $.getJSON(globalURL + "api/user/reference/dept", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-dept").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initApplicant = function() {
                 $.getJSON(globalURL + "api/report/reference/applicant", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicant").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initApplicationStatus = function() {
                 $.getJSON(globalURL + "api/report/reference/applicationstatus", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicationStatus").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initApplicationStep = function() {
                 $.getJSON(globalURL + "api/report/reference/applicationstep", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicationStep").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initApplicationType = function() {
                 $.getJSON(globalURL + "api/report/reference/applicationtype", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicationType").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initCity = function() {

                 $.getJSON(globalURL + "api/report/reference/city", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-city").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initSector = function() {
                  $.getJSON(globalURL + "api/report/reference/sector", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-sector").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initSex = function() {
                    $.getJSON(globalURL + "api/report/reference/sex", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-sex").append('<option value='+k+'>'+v+'</option>');
                     });
                 });
          }
    
   
};

MetronicApp.directive('params', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: ParamterController, 
        scope: {
          report: '=',
          params: '=',
          loading: '='

        },
        templateUrl: 'views/sqleditor/params.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});