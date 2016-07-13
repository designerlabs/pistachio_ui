'use strict';
var selected_countries = [];
var selected_jobs = [];
var clickCircle, clickMarker;
var filter_query = "";
// var solrHost = "localhost";
//var solrHost = "pistachio_server";
MetronicApp.controller('GlobalSearchController', function ($rootScope, $scope, $http, $timeout, $sce) {
  $scope.$on('$viewContentLoaded', function () {

    // initialize core components
    Metronic.initAjax();
    Layout.setSidebarMenuActiveLink('set', $('#fastsearchLink'));
    var getUser = localStorage.getItem("username");
    if (!$rootScope.fastsearch.load) {
      $scope.showApplication = false;
      $scope.showVisitor = false;
      $scope.showCitizen = false;
      $scope.option = false;
      $scope.start = 0;
      $scope.users = 0;
      $scope.text = "";
      $scope.fullscreen = false;
      $scope.go();
    }
    else {
      $scope.showApplication = $rootScope.fastsearch.showApplication;
      $scope.showVisitor = $rootScope.fastsearch.showVisitor;
      $scope.start = 0;
      $scope.users = 0;
      $scope.text = $rootScope.fastsearch.text;
      $scope.show();
      $rootScope.fastsearch.load = false;

    }
    $scope.drawHeatMap();

  });

  var bigmapheight = 650;
  var smallmapheight = 300;
  var mapbreakwidth = 720;
  var highzoom = 8;
  var lowzoom = 7;
  var initzoom;


  $rootScope.triggerMap = function(){
    $scope.clicked= true;
    //$scope.showVisitor = true;
    $scope.show();
  };


  var rangeSlider = function () {
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');
        slider.each(function () {
        value.each(function () {
          var value = $(this).prev().attr('value');
          $(this).html(value+" KM");
        });
        range.on('input', function () {
          $scope.kilom = this.value;
          $scope.clicked= true;
          $scope.show();

          $(this).next(value).html(this.value+" KM");
          $rootScope.triggerFunc(this.value+"000");

        });
    });
  };

  rangeSlider();
  // don't forget to include leaflet-heatmap.js

  var greenIcon = L.icon({
    //iconUrl: 'assets/pistachio/map/leaf-green.png',
    //shadowUrl: 'assets/pistachio/map/leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


$scope.$on('mapClick', function(event, e) {
  $scope.clicked = true 
  $scope.latVal = e.latlng.lat; $scope.lngVal = e.latlng.lng;
  $(".range-slider__range").val('20');
  $scope.kilom = $(".range-slider__range").val();
  $scope.show();
});

  $scope.drawHeatMap = function () {
    var map = L.map("mapid",{fullscreenControl: true}).setView([4, 100], 7);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; NSL | Mimos'
    }).addTo(map);


    map.on('fullscreenchange', function () {
    if (map.isFullscreen()) {
       $(".range-slider").addClass("range_fullscreen");
    } else {
        $(".range-slider").removeClass("range_fullscreen");
    }
});



    map.on('singleclick', function (e) {
      debugger;
      $rootScope.$broadcast('mapClick', e);
      $(".range-slider__range").val('20');
      $(".range-slider__value").text('20 KM');

      $rootScope.triggerFunc = function(km){
    
        $rootScope.triggerMap();  
        if ($scope.clickCircle != undefined) {
          map.removeLayer($scope.clickCircle);
          map.removeLayer($scope.clickMarker);
        };
      
 
      $scope.clickMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
      $scope.clickCircle = L.circle([e.latlng.lat, e.latlng.lng], km, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
      }).addTo(map);
      //L.popup().setLatLng(e.latlng)
      //  .setContent('<p><code>clicked location</code> is ' + e.latlng)
      //  .openOn(map);
         
        
       
      };

      $rootScope.triggerFunc(20000);
    });


    map.on('load', function (e) {
      $("#mapid").css('height', bigmapheight);
      $("#mapid").css('height', bigmapheight);
    });



    }



  $scope.getQuery = function () {
    var query;
    if ($scope.text.length > 0) {
      var stext = $scope.text.split(" ");
      var j = stext.length;
      console.log("length :" + j);
      query = "combinedSearch:*" + stext[0] + "*"
      for (var i = 1; i < j; i++) {
        query = query + " AND combinedSearch:*" + stext[i] + "*";
      }
    }
    else {
      query = "*:*"
    }
    console.log(query);
    return (query);
  }

  $scope.show = function () {
    $scope.box_update();
    if ($scope.showApplication) {
      $scope.showApplications();
      $scope.visitor_box();
      $scope.citizen_box();
    }
    else if ($scope.showVisitor) {
      $scope.showVisitors();
      $scope.application_box();
      $scope.citizen_box();
    }

    else if ($scope.showCitizen) {
      $scope.showCitizens();
      $scope.application_box();
      $scope.visitor_box();
    }

    else
      $scope.go();
  }


  $scope.go = function () {
    $scope.application_box();
    $scope.visitor_box();
    $scope.citizen_box();
  }



  $scope.updateFilterQuery_Country = function () {
    //alert('sdf');
    var filter_query = "";
    var arrayLength = selected_countries.length;
    if (arrayLength > 0) {
      filter_query = "country:( "
      for (var i = 0; i < arrayLength; i++) {
        filter_query = filter_query + selected_countries[i];

        if (i != arrayLength - 1)
          filter_query = filter_query + " "

      }
      filter_query = filter_query + ')'
    }

    arrayLength = selected_jobs.length;
    if (arrayLength > 0) {
      if (filter_query.length > 1)
        filter_query = filter_query + " AND "
      filter_query = filter_query + "job_bm:("
      for (var i = 0; i < arrayLength; i++) {
        filter_query = filter_query +"\""+  selected_jobs[i]+"\"";

        if (i != arrayLength - 1)
          filter_query = filter_query + " "
      }
      filter_query = filter_query + ")"
    }

    //#geosearch
    if($scope.clicked) {
       if (filter_query.length > 1)
        filter_query = filter_query + " AND "
      filter_query = filter_query + "{!geofilt sfield=loc}";
      console.log(filter_query);
    }


    return filter_query
  }

 $scope.spatialSearch = function() {
   if($scope.clicked)
    return "&pt="+$scope.latVal+","+$scope.lngVal+"&d=+"+$scope.kilom
   else
    return ""
 }

  $scope.jobBox = function (id) {
    var index = selected_jobs.indexOf(id);    // <-- Not supported in <IE9
    if (index !== -1) {
      selected_jobs.splice(index, 1);
    }
    else {
      selected_jobs.push(id);
    }
    console.log(selected_jobs);
    $scope.start = 0;
    $scope.show();

  }

  $scope.checkboxselectedCountry = function (id) {
    id = id.replace(/ /g, "*");
    //alert(id);
    var index = selected_countries.indexOf(id);    // <-- Not supported in <IE9
    if (index !== -1) {
      // alert("first")
      selected_countries.splice(index, 1);
    }
    else {
      // alert("psh")
      selected_countries.push(id);
    }
    console.log(selected_countries);
    $scope.start = 0;
    //  alert($scope.text);
    $scope.show();


  }

  $scope.application_box = function () {
    $http.get('http://' + solrHost + ':8983/solr/immigration2/select?q=' + $scope.getQuery() + '&wt=json&start=0&rows=0').
      success(function (data) {
        $scope.applicationsFound = data.response.numFound;
        $scope.qtime = data.responseHeader.QTime;

      }).
      error(function (data, status, headers, config) {
        console.log('error');
        console.log('status : ' + status); //Being logged as 0
        console.log('headers : ' + headers);
        console.log('config : ' + JSON.stringify(config));
        console.log('data : ' + data); //Being logged as null
      });
  }

  $scope.visitor_box = function () {
    $http.get('http://' + solrHost + ':8983/solr/hismove/select?q=' + $scope.getQuery() + '&wt=json&start=0&rows=0').
      success(function (data) {
        $('#searchbox').val($scope.text);
        $scope.employers = data.response.numFound;
        $scope.vtime = data.responseHeader.QTime;
      }).
      error(function (data, status, headers, config) {
        console.log('data : ' + data); //Being logged as null
      });
  }

  $scope.citizen_box = function () {
    $http.get('http://' + solrHost + ':8983/solr/cit/select?q=' + $scope.getQuery() + '&wt=json&start=0&rows=0').
      success(function (data) {
        $('#searchbox').val($scope.text);
        $scope.users = data.response.numFound;
        $scope.vtime = data.responseHeader.QTime;
      }).
      error(function (data, status, headers, config) {
        console.log('data : ' + data); //Being logged as null
      });
  }

  $scope.formatDate = function (date) {
    if (typeof (date) != "undefined")
      return date.replace('T', ' ').replace('Z', '')
    else {
      return ""
    }
  }
  $scope.box_update = function () {
    if ($scope.showApplication) {
      $scope.visitor_box();
      $scope.citizen_box();
    }
    else if ($scope.showVisitor) {
      $scope.application_box();
      $scope.citizen_box();
    }
    else if ($scope.showCitizen) {
      $scope.application_box();
      $scope.visitor_box();
    }
  }


  $scope.options = function () {
    if (!$scope.option) {
      $scope.option = true;

    }
    else {
      $scope.option = false;
    }

  }

  $scope.search = function (text) {

    filter_query = "";
    $scope.text = text;
    $scope.start = 0;

    selected_countries = [];
    $scope.show();


  };
  $scope.reset = function () {
    selected_countries = [];
    $scope.text = "";
    $scope.showApplication = false;
    $scope.showVisitor = false;
    $scope.showCitizen = false;
    $scope.fullscreen = false
    $scope.go();
  };




  $scope.next = function () {
    $scope.start = $scope.start + 10;
    $scope.show();

  }

  $scope.previous = function () {
    $scope.start = $scope.start - 10;
    if ($scope.start < 0)
      $scope.start = 0;
    $scope.show();
  }



  $scope.viewReq = function (docno, cntry) {
    cntry = cntry.replace(/ /g, "*");
    window.location = "#/travelertracker/travelertracker.html?doc_nos=" + docno + "&country=" + cntry + "";
  };

  $scope.viewCitizen = function (docno) {

    window.location = "#/travelertracker/travelertracker.html?doc_nos=" + docno + "&citizen=true";
  };


  $scope.showVisitors = function () {
    var query = "";
    $scope.showApplication = false;
    $scope.showCitizen = false;
    $scope.showVisitor = true;
    var query = ""
    var sq = "http://" + solrHost + ":8983/solr/hismove/query?json=";

    var json = {};
    json.limit = 10;
    json.offset = $scope.start
    json.query = $scope.getQuery();
    json.filter = $scope.updateFilterQuery_Country();
    json.sort = "xit_date desc"
    json.facet = {};
    json.facet.country = {};
    json.facet.country.type = "terms";
    json.facet.country.field = "country";

    // json.facet.country.domain = "{excludeTags:COLOR}"
    $http.get(sq + JSON.stringify(json)).
      success(function (data) {
        if (data.response.numFound == 0) {
          $scope.showVisitor = false;
        }
        $scope.vtime = data.responseHeader.QTime;
        $scope.employers = data.response.numFound;

        $scope.items = data.response.docs;
        if (selected_countries.length == 0)
          $scope.countries = data.facets.country.buckets

      })
      .error(function (data, status, headers, config) {
        console.log('error');
      });

  }

  $scope.showCitizens = function () {
    var query = "";

    $scope.showCitizen = true;
    $scope.showApplication = false;
    $scope.showVisitor = false;
    var query = ""
    var sq = "http://" + solrHost + ":8983/solr/cit/query?json=";

    var json = {};
    json.limit = 10;
    json.offset = $scope.start
    json.query = $scope.getQuery();
    json.sort = "xit_date desc"
    $http.get(sq + JSON.stringify(json)).
      success(function (data) {
        if (data.response.numFound == 0) {
          $scope.showCitizen = false;
        }
        $scope.vtime = data.responseHeader.QTime;
        $scope.users = data.response.numFound;
        console.log(data.response.docs);
        $scope.items = data.response.docs;

      })
      .error(function (data, status, headers, config) {
        console.log('error');
      });

  }



  $scope.showApplications = function () {
    var query = "";
    $scope.showVisitor = false;
    $scope.showCitizen = false;
    $scope.showApplication = true;

    var query = ""
    var sq = "http://" + solrHost + ":8983/solr/immigration2/query?json=";

    var json = {};
    json.limit = 10;
    json.offset = $scope.start
    json.query = $scope.getQuery();
    json.filter = $scope.updateFilterQuery_Country();
    json.sort = "created desc"
    json.facet = {};
    json.facet.country = {};
    json.facet.country.type = "terms";
    json.facet.country.field = "country";
    json.facet.country.limit = 20;
    json.facet.job = {};
    json.facet.job.type = "terms";
    json.facet.job.field = "job_bm";
    // json.facet.country.domain = "{excludeTags:COLOR}"
    $http.get(sq + JSON.stringify(json)+$scope.spatialSearch()).
      success(function (data) {
        if (data.response.numFound == 0) {
          $scope.showApplication = false;
        }
        $scope.vtime = data.responseHeader.QTime;
        $scope.applicationsFound = data.response.numFound;
        //$scope.employers = data.response.numFound;
        $scope.items = data.response.docs;
        if (selected_countries.length == 0)
          $scope.countries = data.facets.country.buckets

        if (selected_jobs.length == 0)
          $scope.jobs = data.facets.job.buckets
        console.log($scope.jobs);
      })
      .error(function (data, status, headers, config) {
        console.log('error');
      });

  }

  



  $scope.$on('$locationChangeStart', function (event) {
    $rootScope.fastsearch.text = $scope.text;
    $rootScope.fastsearch.showApplication = $scope.showApplication;
    $rootScope.fastsearch.showVisitor = $scope.showVisitor;
  });

  // $('.searchBtn').click(function (event) {

  //  alert('clicked view');
  // });

  // set sidebar closed and body solid layout mode
  $rootScope.settings.layout.pageSidebarClosed = true;
  $rootScope.skipTitle = false;
  $rootScope.settings.layout.setTitle("fastsearch");
});
