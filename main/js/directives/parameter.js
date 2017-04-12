'use strict';

MetronicApp.directive("select2", function($timeout, $parse) {
  return {
    restrict: 'AC',
    require: 'ngModel',
    link: function(scope, element, attrs) {
      console.log(attrs);
      $timeout(function() {
        element.select2({ width: '100%' });
        element.select2Initialized = true;
      });
    }
  };
});

var ParamterController = function ($scope,$rootScope,$http,Upload) {
    
   $scope.nparams = [];
   $scope.inputCounter = 0;
   $scope.$on('$viewContentLoaded', function() {

        
    });




   $scope.dateOptions = {
    dateDisabled: false,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };



   

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


        $scope.initDropDown = function(parameter) {
          console.log(parameter);
          $.getJSON(globalURL + "api/secured/pistachio/ereport/parameter/"+parameter, function (json) {
                     $.each(json, function(k, v){
                        $("#"+parameter).append('<option value='+v+'>'+v+'</option>');
                     });
                 });
           $("#"+parameter).select2({
            placeholder: 'This is my placeholder',
            allowClear: true
             
            });

        }
        $scope.getValues = function(parameter) {
          console.log(parameter);
          $http.get(globalURL + "api/secured/pistachio/ereport/parameter/"+parameter).
             then( function (response) {
              return response.data
                 },
                 function(error) {

                 });
        }



        $scope.initUser = function() {
          $.getJSON(globalURL + "api/report/reference/myuser", function (json) {
                     $.each(json, function(k, v){
                        $("#temp-myuser").append('<option value='+v+'>'+v+'</option>');
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

                         $("#temp-branch").append('<option value='+v+'>'+v+'</option>');
                     });
                 });
            
           }

           $scope.initMyUser = function() {
              $.getJSON(globalURL + "api/report/reference/myuser", function (json) {
                   $.each(json, function(k, v){
                      $("#temp-myuser").append('<option value='+v+'>'+v+'</option>');
                   });
               });

           }

          $scope.initState = function() {
              $.getJSON(globalURL + "api/report/reference/state", function (json) { //api/user/reference/
                 $.each(json, function(k, v){
                    $("#temp-state").append('<option value='+v+'>'+v+'</option>');
                 });
             });
          }

          $scope.initNationality = function() {
            $.getJSON(globalURL + "api/report/reference/nationality", function (json) {
                 $.each(json, function(k, v){
                     $("#temp-nationality").append('<option value='+v+'>'+v+'</option>');
                 });
             });
          }
          $scope.initPasType = function() {
                 $.getJSON(globalURL + "api/report/reference/pastype", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-pastype").append('<option value='+v+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initDept = function() {
                 $.getJSON(globalURL + "api/user/reference/dept", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-dept").append('<option value='+v+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initApplicant = function() {
                 $.getJSON(globalURL + "api/report/reference/applicant", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicant").append('<option value='+v+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initApplicationStatus = function() {
                 $.getJSON(globalURL + "api/report/reference/applicationstatus", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicationStatus").append('<option value='+v+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initApplicationStep = function() {
                 $.getJSON(globalURL + "api/report/reference/applicationstep", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicationStep").append('<option value='+v+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initApplicationType = function() {
                 $.getJSON(globalURL + "api/report/reference/applicationtype", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-applicationType").append('<option value='+v+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initCity = function() {

                 $.getJSON(globalURL + "api/report/reference/city", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-city").append('<option value='+v+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initSector = function() {
                  $.getJSON(globalURL + "api/report/reference/sector", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-sector").append('<option value='+v+'>'+v+'</option>');
                     });
                 });
          }

          $scope.initSex = function() {
                    $.getJSON(globalURL + "api/report/reference/sex", function (json) {
                     $.each(json, function(k, v){
                         $("#temp-sex").append('<option value='+v+'>'+v+'</option>');
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
          nparams: '=',
          loading: '='

        },
        templateUrl: 'views/sqleditor/params.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});