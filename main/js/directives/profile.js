'use strict';


var ProfileController = function ($scope,$http) {
    $scope.showVisa=false;
    var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/offender/query?collection=offender,hismove,immigration2&rows=1&q='
    $scope.image_src = "./assets/admin/layout2/img/avatar3.png";
    $scope.birth_date = "NA"
    init();
    function init() {
      var query = "expact_id:\""+$scope.expact +"\""
      $scope.visatotal = 0;
      $scope.movetotal = 0;
    $http.get(thisSolrAppUrl+query).
      success(function(data) {
        $scope.doc = data.response.docs[0];
        $scope.birth_date = $scope.getDate($scope.doc.birth_date)
        $scope.age = $scope.getAge($scope.doc.birth_date)
         
  });  
    }
    
   $scope.getDate = function (data) {
      return moment(data, "YYYYMMDD").format('DD-MM-YYYY');
   }

   $scope.getAge = function (data) {
      return moment(data, "YYYYMMDD").fromNow().split(" ")[0];
   }

   $scope.back = function () {
    $scope.show = false;
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

MetronicApp.directive('profile', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: ProfileController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            expact: '=expactId',
            show: '=show_profile'        },
        templateUrl: 'views/travelertracker/profile.html',
        link: function ($scope, element, attrs) {
            
         }
        
    }
});

var profileModal = function ($scope, $uibModalInstance,expact) {
  $scope.expact_id = expact
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};

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


