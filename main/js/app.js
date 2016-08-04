/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular
    .module("MetronicApp", [
        "ui.router",
        "oc.lazyLoad",
        "ui.ace",
        "ngSanitize",
        "ngResource",
        "ngTable",
        "pascalprecht.translate",
        'tmh.dynamicLocale',
        "datamaps",
        "chart.js",
        "ngIdle",
        "ui.bootstrap",
        "ngFileUpload"
    ])

// /* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
// MetronicApp.config(['$ocLazyLoadProvider', '$translateProvider', function($ocLazyLoadProvider, $translateProvider) {
//     $ocLazyLoadProvider.config({
//         // global configs go here
//     });

//     $translateProvider.translations('en', {
//       'sidebar.dashboard':'Dashboard',
//       'login.username' : 'User Name',
//       'login.title': 'E-Reporting Immigration Department'
//     });

//     $translateProvider.translations('my', {
//       'sidebar.dashboard':'Malay Dashboard',
//       'login.username' : 'Nama Pengguna',
//       'login.title': 'E-Reporting Jabatan Imigresen Malaysia'
//     });

//     $translateProvider.preferredLanguage('en_EN');
// }]);

.constant('DEBUG_MODE', /*DEBUG_MODE*/ true /*DEBUG_MODE*/ )
    .constant('VERSION_TAG', /*VERSION_TAG_START*/ new Date().getTime() /*VERSION_TAG_END*/ )
    .constant('LOCALES', {
        'locales': {
            'en_US': 'English',
            'ms_my': 'Bahasa Malaysia'
        },
        'preferredLocale': 'ms_my'
    })



.filter('titleCase', function() {
    return function(input) {
        input = input || '';
        return input.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
})


.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
})

// Angular Translate

.config(function($translateProvider, DEBUG_MODE, LOCALES) {
    if (DEBUG_MODE) {
        $translateProvider.useMissingTranslationHandlerLog(); // warns about missing translates
    }

    $translateProvider.useStaticFilesLoader({

        prefix: 'resources/locale-',
        suffix: '.json'
    });
    var DBLocale = (localStorage.getItem("lang") == "en") ? "en_US" : "ms_my";
    $translateProvider.preferredLanguage(DBLocale);
    // $translateProvider.useLocalStorage();
})

.factory('sortable', ['$filter', '$rootScope', function($filter, $rootScope){

  return function (scope, data, itemsPerPage, initSortingOrder) {

    
    scope.sortingOrder = initSortingOrder;
    scope.reverse = true;
    scope.filteredItems = [];
    scope.groupedItems = [];
    scope.itemsPerPage = itemsPerPage;
    scope.pagedItems = [];
    scope.currentPage = 1;
    scope.items = data;
    scope.maxSize = 5;

    var searchMatch = function (haystack, needle) {
          if (!needle) {
              return true;
          }
          return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
      };


      // init the filtered items
      scope.search = function () {

          scope.filteredItems = $filter('filter')(scope.items, $rootScope.query);

          // take care of the sorting order
        if (scope.sortingOrder !== '') {
            scope.filteredItems = $filter('orderBy')(scope.filteredItems, scope.sortingOrder, scope.reverse);
        }

          scope.currentPage = 1;

          // now group by pages
          scope.groupToPages();

          // reset the total items for the pagination buttons
          scope.totalItems = scope.filteredItems.length;
      };
      

      // calculate page in place
      scope.groupToPages = function () {
          scope.pagedItems = [];
          
          for (var i = 0; i < scope.filteredItems.length; i++) {
              if (i % scope.itemsPerPage === 0) {
                  scope.pagedItems[Math.floor(i / scope.itemsPerPage)] = [ scope.filteredItems[i] ];
              } else {
                  scope.pagedItems[Math.floor(i / scope.itemsPerPage)].push(scope.filteredItems[i]);
              }
          }
      };
      

      scope.range = function (start, end) {
          var ret = [];
          if (!end) {
              end = start;
              start = 0;
          }
          for (var i = start; i < end; i++) {
              ret.push(i);
          }
          return ret;
      };


      // functions have been described process the data for display
      scope.search();


      // change sorting order
      scope.sort_by = function(newSortingOrder) {
          if (scope.sortingOrder == newSortingOrder)
              scope.reverse = !scope.reverse;

          scope.sortingOrder = newSortingOrder;

          // call search again to make sort affect whole query
          scope.search();
      };

      scope.sort_by(initSortingOrder);
      scope.totalItems = scope.filteredItems.length;
  }

}])

// Angular Dynamic Locale
.config(function(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
    })
    .controller('MetronicApp', function($scope, $rootScope, $translate, $interval, VERSION_TAG) {
        $rootScope.$on('$translateChangeSuccess', function(event, data) {
            $scope.locale = data.language;
            console.log(data.language);
        });

    });


/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
// MetronicApp.config(['$ocLazyLoadProvider', '$translateProvider', function($ocLazyLoadProvider, $translateProvider) {
//     $ocLazyLoadProvider.config({
//         // global configs go here
//     });

//     $translateProvider.translations('en', {
//       'sidebar.dashboard':'Dashboard',
//       'sidebar.fastsearch':'Fast Search',
//       'login.username' : 'User Name',
//       'login.title': 'E-Reporting Immigration Department'
//     });

