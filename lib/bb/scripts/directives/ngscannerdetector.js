'use strict';

/**
 * @ngdoc directive
 * @name netLabApp.directive:ngKeypress
 * @description
 * # ngKeypress
 */
angular.module('netLabApp')
    .directive('ngScannerDetector', function($rootScope, $timeout, $log) {
        var barcode = '';
        var barcode_timer = null;
        return function(scope, element, attrs) {
            element.bind("keydown", function(event) {
                if (barcode_timer != null) {
                    $timeout.cancel(barcode_timer);
                }

                if (event.which !== 13) {
                    barcode += String.fromCharCode(event.keyCode);
                    barcode_timer = $timeout(function() {
                        barcode = '';
                        $log.debug('Clearing barcode - timeout!');
                    }, 50);
                } else {
                    if (barcode !== '') {
                        $log.debug('Finishing barcode: ' + barcode);
                        $rootScope.$apply(function() {
                            $rootScope.$broadcast('ScanEvent', barcode);
                            $rootScope.$broadcast('ScanEvent_' + barcode.length, barcode);
                        });
                        barcode = '';
                    }
                }
            });
        };
    });
