/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular
    .module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngResource",
    "ngTable",
    "pascalprecht.translate",
    'tmh.dynamicLocale',
    "datamaps",
    "chart.js"
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

// Angular Translate

.config(function ($translateProvider, DEBUG_MODE, LOCALES) {
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

// Angular Dynamic Locale
.config(function (tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
    })
    .controller('MetronicApp', function ($scope, $rootScope, $translate, $interval, VERSION_TAG) {
        $rootScope.$on('$translateChangeSuccess', function (event, data) {
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
var globalURL = "http://pistachio_server:8080/";
//var solrHost = "10.23.124.243";
var solrHost = "localhost";
var queryString = "query";
var categoryName = "cat";


//validation on keyup
function formInputValidation(id) {
    $(id + " input").keyup(function (event) {
        if ($(this).val() != "") {
            $(this).parent('.form-group').removeClass('has-error');
        } else {
            $(this).parent('.form-group').addClass('has-error');
        }
    });

    $(id + " textarea").keyup(function (event) {
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
    $.each($(id), function (index, val) {
        totalCount = $(val).find("input").length;
        totalCount += $(val).find("textarea").length;
        totalCount = totalCount - 1;
        $.each(val, function (index, val) {
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
MetronicApp.config(['$controllerProvider', function ($controllerProvider) {
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


/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);



/* Setup global Authorities */
MetronicApp.factory('authorities', function () {

    var authoritiesValue = localStorage.getItem('authorities');

    var res = authoritiesValue.split(",");


    return {
        checkRole: function (x) {
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
MetronicApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        // $("#selectLanguage [value=1]").attr('selected', 'selected');
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);


MetronicApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

MetronicApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
            console.log(data);
        })
        .error(function(){
        });
    }
}]);



/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', '$http', 'authorities', function ($scope, $http, authorities) {
    $scope.$on('$includeContentLoaded', function () {
        var getToken = localStorage.getItem("token");
        var authoritiesArray, res = [];
        var authoritiesValue;
        $scope.chkRole = authorities.checkRole;
        $.ajax({
                url: globalURL + 'auth/token?token=' + getToken,
                type: 'GET',
            })
            .done(function (data) {
                $scope.displayNames = data.reports;
                console.log(data.reports);
                console.log("success");
            })
            .fail(function () {
                localStorage.setItem("token", "");
                //location.href="#/login.html";
                window.location = "login.html";
                console.log("error");
            })
            .always(function () {
                console.log("complete");
            });


        console.log(authoritiesArray);

        var flag = true;
        $scope.goes = function (data) {
            localStorage.setItem('sideMenuValue', data);
            $.ajax({
                    //url: globalURL+'query/report/'+data,
                    url: globalURL + 'auth/subreports?token=' + getToken + '&parent=' + data,
                    type: 'GET',
                })
                .done(function (data) {
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
                .fail(function () {
                    console.log("error");
                })
                .always(function () {
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
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
    
    
    .state('applAnalysis', {
        url: "/applAnalysis.html",
        templateUrl: "views/analysis/appl.html",
        data: {
            pageTitle: 'Visa Application Analysis'
        },
        controller: "VAAController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                    'assets/pages/scripts/angular-chart/angular-chart.css',
                    'assets/pages/scripts/datamaps/datamaps.world.js',
                    'assets/pages/css/search.css',
                    'assets/pages/css/pricing.min.css',

                    'js/controllers/VAAController.js'
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [

                    'assets/pages/css/search.css',
                    'assets/pages/css/pricing.min.css',

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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                           'assets/pages/css/search.css',
                           'assets/pages/css/pricing.min.css',

                           'assets/admin/pages/scripts/index.js',
                           'js/controllers/GlobalSearchController.js'
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('reportList', {
        url: "/reportList.html",
        templateUrl: "views/reportList.html",
        data: {
            pageTitle: 'Reports'
        },
        controller: "SidebarMenuController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

                        'js/controllers/SidebarMenuController.js'
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    // UI Bootstrap
    .state('uibootstrap', {
        url: "/ui_bootstrap.html",
        templateUrl: "views/ui_bootstrap.html",
        data: {
            pageTitle: 'AngularJS UI Bootstrap'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Tree View
    .state('tree', {
        url: "/tree",
        templateUrl: "views/tree.html",
        data: {
            pageTitle: 'jQuery Tree View'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/jstree/dist/themes/default/style.min.css',

                        'assets/global/plugins/jstree/dist/jstree.min.js',
                        'assets/admin/pages/scripts/ui-tree.js',
                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Form Tools
    .state('formtools', {
        url: "/form-tools",
        templateUrl: "views/form_tools.html",
        data: {
            pageTitle: 'Form Tools'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        'assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                        'assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                        'assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                        'assets/global/plugins/typeahead/typeahead.css',

                        'assets/global/plugins/fuelux/js/spinner.min.js',
                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                        'assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                        'assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                        'assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                        'assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                        'assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                        'assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                        'assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                        'assets/global/plugins/typeahead/handlebars.min.js',
                        'assets/global/plugins/typeahead/typeahead.bundle.min.js',
                        'assets/admin/pages/scripts/components-form-tools.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Date & Time Pickers
    .state('pickers', {
        url: "/pickers",
        templateUrl: "views/pickers.html",
        data: {
            pageTitle: 'Date & Time Pickers'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/clockface/css/clockface.css',
                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        'assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                        'assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                        'assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                        'assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        'assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                        'assets/global/plugins/clockface/js/clockface.js',
                        'assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                        'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        'assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                        'assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                        'assets/admin/pages/scripts/components-pickers.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Custom Dropdowns
    .state('dropdowns', {
        url: "/dropdowns",
        templateUrl: "views/dropdowns.html",
        data: {
            pageTitle: 'Custom Dropdowns'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        'assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                        'assets/global/plugins/select2/select2.css',
                        'assets/global/plugins/jquery-multi-select/css/multi-select.css',

                        'assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                        'assets/global/plugins/select2/select2.min.js',
                        'assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

                        'assets/admin/pages/scripts/components-dropdowns.js',

                        'js/controllers/GeneralPageController.js'
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
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    // Jobs
    .state('jobs', {
            url: "/datatables/jobs.html",
            templateUrl: "views/datatables/jobs.html",
            data: {
                pageTitle: 'Advanced Datatables'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
        .state('report_masuk', {
            url: "/reports/permit-masuk.html",
            templateUrl: "views/reports/permit-masuk.html",
            data: {
                pageTitle: 'Permit Masuk'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=paspelajar', {
        url: "/reports/pas-pelajar.html",
        templateUrl: "views/reports/pas-pelajar.html",
        data: {
            pageTitle: 'Pas Pelajar'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=paskerja', {
        url: "/reports/pas-kerja.html",
        templateUrl: "views/reports/pas-kerja.html",
        data: {
            pageTitle: 'Pas Kerja'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=tanggungan', {
        url: "/reports/pas-tanggungan.html",
        templateUrl: "views/reports/pas-tanggungan.html",
        data: {
            pageTitle: 'Pas Tanggungan'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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


    .state('query?cat=pls', {
        url: "/reports/pls.html",
        templateUrl: "views/reports/pls.html",
        data: {
            pageTitle: 'PLS'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=plik', {
        url: "/reports/plik.html",
        templateUrl: "views/reports/plik.html",
        data: {
            pageTitle: 'PLIK'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=pengecualian', {
        url: "/reports/pas-pengecualian.html",
        templateUrl: "views/reports/pas-pengecualian.html",
        data: {
            pageTitle: 'Pas Pengecualian'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=plks', {
        url: "/reports/plks.html",
        templateUrl: "views/reports/plks.html",
        data: {
            pageTitle: 'PLKS'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=mm2h', {
        url: "/reports/mm2h.html",
        templateUrl: "views/reports/mm2h.html",
        data: {
            pageTitle: 'MM2H'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=visa', {
        url: "/reports/e-reporting.html",
        //templateUrl: "views/reports/visa-atase.html",
        templateUrl: "views/reports/e-reporting.html",
        data: {
            pageTitle: 'Visa Atase'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        // 'assets/global/plugins/bootstrap-daterangepicker/moment.js',
                        // 'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                        'assets/global/plugins/select2/select2.css',
                        'assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',
                        'assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                        'assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                        'assets/global/plugins/bootstrap-daterangepicker/daterangepicker.css',
                       
                        'assets/global/plugins/select2/select2.min.js',

                        'assets/global/plugins/datatables/all.min.js',
                        'js/scripts/table-advanced.js',                        
                        
                        

                        'js/controllers/GeneralPageController.js'
                    ]
                });
            }]
        }
    })

    .state('query?cat=khas', {
        url: "/reports/e-reporting.html",
        templateUrl: "views/reports/e-reporting.html",
        //templateUrl: "views/reports/pas-khas.html",
        data: {
            pageTitle: 'Pas Khas'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=pasangan', {
        url: "/reports/pasangan-warganegara.html",
        templateUrl: "views/reports/pasangan-warganegara.html",
        data: {
            pageTitle: 'Pasangan Warganegara'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=pengajian', {
        url: "/reports/pas-pengajian.html",
        templateUrl: "views/reports/pas-pengajian.html",
        data: {
            pageTitle: 'Pas Tanggungan'
        },
        controller: "Pas Tanggungan",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    .state('query?cat=penguatkuasaan', {
        url: "/reports/depoh-penguatkuasaan.html",
        templateUrl: "views/reports/depoh-penguatkuasaan.html",
        data: {
            pageTitle: 'Depoh Dan Penguatkuasaan'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
        //Report

    // Query UI
    .state('reoirt', {
            url: "/report.html",
            templateUrl: "views/report.html",
            data: {
                pageTitle: 'Advanced Federated Reports'
            },
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
        .state('queryExe', {
            url: "/queryExe.html",
            templateUrl: "views/queryExe.html",
            data: {
                pageTitle: 'Query UI'
            },
            controller: "ReportCategoryController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    // Ajax Datetables
    .state('datatablesAjax', {
        url: "/datatables/ajax.html",
        templateUrl: "views/datatables/ajax.html",
        data: {
            pageTitle: 'Ajax Datatables'
        },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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

    // User Management
    .state("userMgt", {
        url: "/userManagement/userMgt.html",
        templateUrl: "views/userManagement/userMgt.html",
        data: {
            pageTitle: 'User Management'
        },
        controller: "UserMgtController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
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


}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function ($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $(".modal-header").addClass('btn-success');
}]);
