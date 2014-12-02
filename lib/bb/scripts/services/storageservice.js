'use strict';

/**
 * @ngdoc service
 * @name netLabApp.StorageService
 * @description
 * # StorageService
 * Service in the netLabApp.
 */
angular.module('netLabApp')
    .service('StorageService', function($q) {
        this.set = function(key, value) {
            return $q.when(localStorage.setItem(key, JSONR.stringify(value)));
        }.bind(this);

        this.get = function(key) {
            var res = localStorage.getItem(key);
            if (res != null) {
                var res = JSONR.parse(res);
            }
            return res;
        }.bind(this);
    });
