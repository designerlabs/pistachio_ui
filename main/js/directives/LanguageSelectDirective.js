/**
 * @ngdoc function
 * @name translateApp.directive:LanguageSelectDirective
 * @description
 * # LanguageSelectDirective
 * Directive to append language select and set its view and behavior
 */
angular.module('MetronicApp')
  .directive('ngTranslateLanguageSelect', function (LocaleService) {
    'use strict';

    return {
      restrict: 'A',
      replace: true,
      template: ''+
        '<div class="language-select" ng-if="visible">'+
          '<label class="languageLabel"><i class="fa fa-language"></i> '+
            '{{"directives.language-select.Language" | translate}}:'+
            '<select id="selectLanguage" class="form-control" ng-model="currentLocaleDisplayName"'+
              'ng-options="localesDisplayName for localesDisplayName in localesDisplayNames"'+
              'ng-change="changeLanguage(currentLocaleDisplayName)">'+
            '</select>'+
          '</label>'+
        '</div>'+
      '',
      controller: function ($scope) {
        $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
        $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
        $scope.visible = $scope.localesDisplayNames &&
        $scope.localesDisplayNames.length > 1;

        $scope.changeLanguage = function (locale) {
          console.log(locale);
          LocaleService.setLocaleByDisplayName(locale);
          // $rootScope.editBtn = $translate.instant('editBtn');
        };
      }
    };
  });
