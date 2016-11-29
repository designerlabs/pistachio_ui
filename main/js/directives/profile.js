'use strict';


var ProfileController = function ($scope,$http) {
    $scope.showVisa=false;
    var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/profile/query?rows=1&q='
    $scope.image_src = "./assets/admin/layout2/img/avatar3.png";
    $scope.birth_date = "NA"
    init();
    function init() {
      $scope.suspect = false;
      var query = "expact_id:\""+$scope.expact +"\""
      $scope.visatotal = 0;
      $scope.movetotal = 0;
      $scope.offendertotal = 0;
    $http.get(thisSolrAppUrl+query).
      success(function(data) {
        if(data.response.numFound == 0) {
          getFromOffender()
          return
        }
        $scope.doc = data.response.docs[0];
        $scope.birth_date = $scope.getDateFromExpact($scope.doc.expact_id)
        $scope.age = $scope.getAgeFromExpact($scope.doc.expact_id)
        console.log($scope.age)
         
  });  
    }

    function getFromOffender() {
      var offenderUrl = 'http://'+solrHost+':8983/solr/offender/query?rows=1&q='
      var query = "expact_id:\""+$scope.expact +"\""
      $http.get(offenderUrl+query).
      success(function(data) {
        if(data.response.numFound == 0) {
          getFromSuspect()  
        }
        $scope.doc = data.response.docs[0];
        $scope.doc.status = "OFFENDER"
        $scope.birth_date = $scope.getDateFromExpact($scope.doc.expact_id)
        $scope.age = $scope.getAgeFromExpact($scope.doc.expact_id)
        console.log($scope.age)
       });  
    }

    function getFromSuspect() {
      var offenderUrl = 'http://'+solrHost+':8983/solr/blacklist/query?rows=1&q='
      var query = "expact_id:\""+$scope.expact +"\""
      $http.get(offenderUrl+query).
      success(function(data) {
        if(data.response.numFound == 0) {
          return  
        }
        $scope.suspect = true;
        $scope.doc = data.response.docs[0];
        $scope.birth_date = $scope.getDateFromExpact($scope.doc.expact_id)
        $scope.age = $scope.getAgeFromExpact($scope.doc.expact_id)
        console.log($scope.age)
       });  
    }
  
   $scope.getDateFromExpact = function(data) {
      var dt = data.split("-")[2]
      return moment(dt, "YYYYMMDD").format('DD-MM-YYYY');
   }
   $scope.getDate = function (data) {
      return moment(data, "YYYYMMDD").format('DD-MM-YYYY');
   }
   
    $scope.getAgeFromExpact = function (data) {
      var dt = data.split("-")[2]
      console.log(dt)
      return moment(dt, "YYYYMMDD").fromNow().split(" ")[0];
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

var ModalInstanceCtrl = function ($scope, $uibModalInstance,$http,detainees,page,filter,solrUrl,NgTableParams) {
  $scope.detainees = detainees
  $scope.page = page



  var thisSolrAppUrl = solrUrl;

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
         if(page_options.start < 1)
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
              $scope.detainees = data.response.docs;
          });
       }
};


