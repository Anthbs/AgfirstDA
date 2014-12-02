'use strict';

/**
 * @ngdoc function
 * @name netLabApp.controller:ModalresultCtrl
 * @description
 * # ModalresultCtrl
 * Controller of the netLabApp
 */
angular.module('netLabApp')
    .controller('ModalResultCtrl', function($scope, $modalInstance, text, value) {
        $scope.text = text;
        $scope.value = value;

        $scope.ok = function() {
            $modalInstance.close(true);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    });
