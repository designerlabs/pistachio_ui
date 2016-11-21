'use strict';


var ProfileController = function ($scope,$http) {
  var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/immigration2/query?collection=offender&json='

$scope.age = 20
            var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/offender/query?q='
            var query = "expact_id:\""+$scope.expact +"\""
            $http.get(thisSolrAppUrl+query).
              success(function(data) {
                $scope.doc = data.response.docs[0];
                  $scope.tabs = [
    { title:'Dynamic Title 1', content:'<h3>Dynamic content 1</h3>' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  ];
          });

       $scope.getDate = function (data) {
        debugger;
          return moment(data, "YYYYMMDD").format('DD-MM-YYYY');
       }

       $scope.getData = function () {
         var json = {};
         json.limit  = $scope.page.limit;
         json.offset = $scope.page.start;
         json.query = "*:*"
         $http.get(thisSolrAppUrl+JSON.stringify(json)+filter).
         success(function(data) {
              $scope.page.total = data.response.numFound;
              $scope.detainees = new NgTableParams({page: 1, count: 10}, { dataset: data.response.docs});
          });
       }
};

MetronicApp.directive('profileDirective', function ($http) {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment        
        controller: ProfileController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            expact: '=profileDirective'        },
        templateUrl: 'views/travelertracker/profile.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});

var ModalInstanceCtrl = function ($scope, $uibModalInstance,$http,detainees,page,filter,NgTableParams) {
  $scope.detainees = detainees
  $scope.page = page



  var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/immigration2/query?collection=offender&json='

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

   $scope.view = function(data)  {
    $scope.expact_id = data;
     $scope.show_profile = true;

    
   }

   $scope.back = function(data) {
     $scope.show_profile = false;
   }

 

       $scope.next_page = function() {
         var page_options = {};
         page_options.start = $scope.page.start + $scope.page.limit;
         page_options.limit = $scope.page.limit;
         page_options.page = $scope.page.page+1;
         page_options.first = false;
         if((page_options.start + page_options.limit) > $scope.page.total) {

           page_options.last = false; 
         }
         
         $scope.page = page_options;
         $scope.getData()
       }

      $scope.previous_page = function () {
         var page_options = {};
         page_options.start = $scope.page.start - $scope.page.limit;
         if(page_options.start < 0)
         {
          page_options.start =0
          page_options.first = true;
         }
         page_options.limit = $scope.page.limit;
         page_options.page = $scope.page.page - 1;
         page_options.last = false;
         $scope.page = page_options;
         $scope.getData()
       }



       $scope.getData = function () {
         var json = {};
         json.limit  = $scope.page.limit;
         json.offset = $scope.page.start;
         json.query = "*:*"
         $http.get(thisSolrAppUrl+JSON.stringify(json)+filter).
         success(function(data) {
              $scope.page.total = data.response.numFound;
              $scope.detainees = new NgTableParams({page: 1, count: 10}, { dataset: data.response.docs});
          });
       }
};