//     $translateProvider.translations('my', {
//       'sidebar.dashboard':'Papan Pemuka',
//       'sidebar.fastsearch':'Terima pengesahan',
//       'login.username' : 'Nama Pengguna',
//       'login.title': 'E-Reporting Jabatan Imigresen Malaysia'
//     });

//     // $translateProvider.preferredLanguage(LOCALES.preferredLocale);
//     //$translateProvider.useLocalStorage();
//   ]);


/*MetronicApp.config(['$httpProvider',
function($httpProvider) {
    $httpProvider.defaults.withCredentials = false;

}]);*/

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/



/* Global hosting details */

//var globalURL = "http://10.23.124.243:8080/";
var globalURL = "http://10.1.17.25:8081/";
//var globalURL = "http://pistachio_server:8080/";
//var solrHost = "10.23.124.220";
var solrHost = "10.4.104.176";

//var solrHost = "10.4.104.176";

var queryString = "query";
var categoryName = "cat";
var sendUpload = false;
//validation on keyup
function formInputValidation(id) {
    $(id + " input").keyup(function(event) {
        if ($(this).val() != "") {
            $(this).parent('.form-group').removeClass('has-error');
        } else {
            $(this).parent('.form-group').addClass('has-error');
        }
    });

    $(id + " textarea").keyup(function(event) {
        if ($(this).val() != "") {
            $(this).parent('.form-group').removeClass('has-error');
        } else {
            $(this).parent('.form-group').addClass('has-error');
        }
    });
}




//validation before ajax
function inputValidation(id, callback) {
    var errorStatus;
    $.each($(id), function(index, val) {
        totalCount = $(val).find("input").length;
        totalCount += $(val).find("textarea").length;
        totalCount = totalCount - 1;
        $.each(val, function(index, val) {
            if ($("#" + this.id).val() == "") {
                $("#" + this.id).parent(".form-group").addClass("has-error");
            } else {
                if (index == totalCount) {
                    errorStatus = $(id + " div").hasClass("form-group has-error");
                    $("#" + this.id).parent(".form-group").removeClass("has-error");
                    if (errorStatus == false) {
                        console.log("matched");
                        callback();
                    } else {
                        return false;
                    }
                } else {
                    return;
                }
            }

        });
    });
}




//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();


    //var currentUserName = localStorage.getItem("username");
    var currentToken = localStorage.getItem("token");


    if (currentToken) {
        console.log('true ' + currentToken);
    } else {
        window.location = "login.html";
    }


    //return false;
    if ((currentToken == undefined)) {
        window.location = "login.html";
    } else {
        return true;
    }

}]);

MetronicApp.controller('sessionController', function($scope, Idle, Keepalive, $modal) {
        // $scope.started = false;
        // start();

        var currentToken = localStorage.getItem("token");

        function closeModals() {
            if ($scope.warning) {
                $scope.warning.close();
                $scope.warning = null;
            }

            if ($scope.timedout) {
                $scope.timedout.close();
                $scope.timedout = null;
            }
        }

        $scope.$on('IdleStart', function() {
            closeModals();
            // window.getAttention();
            $scope.warning = $modal.open({
                templateUrl: 'warning-dialog.html',
                windowClass: 'modal-danger'
            });
        });

        $scope.$on('IdleEnd', function() { //user wants to refresh session
            closeModals();

            $.get(globalURL + "auth/refresh?token=" + currentToken, function() {
                    console.log("User can continue the current session");
                })
                .success(function(data) {
                    console.log(data);
                })
                .error(function(data) {
                    console.log(data);
                });
        });

        $scope.$on('IdleTimeout', function() { //user session expirered
            closeModals();
            $scope.timedout = $modal.open({
                templateUrl: 'timedout-dialog.html',
                windowClass: 'modal-danger'
            });

            $.get(globalURL + "auth/logout?token=" + currentToken, function() {
                    console.log("Session expired");
                })
                .success(function(data) {
                    localStorage.setItem("token", "");
                    window.location = "login.html";
                    console.log(data);
                })
                .error(function(data) {
                    console.log(data);
                });


        });

    })
    .config(function(IdleProvider, KeepaliveProvider) {

        var dt = new Date(localStorage.getItem("expireTime"));
        var sec = dt.getSeconds()
        IdleProvider.idle(900); //idle time dueration
        IdleProvider.timeout(30); // waiting time to refresh
        // KeepaliveProvider.interval(15);
    });

MetronicApp.run(['Idle', function(Idle) {
    Idle.watch();
    console.log("Started From session");
}]);
/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var pageTitle = "";

    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000, // auto scroll to top on page load
            pageContentWhite: false,
            pageTitle: function(){ return pageTitle;},
            setTitle: function(n){ n ? pageTitle = n+'.title' : pageTitle = n; }

        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    var fastsearch ={
      load : false,
      text : "",
      showApplication : false,
      showVisitor: false,

      showPreviousSearch: function() {
        load : true;
      }

    }
    $rootScope.fastsearch = fastsearch;

    $rootScope.settings = settings;
    return settings;
}]);





/* interceptors store token in header */

