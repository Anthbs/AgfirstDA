'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:ModaltemplateCtrl
 * @description
 * # ModaltemplateCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('ModaltemplateCtrl', function($scope, $modalInstance) {
        $scope.ok = function() {
            $modalInstance.close(true);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    });
