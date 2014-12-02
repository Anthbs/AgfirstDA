'use strict';

/**
 * @ngdoc directive
 * @name netLabApp.directive:actionConnector
 * @description
 * # actionConnector
 */
angular.module('netLabApp')
  .directive('actionConnector', function ($q, $compile, $templateCache) {
    return function($scope, $element, $attr) {
        var sEle = Snap($element[0]);
        var parentSvg = sEle.parent();
        
        var svgTemplate = Snap.parse($templateCache.get('SMS/svgs/Line.svg')[1]);
        var arrowHeadTemplate = svgTemplate.select("marker[id='head']");
        var arrowTemplate = svgTemplate.select("path[id='arrow-line']");

        if(arrowHeadTemplate != null) {
            //Append svg filters
            parentSvg.select("defs").append(arrowHeadTemplate);
        }

        var compiled = $compile(arrowTemplate.node)($scope);
        sEle.add(arrowTemplate);
    };
  });
