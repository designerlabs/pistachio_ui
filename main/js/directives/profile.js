'use strict';


var ProfileController = function ($scope,$http) {
    $scope.showVisa=false;
    var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/profile/query?rows=1&q='
    $scope.image_src = "";
    $scope.birth_date = "NA"
    $scope.isExpact = true 
    $scope.docs= [];
    $scope.banner =""
    $scope.visatotal = 0;
    $scope.movetotal = 0;
    var check = {suspect:true,offender:true}
    init();
    checkAll();

    function checkAll() {
      if(check.suspect)
        checkSuspect()
      if(check.offender)
        checkOffender()
    }
    function init() {
      $scope.offender = false;
      if(!$scope.expact.includes("-")){
        $scope.isExpact  = false
        getFromCitizen()
        return
      }
      var query = "expact_id:\""+$scope.expact +"\""

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
        getOldPassports()
        if($scope.doc.image != undefined && $scope.doc.image.length > 0 )
          $scope.image_src=$scope.doc.image

        if(moment($scope.doc.pass_exp_date).diff(moment()) < 0 && $scope.doc.entry == "ENTRY") {
          debugger;
           $scope.banner = $scope.banner + " OVERSTAY"
           $scope.offender = true;
        }
        console.log($scope.age)
         
  });  
    }

    function getOldPassports() {
      var d = $scope.doc.doc_nos;
      if(d.length>1){
        var index = d.indexOf($scope.doc.doc_no);
        if (index > -1) {
          d.splice(index, 1);
        }
        $scope.doc.doc_nos = d
      }
      else
         $scope.doc.doc_nos = [];
    }

    function getFromCitizen() {
      var offenderUrl = 'http://'+solrHost+':8983/solr/immigration2/query?collection=citizen&sort=doc_exp_date desc&q='
      var query = "expact_id:\""+$scope.expact +"\""
      $http.get(offenderUrl+query).
      success(function(data) {
        if(data.response.numFound == 0) {
         getFromMovement4Citizen()
         return
        }
        $scope.passporttotal =data.response.numFound
        $scope.doc = data.response.docs[0];
        $scope.docs = data.response.docs;
        getOldPassports()
         if($scope.doc.image != undefined && $scope.doc.image.length > 0 )
          $scope.image_src=$scope.doc.image
        $scope.doc.status = "CITIZEN"
        $scope.doc.country= "MALAYSIA"
        $scope.birth_date = moment($scope.doc.birth_date, "YYYYMMDD").format('DD-MM-YYYY');
        $scope.age = $scope.getAge($scope.doc.birth_date)
        console.log($scope.age)
       });  
    }

    function getFromMovement4Citizen() {
       var moveUrl = 'http://'+solrHost+':8983/solr/citizen_history/query?sort=doc_exp_date desc&q='
      var query = "expact_id:\""+$scope.expact +"\""
      $http.get(moveUrl+query).
      success(function(data) {
        if(data.response.numFound == 0) {
          getFromSuspectList()
          return
        }
        $scope.passporttotal =0
        $scope.doc = data.response.docs[0];
        $scope.doc.doc_nos = [];


         if($scope.doc.image != undefined && $scope.doc.image.length > 0 )
          $scope.image_src=$scope.doc.image
        $scope.doc.status = "CITIZEN"
        $scope.doc.country= "MALAYSIA"
        $scope.birth_date = moment($scope.doc.birth_date, "YYYYMMDD").format('DD-MM-YYYY');
        $scope.age = $scope.getAge($scope.doc.birth_date)
        console.log($scope.age)
       });  
    }

    function checkSuspect() {
      var moveUrl = 'http://'+solrHost+':8983/solr/immigration2/query?collection=blacklist&sort=doc_exp_date desc&q='
      var query = "expact_id:\""+$scope.expact +"\""
      $http.get(moveUrl+query).
      success(function(data) {
        if(data.response.numFound == 0) {
          return
        }
        var doc = data.response.docs[0];
         $scope.banner = $scope.banner + " SUSPECT"
        $scope.offender = true;
       // $scope.doc.status = $scope.doc.status +" SUSPECT"
       });  

    }
    function checkOffender() {
      var moveUrl = 'http://'+solrHost+':8983/solr/offender/query?sort=doc_exp_date desc&q='
      var query = "expact_id:\""+$scope.expact +"\""
      $http.get(moveUrl+query).
      success(function(data) {
        if(data.response.numFound == 0) {
          return
        }
        var doc = data.response.docs[0];
        
          $scope.image_src=doc.image
         $scope.banner = "DETAINEE"
        $scope.offender = true;
      //  $scope.doc.status = $scope.doc.status +" SUSPECT"
       });  
    }


    function getFromSuspectList() {
      check.suspect = false;
      var moveUrl = 'http://'+solrHost+':8983/solr/blacklist/query?sort=doc_exp_date desc&q='
      var query = "expact_id:\""+$scope.expact +"\""
      $http.get(moveUrl+query).
      success(function(data) {
        if(data.response.numFound == 0) {
          return
        }
        //$scope.visatotal =0
        $scope.doc = data.response.docs[0];
        $scope.doc.doc_nos = [];
         $scope.banner = $scope.banner + " SUSPECT"
        $scope.offender = true;

         if($scope.doc.image != undefined && $scope.doc.image.length > 0 )
          $scope.image_src=$scope.doc.image
        if($scope.doc.citizen == "MYS") {
           $scope.doc.status = "CITIZEN, SUSPECT"
           $scope.doc.country= "MALAYSIA"
        }
        else
          $scope.doc.status = "SUSPECT"
       
        $scope.birth_date = moment($scope.doc.birth_date, "YYYYMMDD").format('DD-MM-YYYY');
        $scope.age = $scope.getAge($scope.doc.birth_date)
        console.log($scope.age)
       });  
    }

    function getFromOffender() {
      check.offender = false;
      var offenderUrl = 'http://'+solrHost+':8983/solr/offender/query?rows=1&q='
      var query = "expact_id:\""+$scope.expact +"\""
      $http.get(offenderUrl+query).
      success(function(data) {
        if(data.response.numFound == 0) {
          getFromSuspectList()  
        }
        $scope.doc = data.response.docs[0];
        $scope.doc.status = "DETAINEE"
        
        $scope.offender = true;
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