MetronicApp.factory('httpRequestInterceptor', function() {
    return {
        request: function(config) {
            var storeToken = localStorage.getItem("token");
            config.headers.token = storeToken;
            Metronic.initSlimScroll('.scroller');
            return config;
        }
    };
});

MetronicApp.config(function($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});


/* interceptors store token in header end */


/* Setup global Authorities */
MetronicApp.factory('authorities', function() {

    var authoritiesValue = localStorage.getItem('authorities');

    var res = authoritiesValue.split(",");


    return {
        checkRole: function(x) {
            var arrayChk = $.inArray(x, res);
            if (arrayChk != -1) {
                return true;
            } else {
                return false;
            }

        }
    };

});


/*$scope.authoritiesValue = localStorage.getItem('authorities');

$scope.res = $scope.authoritiesValue.split(",");
$scope.roles = $scope.res;

$scope.checkRole = function(x){
    alert(x);
    //alert(x + " Admin");
    var arrayChk = $.inArray(x,$scope.roles);
    if(arrayChk != -1){
     return true;
    }else{
     return false;
    }

}*/

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        // $("#selectLanguage [value=1]").attr('selected', 'selected');
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);


MetronicApp.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

MetronicApp.directive('myEmpDirective', function() {
    return function(scope, element, attrs, $scope) {

        if (scope.$last) {

         $('input[name="check-box"]').wrap('<div class="check-box"><i></i></div>');
         $.fn.toggleCheckbox = function () {
             this.attr('checked', !this.attr('checked'));

         }
        
        

        $.each($("#employeeList input"), function(i, k) {
            $(k).parent().parent('.check-box').on('click', function (e) {
                //debugger;
                $(this).find(':checkbox').toggleCheckbox();
                $(this).find(':checkbox').prop('checked');
                $(this).toggleClass('checkedBox');
                var currentValue = $(e.target.innerHTML).children().val();
                var currentValueNext = $(e.target.innerHTML).val();
                if($('.'+currentValue).prop('checked')){
                    scope.employeeArr.push(currentValue);
                    scope.timelineChart();
                }else if($('.'+currentValueNext).prop('checked')){
                    scope.employeeArr.push(currentValueNext);
                    scope.timelineChart();
                }else{
                    if(currentValue){
                        removeItem(scope.employeeArr, currentValue);
                        scope.timelineChart();
                    }else{
                        removeItem(scope.employeeArr, currentValueNext);
                        scope.timelineChart();
                    }

                }

                console.log(scope.employeeArr);


            });

        });
            scope.$watch('empName', function(e){
                console.log(e);
                if(e.length > 0){
                    $("."+e).prop('checked', true);
                    $('.'+e).parent().parent('.check-box').toggleClass('checkedBox');
                }
                
            });
            scope.$watch('employeeArr', function(e) {
                console.log(e);

            });


            function removeItem(array, item){
                for(var i in array){
                    if(array[i]==item){
                        array.splice(i,1);
                        break;
                        }
                }
            };


        }
    };
});


