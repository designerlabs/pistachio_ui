'use strict';

var VisaController = function ($scope,$http) {
    var thisSolrAppUrl = 'http://'+solrHost+':8983/solr/immigration2/query?q='
    init();

  function init() {
    var query = "expact_id:\""+$scope.expact +"\""
    //var query = "doc_no:A4010734"
    $http.get(thisSolrAppUrl+query).
      success(function(data) {
      $scope.docs = data.response.docs;
      $scope.visatotal = data.response.numFound;

      var visadetails = data.response.docs;
      //  $.get(globalURL + "api/image/solr/" + visadetails[0].fin_no)
      //          .then(function (data) {
       //             // $scope.showVisa = true;
       //             $scope.fn_loadVisaTbl(visadetails, data);
       //         });
        $scope.fn_loadVisaTbl(visadetails, data);
    });
  } 

  $scope.getDate = function (data) {
    return moment(data, "YYYYMMDD").format('DD-MM-YYYY');
  }

  

  $scope.fn_loadVisaTbl = function (_visadata, _imgdata) {
            var visatbl = $('#tblvisa').DataTable({
                data: _visadata,
                columns: [{
                    "data": "appl_no",
                    "render": function (data, type, full, meta) {
                        var result = $.grep(_imgdata, function (e) { return e.appl_no == data; });//Match Appl_no
                        if (result.length > 0) {
                            return '<img src="data:image/bmp;base64,' + result[0].image + '" width="70" height="70">';
                        } else {
                            return '<img src="./assets/admin/layout2/img/avatar3.png" width="70" height="70">';
                        }
                    }
                }, {
                    "data": "sticker",
                    "render": function (data, type, full, meta) {
                        return (data == undefined ? "" : data);
                    }
                }, {
                    "data": "pass_type",
                    "render": function (data, type, full, meta) {
                        return (data == undefined ? "" : data);
                    }
                },
                {
                    "data": "job_en",
                    "render": function (data, type, full, meta) {
                        return (data == undefined ? "" : data);
                    }
                }, {
                    "data": "address",
                    "render": function (data, type, full, meta) {
                        return (data == undefined ? "" : data);
                    }
                },
                {
                    "data": "created",
                    "render": function (data, type, full, meta) {
                        // return(moment(data,"YYYY-MM-DDT00:00:00").format("YYYY-MM-DD"));
                        return (moment.utc(data).format("DD-MM-YYYY"));
                    }
                },
                {
                    "data": "vend",
                    "render": function (data, type, full, meta) {
                        return (moment.utc(data, "YYYYMMDD").format("DD-MM-YYYY"));
                    }
                }
                ]
            });

            var column = visatbl.column(0); //Disable visa image if nothing
            column.visible(_imgdata.length > 0 ? true : false);
        }
};

MetronicApp.directive('visa', function ($http) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment        
        controller: VisaController, 
        scope: {

            //@ reads the attribute value, = provides two-way binding, & works with functions
            expact: '=expact' ,
            visatotal: "="       },
        templateUrl: 'views/travelertracker/visa.html',
        link: function ($scope, element, attrs) {
            
         } //DOM manipulation
    }
});