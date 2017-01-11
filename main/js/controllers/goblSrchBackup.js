'use strict';
var selected_countries = [];
var selected_jobs = [];
var selected_states = [];
var selected_branch = [];
var clickCircle, clickMarker;
var filter_query = "";
// var solrHost = "localhost";
//var solrHost = "pistachio_server";
MetronicApp.controller('GlobalSearchController', function ($rootScope, $scope, $http, $timeout, chkIframe, $sce,$uibModal) {
  $scope.$on('$viewContentLoaded', function () {

    // initialize core components
    Metronic.initAjax();
    Layout.setSidebarMenuActiveLink('set', $('#fastsearchLink'));
    $scope.tblContent = false;
    $scope.noData = false;
    var getUser = localStorage.getItem("username");
    $scope.getSearchFromDt1 = "";
    $scope.getSearchToDt = "";
    $scope.text = "";
    $scope.latVal = "";
    $scope.lngVal ="";
    $scope.kilom = "";

    $('#searchDaterange').daterangepicker({
      startDate: moment().subtract(1, "year"),
      endDate: moment(),
      "alwaysShowCalendars": false,
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    },
      function (startdt, enddt) {
        $('#searchDaterange span').html(startdt.format('MMM DD, YYYY') + ' - ' + enddt.format('MMM DD, YYYY'));
      });

    // $("#searchDaterange span").html(moment().subtract(1,"year").format("MMM DD YYYY") + " - " + moment().format("MMM DD YYYY"));
    $("#searchDaterange span").html("Search by Date here");
    // 


    $rootScope.$on('loading:progress', function () {
      console.log("loading");
      $scope.loading = true;
    });

    $rootScope.$on('loading:finish', function () {
      $scope.loading = false;
      console.log("stop");
    });

    $scope.open = function (data) {
      $scope.expact_id = data;
      var options = {
        templateUrl: 'myModalContent.html',
        controller: profileModal,
        size: 'lg',
        resolve: {
          expact: function () {
            return data;
          }
        }
      };
      var modalInstance = $uibModal.open(options);
      modalInstance.result.then(function () {
        $scope.show_profile = false;
      }, function () {
       $scope.show_profile = false;
      });
    };





    $('.searchcont').on('apply.daterangepicker', function (ev, picker) {
      $scope.getSearchFromDt1 = picker.startDate.format("DDMMYYYY");
      $scope.getSearchToDt = picker.endDate.format("DDMMYYYY");
      // alert($scope.getSearchFromDt1 + " , " + $scope.getSearchToDt);
      // $scope.$apply();
      $scope.show();
    });

    if (!$rootScope.fastsearch.load) {
      $scope.showApplication = false;
      $scope.showVisitor = false;
      $scope.showCitizen = false;
      $scope.showBlacklist = false;
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


  $rootScope.triggerMap = function () {
    $scope.clicked = true;
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
        $(this).html(value + " KM");
      });
      range.on('input', function () {
        $scope.kilom = this.value;
        $scope.clicked = true;
        $scope.show();

        $(this).next(value).html(this.value + " KM");
        $rootScope.triggerFunc(this.value + "000");

      });
    });
  };

  rangeSlider();
  // don't forget to include leaflet-heatmap.js

  var greenIcon = L.icon({
    //iconUrl: 'assets/pistachio/map/leaf-green.png',
    //shadowUrl: 'assets/pistachio/map/leaf-shadow.png',

    iconSize: [38, 95], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });


  $scope.$on('mapClick', function (event, e) {
    $scope.clicked = true
    $scope.latVal = e.latlng.lat; $scope.lngVal = e.latlng.lng;
    $(".range-slider__range").val('20');
    $scope.kilom = $(".range-slider__range").val();
    // $scope.show(); // to avoid 3 times call;
  });

  $scope.drawHeatMap = function () {
    var map = L.map("mapid", { fullscreenControl: true }).setView([4, 100], 7);

    L.tileLayer('//c.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //L.tileLayer('http://10.23.124.233/osm_tiles/{z}/{x}/{y}.png', {
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

      $rootScope.$broadcast('mapClick', e);
      $(".range-slider__range").val('20');
      $(".range-slider__value").text('20 KM');

      $rootScope.triggerFunc = function (km) {

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
    $rootScope.box_update();
    $scope.showApplications($scope.currentStatus, 'prenext');
  }


  $scope.go = function () {
    $rootScope.box_update();
  }

  $scope.updateFilterQuery_Country = function () {
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
        filter_query = filter_query + "\"" + selected_jobs[i] + "\"";

        if (i != arrayLength - 1)
          filter_query = filter_query + " "
      }
      filter_query = filter_query + ")"
    }

    //#geosearch
    if ($scope.clicked) {
      if (filter_query.length > 1)
        filter_query = filter_query + " AND "
      filter_query = filter_query + "{!geofilt sfield=loc}";
      console.log(filter_query);
    }


    return filter_query
  }

  $scope.spatialSearch = function () {
    if ($scope.clicked)
      return "&pt=" + $scope.latVal + "," + $scope.lngVal + "&d=+" + $scope.kilom
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
    $scope.selected_jobs = selected_jobs
    $scope.start = 0;
    $scope.show();

  }

  $scope.checkboxselectedCountry = function (id) {
    var index = selected_countries.indexOf(id);    // <-- Not supported in <IE9
    if (index !== -1) {
      selected_countries.splice(index, 1);
    }
    else {
      selected_countries.push(id);
    }
    $scope.selected_countries = selected_countries;
    console.log(selected_countries);
    $scope.start = 0;
    $scope.show();
  }

  $scope.statesBox = function (id) {
    var index = selected_states.indexOf(id);    // <-- Not supported in <IE9
    if (index !== -1) {
      selected_states.splice(index, 1);
    }
    else {
      selected_states.push(id);
    }
    console.log(selected_states);
    $scope.selected_states = selected_states
    $scope.start = 0;
    $scope.show();
  }

// selected_branch
$scope.branchsBox = function (id) {
    var index = selected_branch.indexOf(id);    // <-- Not supported in <IE9
    if (index !== -1) {
      selected_branch.splice(index, 1);
    }
    else {
      selected_branch.push(id);
    }
    console.log(selected_branch);
    $scope.selected_branch = selected_branch
    $scope.start = 0;
    $scope.show();
  }

  $scope.formatDate = function (date) {
    if (typeof (date) != "undefined")
      return date.replace('T', ' ').replace('Z', '')
    else {
      return ""
    }
  }

  $rootScope.box_update = function () {
    $scope.tblContent = false;
    // var sq = "http://10.1.17.25:8081/pistachio/fastsearch/gfs";
    var sq = globalURL + "pistachio/fastsearch/gfs";
    var json = {};
    json.text = $scope.text;
    json.from = $scope.getSearchFromDt1;
    json.to = $scope.getSearchToDt;
    json.offset = 0;
    json.limit = 0;
    json.point = ($scope.latVal.toString().length > 0 && $scope.lngVal.toString().length > 0? $scope.latVal  + ',' + $scope.lngVal : null);
    json.d = ($scope.kilom.length > 0? $scope.kilom : null);
    json.state = selected_states.join(",");
    json.country = selected_countries.join(",");
    json.job = selected_jobs.join(",");
    json.branch = selected_branch.join(",");
    json.showPass = false;
    json.showCitizen = false;
    json.showMovement = false;
    json.showBlacklisted = false;

    $http.post(sq, JSON.stringify(json)).
      success(function (data) {
        $('#searchbox').val($scope.text);
        $scope.passFound = data.header.pass;
        $scope.qtime = data.header.passQueryTime;
        $scope.users = data.header.citizen;
        $scope.ctime = data.header.citizenQueryTime;
        $scope.employers = data.header.movement;
        $scope.vtime = data.header.movementQueryTime;
        $scope.blacklisted = data.header.blackListed;
        $scope.btime = data.header.blackListedQueryTime;
      })
      .error(function (data, status, headers, config) {
        console.log('error');
      });

  }


  $scope.options = function () {
    if (!$scope.option) {
      $scope.option = true;

    }
    else {
      $scope.option = false;
    }

  }
  $('#searchbox').keypress(function (e) {
    if (e.which == 13) {
      $scope.search($(this).val().trim());
    }
  });

  $scope.search = function (text) {

    filter_query = "";
    $scope.text = text;
    $scope.start = 0;

    // selected_countries = [];
    $scope.show();
  };

  $scope.reset = function () {
    selected_countries = [];
    $scope.text = "";
    $scope.showApplication = false;
    $scope.showVisitor = false;
    $scope.showCitizen = false;
    $scope.showBlacklist = false;
    $scope.fullscreen = false;

    $scope.option = false;
    selected_countries = [];
    selected_jobs = [];
    selected_states = [];
    selected_branch = [];
    $scope.latVal = "";
    $scope.lngVal ="";
    $scope.kilom = "";
    $scope.getSearchFromDt1 = "";
    $scope.getSearchToDt = "";

    $scope.selected_countries = selected_countries;
    $("#searchDaterange span").html("Search by Date here");
     $scope.go();
    //location.reload();
  };

  $scope.next = function () {
    $scope.start = $scope.start + 10;
    // $scope.show($scope.currentStatus);
    $('#tblSearch').DataTable().destroy();
    $scope.showApplications($scope.currentStatus, 'prenext');
  }

  $scope.previous = function () {
    $scope.start = $scope.start - 10;
    if ($scope.start < 0)
      $scope.start = 0;
    // $scope.show($scope.currentStatus);
    $('#tblSearch').DataTable().destroy();
    $scope.showApplications($scope.currentStatus, 'prenext');
  }

  $scope.showApplications = function (status, eve) {
    if (eve == 'load') {
      $scope.start = 0;
    }
    $scope.currentStatus = status;
    $scope.tblContent = true;
    var query = "";
    if (status == 'pass') {
      $scope.showApplication = true;
      $scope.showCitizen = false;
      $scope.showVisitor = false;
      $scope.showBlacklist = false;
      $scope.ChkCntry = true;
      $scope.ChkStates = false;
      $scope.ChkJobs = true;
      $scope.ChkBranchs = false;
      $scope.mapAreas = true;
      
    } else if (status == 'citizen') {
      $scope.showCitizen = true;
      $scope.showApplication = false;
      $scope.showVisitor = false;
      $scope.showBlacklist = false;
      $scope.ChkCntry = false;
      $scope.ChkStates = true;
      $scope.ChkJobs = false;
      $scope.ChkBranchs = false;
      $scope.mapAreas = true;
    } else if (status == 'vistor') {
      $scope.showVisitor = true;
      $scope.showApplication = false;
      $scope.showCitizen = false;
      $scope.showBlacklist = false;
      $scope.ChkCntry = true;
      $scope.ChkStates = false;
      $scope.ChkJobs = false;
      $scope.ChkBranchs = true;
      $scope.mapAreas = true;
    } else if (status == 'blackListed') {
      $scope.showBlacklist = true;
      $scope.showApplication = false;
      $scope.showCitizen = false;
      $scope.showVisitor = false;
      $scope.ChkCntry = true;
      $scope.ChkStates = false;
      $scope.ChkJobs = false;
      $scope.ChkBranchs = false;
      $scope.mapAreas = false;
    }

    var query = ""
    var sq = globalURL + "pistachio/fastsearch/gfs";
    var json = {};
    json.text = $scope.text;
    json.from = $scope.getSearchFromDt1;
    json.to = $scope.getSearchToDt;
    json.limit = 10;
    json.point = ($scope.latVal.toString().length > 0 && $scope.lngVal.toString().length > 0? $scope.latVal  + ',' + $scope.lngVal : null);
    json.d = ($scope.kilom.length > 0? $scope.kilom : null);
    json.offset = $scope.start;
    json.state = selected_states.join(",");
    json.country = selected_countries.join(",");
    json.job = selected_jobs.join(",");
    json.branch = selected_branch.join(",");
    json.showPass = $scope.showApplication;
    json.showCitizen = $scope.showCitizen;
    json.showMovement = $scope.showVisitor;
    json.showBlacklisted = $scope.showBlacklist;
    var tblGloSEarch;

    $http.post(sq, JSON.stringify(json)).
      success(function (data) {
        console.log(data);
        var totalResLenth;
        if (status == 'pass') {
          $scope.applicationsFound = data.header.pass;
          if (data.pass != null) {
            $scope.tblContent = true;
            $scope.noData = false;
            totalResLenth = data.pass.results.length;
            var strdoc_no, strcountry;
            if ($('#tblSearch tr').length > 0) {
              if ($('#tblSearch').DataTable().rows().length > 0) {
                $('#tblSearch').DataTable().destroy();
              }
            }
            // tblGloSEarch.destroy();

            tblGloSEarch = $('#tblSearch').DataTable({
              order: [[0, "asc"]],
              data: data.pass.results,
              searching: false,
              paging: false,
              info: false,
              layout: 'fixed',
              'word-wrap': 'break-word',
              columns: [{
                "title": "Date",
                "data": "date",
                "width": "10%",
                "render": function (data, type, full, meta) {
                  // var dt = moment.utc(data).format('DD-MM-YYYY HH:mm:ss');
                  return data.substring(0, 19);
                }
              }, {
                "title": "Job",
                "data": "job",
                "width": "20%"
              },
              {
                "title": "Name",
                "data": "name",
                "width": "30%"
              },
              {
                "title": "Gender",
                "data": "sex",
                "width": "5%",
                "render": function (data) {
                  if (data == "LELAKI") {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-male" aria-hidden="true" style="font-size:22px; color:#0093ff;"></i></div>';
                  } else if (data == "PEREMPUAN") {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-female" aria-hidden="true"  style="font-size:22px; color:#ff0097;"></i></div>';
                  } else {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-transgender" aria-hidden="true"  style="font-size:22px; color:#818990;"></i></div>';
                  }
                }
              },
              {
                "title": "Country",
                "data": "country",
                "width": "15%",
                "render": function (data, type, full, meta) {
                  strcountry = data;
                  return data;
                }
              },
              {
                "title": "Document No",
                "data": "doc_no",
                "width": "10%",
                "render": function (data, type, full, meta) {
                  strdoc_no = data;
                  return data;
                }
              },
              {
                "title": "Action",
                "data": "action",
                "width": "10%",
                "render": function (data, type, full, meta) {
                  return '<a class="viewReq")>' +
                    '<button class="btn btn-xs btn-warning searchBtn"><i class="fa fa-eye"></i>' +
                    'View </button></a>';
                }
              }]
            });
          } else {
            $scope.tblContent = false;
            $scope.noData = true;
          }

        } else if (status == 'citizen') {
          var strdoc_no;
          $scope.applicationsFound = data.header.citizen;
          if (data.citizen != null) {
            $scope.tblContent = true;
            $scope.noData = false;
            totalResLenth = data.citizen.results.length;

            // if ($('#tblSearch tr').length > 0 && $('#tblSearch').DataTable().data().length > 0)
            //   $('#tblSearch').DataTable().destroy()

            if ($('#tblSearch tr').length > 0) {
              if ($('#tblSearch').DataTable().rows().length > 0) {
                $('#tblSearch').DataTable().destroy();
              }
            }

            tblGloSEarch = $('#tblSearch').DataTable({
              order: [[0, "asc"]],
              data: data.citizen.results,
              searching: false,
              paging: false,
              info: false,
              columns: [{
                "title": "Date",
                "data": "date",
                "width": "10%",
                "render": function (data, type, full, meta) {
                  // var dt = moment.utc(data).format('DD-MM-YYYY HH:mm:ss');
                  return data.substring(0, 19);
                }
              }, {
                "title": "IC No.",
                "data": "kp_no",
                "width": "10%"
              },
              {
                "title": "Name",
                "data": "name",
                "width": "35%"
              }, {
                "title": "Gender",
                "data": "sex",
                "width": "5%",
                "render": function (data) {
                  if (data == "LELAKI") {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-male" aria-hidden="true" style="font-size:22px; color:#0093ff;"></i></div>';
                  } else if (data == "PEREMPUAN") {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-female" aria-hidden="true"  style="font-size:22px; color:#ff0097;"></i></div>';
                  } else {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-transgender" aria-hidden="true"  style="font-size:22px; color:#818990;"></i></div>';
                  }
                }
              },
              {
                "title": "Passport No.",
                "data": "doc_no",
                "width": "15%",
                "render": function (data, type, full, meta) {
                  // strdoc_no = data;
                  return data;
                }
              },
              {
                "title": "State",
                "data": "state",
                "width": "15%",
                "render": function (data, type, full, meta) {
                  // strdoc_no = data;
                  if (data == undefined) {
                    return "";
                  } else {
                    return data;
                  }
                }
              },
              {
                "title": "Action",
                "data": "action",
                "width": "10%",
                "render": function (data, type, full, meta) {
                  return '<a  class="viewCitizen">' +
                    '<button class="btn btn-xs btn-warning searchBtn"><i class="fa fa-eye"></i>' +
                    'View </button></a>';
                }
              }]
            });
          } else {
            $scope.tblContent = false;
            $scope.noData = true;
          }

        } else if (status == 'vistor') {
          $scope.applicationsFound = data.header.movement;
          if (data.vistor != null) {
            $scope.tblContent = true;
            $scope.noData = false;
            totalResLenth = data.vistor.results.length;
            // if ($('#tblSearch tr').length > 0 && $('#tblSearch').DataTable().data().length > 0)
            //   $('#tblSearch').DataTable().destroy()

            if ($('#tblSearch tr').length > 0) {
              if ($('#tblSearch').DataTable().rows().length > 0) {
                $('#tblSearch').DataTable().destroy();
              }
            }

            tblGloSEarch = $('#tblSearch').DataTable({
              order: [[0, "asc"]],
              data: data.vistor.results,
              searching: false,
              paging: false,
              info: false,
              columns: [{
                "title": "Date",
                "data": "date",
                "width": "10%",
                "render": function (data, type, full) {
                  // var dt = moment.utc(data).format('DD-MM-YYYY HH:mm:ss');
                  return data.substring(0, 19);
                }
              }, {
                "title": "Branch",
                "data": "branch",
                "width": "20%"
              },
              {
                "title": "Name",
                "data": "name",
                "width": "25%"
              }, {
                "title": "Gender",
                "data": "sex",
                "width": "5%",
                "render": function (data) {
                  if (data == "LELAKI") {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-male" aria-hidden="true" style="font-size:22px; color:#0093ff;"></i></div>';
                  } else if (data == "PEREMPUAN") {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-female" aria-hidden="true"  style="font-size:22px; color:#ff0097;"></i></div>';
                  } else {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-transgender" aria-hidden="true"  style="font-size:22px; color:#818990;"></i></div>';
                  }
                }
              },
              {
                "title": "Country",
                "data": "country",
                "width": "20%",
                "render": function (data, type, full, meta) {
                  return data;
                }
              },
              {
                "title": "Document No",
                "data": "doc_no",
                "width": "10%",
                "render": function (data, type, full, meta) {
                  // strdoc_no = data;
                  if (data == undefined) {
                    return "";
                  } else {
                    return data;
                  }
                }
              },
              {
                "title": "Action",
                "data": "action",
                "width": "10%",
                "render": function (data, type, full, meta) {
                  return '<a class="viewReq">' +
                    '<button class="btn btn-xs btn-warning searchBtn"><i class="fa fa-eye"></i>' +
                    'View </button></a>';
                }
              }]
            });
          } else {
            $scope.tblContent = false;
            $scope.noData = true;
          }

        } else if (status == 'blackListed') {
          $scope.applicationsFound = data.header.blackListed;
          if (data.blackListed != null) {
            $scope.tblContent = true;
            $scope.noData = false;
            totalResLenth = data.blackListed.results.length;
            // if ($('#tblSearch tr').length > 0 && $('#tblSearch').DataTable().data().length > 0)
            //   $('#tblSearch').DataTable().destroy()

            if ($('#tblSearch tr').length > 0) {
              if ($('#tblSearch').DataTable().rows().length > 0) {
                $('#tblSearch').DataTable().destroy();
              }
            }

            tblGloSEarch = $('#tblSearch').DataTable({
              order: [[0, "asc"]],
              data: data.blackListed.results,
              searching: false,
              paging: false,
              info: false,
              columns: [{
                "title": "Date",
                "data": "date",
                "width": "10%",
                "render": function (data, type, full, meta) {
                  // var dt = moment.utc(data).format('DD-MM-YYYY HH:mm:ss');
                  return data.substring(0, 19);
                }
              }, {
                "title": "IC No.",
                "data": "kp_no",
                "width": "20%"
              },
              {
                "title": "Name",
                "data": "name",
                "width": "25%"
              }, {
                "title": "Gender",
                "data": "sex",
                "width": "5%",
                "render": function (data) {
                  if (data == "LELAKI") {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-male" aria-hidden="true" style="font-size:22px; color:#0093ff;"></i></div>';
                  } else if (data == "PEREMPUAN") {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-female" aria-hidden="true"  style="font-size:22px; color:#ff0097;"></i></div>';
                  } else {
                    return '<div style="width:100%; text-align:center;"><i class="fa fa-transgender" aria-hidden="true"  style="font-size:22px; color:#818990;"></i></div>';
                  }
                }
              }, {
                "title": "Passport No.",
                "data": "doc_no",
                "width": "20%",
                "render": function (data, type, full, meta) {
                  return data;
                }
              }, {
                "title": "Country",
                "data": "country",
                "width": "20%",
                "render": function (data, type, full, meta) {
                  // strdoc_no = data;
                  if (data == undefined) {
                    return "";
                  } else {
                    return data;
                  }
                }
              }, {
                "title": "Action",
                "data": "action",
                "width": "0%",
                "visible": false,
                "render": function (data, type, full, meta) {
                  return '<a class="viewBlacklist">' +
                    '<button class="btn btn-xs btn-warning searchBtn"><i class="fa fa-eye"></i>' +
                    'View </button></a>';
                }
              }]
            });
          } else {
            $scope.tblContent = false;
            $scope.noData = true;
          }
        }

        $scope.first = ($scope.start / 10) > 0 ? false : true;
        $scope.startCount = $scope.start + totalResLenth;
        $scope.previousCount = $scope.start;
        // $scope.startCount = ($scope.applicationsFound < 10 ? $scope.applicationsFound : $scope.start + 10);
        $scope.last = ($scope.startCount == $scope.applicationsFound ? true : false);

        var viewinfo = undefined;

        var strtest = 0;
        $('.viewReq').on('click', 'button.searchBtn', function (e) {
          $("#myTravalModal").find('.modal-body').append("<iframe id='frame' width='100%' height='600px'></iframe>");
          var viewinfo = tblGloSEarch.row($(this).parents('tr')).data();
          var strcntry = viewinfo.country.replace(/ /g, "*");
          // var qstr = 'doc_nos:'+ viewinfo.doc_no + (strcntry.length != 0? ' AND country:'+ strcntry : '');
          // sessionStorage.setItem('Qparam','doc_nos:'+ viewinfo.doc_no +' AND country:'+ strcntry);
          if (strcntry.toLowerCase().trim() == 'malaysia') {
            var qstr = 'doc_no:' + viewinfo.doc_no + ' AND citizen:' + true;
          } else {
            var qstr = 'doc_nos:' + viewinfo.doc_no + ' AND country:' + strcntry;
          }
          sessionStorage.setItem('Qparam', qstr);

          //To load in to Modal
          e.preventDefault();
          strtest += 1;
          $('#myTravalModal').modal('show').find("#frame").attr("src", "#/travelertracker/travelertracker.html?session=true&test=" + strtest);
        });

        $('#myTravalModal').on('hidden.bs.modal', function (e) {
          $('#frame').remove();
          //sessionStorage.setItem('backct',true);
        });


        var viewCitizinfo = undefined;
        $('.viewCitizen').on('click', 'button.searchBtn', function (e) {
          chkIframe.addStatus("true");

          $("#myTravalModal").find('.modal-body').append("<iframe id='frame' width='100%' height='600px'></iframe>");
          //sessionStorage.setItem('backct',false);
          viewCitizinfo = tblGloSEarch.row($(this).parents('tr')).data();
          // sessionStorage.setItem('Qparam','doc_no:'+ viewCitizinfo.doc_no +' AND citizen:'+ true);
          sessionStorage.setItem('Qparam', 'doc_no:' + viewCitizinfo.doc_no + ' AND citizen:' + true);
          // window.location = "#/travelertracker/travelertracker.html?session=true";   
          strtest += 1;
          $('#myTravalModal').modal('show').find("#frame").attr("src", "#/travelertracker/travelertracker.html?session=true&test=" + strtest);

        });

        // $scope.startCount = $scope.start + 10; 


        // if (data.response.numFound == 0) {
        //   $scope.showApplication = false;
        // }
        // $scope.vtime = data.responseHeader.QTime;        
        // $scope.items = data.response.docs;
        //if (selected_countries.length == 0)
          $scope.countries = data.facetCountry

        //if (selected_jobs == 0)
          $scope.jobs = data.facetJobs

        if(selected_states.length == 0)
          $scope.states = data.facetStates

        if(selected_branch.length == 0)
          $scope.branch = data.facetBranches 

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