MetronicApp.directive('myRepeatDirective', function() {
    return function(scope, element, attrs) {
        if (scope.$last === true) {
            Highcharts.SparkLine = function(a, b, c) {
                var hasRenderToArg = typeof a === 'string' || a.nodeName,
                    options = arguments[hasRenderToArg ? 1 : 0],
                    defaultOptions = {
                        chart: {
                            renderTo: (options.chart && options.chart.renderTo) || this,
                            backgroundColor: null,
                            borderWidth: 0,
                            type: 'area',
                            margin: [2, 0, 2, 0],
                            width: 120,
                            height: 20,
                            style: {
                                overflow: 'visible'
                            },
                            skipClone: true
                        },
                        title: {
                            text: ''
                        },
                        credits: {
                            enabled: false
                        },
                        xAxis: {
                            labels: {
                                enabled: false
                            },
                            title: {
                                text: null
                            },
                            startOnTick: false,
                            endOnTick: false,
                            tickPositions: []
                        },
                        yAxis: {
                            endOnTick: false,
                            startOnTick: false,
                            labels: {
                                enabled: false
                            },
                            title: {
                                text: null
                            },
                            tickPositions: [0]
                        },
                        legend: {
                            enabled: false
                        },
                        tooltip: {
                            backgroundColor: null,
                            borderWidth: 0,
                            shadow: false,
                            useHTML: true,
                            hideDelay: 0,
                            shared: true,
                            padding: 0,
                            positioner: function(w, h, point) {
                                return { x: point.plotX - w / 2, y: point.plotY - h };
                            }
                        },
                        plotOptions: {
                            series: {
                                enableMouseTracking: true,
                                animation: false,
                                lineWidth: 1,
                                shadow: false,
                                button: false,
                                color: '#F08080',
                                states: {
                                    hover: {
                                        enabled: false

                                    }
                                },
                                events: {
                                    mouseOver: function() {
                                        var chart = this.chart.series;
                                        chart[0].graph.stroke = "";
                                    },
                                    mouseOut: function() {
                                        var chart = this.chart.series;
                                        chart[0].graph.stroke = "";
                                    }


                                },
                                marker: {
                                    radius: 1,
                                    states: {
                                        hover: {
                                            enabled: false
                                        }
                                    }
                                },
                                fillOpacity: 0.80
                            },
                            column: {
                                negativeColor: '#910000',
                                borderColor: 'silver'
                            }
                        }
                    };

                options = Highcharts.merge(defaultOptions, options);

                return hasRenderToArg ?
                    new Highcharts.Chart(a, options, c) :
                    new Highcharts.Chart(options, b);
            };

            var start = +new Date(),
                $tds = $('td[data-sparkline]'),
                fullLen = $tds.length,
                n = 0;

            // Creating 153 sparkline charts is quite fast in modern browsers, but IE8 and mobile
            // can take some seconds, so we split the input into chunks and apply them in timeouts
            // in order avoid locking up the browser process and allow interaction.
            function doChunk() {
                var time = +new Date(),
                    i,
                    len = $tds.length,
                    $td,
                    stringdata,
                    arr,
                    data,
                    chart;

                for (i = 0; i < len; i += 1) {
                    $td = $($tds[i]);
                    stringdata = $td.data('sparkline');
                    arr = stringdata.split('; ');
                    data = $.map(arr[0].split(', '), parseFloat);
                    chart = {};

                    if (arr[1]) {
                        chart.type = arr[1];
                    }
                    $td.highcharts('SparkLine', {
                        series: [{
                            data: data,
                            pointStart: 1,
                            states: {
                                hover: {
                                    enabled: false
                                }
                            }
                        }],
                        tooltip: {
                            // headerFormat: '<span style="font-size: 10px">' + $td.parent().find('th').html() + ', Q{point.x}:</span><br/>',
                            pointFormat: '<b>{point.y} </b>'
                        },
                        chart: chart
                    });

                    n += 1;

                    // If the process takes too much time, run a timeout to allow interaction with the browser
                    if (new Date() - time > 500) {
                        $tds.splice(0, i + 1);
                        setTimeout(doChunk, 0);
                        break;
                    }

                    // Print a feedback on the performance
                    if (n === fullLen) {
                        $('#result').html('Generated ' + fullLen / 2 + ' Reports in ' + (new Date() - start) + ' ms');
                    }
                    $('.entrySpark > div svg .highcharts-series-group path:nth-child(1)').attr('fill', '#87CEEB');
                    $('.entrySpark > div svg .highcharts-series-group path:nth-child(2)').attr('stroke', '#87CEEB');
                    $('.entrySpark > div svg .highcharts-series-group .highcharts-markers path').attr('stroke', '#87CEEB !important');

                }
            }


            doChunk();
        }

    };
});


MetronicApp.service('stageUpdate', function() {
  var stage = [];

  var addStage = function(newObj) {
      stage.push(newObj);
  };

  var getStage = function(){
      return stage;
  };

  return {
    addStage: addStage,
    getStage: getStage
  };

});

MetronicApp.service('fileUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl) {

        sendUpload = true;
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function(data) {
              //  alert("successfully submitted!");
                console.log(data);
            })
            .error(function() {
             //   alert("error");
            });
    }
}]);


