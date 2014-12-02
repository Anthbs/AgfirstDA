'use strict';

/**
 * @ngdoc directive
 * @name netLabApp.directive:ngEnter
 * @description
 * # ngEnter - calls function on enter pressed
 */
angular.module('netLabApp')
    .directive('showCurrentTime', function(dateFilter){
    return function(scope, element, attrs){
        var format = 'M/d/yy h:mm:ss a';
        
        scope.$watch(attrs.showCurrentTime, function(value) {
            format = value;
            updateTime();
        });
        
        function updateTime(){
            var dt = dateFilter(new Date(), 'h:mm:ss a - d MMM yy');
            element.text(dt);
        }
        
        function updateLater() {
            setTimeout(function() {
              updateTime(); // update DOM
              updateLater(); // schedule another update
            }, 1000);
        }
        
        updateLater();
    }
});