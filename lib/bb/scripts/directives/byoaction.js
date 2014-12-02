'use strict';

/**
 * @ngdoc directive
 * @name netLabApp.directive:byoAction
 * @description
 * # byoAction
 */
angular.module('netLabApp')
  .directive('byoAction', function ($q, $compile, $templateCache) {
    var baseScope = null;

    var updateElement = function(scope, template) {
        var action = scope.action;

        createDrag(scope, template, action);
        template.click(function(eve) {
            scope.$apply(function() {
                if(eve.button == 1) {
                    baseScope.Tests.Functions.RemoveAction(action);
                    baseScope.Display.Functions.UpdateLines();
                } else {
                    baseScope.Tests.Functions.SelectAction(action);
                }
            });
        });

        template.dblclick(function() {
            scope.$apply(function() {
                baseScope.Tests.Functions.AddAction(action);
            });
        });
    }

    var createDrag = function(scope, template, action) {
        action.movement = { x: action.x, y: action.y };
        var matrix = new Snap.Matrix();
        matrix.translate(+action.x, +action.y);
        template.transform(matrix);
        template.drag(function(dx,dy,x,y,event) {
            //Drag Moving Event
            scope.$apply(function() {
                var w = 2000 / $("#FlowChart").width();
                var h = 2000 / $("#FlowChart").height();
                action.x = Snap.snapTo(25, dx * h + action.movement.x, 25);
                action.y = Snap.snapTo(25, dy * h + action.movement.y, 25);
                var matrix = new Snap.Matrix();
                matrix.translate(+action.x, +action.y);
                template.transform(matrix);
                baseScope.Display.Functions.UpdateLines();
            });
        }, function() {
            //Drag Start Event
        }, function() {
            //Drag Complete Event
            scope.$apply(function() {
                action.movement.x = Snap.snapTo(25, action.x, 25);
                action.movement.y = Snap.snapTo(25, action.y, 25);
                baseScope.Display.Functions.UpdateLines();
            });
        });
    }

    return function($scope, $element, $attr) {
        baseScope = $scope.$parent.$parent.$parent;

        var sEle = Snap($element[0]);
        var parentSvg = sEle.parent();
        var svgTemplate = Snap.parse($templateCache.get('SMS/svgs/' + $scope.action.type + '.svg')[1]);
        var filterTemplate = svgTemplate.select("filter");
        var gTemplate = svgTemplate.select('g');
        
        if(filterTemplate != null) {
            //Append svg filters
            parentSvg.select("defs").append(filterTemplate);
        }

        //Get svg width and height
        $scope.action.width = Number(svgTemplate.select("svg").attr("width"));
        $scope.action.height = Number(svgTemplate.select("svg").attr("height"));

        var compiled = $compile(gTemplate.node)($scope);
        sEle.add(gTemplate);
        updateElement($scope, sEle);
    }
  });