/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', '$http', 'authorities', function($scope, $http, authorities) {
    $scope.$on('$includeContentLoaded', function() {

        
        var getToken = localStorage.getItem("token");
        var authoritiesArray, res = [];
        var authoritiesValue;
        $scope.chkRole = authorities.checkRole;
        $.ajax({

                url: globalURL + 'auth/token?token=' + getToken,

                type: 'GET'
            })
            .done(function(data) {
                $scope.displayNames = data.reports;
                console.log(data.reports);
                console.log("success");

            })
            .fail(function() {
                localStorage.setItem("token", "");
                //location.href="#/login.html";
                window.location = "login.html";
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });

            $('a, li[class^="nav"], *[ng-click], .sub-menu li a').click(function(){
                $.ajax({

                    url: globalURL + 'auth/token?token=' + getToken,
                    type: 'GET'
                })
                .done(function(data) {
                    $scope.displayNames = data.reports;
                    console.log(data.reports);
                    console.log("success");

                })
                .fail(function() {
                    localStorage.setItem("token", "");
                    //location.href="#/login.html";
                    window.location = "login.html";
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
            });
        console.log(authoritiesArray);

        var flag = true;
        $scope.goes = function(data, displayName) {

            localStorage.setItem('sideMenuValue', data);
            localStorage.setItem('selSystemDisplayName', displayName);
            $.ajax({
                    //url: globalURL+'query/report/'+data,
                    url: globalURL + 'auth/subreports?token=' + getToken + '&parent=' + data,
                    type: 'GET',
                })
                .done(function(data) {
                    $scope.names = data;
                    console.log(data);
                    console.log("success");

                    if (flag) {
                        flag = false;
                        location.href = "#/report2.html";
                    } else {
                        flag = true;
                        location.href = "#/report3.html";
                    }
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });
        };

        /*
                $scope.authoritiesValue = localStorage.getItem('authorities');

                $scope.res = $scope.authoritiesValue.split(",");
                $scope.roles = $scope.res;



                   $scope.checkRole = function(x){
                       //alert(x + " Admin");
                       var arrayChk = $.inArray(x,$scope.roles);
                       if(arrayChk != -1){
                        return true;
                       }else{
                        return false;
                       }

                   }*/


        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url
    //if (currentUserName == jimUserId || currentUserName == mimosUserId) {
    $urlRouterProvider
    //.when("/search/user/:doc_no"), {
    //    templateUrl: 'partials/page.html', // I made this up
    //    controller: 'StoreController'
    //})
        .otherwise("/myprofile.html");
    //}else{
    //  $urlRouterProvider.otherwise("/dashboard.html");
    //}

    $stateProvider

    // Dashboard
        .state('dashboard', {
        url: "/dashboard.html",
        templateUrl: "views/dashboard.html",
        data: {
            pageTitle: 'Admin Dashboard Template'
        },
        controller: "DashboardController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/morris/morris.css',
                        'assets/admin/pages/css/tasks.css',

                        'assets/global/plugins/morris/morris.min.js',
                        'assets/global/plugins/morris/raphael-min.js',
                        'assets/global/plugins/jquery.sparkline.min.js',

                        'assets/admin/pages/scripts/index.js',
                        'assets/admin/pages/scripts/tasks.js',

                        'js/controllers/DashboardController.js'
                    ]
                });
            }]
        }
    })

    .state('dashboardchart', {
        url: "/dashboardchart.html",
        templateUrl: "views/dashboardchart.html",
        data: {
            pageTitle: 'Admin Dashboard Template'
        },
        controller: "DashboardChartController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/morris/morris.css',
                        'assets/admin/pages/css/tasks.css',

                        'assets/global/plugins/morris/morris.min.js',
                        'assets/global/plugins/morris/raphael-min.js',
                        'assets/global/plugins/jquery.sparkline.min.js',

                        'assets/admin/pages/scripts/index.js',
                        'assets/admin/pages/scripts/tasks.js',

                        'js/controllers/DashboardChartController.js'
                    ]
                });
            }]
        }
    })
    .state('statistics', {
        url: "/stats.html",
        templateUrl: "views/stats/stats.html",
        data: {
            pageTitle: 'Statistics'
        },
        controller: "StatsChartController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pistachio/stats/stats.css',
                        'js/controllers/StatsChartController.js'
                    ]
                });
            }]
        }
    })


    .state('applAnalysis', {
        url: "/applAnalysis.html",
        templateUrl: "views/analysis/appl.html",
        data: {
            pageTitle: 'Visa Application Analysis'
        },
        controller: "VAAController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pages/scripts/angular-chart/angular-chart.css',
                        'assets/pages/scripts/datamaps/datamaps.world.js',
                        'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.css',
                        'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        'assets/global/plugins/bootstrap-daterangepicker/moment.js',

                        'assets/pages/css/search.css',
                        'assets/pages/css/pricing.min.css',
                        'assets/pages/scripts/highstock.js',
                        'assets/pistachio/fastsearch/leaflet/leaflet_canvas_layer.js',
                        'assets/pistachio/fastsearch/leaflet/heatmap.js ',
                        'assets/pistachio/map/Leaflet.fullscreen.min.js',
                        'assets/pistachio/map/leaflet.fullscreen.css',
                        'js/controllers/VAAController.js'
                    ]
                });
            }]
        }
    })
    .state('myAlert', {
        url: "/alertAnalysis.html",
        templateUrl: "views/analysis/alert.html",
        data: {
            pageTitle: 'My Alerts'
        },
        controller: "MyAlertController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pistachio/myAlert/myAlert.css',
                        'bower_components/moment/min/moment.min.js',
                        'js/controllers/MyAlertController.js'
                    ]
                });
            }]
        }
    })
    .state('myAudit', {
        url: "/auditAnalysis.html",
        templateUrl: "views/analysis/audit.html",
        data: {
            pageTitle: 'My Audit Analysis'
        },
        controller: "MyAuditController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pistachio/myAudit/myaudit.css',
                        'js/controllers/MyAuditController.js',
                        'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.css',
                        'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js'
                        
                    ]
                });
            }]
        }
    })


    .state('countryAnalysis', {
        url: "/cntryAnalysis.html",
        templateUrl: "views/analysis/cntry.html",
        data: {
            pageTitle: 'Analysis by Country'
        },
        controller: "CAController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pages/css/profile-2.min.css',
                        'assets/global/plugins/highcharts/js/highcharts.js',
                        //  '//code.highcharts.com/modules/treemap.js',
                        'js/controllers/CAController.js'
                    ]
                });
            }]
        }
    })

    .state('robot', {
        url: "/robot/robot.html",
        templateUrl: "views/robot/robot.html",
        data: {
            pageTitle: 'Robot Document'
        },
        controller: "RobotDocumentController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/RobotDocumentController.js',
                        'assets/global/plugins/morris/morris.css',
                        'assets/admin/pages/css/tasks.css',
                        'assets/pages/css/search.css',
                        //'assets/pistachio/upload_doc/css/uploadfile.css',
                        //'assets/pistachio/upload_doc/js/jquery.uploadfile.min.js'
                        'assets/pistachio/ng-upload/common.css'


                    ]
                });
            }]
        }
    })


    .state('workflowuser', {
        url: "/workflowuser.html",
        templateUrl: "views/workflow/workflowuser.html",
        data: {
            pageTitle: 'Workflow User'
        },
        controller: "WorkflowuserController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/morris/morris.css',
                        'assets/admin/pages/css/tasks.css',

                        'assets/global/plugins/morris/morris.min.js',
                        'assets/global/plugins/morris/raphael-min.js',
                        'assets/global/plugins/jquery.sparkline.min.js',

                        'assets/admin/pages/scripts/index.js',
                        'assets/admin/pages/scripts/tasks.js',

                        'js/controllers/WorkflowuserController.js'
                    ]
                });
            }]
        }
    })

    .state('workflowadmin', {
        url: "/workflowadmin.html",
        templateUrl: "views/workflow/workflowadmin.html",
        data: {
            pageTitle: 'Workflow Admin'
        },
        controller: "WorkflowadminController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/morris/morris.css',
                        'assets/admin/pages/css/tasks.css',

                        'assets/global/plugins/morris/morris.min.js',
                        'assets/global/plugins/morris/raphael-min.js',
                        'assets/global/plugins/jquery.sparkline.min.js',

                        'assets/admin/pages/scripts/index.js',
                        'assets/admin/pages/scripts/tasks.js',

                        'js/controllers/WorkflowadminController.js'
                    ]
                });
            }]
        }
    })

    .state('fastsearch', {
        url: "/fastsearch.html",
        templateUrl: "views/fastsearch/fs.html",
        data: {
            pageTitle: 'Fast Search'
        },
        controller: "FastSearchController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                      'assets/pistachio/fastsearch/ui_box.css',
                        'assets/admin/pages/css/tasks.css',
                        'assets/pages/css/portfolio.min.css',


                        'assets/admin/pages/scripts/index.js',
                        'assets/admin/pages/scripts/tasks.js',
                        //    'assets/admin/pages/scripts/portfolio-1.min.js',
                        //    'assets/global/plugins/cubeportfolio/js/jquery.cubeportfolio.min.js',
                        'assets/global/plugins/cubeportfolio/css/cubeportfolio.css',

                        'js/controllers/FastSearchController.js'

                    ]
                });
            }]
        }
    })

    .state('audit', {
        url: "/audit.html",
        templateUrl: "views/audit/audit.html",
        data: {
            pageTitle: 'User Audit'
        },
        controller: "AuditController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [

                        'assets/pages/css/search.css',
                        'assets/pages/css/pricing.min.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                        'assets/global/plugins/select2/select2.min.js',
                        'assets/global/plugins/datatables/all.min.js',
                        'js/scripts/table-advanced.js',
                        'js/controllers/AuditController.js'
                    ]
                });
            }]
        }
    })

    .state('docsearch', {
        url: "/fastsearch/dfs.html",
        templateUrl: "views/fastsearch/dfs.html",
        data: {
            pageTitle: 'Fast Document Search'
        },
        controller: "DocumentSearchController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/morris/morris.css',
                        'assets/admin/pages/css/tasks.css',
                        'assets/pages/css/search.css',

                        'assets/global/plugins/morris/morris.min.js',
                        'assets/global/plugins/morris/raphael-min.js',

                        'assets/admin/pages/scripts/index.js',
                        'assets/admin/pages/scripts/tasks.js',


                        'js/controllers/DocumentSearchController.js'
                    ]
                });
            }]
        }
    })

    .state('globalsearch', {
        url: "/fastsearch/gfs.html",
        templateUrl: "views/fastsearch/gfs.html",
        data: {
            pageTitle: 'Global Search'
        },
        controller: "GlobalSearchController",
        // controller: "DocumentSearchController1",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pages/css/search.css',
                        'assets/pages/css/pricing.min.css',


                        'assets/pistachio/fastsearch/leaflet/leaflet_canvas_layer.js',
                        //'assets/pistachio/map/heatmap.min.js',
                        //'assets/pistachio/map/leaflet-heatmap.js',
                        'assets/pistachio/fastsearch/leaflet/heatmap.js ',
                        'assets/pistachio/map/singleclick.js',
                        'assets/pistachio/map/Leaflet.fullscreen.min.js',
                        'assets/pistachio/map/leaflet.fullscreen.css',

                        'js/controllers/GlobalSearchController.js',
                        'assets/pistachio/range/range.css',
                        'assets/pistachio/range/range.js'
                    ]
                });
            }]
        }
    })


    .state('report2', {
        url: "/report2.html",
        templateUrl: "views/report2.html",
        data: {
            pageTitle: 'Reports'
        },
        controller: "ReportCategoryController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/morris/morris.css',
                        'assets/admin/pages/css/tasks.css',

                        'assets/global/plugins/morris/morris.min.js',
                        'assets/global/plugins/morris/raphael-min.js',
                        'assets/global/plugins/jquery.sparkline.min.js',

                        'assets/admin/pages/scripts/index.js',
                        'assets/admin/pages/scripts/tasks.js',

                        'js/controllers/ReportCategoryController.js'
                    ]
                });

            }]
        }
    })

    .state('report3', {
        url: "/report3.html",
        templateUrl: "views/report3.html",
        data: {
            pageTitle: 'Reports'
        },
        controller: "ReportCategoryController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/morris/morris.css',
                        'assets/admin/pages/css/tasks.css',

                        'assets/global/plugins/morris/morris.min.js',
                        'assets/global/plugins/morris/raphael-min.js',
                        'assets/global/plugins/jquery.sparkline.min.js',

                        'assets/admin/pages/scripts/index.js',
                        'assets/admin/pages/scripts/tasks.js',

                        'js/controllers/ReportCategoryController.js'
                    ]
                });

            }]
        }
    })



    // AngularJS plugins
    .state('fileupload', {
        url: "/file_upload.html",
        templateUrl: "views/file_upload.html",
        data: {
            pageTitle: 'AngularJS File Upload'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'angularFileUpload',
                    files: [
                        'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                    ]
                }, {
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // UI Select
    .state('uiselect', {
        url: "/ui_select.html",
        templateUrl: "views/ui_select.html",
        data: {
            pageTitle: 'AngularJS Ui Select'
        },
        controller: "UISelectController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'ui.select',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                        'assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                    ]
                }, {
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/UISelectController.js'
                    ]
                }]);
            }]
        }
    })


    // Advanced Datatables
    .state('datatablesAdvanced', {
        url: "/datatables/advanced.html",
        templateUrl: "views/datatables/advanced.html",
        data: {
            pageTitle: 'Advanced Datatables'
        },
        controller: "DatabaseListController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/select2/select2.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                        'assets/global/plugins/select2/select2.min.js',
                        'assets/global/plugins/datatables/all.min.js',
                        'js/scripts/table-advanced.js',


                        'js/controllers/DatabaseListController.js'
                    ]
                });
            }]
        }
    })

    // Jobs
    .state('jobs', {
            url: "/datatables/jobs.html",
            templateUrl: "views/datatables/jobs.html",
            data: {
                pageTitle: 'Advanced Datatables'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/select2/select2.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            'assets/global/plugins/select2/select2.min.js',
                            'assets/global/plugins/datatables/all.min.js',
                            'js/scripts/table-advanced.js',


                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })
        // Query UI
        .state('query', {
            url: "/query.html",
            templateUrl: "views/query.html",
            data: {
                pageTitle: 'Query UI'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/select2/select2.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            'assets/global/plugins/select2/select2.min.js',
                            'assets/global/plugins/datatables/all.min.js',
                            'js/scripts/table-advanced.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })





    .state('query?cat=reporting', {
            url: "/reports/e-reporting.html",
            templateUrl: "views/reports/e-reporting.html",
            data: {
                pageTitle: 'E-Reporting'
            },
            controller: "EreportingController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/select2/select2.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.css',
                            'assets/global/plugins/select2/select2.min.js',
                            'assets/global/plugins/datatables/all.min.js',
                            'js/scripts/table-advanced.js',


                            'js/controllers/EreportingController.js'
                        ]
                    });
                }]
            }
        })
        //Report

        // Query UI
        .state('queryExe', {
            url: "/queryExe.html",
            templateUrl: "views/queryExe.html",
            data: {
                pageTitle: 'Query UI'
            },
            controller: "ReportCategoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'assets/global/plugins/select2/select2.css',
                            'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                            'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            'assets/global/plugins/select2/select2.min.js',
                            'assets/global/plugins/datatables/all.min.js',
                            'js/scripts/table-advanced.js',


                            'js/controllers/ReportCategoryController.js'
                        ]
                    });
                }]
            }
        })

    // Query UI
    .state('config', {
        url: "/config.html",
        templateUrl: "views/config.html",
        data: {
            pageTitle: 'Configuration'
        },
        controller: "ConfigController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/select2/select2.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                        'assets/global/plugins/select2/select2.min.js',
                        'assets/global/plugins/datatables/all.min.js',
                        'js/scripts/table-advanced.js',


                        'js/controllers/ConfigController.js'
                    ]
                });
            }]
        }
    })

    // Ajax Datetables
    .state('datatablesAjax', {
        url: "/datatables/ajax.html",
        templateUrl: "views/datatables/ajax.html",
        data: {
            pageTitle: 'Ajax Datatables'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/select2/select2.css',
                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        'assets/global/plugins/select2/select2.min.js',
                        'assets/global/plugins/datatables/all.min.js',

                        'assets/global/scripts/datatable.js',
                        'js/scripts/table-ajax.js',


                        'js/controllers/GeneralPageController.js'

                    ]
                });
            }]
        }
    })

    //Dashboard Management

    .state('DashboardMgt', {
        url: "/dashboardManagement/dashboardMgt.html",
        templateUrl: "views/dashboardManagement/dashboardMgt.html",
        data: {
            pageTitle: 'Dashboard'
        },
        controller: "DashboardMgtController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [

                        'assets/global/plugins/select2/select2.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                        'assets/global/plugins/select2/select2.min.js',
                        'assets/global/plugins/datatables/all.min.js',
                        'js/scripts/table-advanced.js',


                        'js/controllers/DashboardMgtController.js'

                    ]
                });
            }]
        }
    })



    // Report Management
    .state("reportMgt", {
        url: "/reportManagement/reportMgt.html",
        templateUrl: "views/reportManagement/reportMgt.html",
        data: {
            pageTitle: 'Report Management'
        },
        controller: "ReportMgtController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        //'assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        'assets/global/plugins/select2/select2.css',
                        //'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        'assets/global/plugins/select2/select2.min.js',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                        'assets/global/plugins/datatables/all.min.js',
                        'js/scripts/table-advanced.js',

                        'js/controllers/ReportMgtController.js'
                    ]
                });
            }]
        }
    })

    // SQL Editor
    .state("sqleditorMgt", {
        url: "/sqleditor/sqleditor.html",
        templateUrl: "views/sqleditor/sqleditor.html",
        data: {
            pageTitle: 'SQL Editor'
        },
        controller: "SQLEditorMgtController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        // 'assets/global/plugins/angularjs/angular.min.js',
                        'js/scripts/Common.js',
                        'js/scripts/resizer.js',
                        // 'bower_components/ace-builds/src-min-noconflict/ext-language_tools.js',
                        // 'assets/global/plugins/ace.js',
                        // 'assets/global/plugins/ui-ace.js',
                        'assets/global/plugins/select2/select2.css',
                        'assets/global/plugins/select2/select2.min.js',
                        'js/scripts/table-advanced.js',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                        'assets/global/plugins/datatables/all.min.js',

                        'bower_components/ace-builds/src-min-noconflict/ext-language_tools.js',
                        'js/controllers/SQLEditorMgtController.js'
                    ]
                });
            }]
        }
    })

    //Tracking
    .state('d2dTracking', {
        url: "/d2dTracking/d2dTracking.html",
        templateUrl: "views/d2dTracking/d2dTracking.html",
        data: {
            pageTitle: 'Tracking'
        },
        controller: "d2dTrackingController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pages/scripts/angular-chart/angular-chart.css',

                        'assets/pages/scripts/datamaps/datamaps.world.js',
                        'assets/pages/css/search.css',
                        'assets/pages/scripts/jquery-ui.min.js',
                        'assets/pages/css/pricing.min.css',
                        'assets/pages/scripts/highstock.js',
                        'assets/pages/css/jquery-ui.css',
                        'bower_components/moment/min/moment.min.js',
                        'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                        'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',


                        'js/controllers/d2dTrackingController.js'
                    ]
                });
            }]
        }
    })
    //Tracking
    .state('employeeHourlyDetails', {
        url: "/employeeHourlyDetails/employeeHourlyDetails.html",
        templateUrl: "views/employeeHourlyDetails/employeeHourlyDetails.html",
        data: {
            pageTitle: 'employeeHourlyDetails'
        },
        controller: "employeeHourlyDetailsController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pages/scripts/angular-chart/angular-chart.css',

                        'assets/pages/scripts/datamaps/datamaps.world.js',
                        'assets/pages/css/search.css',
                        'assets/pages/scripts/jquery-ui.min.js',
                        'assets/pages/css/pricing.min.css',
                       /* 'assets/pages/scripts/highstock.js',*/
                       'assets/global/plugins/highcharts/js/highcharts.js',
                        'assets/pages/css/jquery-ui.css',
                        'bower_components/moment/min/moment.min.js',
                        'bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                        'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',

                        'assets/pistachio/hourlyReport/hourlyReport.css',
                        'js/controllers/employeeHourlyDetailsController.js'
                    ]
                });
            }]
        }
    })
    // User Management
    .state("userMgt", {
        url: "/userManagement/userMgt.html",
        templateUrl: "views/userManagement/userMgt.html",
        data: {
            pageTitle: 'User Management'
        },
        controller: "UserMgtController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        //'assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                        /*'assets/global/plugins/select2/select2.css',*/
                        //'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        /*'assets/global/plugins/select2/select2.min.js',*/
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                        'assets/global/plugins/datatables/all.min.js',
                        'js/scripts/table-advanced.js',

                        'js/controllers/UserMgtController.js'
                    ]
                });
            }]
        }
    })

    // Role Management
    .state("roleMgt", {
        url: "/roleManagement/roleMgt.html",
        templateUrl: "views/roleManagement/roleMgt.html",
        data: {
            pageTitle: 'Role Management'
        },
        controller: "RoleMgtController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/select2/select2.css',
                        'assets/global/plugins/select2/select2.min.js',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                        'assets/global/plugins/datatables/all.min.js',
                        'assets/global/plugins/jquery-multi-select/css/multi-select.css',
                        'assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',
                        'js/scripts/table-advanced.js',

                        'js/controllers/RoleMgtController.js'
                    ]
                });
            }]
        }
    })



    //My Profile page
    .state('myprofile', {

        url: "/myprofile.html",
        templateUrl: "views/profile/myprofile.html",
        data: {
            pageTitle: 'My Profile'
        },
        controller: "MyProfileController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pages/css/profile.css',
                        'js/controllers/MyProfileController.js'
                    ]
                });
            }]
        }
    })

    //Traveler Tracker page
    .state('travelertracker', {

        url: "/travelertracker/travelertracker.html",
        templateUrl: "views/travelertracker/travelertracker.html",
        data: {
            pageTitle: 'Traveler Tracker'
        },
        controller: "TravelerTrackerController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/pages/css/profile.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                        'assets/global/plugins/datatables/all.min.js',
                        'assets/pages/css/invoice-2.css',
                        'assets/global/plugins/vis/vis.js',
                        'assets/global/plugins/vis/vis.css',
                        'js/controllers/TravelerTrackerController.js'
                    ]
                });
            }]
        }
    })


}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $(".modal-header").addClass('btn-success');

}]);
