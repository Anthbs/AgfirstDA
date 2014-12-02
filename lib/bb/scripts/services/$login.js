 'use strict';

/**
 * @ngdoc service
 * @name netLabApp.$login
 * @description
 * # $login
 * Service in the netLabApp.
 */
angular.module('netLabApp')
  	.service('$login', function($modal) {
        return {
            open: function(scope, attrs, opts) {
                angular.extend(scope, attrs);
                opts = angular.extend(opts || {}, {
                    backdrop: false,
                    scope: scope,
                    templateUrl: 'views/login_screen.html',
                    windowTemplateUrl: 'views/login_page.html'
                });
                return $modal.open(opts);
            }
        };
    });
